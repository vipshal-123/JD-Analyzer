import { userAuthenticate as userAuth } from '@/security/passport';
import express from 'express'
import * as controllers from '@/controllers'
import * as validations from '@/validations'

const router = express.Router()

router.route('/signup-sendotp').post(validations.auth.user.signup, controllers.auth.user.signupSendOtp)
router.route('/signup-verifyotp').post(controllers.auth.user.verifySignupOtp)
router.route('/resend-otp').post(controllers.auth.user.resendOtp)
router.route('/create-password').post(controllers.auth.user.createPassword)
router.route('/signin').post(controllers.auth.user.signin)
router.route('/refresh-token').post(controllers.auth.user.refreshToken)

router.route('/user-info').get(userAuth, controllers.auth.user.userInfo)

export default router
