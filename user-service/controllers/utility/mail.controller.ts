import nodemailer, { TransportOptions } from 'nodemailer'
import config from '@/config'
import * as enums from '@/constants/enums'
import { EmailTemplates } from '@/models'

interface MailContent {
    subject: string
    template: string
}

interface TemplateContent {
    otp?: string
    [key: string]: any
}

const sendEmail = async (toEmail: string, content: MailContent, bcc: string | string[] | null = null): Promise<boolean> => {
    try {
        const { subject, template } = content
        const transport = nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            secure: config.SMTP_SECURE,
            auth: {
                user: config.SMTP_USER,
                pass: config.SMTP_PASS,
            },
        } as TransportOptions)

        const mailSentInformation = await transport.sendMail({
            from: config.SMTP_MAIL,
            to: toEmail,
            bcc: bcc || undefined,
            subject,
            html: template,
        })

        console.log('Mail sent info:', mailSentInformation.accepted, mailSentInformation.messageId)
        return true
    } catch (error) {
        console.log('Error in sending email', error)
        return false
    }
}

export const sendEmailViaTemplate = async ({
    identifier,
    to,
    content,
    bcc,
}: {
    identifier: string
    to: string
    content: TemplateContent
    bcc?: string | string[]
}): Promise<boolean> => {
    try {
        const template = await EmailTemplates.findOne({ identifier })

        if (!template) {
            console.log('No email template found for', identifier)
            return false
        }

        if (template.status === 'INACTIVE') {
            console.log(`${identifier} template is currently inactive`)
        }

        const mailContent: MailContent = {
            subject: template.subject,
            template: template.content,
        }

        switch (identifier) {
            case enums.EMAIL_CATEGORIES.VERIFICATION_MAIL:
                mailContent.template = mailContent.template.replace('##OTP##', content.otp || '')
                break
            default:
                break
        }

        return await sendEmail(to, mailContent, bcc ?? null)
    } catch (error) {
        console.log('sendEmailViaTemplate', error)
        return false
    }
}
