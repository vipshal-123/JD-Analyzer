import fs from 'fs'
import path from 'path'
import ms from 'ms'

export default {
    PORT: process.env.PORT as string,
    MONGO_URI: process.env.MONGO_URI as string,
    API_HOST: process.env.API_HOST as string,
    CORS_ORIGIN: ['http://localhost:3000'],
    CRYPTO_SECRET: process.env.CRYPTO_SECRET as string,
    AUTH_PUBLIC_KEY: fs.readFileSync(path.resolve(path.join(__dirname, '../private/auth_public_key.pem')), 'utf8'),
    AUTH_SIGNER_KEY: fs.readFileSync(path.resolve(path.join(__dirname, '../private/auth_private_signer.pem')), 'utf8'),
    REFRESH_TOKEN_EXPIRATION: ms("7d"),
    ACCESS_TOKEN_EXPIRATION:  ms("15m"),

    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    SMTP_SECURE: process.env.SMTP_SECURE as string,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PASS: process.env.SMTP_PASS as string,
    SMTP_MAIL: process.env.SMTP_MAIL as string,

    FRONTEND_USER: process.env.FRONTEND_USER
}
