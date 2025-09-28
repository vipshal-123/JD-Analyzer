import React, { useState } from 'react'
import { Lightbulb, TrendingUp, Star, CheckCircle, Copy, Check } from 'lucide-react'

interface RecommendationsProps {
    data: string[]
}

const Recommendations: React.FC<RecommendationsProps> = ({ data }) => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIndex(index)
            setTimeout(() => setCopiedIndex(null), 2000)
        })
    }

    const getPriorityColor = (text: string) => {
        if (text.includes('High Impact')) return 'border-red-200 bg-red-50'
        if (text.includes('Medium Impact')) return 'border-yellow-200 bg-yellow-50'
        if (text.includes('Low Impact')) return 'border-green-200 bg-green-50'
        return 'border-blue-200 bg-blue-50'
    }

    const getPriorityIcon = (text: string) => {
        if (text.includes('High Impact')) return <Star className='w-5 h-5 text-red-500' />
        if (text.includes('Medium Impact')) return <TrendingUp className='w-5 h-5 text-yellow-500' />
        if (text.includes('Low Impact')) return <CheckCircle className='w-5 h-5 text-green-500' />
        return <Lightbulb className='w-5 h-5 text-blue-500' />
    }

    return (
        <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow p-6'>
                <div className='flex items-center space-x-2 mb-6'>
                    <Lightbulb className='w-6 h-6 text-yellow-500' />
                    <h2 className='text-2xl font-bold text-gray-900'>Improvement Recommendations</h2>
                </div>
                <p className='text-gray-600 mb-6'>Here are personalized recommendations to improve your resume and increase your match score:</p>

                <div className='space-y-4'>
                    {data.map((recommendation, index) => (
                        <div key={index} className={`border rounded-lg p-6 ${getPriorityColor(recommendation)}`}>
                            <div className='flex items-start justify-between'>
                                <div className='flex items-start space-x-3 flex-1'>
                                    {getPriorityIcon(recommendation)}
                                    <div className='flex-1'>
                                        <p className='text-gray-800 leading-relaxed whitespace-pre-line'>
                                            {recommendation.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(recommendation, index)}
                                    className='ml-4 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white/50 transition-colors flex-shrink-0'
                                    title='Copy recommendation'
                                >
                                    {copiedIndex === index ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4' />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Quick Action Items</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div className='bg-white rounded-lg p-4 shadow-sm'>
                        <div className='flex items-center space-x-2 mb-2'>
                            <Star className='w-4 h-4 text-red-500' />
                            <span className='font-semibold text-sm text-red-600'>High Priority</span>
                        </div>
                        <p className='text-sm text-gray-600'>Add missing technical skills (PostgreSQL, MySQL)</p>
                    </div>
                    <div className='bg-white rounded-lg p-4 shadow-sm'>
                        <div className='flex items-center space-x-2 mb-2'>
                            <TrendingUp className='w-4 h-4 text-yellow-500' />
                            <span className='font-semibold text-sm text-yellow-600'>Medium Priority</span>
                        </div>
                        <p className='text-sm text-gray-600'>Emphasize Node.js and backend experience</p>
                    </div>
                    <div className='bg-white rounded-lg p-4 shadow-sm'>
                        <div className='flex items-center space-x-2 mb-2'>
                            <CheckCircle className='w-4 h-4 text-green-500' />
                            <span className='font-semibold text-sm text-green-600'>Quick Wins</span>
                        </div>
                        <p className='text-sm text-gray-600'>Add professional summary and quantify achievements</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recommendations
