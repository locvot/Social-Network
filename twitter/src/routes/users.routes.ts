import { Router } from 'express'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '../middlewares/users.middlewares'
import {
  verifyEmailController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController,
  getProfileController,
  followController,
  unfollowController,
  changePasswordController
} from '../controllers/users.controllers'
import { wrapRequestHandler } from '../utils/handlers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.request'
const usersRouter = Router()

/**
 * Description: Login a user
 * Path: /users/login
 * Method: POST
 * Body: { email : string, password  :string}
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Register a new user
 * Path: /users/register
 * Method: POST
 * Body: { name : string, email : string, password  :string, confirm password : string, date_of_birth: ISO8601 }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Logout a user
 * Path: /users/logout
 * Method: POST
 * Header: {Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Verify email when user client click on the link in the email
 * Path: /users/verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: Resend verify email when user client click on the link in the email
 * Path: /users/resend-verify-email
 * Header: { Authorization: Bearer <access_token> }
 * Method: POST
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description: Submit email to reset password
 * Path: /users/forgot-password
 * Method: POST
 * Body: { email:string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Veirify link in email to reset password
 * Path: /users/verify-forgot-password-token
 * Method: POST
 * Body: { forgot-password-token:string }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: Reset password
 * Path: /users/reset-password
 * Method: POST
 * Body: { forgot-password-token:string, password: string, confirm_password: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: Get my profile
 * Path: /users/me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update my profile
 * Path: /users/me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Description: Get user profile
 * Path: /users/:username
 * Method: GET
 */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 * Description: Follow someone
 * Path: /users/follow
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { followed_user_id: string }
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * Description: Unfollow someone
 * Path: /users/follow/user_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)

/**
 * Description: Change password
 * Path: /change-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { old_password: string, password: string, confirm_password: string }
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter
