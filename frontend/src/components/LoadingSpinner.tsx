import React, { useState, useEffect } from 'react'
import { FileText, BarChart3, TrendingUp } from 'lucide-react'

type SpinnerType = 'default' | 'analysis' | 'reports' | 'dashboard'

interface LoadingSpinnerProps {
    message?: string
    type?: SpinnerType
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', type = 'default' }) => {
    const getIcon = () => {
        switch (type) {
            case 'analysis':
                return <BarChart3 className='w-8 h-8 text-blue-500 animate-pulse' />
            case 'reports':
                return <FileText className='w-8 h-8 text-purple-500 animate-pulse' />
            case 'dashboard':
                return <TrendingUp className='w-8 h-8 text-green-500 animate-pulse' />
            default:
                return null
        }
    }

    const getMessages = (): string[] => {
        switch (type) {
            case 'analysis':
                return ['Analyzing resume...', 'Extracting key skills...', 'Calculating match score...', 'Generating recommendations...']
            case 'reports':
                return ['Loading past analyses...', 'Fetching your reports...', 'Preparing data...']
            case 'dashboard':
                return ['Loading dashboard...', 'Calculating statistics...', 'Preparing insights...']
            default:
                return [message]
        }
    }

    const messages = getMessages()
    const [currentMessage, setCurrentMessage] = useState<number>(0)

    useEffect(() => {
        if (messages.length > 1) {
            const interval = setInterval(() => {
                setCurrentMessage((prev) => (prev + 1) % messages.length)
            }, 2000)
            return () => clearInterval(interval)
        }
    }, [messages.length])

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='flex flex-col items-center space-y-6 p-8'>
                <div className='relative'>
                    <div className='animate-spin rounded-full h-16 w-16 border-4 border-gray-200'></div>
                    <div
                        className='animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0'
                        style={{ animationDuration: '1.5s' }}
                    ></div>

                    <div className='absolute inset-0 flex items-center justify-center'>{getIcon()}</div>
                </div>

                <div className='text-center'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>{messages[currentMessage]}</h3>
                    <p className='text-gray-600 max-w-md'>Please wait while we process your request. This may take a few moments.</p>
                </div>

                <div className='flex space-x-2'>
                    {[0, 1, 2].map((index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                index === currentMessage % 3 ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                            style={{
                                animationDelay: `${index * 0.2}s`,
                            }}
                        />
                    ))}
                </div>

                {type === 'analysis' && (
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md'>
                        <p className='text-sm text-blue-800'>
                            <strong>Tip:</strong> Our AI is analyzing your resume against job requirements to provide the most accurate match score
                            and personalized recommendations.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

interface MinimalSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    color?: 'blue' | 'green' | 'purple' | 'red' | 'gray'
}

export const MinimalSpinner: React.FC<MinimalSpinnerProps> = ({ size = 'md', color = 'blue' }) => {
    const sizeClasses: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
    }

    const colorClasses: Record<'blue' | 'green' | 'purple' | 'red' | 'gray', string> = {
        blue: 'border-blue-500',
        green: 'border-green-500',
        purple: 'border-purple-500',
        red: 'border-red-500',
        gray: 'border-gray-500',
    }

    const spinnerSize = sizeClasses[size]
    const spinnerColor = colorClasses[color]

    return (
        <div className='flex items-center justify-center p-4'>
            <div className={`animate-spin rounded-full border-2 border-gray-200 ${spinnerColor} border-t-transparent ${spinnerSize}`}></div>
        </div>
    )
}

interface InlineLoaderProps {
    text?: string
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({ text = 'Loading...' }) => {
    return (
        <div className='flex items-center justify-center space-x-2 py-4'>
            <div className='animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-blue-500'></div>
            <span className='text-gray-600 text-sm'>{text}</span>
        </div>
    )
}

export default LoadingSpinner
