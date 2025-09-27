import { useFormik } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, AlertCircle } from 'lucide-react'
import { registerSchema } from '../utils/validationSchemas'

const Register = () => {
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
        },
        validationSchema: registerSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000))

                // Store user data temporarily
                localStorage.setItem('registerData', JSON.stringify(values))

                navigate('/verify-otp')
            } catch (error) {
                console.error('error: ', error)
                setFieldError('email', 'Email already exists')
            } finally {
                setSubmitting(false)
            }
        },
    })

    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4'>
            <div className='max-w-md w-full bg-white rounded-xl shadow-lg p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h1>
                    <p className='text-gray-600'>Join us to analyze your resume</p>
                </div>

                <form onSubmit={formik.handleSubmit} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                        <div className='relative'>
                            <User className='absolute left-3 top-3.5 h-4 w-4 text-gray-400' />
                            <input
                                type='text'
                                name='name'
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                                    formik.touched.name && formik.errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder='Enter your full name'
                            />
                            {formik.touched.name && formik.errors.name && <AlertCircle className='absolute right-3 top-3.5 h-4 w-4 text-red-500' />}
                        </div>
                        {formik.touched.name && formik.errors.name && (
                            <p className='mt-1 text-sm text-red-600 flex items-center'>
                                <AlertCircle className='w-4 h-4 mr-1' />
                                {formik.errors.name}
                            </p>
                        )}
                    </div>

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

                    <button
                        type='submit'
                        disabled={formik.isSubmitting || !formik.isValid}
                        className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    >
                        {formik.isSubmitting ? 'Processing...' : 'Continue'}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-gray-600'>
                        Already have an account?{' '}
                        <Link to='/login' className='text-green-600 hover:text-green-700 font-semibold'>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
