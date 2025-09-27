import { useState, useRef } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { Shield, AlertCircle } from 'lucide-react'
import { otpSchema } from '../utils/validationSchemas'

const OTPVerification = () => {
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
    const inputRefs = useRef([])
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema: otpSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000))

                navigate('/create-password')
            } catch (error) {
                console.error('error: ', error)
                setFieldError('otp', 'Invalid OTP. Please try again.')
            } finally {
                setSubmitting(false)
            }
        },
    })

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtpValues = [...otpValues]
            newOtpValues[index] = value
            setOtpValues(newOtpValues)

            const otpString = newOtpValues.join('')
            formik.setFieldValue('otp', otpString)

            // Auto-focus next input
            if (value !== '' && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleResendOTP = async () => {
        try {
            // Simulate resend API call
            await new Promise((resolve) => setTimeout(resolve, 500))
            alert('OTP resent successfully!')
        } catch (error) {
            console.error('error: ', error);
            alert('Failed to resend OTP. Please try again.')
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4'>
            <div className='max-w-md w-full bg-white rounded-xl shadow-lg p-8'>
                <div className='text-center mb-8'>
                    <div className='mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
                        <Shield className='w-8 h-8 text-purple-600' />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Verify Email</h1>
                    <p className='text-gray-600'>Enter the 6-digit code sent to your email</p>
                </div>

                <form onSubmit={formik.handleSubmit} className='space-y-6'>
                    <div>
                        <div className='flex justify-center space-x-3 mb-4'>
                            {otpValues.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type='text'
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                                        formik.touched.otp && formik.errors.otp ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    maxLength={1}
                                />
                            ))}
                        </div>
                        {formik.touched.otp && formik.errors.otp && (
                            <p className='text-center text-sm text-red-600 flex items-center justify-center'>
                                <AlertCircle className='w-4 h-4 mr-1' />
                                {formik.errors.otp}
                            </p>
                        )}
                    </div>

                    <button
                        type='submit'
                        disabled={formik.isSubmitting || !formik.isValid || formik.values.otp.length !== 6}
                        className='w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
                    >
                        {formik.isSubmitting ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-gray-600'>
                        Didn't receive code?{' '}
                        <button onClick={handleResendOTP} className='text-purple-600 hover:text-purple-700 font-semibold'>
                            Resend
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default OTPVerification
