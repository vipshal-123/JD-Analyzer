import config from '@/config'
import { EmailTemplates, Security, Token, User } from '@/models'
import { sendOtp, verifyOtp } from '@/security/auth.security'
import { decryptString, encryptString } from '@/security/crypto'
import { comparePassword, generateJWTToken, generatePassword } from '@/security/security'
import { v4 as uuid } from 'uuid'
import isEmpty from 'is-empty'
import ms from 'ms'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { AuthTokenPayload } from '@/types/auth'
import * as enums from '@/constants/enums'

export const signupSendOtp = async (req: Request, res: Response) => {
    try {
        const { body } = req
        const otpCount = body.otpCount || 0

        const findEmailTemplate = await EmailTemplates.findOne({ identifier: 'verification_mail' }).select('_id').lean()

        if (isEmpty(findEmailTemplate)) {
            return res.status(500).json({ success: false, message: 'Email Template not found.' })
        }

        const findUser = await User.findOne({ email: body.email })
        console.log('findUser: ', findUser)

        if (findUser && findUser.isEmailVerified) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' })
        }

        const userPayload = {
            fullName: body.name,
            email: body.email,
        }

        let createUser: any = { _id: findUser?._id, email: body.email, fullName: body?.name }
        console.log('createUser: ', createUser)

        if (!findUser) {
            createUser = await User.create(userPayload)

            if (isEmpty(createUser)) {
                console.log('createUser: ', createUser)
                return res.status(500).json({ success: false, message: 'Something went wrong' })
            }
        }

        const findSecurities = await Security.findOne({ userId: findUser?._id })

        if (findUser && !findUser?.isEmailVerified && !isEmpty(findSecurities)) {
            await Security.updateOne(
                { userId: findUser?._id, type: 'activation_mail' },
                {
                    $set: {
                        value: '',
                        expiresAt: null,
                        secret: null,
                        tries: 0,
                        securityCount: 0,
                        otpRequestedAt: null,
                    },
                },
            )
        }

        const { status, message, token } = await sendOtp(
            { _id: createUser._id, email: createUser.email },
            req,
            res,
            'verification_mail',
            '',
            'activation_mail',
            'email',
            'email_otp_session',
            { name: createUser.fullName },
            otpCount,
        )

        if (!status) {
            console.log('message: ', message)
            return res.status(500).json({ success: false, message: 'Something went wrong while sending OTP' })
        }

        return res.status(200).json({ success: true, message: 'OTP sent via email', mode: 'OTP_VERIFY', token })
    } catch (error) {
        console.log('error: ', error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const verifySignupOtp = async (req: Request, res: Response) => {
    try {
        const { body, cookies } = req
        console.log('cookies: ', cookies)

        if (isEmpty(body?.token)) {
            return res.status(400).json({ success: false, message: 'Invalid token' })
        }

        const decryptToken = JSON.parse(decryptString(body.token))
        console.log('decryptToken: ', decryptToken)
        if (isEmpty(decryptToken)) {
            return res.status(400).json({ success: false, message: 'Invalid token' })
        }

        const { status, message } = await verifyOtp(
            { _id: decryptToken._id },
            res,
            cookies,
            body.otp,
            'activation_mail',
            'email',
            'email_otp_session',
        )

        if (!status) {
            return res.status(400).json({ success: false, message })
        }

        const updatedCount = await User.updateOne({ _id: decryptToken._id }, { $set: { isEmailVerified: true } })

        if (updatedCount.modifiedCount === 0) {
            console.log('updatedCount: ', updatedCount)
            return res.status(500).json({ success: false, message: 'Something went wrong' })
        }

        const cookieData = encryptString(JSON.stringify({ _id: decryptToken._id }))
        const cookieConfig = {
            httpOnly: true,
            sameSite: 'none' as const,
            secure: true,
            partitioned: true,
        }

        res.header('Access-Control-Allow-Origin', config.FRONTEND_USER)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.clearCookie('email_otp_session')
        res.cookie('create_password_token', cookieData, cookieConfig)

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            mode: 'CREATE_PASSWORD',
        })
    } catch (error) {
        console.error('error: ', error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const resendOtp = async (req: Request, res: Response) => {
    try {
        const { body } = req

        if (isEmpty(body.token)) {
            return res.status(400).json({ success: false, message: 'Token is required' })
        }

        const tokenId = JSON.parse(decryptString(body.token))
        const user = await User.findById(tokenId?._id)

        if (!user) {
            console.log('user: ', user)
            return res.status(400).json({ success: false, message: 'Invalid token' })
        }

        const securityData = await Security.findOne({ userId: user._id, type: tokenId?.type, mode: tokenId?.mode })

        if (!securityData) {
            console.log('securityData: ', securityData)
            return res.status(404).json({ success: false, message: 'Security not found' })
        }

        if (securityData.expiresAt && securityData.expiresAt.getTime() - new Date().getTime() > ms('8m')) {
            return res.status(400).json({ success: false, message: 'Please try requesting OTP after two minutes' })
        }

        const { status, message } = await sendOtp(
            { _id: tokenId._id, email: tokenId.email },
            req,
            res,
            'verification_mail',
            '',
            'activation_mail',
            'email',
            'email_otp_session',
            { name: user.fullName },
            0,
        )

        if (!status) {
            console.log('message: ', message)
            return res.status(500).json({ success: false, message: 'Something went wrong while sending otp' })
        }
        return res.status(201).json({ success: true, message: 'OTP has been successfully resent to your email', mode: 'VERIFY_SIGNUP' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const createPassword = async (req: Request, res: Response) => {
    try {
        const { body, cookies } = req

        if (isEmpty(cookies.create_password_token)) {
            console.log('Invalid session: missing create_password_token: ')
            return res.status(400).json({ success: false, message: 'Invalid session' })
        }

        const decryptData = JSON.parse(decryptString(cookies.create_password_token as string))

        if (isEmpty(decryptData)) {
            console.log('decryptData: ', decryptData)
            return res.status(400).json({ success: false, message: 'Invalid session' })
        }

        const userData = await User.findById(decryptData._id)

        if (!userData) {
            console.log('userData: ', userData)
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        let findSecurity = await Security.findOne({ userId: userData._id })
        if (isEmpty(findSecurity)) {
            const secPayload = {
                userId: userData._id,
                type: 'activation_mail',
            }

            findSecurity = await Security.create(secPayload)

            if (isEmpty(findSecurity)) {
                console.log('findSecurity: ', findSecurity)
                return res.status(500).json({ success: false, message: 'Something went wrong' })
            }
        }

        const hashPassword = await generatePassword(body?.password)
        if (isEmpty(hashPassword)) {
            console.log('hashPassword: ', hashPassword)
            return res.status(500).json({ success: false, message: 'Something went wrong' })
        }

        const updateUser = await User.updateOne(
            { _id: userData._id },
            {
                $set: {
                    password: hashPassword,
                    isEmailVerified: true,
                    status: enums.STATUS.ACTIVE,
                },
            },
        )

        if (updateUser.modifiedCount === 0) {
            console.log('updateUser: ', updateUser)
            return res.status(500).json({ success: false, message: 'Something went wrong' })
        }

        const sessionId = uuid()
        const jwtPayload = { sessionId, _id: String(userData._id), email: userData?.email }

        const accessToken = generateJWTToken(jwtPayload, false)
        const refreshToken = generateJWTToken(jwtPayload, true)

        const createToken = await Token.create({
            userId: userData._id,
            sessionId,
            accessToken,
            refreshToken,
            expiresAt: new Date(Date.now() + config.REFRESH_TOKEN_EXPIRATION),
        })

        if (isEmpty(createToken)) {
            console.log('createToken: ', createToken)
            return res.status(500).json({ success: false, message: 'Something went wrong' })
        }

        res.cookie('refreshToken', refreshToken, {
            maxAge: config.REFRESH_TOKEN_EXPIRATION / 1000,
            httpOnly: true,
            sameSite: 'none' as const,
            secure: true,
            partitioned: true,
        }).clearCookie('create_password_token')

        res.header('Access-Control-Allow-Origin', config.FRONTEND_USER)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

        return res.status(200).json({
            success: true,
            message: 'Password created successfully',
            mode: 'HOME',
            accessToken,
        })
    } catch (error) {
        console.error('error: ', error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const { body } = req

        const user = await User.findOne({ email: body.email }).lean()
        console.log('user: ', user)

        if (!user) {
            console.log('user: ', user)
            return res.status(400).json({ success: false, message: 'No user exists with this email' })
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: 'E-mail was not verified, please signUp to continue',
                mode: 'SIGNUP',
            })
        }

        const passwordCheck = await comparePassword(body.password, user.password)
        if (!passwordCheck) {
            return res.status(400).json({ success: false, message: 'Password is incorrect' })
        }

        const userSecurity = await Security.findOne({ userId: user._id })
        if (isEmpty(userSecurity)) {
            console.log('userSecurity: ', userSecurity)
            return res.status(404).json({ success: false, message: 'Security info not found' })
        }

        const sessionId = uuid()
        const accessToken = generateJWTToken({ sessionId, _id: String(user._id), email: user.email }, false)
        const refreshToken = generateJWTToken({ sessionId, _id: String(user._id), email: user.email }, true)

        await Token.create({
            userId: user._id,
            sessionId,
            accessToken,
            refreshToken,
            expiresAt: new Date(Date.now() + config.REFRESH_TOKEN_EXPIRATION),
        })

        res.cookie('refreshToken', refreshToken, {
            maxAge: config.REFRESH_TOKEN_EXPIRATION / 1000,
            httpOnly: true,
            sameSite: 'none' as const,
            secure: true,
            partitioned: true,
        })

        res.header('Access-Control-Allow-Origin', config.FRONTEND_USER)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

        return res.status(201).json({
            success: true,
            message: 'Signed-In successfully',
            sessionId,
            accessToken,
        })
    } catch (error) {
        console.error('error: ', error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { cookies } = req

        if (isEmpty(cookies.refreshToken)) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        const storedToken = await Token.findOne({ refreshToken: cookies?.refreshToken })

        if (!storedToken) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        if (new Date() > new Date(storedToken.expiresAt)) {
            await Token.deleteOne({ refreshToken: cookies?.refreshToken })

            res.clearCookie('refreshToken')
            return res.status(403).json({ success: false, message: 'Refresh token expired' })
        }

        let decoded: any = null
        try {
            decoded = jwt.verify(cookies?.refreshToken, config.AUTH_PUBLIC_KEY, { algorithms: ['RS256'] }) as AuthTokenPayload
            console.log('decoded: ', decoded)

            if (isEmpty(decoded)) {
                return res.status(401).json({ success: false, message: 'Unauthorized' })
            }
        } catch (error) {
            console.log('error: ', error)
            return res.status(403).json({ success: false, message: 'Invalid refresh token' })
        }

        const user = await User.findById(decoded._id)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const newAccessToken = generateJWTToken(
            {
                sessionId: storedToken.sessionId,
                _id: String(user._id),
                email: user.email,
            },
            false,
        )

        await Token.updateOne({ refreshToken: cookies?.refreshToken }, { $set: { accessToken: newAccessToken } })

        return res.status(200).json({ success: true, message: 'New access token generated', accessToken: newAccessToken })
    } catch (error) {
        console.log('error: ', error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const userInfo = async (req: Request, res: Response) => {
    try {
        const { user } = req
        console.log('user: ', user)

        const findUser = await User.findById(user._id).select('-password -isEmailVerified -status').lean()

        if (isEmpty(findUser)) {
            return res.status(200).json({ success: true, data: {} })
        }

        return res.status(200).json({ success: true, data: findUser })
    } catch (error) {
        console.error('error: ', error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}
