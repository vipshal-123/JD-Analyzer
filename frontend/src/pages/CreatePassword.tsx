import { useState } from 'react'
import { useFormik } from 'formik'
import type { FormikHelpers } from 'formik'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react'
import { createPasswordSchema } from '../utils/validationSchemas'
import { createPassword } from '@/services/auth/user/user.service'
import { useDispatch } from 'react-redux'
import { openToast } from '@/redux/slice/toastSlice'
import { removeLocal, setLocal } from '@/utils/storage'
import { fetchUserData } from '@/redux/slice/authSlice'
import type { AppDispatch } from '@/redux/store'

interface CreatePasswordFormValues {
    password: string
    confirmPassword: string
}

const CreatePassword: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const handleSumbit = async (values: CreatePasswordFormValues, { setSubmitting }: FormikHelpers<CreatePasswordFormValues>) => {
        try {
            const response = await createPassword({ password: values.password })

            if (response.success) {
                dispatch(fetchUserData())
                navigate('/upload')
                removeLocal('token')
                setLocal('access_token', response.accessToken)
                dispatch(openToast({ message: response.message, type: 'success' }))
            } else {
                dispatch(openToast({ message: response.message, type: 'error' }))
            }
        } catch (error) {
            console.error('Password creation failed:', error)
            dispatch(openToast({ message: 'Something went wrong', type: 'error' }))
        } finally {
            setSubmitting(false)
        }
    }

    const formik = useFormik<CreatePasswordFormValues>({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: createPasswordSchema,
        onSubmit: handleSumbit,
    })

    const passwordRequirements = [
        { label: 'At least 8 characters', met: formik.values.password.length >= 8 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(formik.values.password) },
        { label: 'One lowercase letter', met: /[a-z]/.test(formik.values.password) },
        { label: 'One number', met: /\d/.test(formik.values.password) },
    ]

    return (
        <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4'>
            <div className='max-w-md w-full bg-white rounded-xl shadow-lg p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create Password</h1>
                    <p className='text-gray-600'>Set up a secure password for your account</p>
                </div>

                <form onSubmit={formik.handleSubmit} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                        <div className='relative'>
                            <Lock className='absolute left-3 top-3.5 h-4 w-4 text-gray-400' />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name='password'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                                    formik.touched.password && formik.errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder='Enter your password'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-3.5 h-4 w-4 text-gray-400 hover:text-gray-600'
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className='mt-1 text-sm text-red-600 flex items-center'>
                                <AlertCircle className='w-4 h-4 mr-1' />
                                {formik.errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm Password</label>
                        <div className='relative'>
                            <Lock className='absolute left-3 top-3.5 h-4 w-4 text-gray-400' />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name='confirmPassword'
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                                    formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder='Confirm your password'
                            />
                            <button
                                type='button'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute right-3 top-3.5 h-4 w-4 text-gray-400 hover:text-gray-600'
                            >
                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className='mt-1 text-sm text-red-600 flex items-center'>
                                <AlertCircle className='w-4 h-4 mr-1' />
                                {formik.errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {formik.values.password && (
                        <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                            <p className='text-sm font-medium text-gray-700'>Password Requirements:</p>
                            {passwordRequirements.map((req, index) => (
                                <div key={index} className='flex items-center space-x-2'>
                                    {req.met ? <Check className='w-4 h-4 text-green-500' /> : <X className='w-4 h-4 text-red-500' />}
                                    <span className={`text-sm ${req.met ? 'text-green-600' : 'text-red-600'}`}>{req.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type='submit'
                        disabled={formik.isSubmitting || !formik.isValid}
                        className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    >
                        {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreatePassword
