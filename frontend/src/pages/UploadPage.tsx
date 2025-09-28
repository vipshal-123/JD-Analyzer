import { useState } from 'react'
import { useFormik } from 'formik'
import type { FormikHelpers } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import type { FileWithPath } from 'react-dropzone'
import { Upload, FileText, Briefcase, AlertCircle, CheckCircle, X, LogOut, LayoutDashboard } from 'lucide-react'
import { uploadSchema } from '../utils/validationSchemas'
import { analyseResume } from '@/services/v1/agent/agent.service'
import { useDispatch } from 'react-redux'
import { openToast } from '@/redux/slice/toastSlice'
import { removeLocal } from '@/utils/storage'
import { fetchUserData } from '@/redux/slice/authSlice'
import type { AppDispatch } from '@/redux/store'

interface UploadFormValues {
    jobTitle: string
    company: string
    jobDescription: string
    resume: File | null
}

const UploadPage: React.FC = () => {
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const handleSubmit = async (values: UploadFormValues, { setSubmitting }: FormikHelpers<UploadFormValues>) => {
        try {
            setIsAnalyzing(true)

            if (!values.resume) return

            const formData = new FormData()
            formData.append('resume', values.resume)
            formData.append('jd', values.jobDescription)
            formData.append('job_title', values.jobTitle)
            formData.append('company', values.company)

            const response = await analyseResume(formData)

            if (response.success) {
                navigate('/dashboard', { state: { analysisData: response.data } })
                dispatch(openToast({ message: response.message, type: 'success' }))
            } else {
                dispatch(openToast({ message: response.message, type: 'error' }))
            }
        } catch (error) {
            console.error('error: ', error)
            dispatch(openToast({ message: 'Something went wrong', type: 'error' }))
        } finally {
            setIsAnalyzing(false)
            setSubmitting(false)
        }
    }

    const formik = useFormik<UploadFormValues>({
        initialValues: {
            jobTitle: '',
            company: '',
            jobDescription: '',
            resume: null,
        },
        validationSchema: uploadSchema,
        onSubmit: handleSubmit,
    })

    const onDrop = (acceptedFiles: FileWithPath[], rejectedFiles: FileWithPath[]) => {
        if (rejectedFiles.length > 0) {
            formik.setFieldError('resume', 'Please upload a valid PDF or DOCX file (max 5MB)')
            return
        }

        if (acceptedFiles.length > 0) {
            formik.setFieldValue('resume', acceptedFiles[0])
            formik.setFieldError('resume', '')
        }
    }

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: false,
    })

    const handleLogout = () => {
        removeLocal('access_token')
        dispatch(fetchUserData())
        navigate('/login')
    }

    const removeFile = () => {
        formik.setFieldValue('resume', null)
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <header className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div  onClick={() => navigate('/upload')} className='flex items-center space-x-4 cursor-pointer'>
                            <div className='bg-blue-600 rounded-lg p-2'>
                                <FileText className='w-6 h-6 text-white' />
                            </div>
                            <h1 className='text-xl font-bold text-gray-900'>Resume Analyzer</h1>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <button
                                onClick={() => navigate('/past-analysis')}
                                className='flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md transition-colors'
                            >
                                <FileText className='w-4 h-4' />
                                <span>Past Analysis</span>
                            </button>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className='flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md transition-colors'
                            >
                                <LayoutDashboard className='w-4 h-4' />
                                <span>Dashboard</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className='flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md'
                            >
                                <LogOut className='w-4 h-4' />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-gray-900 mb-4'>Analyze Your Resume</h2>
                    <p className='text-gray-600 max-w-2xl mx-auto'>
                        Upload your resume and provide the job description to get a detailed analysis of how well your profile matches the position.
                    </p>
                </div>

                <div className='bg-white rounded-xl shadow-lg p-8'>
                    <form onSubmit={formik.handleSubmit} className='space-y-8'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Job Title *</label>
                                <div className='relative'>
                                    <Briefcase className='absolute left-3 top-3.5 h-4 w-4 text-gray-400' />
                                    <input
                                        type='text'
                                        name='jobTitle'
                                        value={formik.values.jobTitle}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                                            formik.touched.jobTitle && formik.errors.jobTitle ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder='e.g., Frontend Developer'
                                    />
                                </div>
                                {formik.touched.jobTitle && formik.errors.jobTitle && (
                                    <p className='mt-1 text-sm text-red-600 flex items-center'>
                                        <AlertCircle className='w-4 h-4 mr-1' />
                                        {formik.errors.jobTitle}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Company (Optional)</label>
                                <input
                                    type='text'
                                    name='company'
                                    value={formik.values.company}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                                        formik.touched.company && formik.errors.company ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder='e.g., Google'
                                />
                                {formik.touched.company && formik.errors.company && (
                                    <p className='mt-1 text-sm text-red-600 flex items-center'>
                                        <AlertCircle className='w-4 h-4 mr-1' />
                                        {formik.errors.company}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Job Description *</label>
                            <textarea
                                name='jobDescription'
                                rows={8}
                                value={formik.values.jobDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y ${
                                    formik.touched.jobDescription && formik.errors.jobDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder='Paste the complete job description here including requirements, responsibilities, and qualifications...'
                            />
                            {formik.touched.jobDescription && formik.errors.jobDescription && (
                                <p className='mt-1 text-sm text-red-600 flex items-center'>
                                    <AlertCircle className='w-4 h-4 mr-1' />
                                    {formik.errors.jobDescription}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Resume Upload *</label>

                            {!formik.values.resume ? (
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                        isDragActive
                                            ? 'border-blue-400 bg-blue-50'
                                            : isDragReject
                                            ? 'border-red-400 bg-red-50'
                                            : formik.touched.resume && formik.errors.resume
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                                    <p className='text-lg font-medium text-gray-700 mb-2'>
                                        {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
                                    </p>
                                    <p className='text-sm text-gray-500'>Drag and drop your file here, or click to browse</p>
                                    <p className='text-xs text-gray-400 mt-2'>Supports PDF and DOCX files (max 5MB)</p>
                                </div>
                            ) : (
                                <div className='border border-gray-300 rounded-lg p-4 bg-gray-50'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center space-x-3'>
                                            <div className='bg-blue-100 rounded-lg p-2'>
                                                <FileText className='w-5 h-5 text-blue-600' />
                                            </div>
                                            <div>
                                                <p className='font-medium text-gray-900'>{formik.values.resume.name}</p>
                                                <p className='text-sm text-gray-500'>{(formik.values.resume.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-5 h-5 text-green-500' />
                                            <button
                                                type='button'
                                                onClick={removeFile}
                                                className='p-1 text-gray-400 hover:text-red-500 transition-colors'
                                            >
                                                <X className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formik.touched.resume && formik.errors.resume && (
                                <p className='mt-1 text-sm text-red-600 flex items-center'>
                                    <AlertCircle className='w-4 h-4 mr-1' />
                                    {formik.errors.resume}
                                </p>
                            )}
                        </div>

                        <div className='flex justify-center'>
                            <button
                                type='submit'
                                disabled={formik.isSubmitting || !formik.isValid || isAnalyzing}
                                className='px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg'
                            >
                                {isAnalyzing ? (
                                    <div className='flex items-center space-x-2'>
                                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                                        <span>Analyzing Resume...</span>
                                    </div>
                                ) : (
                                    'Analyze Resume'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {isAnalyzing && (
                    <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6'>
                        <div className='flex items-center space-x-3'>
                            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
                            <div>
                                <h3 className='font-semibold text-blue-900'>Analyzing Your Resume</h3>
                                <p className='text-blue-700 text-sm'>
                                    Our AI is comparing your resume against the job requirements. This may take a few moments...
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default UploadPage
