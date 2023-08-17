import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { ParamsDictionary } from 'express-serve-static-core'

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginBody:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: duthanhduoc@gmail.com
 *         password:
 *           type: string
 *           example: Duoc123!
 *     SuccessAuthentication:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjRiZTBhZDJlNDNkMjQ2NDM5NGZlZWRiIiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjoxLCJpYXQiOjE2OTEzODMyMjYsImV4cCI6MTY5MTQ2OTYyNn0.HTLX20cB7_z0c9c8FDg3MIx6RJEELHHlmJNZa94ku-o
 *         refresh_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjRiZTBhZDJlNDNkMjQ2NDM5NGZlZWRiIiwidG9rZW5fdHlwZSI6MSwidmVyaWZ5IjoxLCJpYXQiOjE2OTEzODMyMjYsImV4cCI6MTcwMDAyMzIyNn0.bFnaBfxWl-Q48HCwAeMpNzZwTO9LEjcBd7Zyipjqr64
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: MongoId
 *           example: 64be0ad2e43d2464394feedb
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         date_of_birth:
 *           type: string
 *           format: ISO8601
 *           example: 2023-06-08T10:17:31.096Z
 *         created_at:
 *           type: string
 *           format: ISO8601
 *           example: 2023-03-08T12:00:00Z
 *         updated_at:
 *           type: string
 *           format: ISO8601
 *           example: 2023-03-08T12:00:00Z
 *         verify:
 *           $ref: '#/components/schemas/UserVerifyStatus'
 *         twitter_circle:
 *           type: array
 *           items:
 *             type: string
 *             format: MongoId
 *           example: ['64be0ad2e43d2464394feedb', '64be0ad2e43d2464394feedc']
 *         bio:
 *           type: string
 *           example: 'This is my bio.'
 *         location:
 *           type: string
 *           example: 'San Francisco, CA'
 *         website:
 *           type: string
 *           example: 'www.example.com'
 *         username:
 *           type: string
 *           example: 'johndoe'
 *         avatar:
 *           type: string
 *           example: 'http:localhost:4000/images/avatars/johndoe.jpg'
 *         cover_photo:
 *           type: string
 *           example: 'http:localhost:4000/images/avatars/johndoe.jpg'
 *     UserVerifyStatus:
 *       type: number
 *       enum: [Unverified, Verified, Banned]
 *       example: 1
 */

export interface LoginReqBody {
  email: string
  password: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface GetProfileReqParams extends ParamsDictionary {
  username: string
}

export interface UnfollowReqParams extends ParamsDictionary {
  user_id: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}
export interface FollowReqBody {
  followed_user_id: string
}

export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}
