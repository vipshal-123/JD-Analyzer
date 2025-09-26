import mongoose from 'mongoose'

const TokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null,
        },
        refreshToken: {
            type: String,
            required: true,
        },
        accessToken: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        sessionId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

const Token = mongoose.model('token', TokenSchema, 'token')
export default Token
