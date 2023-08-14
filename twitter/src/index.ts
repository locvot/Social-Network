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
import { Server } from 'socket.io'
import Conversation from './models/schemas/Conversation.schema'
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
app.use('/static', express.static(UPLOAD_VIDEO_DIR))

// Error handler
app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`)
  const user_id = socket.handshake.auth._id
  users[user_id] = {
    socket_id: socket.id
  }
  console.log(users)
  socket.on('private message', async (data) => {
    const receiver_socket_id = users[data.to]?.socket_id
    if (!receiver_socket_id) return
    await databaseService.conversations.insertOne(
      new Conversation({
        sender_id: data.from,
        receiver_id: data.to,
        content: data.content
      })
    )
    socket.to(receiver_socket_id).emit('receive private message', {
      content: data.content,
      from: user_id
    })
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`user ${socket.id} disconnected`)
    console.log(users)
  })
})

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
