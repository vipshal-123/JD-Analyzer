import React from 'react'
import { Calendar, Building, Eye, Trash2, TrendingUp, TrendingDown, Minus, User } from 'lucide-react'

interface SkillMatch {
    matched: string[]
    missing: string[]
}

type ExperienceLevel = 'match' | 'partial' | 'mismatch'

interface MatchAnalysis {
    skill_match: SkillMatch
    experience_level: ExperienceLevel
}

interface Education {
    degree: string
    major: string
    institution: string
    years: string
    cgpa?: string
}

interface WorkExperience {
    role: string
    company: string
    duration: string
    achievements?: string[]
}

interface Project {
    name: string
    duration?: string
    description?: string
    technologies?: string[]
}

interface CertificationsAndProjects {
    projects?: Project[]
}

interface ContactInfo {
    email?: string
    phone?: string
    linkedin?: string
}

interface PersonalDetails {
    name?: string
    contact_info?: ContactInfo
}

interface ParsedResume {
    personal_details?: PersonalDetails
    skills?: Record<string, string[]>
    education?: Education[]
    work_experience?: WorkExperience[]
    certifications_and_projects?: CertificationsAndProjects
}

export interface Analysis {
    analysis_id: string
    job_title: string
    company?: string
    candidate_name: string
    created_at: string
    match_percentage: number
    match_analysis: MatchAnalysis
    parsed_resume?: ParsedResume
    recommendations?: string[]
}

interface AnalysisCardProps {
    analysis: Analysis
    onView: () => void
    onDelete: () => void
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, onView, onDelete }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getMatchScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100 border-green-200'
        if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200'
        return 'text-red-600 bg-red-100 border-red-200'
    }

    const getExperienceIcon = (experienceMatch: ExperienceLevel) => {
        if (experienceMatch === 'match') return <TrendingUp className='w-4 h-4 text-green-500' />
        if (experienceMatch === 'partial') return <Minus className='w-4 h-4 text-yellow-500' />
        return <TrendingDown className='w-4 h-4 text-red-500' />
    }

    return (
        <div className='bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200'>
            <div className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                    <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-1 line-clamp-1'>{analysis.job_title}</h3>

                        <div className='flex items-center text-gray-600 text-sm mb-2'>
                            <Building className='w-4 h-4 mr-1' />
                            <span className='line-clamp-1'>{analysis.company || 'No company specified'}</span>
                        </div>

                        <div className='flex items-center text-gray-600 text-sm mb-2'>
                            <User className='w-4 h-4 mr-1' />
                            <span className='line-clamp-1'>{analysis.parsed_resume?.personal_details?.name}</span>
                        </div>

                        <div className='flex items-center text-gray-500 text-sm'>
                            <Calendar className='w-4 h-4 mr-1' />
                            <span>{formatDate(analysis.created_at)}</span>
                        </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getMatchScoreColor(analysis.match_percentage)}`}>
                        {analysis.match_percentage}%
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Skills Matched:</span>
                        <span className='font-medium text-green-600'>{analysis.match_analysis.skill_match.matched.length}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Skills Missing:</span>
                        <span className='font-medium text-red-600'>{analysis.match_analysis.skill_match.missing.length}</span>
                    </div>
                    <div className='flex justify-between items-center col-span-2'>
                        <span className='text-gray-600'>Experience:</span>
                        <div className='flex items-center space-x-1'>
                            {getExperienceIcon(analysis.match_analysis.experience_level)}
                            <span className='font-medium capitalize'>{analysis.match_analysis.experience_level}</span>
                        </div>
                    </div>
                </div>

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
