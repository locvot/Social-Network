import { Request } from 'express'
import { getFiles, getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import path from 'path'
import fsPromise from 'fs/promises'
import { envConfig, isProduction } from '~/constants/config'
import { EncodingStatus, MediaType } from '~/constants/enum'
import { Media } from '~/models/Others'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import { uploadFileToS3 } from '~/utils/s3'
import mime from 'mime'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3/dist-types/commands/CompleteMultipartUploadCommand'
import { rimrafSync } from 'rimraf'

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }
  async enqueue(item: string) {
    this.items.push(item)
    // item = /home/dat/Downloads/VID_20210715_153415.mp4
    const idName = getNameFromFullName(item.split('\\').pop() as string)
    console.log(idName)
    await databaseService.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EncodingStatus.Pending
      })
    )
    this.processEncode()
  }
  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      const idName = getNameFromFullName(videoPath.split('\\').pop() as string)
      await databaseService.videoStatus.updateOne(
        {
          name: idName
        },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        const files = getFiles(path.resolve(UPLOAD_VIDEO_DIR, idName))
        await Promise.all(
          files.map((filepath) => {
            const filename = 'video-hls' + filepath.replace(path.resolve(UPLOAD_VIDEO_DIR), '').replace(/\\/g, '/')
            return uploadFileToS3({
              filepath,
              filename,
              contentType: mime.getType(filepath) as string
            })
          })
        )
        rimrafSync(path.resolve(UPLOAD_VIDEO_DIR, idName))
        await databaseService.videoStatus.updateOne(
          {
            name: idName
          },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updated_at: true
            }
          }
        )
        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
        await databaseService.videoStatus
          .updateOne(
            {
              name: idName
            },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                updated_at: true
              }
            }
          )
          .catch((error) => {
            console.log('Upload video status error', error)
          })
        console.log(`Encode video ${videoPath} failed`)
        console.log(error)
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.log('Encode queue is empty')
    }
  }
}

const queue = new Queue()

class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFileName)
        await sharp(file.filepath).jpeg({ quality: 80 }).toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: 'images/' + newFullFileName,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })
        console.log(s3Result)
        await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          filename: 'videos/' + file.newFilename,
          contentType: mime.getType(file.filepath) as string,
          filepath: file.filepath
        })
        fsPromise.unlink(file.filepath)
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Video
        }
      })
    )
    return result
  }

  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${envConfig.host}/static/video-hls/${newName}/master.m3u8`
            : `http://localhost:${envConfig.port}/static/video-hls/${newName}/master.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }

  async getVideoStatus(id: string) {
    const data = await databaseService.videoStatus.findOne({ name: id })
    return data
  }
}

const mediasService = new MediasService()

export default mediasService
