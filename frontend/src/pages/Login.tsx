import { useState } from 'react'
import { useFormik } from 'formik'
import type { FormikHelpers } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { loginSchema } from '../utils/validationSchemas'
import { signin } from '@/services/auth/user/user.service'
import { useDispatch } from 'react-redux'
import { openToast } from '@/redux/slice/toastSlice'
import { setLocal } from '@/utils/storage'
import { fetchUserData } from '@/redux/slice/authSlice'
import type { AppDispatch } from '@/redux/store'

interface LoginFormValues {
    email: string
    password: string
}

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const handleSubmit = async (values: LoginFormValues, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
        try {
            const response = await signin(values)

            if (response.success) {
                navigate('/upload')
                dispatch(fetchUserData())
                setLocal('access_token', response.accessToken)
                dispatch(openToast({ message: response.message, type: 'success' }))
            } else {
                dispatch(openToast({ message: response.message, type: 'error' }))
            }
        } catch (error) {
            console.error('error: ', error)
            dispatch(openToast({ message: 'Something went wrong', type: 'error' }))
        } finally {
            setSubmitting(false)
        }
    }

    const formik = useFormik<LoginFormValues>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: handleSubmit,
    })

    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-indigo-100 flex items-center justify-center p-4'>
            <div className='max-w-md w-full bg-white rounded-xl shadow-lg p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back</h1>
                    <p className='text-gray-600'>Sign in to your account</p>
                </div>

                <form onSubmit={formik.handleSubmit} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                        <div className='relative'>
                            <Mail className='absolute left-3 top-3.5 h-4 w-4 text-gray-400' />
                            <input
                                type='email'
                                name='email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                                    formik.touched.email && formik.errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder='Enter your email'
                            />
                            {formik.touched.email && formik.errors.email && <AlertCircle className='absolute right-3 top-3.5 h-4 w-4 text-red-500' />}
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <p className='mt-1 text-sm text-red-600 flex items-center'>
                                <AlertCircle className='w-4 h-4 mr-1' />
                                {formik.errors.email}
                            </p>
                        )}
                    </div>

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
                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
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

                    <button
                        type='submit'
                        disabled={formik.isSubmitting || !formik.isValid}
                        className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    >
                        {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-gray-600'>
                        Don't have an account?{' '}
                        <Link to='/' className='text-green-600 hover:text-green-700 font-semibold'>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
