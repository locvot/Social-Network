import { Request, Response } from 'express'
import { CONVERSATIONS_MESSAGES } from '~/constants/messages'
import conversationService from '~/services/conversations.services'

export const getConversationsController = async (req: Request, res: Response) => {
  const { receiver_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const sender_id = req.decoded_authorization?.user_id as string
  const result = await conversationService.getConversation({
    sender_id,
    receiver_id,
    limit,
    page
  })
  return res.json({
    result: {
      conversations: result.conversations,
      limit,
      page,
      total_page: Math.ceil(result.total / Number(limit))
    },
    message: CONVERSATIONS_MESSAGES.GET_CONVERSATIONS_SUCCESSFULLY
  })
}
