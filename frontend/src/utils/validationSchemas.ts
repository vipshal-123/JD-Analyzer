import * as Yup from 'yup'

export const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

export const registerSchema = Yup.object({
    name: Yup.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
})

export const otpSchema = Yup.object({
    otp: Yup.string()
        .matches(/^\d{6}$/, 'OTP must be 6 digits')
        .required('OTP is required'),
})

export const createPasswordSchema = Yup.object({
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
})

export const uploadSchema = Yup.object({
    jobTitle: Yup.string().min(2, 'Job title must be at least 2 characters').required('Job title is required'),
    company: Yup.string().min(2, 'Company name must be at least 2 characters'),
    jobDescription: Yup.string().min(50, 'Job description must be at least 50 characters').required('Job description is required'),
    resume: Yup.mixed()
        .required('Resume file is required')
        .test('fileType', 'Only PDF and DOCX files are allowed', (value) => {
            if (!value) return false
            return ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type)
        })
        .test('fileSize', 'File size must be less than 5MB', (value) => {
            if (!value) return false
            return value?.size <= 5 * 1024 * 1024
        }),
})
