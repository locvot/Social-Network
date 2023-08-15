import express from 'express'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import tweetsRouter from './routes/tweets.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import cors from 'cors'
import './utils/s3'
import { createServer } from 'http'
import conversationsRouter from './routes/conversations.routes'
import initSocket from './utils/socket'
// import '~/utils/fake'
config()

// Connect to database
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})

const app = express()
const httpServer = createServer(app)

// Enable CORS
app.use(cors())

const port = process.env.PORT

// Initialize folder
initFolder()

app.use(express.json())

// Define Routes
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/static', staticRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationsRouter)
app.use('/static', express.static(UPLOAD_VIDEO_DIR))

// Error handler
app.use(defaultErrorHandler)

// Initialize socket
initSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
