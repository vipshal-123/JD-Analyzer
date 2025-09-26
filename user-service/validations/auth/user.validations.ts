import yupToFormError from '@/utils/yupToFormErrors'
import * as yup from 'yup'
import { EMAIL } from '@/constants/regex'
import { Request, Response } from 'express'

export const signup = async (req: Request, reply: Response) => {
    try {
        const { body } = req

        const schema = yup.object({
            fullName: yup
                .string()
                .trim()
                .min(2, 'Name must be at least 2 characters')
                .max(50, 'Name cannot exceed 50 characters')
                .required('Name is required'),

            email: yup.string().trim().matches(EMAIL).email('Invalid email format').required('Email is required'),
        })

        try {
            await schema.validate(body, { abortEarly: false })
        } catch (error: any) {
            return reply.status(400).send({ success: false, errors: yupToFormError(error) })
        }
    } catch (error) {
        console.log(error)
        return reply.status(500).send({ success: false, message: 'Something went wrong' })
    }
}