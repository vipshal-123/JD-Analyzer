import yupToFormError from '@/utils/yupToFormErrors'
import * as yup from 'yup'
import { EMAIL } from '@/constants/regex'
import { NextFunction, Request, Response } from 'express'

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body } = req

        const schema = yup.object({
            name: yup
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
            return res.status(400).json({ success: false, errors: yupToFormError(error) })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}