import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
const searchRouter = Router()

searchRouter.get('/', accessTokenValidator, verifiedUserValidator, searchController)

export default searchRouter
