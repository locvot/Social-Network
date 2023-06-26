import express from 'express'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
databaseService.connect()
const app = express()
const port = 3000
initFolder()
app.use(express.json())

app.post('/', (req, res) => {
  res.send('Hello World')
})

app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
