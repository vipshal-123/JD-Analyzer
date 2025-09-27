import { Calendar, Building, Eye, Trash2, TrendingUp, TrendingDown, Minus, User } from 'lucide-react'

const AnalysisCard = ({ analysis, onView, onDelete }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getMatchScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-100 border-green-200'
        if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200'
        return 'text-red-600 bg-red-100 border-red-200'
    }

    const getExperienceIcon = (experienceMatch) => {
        if (experienceMatch === 'match') return <TrendingUp className='w-4 h-4 text-green-500' />
        if (experienceMatch === 'partial') return <Minus className='w-4 h-4 text-yellow-500' />
        return <TrendingDown className='w-4 h-4 text-red-500' />
    }

    return (
        <div className='bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200'>
            <div className='p-6'>
                {/* Header */}
                <div className='flex justify-between items-start mb-4'>
                    <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-1 line-clamp-1'>{analysis.job_title}</h3>

                        {/* Company */}
                        <div className='flex items-center text-gray-600 text-sm mb-2'>
                            <Building className='w-4 h-4 mr-1' />
                            <span className='line-clamp-1'>{analysis.company || 'No company specified'}</span>
                        </div>

                        {/* Candidate Name */}
                        <div className='flex items-center text-gray-600 text-sm mb-2'>
                            <User className='w-4 h-4 mr-1' />
                            <span className='line-clamp-1'>{analysis.candidate_name}</span>
                        </div>

                        {/* Date */}
                        <div className='flex items-center text-gray-500 text-sm'>
                            <Calendar className='w-4 h-4 mr-1' />
                            <span>{formatDate(analysis.created_at)}</span>
                        </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getMatchScoreColor(analysis.match_percentage)}`}>
                        {analysis.match_percentage}%
                    </div>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Skills Matched:</span>
                        <span className='font-medium text-green-600'>{analysis.skills_matched}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Skills Missing:</span>
                        <span className='font-medium text-red-600'>{analysis.skills_missing}</span>
                    </div>
                    <div className='flex justify-between items-center col-span-2'>
                        <span className='text-gray-600'>Experience:</span>
                        <div className='flex items-center space-x-1'>
                            {getExperienceIcon(analysis.experience_match)}
                            <span className='font-medium capitalize'>{analysis.experience_match}</span>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className='mb-4'>
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            analysis.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                        {analysis.status === 'completed' ? 'Completed' : 'Processing'}
                    </span>
                </div>

                {/* Actions */}
                <div className='flex justify-between items-center pt-4 border-t border-gray-200'>
                    <button onClick={onView} className='flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium'>
                        <Eye className='w-4 h-4' />
                        <span>View Details</span>
                    </button>
                    <button onClick={onDelete} className='flex items-center space-x-2 text-red-600 hover:text-red-800 font-medium'>
                        <Trash2 className='w-4 h-4' />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AnalysisCard
