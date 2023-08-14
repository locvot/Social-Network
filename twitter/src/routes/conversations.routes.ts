import { Router } from 'express'
import { getConversationsController } from '~/controllers/conversations.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const conversationsRouter = Router()

conversationsRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  getConversationsController
)

export default conversationsRouter
