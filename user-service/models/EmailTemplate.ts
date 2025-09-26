import mongoose from 'mongoose'
import * as enums from '@/constants/enums'

const EmailTemplateSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
            unique: true,
        },
        subject: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: enums.EMAIL_TEMPLATE_STATUS.ACTIVE,
            enum: Object.values(enums.EMAIL_TEMPLATE_STATUS),
        },
    },
    { timestamps: true },
)

const EmailTemplates = mongoose.model('emailTemplate', EmailTemplateSchema, 'emailTemplate')
export default EmailTemplates
