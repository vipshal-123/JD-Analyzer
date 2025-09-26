import mongoose from 'mongoose'
import * as enums from '@/constants/enums'

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            trim: true,
            required: true,
        },
        fullName: {
            type: String,
            trim: true,
            default: '',
        },
        password: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: Object.values(enums.STATUS),
            default: enums.STATUS.PENDING,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

const User = mongoose.model('users', UserSchema, 'users')
export default User
