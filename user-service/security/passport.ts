import jsonwebtoken from 'jsonwebtoken'
import config from '@/config'
import { Token, User } from '@/models'
import { Request, Response, NextFunction } from 'express'
import * as enums from '@/constants/enums'
import { AuthTokenPayload } from '@/types/auth'


export const userAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isRefreshing = req.path.endsWith('/refresh-token')

        const token = isRefreshing ? req.cookies.refreshToken : req?.headers?.authorization?.split(' ')[1]
        const decoded = jsonwebtoken.verify(token, config.AUTH_PUBLIC_KEY, { algorithms: ['RS256'] }) as AuthTokenPayload
        const user = await User.findById(decoded?._id).select('_id status').lean()

        const tokenRecord = await Token.findOne({ [isRefreshing ? 'refreshToken' : 'accessToken']: token }).lean()

        if (!tokenRecord) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        if (user.status !== enums.STATUS.ACTIVE) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        req.user = decoded
        req.user.sessionId = tokenRecord.sessionId

        return next()
    } catch (error) {
        console.log('error: ', error)
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
}

export const decodeRefresh = (token: string) => {
    try {
        return jsonwebtoken.verify(token, config.AUTH_PUBLIC_KEY, { algorithms: ['RS256'] })
    } catch (error) {
        console.error('error: ', error)
    }
}
