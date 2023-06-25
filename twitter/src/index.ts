import express from 'express'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
databaseService.connect()
const app = express()
const port = 3000
app.use(express.json())

app.post('/', (req, res) => {
  res.send('Hello World')
})

app.use('/users', usersRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
