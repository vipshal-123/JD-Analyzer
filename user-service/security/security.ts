import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '@/config'
import { AuthTokenPayload } from '@/types/auth'

export const generatePassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
}

export const generateJWTToken = (payload: AuthTokenPayload, isRefreshToken = false) => {
    const token = jwt.sign(payload, config.AUTH_SIGNER_KEY, {
        algorithm: 'RS256',
        expiresIn: isRefreshToken ? config.REFRESH_TOKEN_EXPIRATION : config.ACCESS_TOKEN_EXPIRATION / 1000,
    })

    return token
}

export const hashString = async (string: string) => {
    const salt = await bcrypt.genSalt(10)
    const hashedString = await bcrypt.hash(string, salt)
    return hashedString
}

export const compareString = async (string: string, hashedString: string) => {
    const isMatch = await bcrypt.compare(string, hashedString)
    return isMatch
}
