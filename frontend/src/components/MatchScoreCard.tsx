import React from 'react'
import { TrendingUp, Target, CheckCircle, XCircle } from 'lucide-react'

type ExperienceLevel = 'match' | 'partial' | 'mismatch'

interface SkillMatch {
    matched: string[]
    missing: string[]
}

interface MatchAnalysis {
    skill_match: SkillMatch
    experience_level: ExperienceLevel
}

export interface MatchScoreData {
    match_percentage: number
    match_analysis: MatchAnalysis
}

interface MatchScoreCardProps {
    data: MatchScoreData
}

const MatchScoreCard: React.FC<MatchScoreCardProps> = ({ data }) => {
    const { match_percentage, match_analysis } = data

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-50 border-green-200'
        if (score >= 60) return 'bg-yellow-50 border-yellow-200'
        return 'bg-red-50 border-red-200'
    }

    return (
        <div className={`rounded-xl border-2 p-8 ${getScoreBgColor(match_percentage)}`}>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex items-center space-x-4 mb-6 lg:mb-0'>
                    <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center ${
                            match_percentage >= 80 ? 'bg-green-100' : match_percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                        }`}
                    >
                        <Target className={`w-10 h-10 ${getScoreColor(match_percentage)}`} />
                    </div>
                    <div>
                        <h2 className='text-3xl font-bold text-gray-900'>{match_percentage}%</h2>
                        <p className='text-lg text-gray-600'>Overall Match Score</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <div className='text-center p-4 bg-white rounded-lg shadow-sm'>
                        <CheckCircle className='w-8 h-8 text-green-500 mx-auto mb-2' />
                        <p className='text-2xl font-bold text-gray-900'>{match_analysis.skill_match.matched.length}</p>
                        <p className='text-sm text-gray-600'>Skills Matched</p>
                    </div>
                    <div className='text-center p-4 bg-white rounded-lg shadow-sm'>
                        <XCircle className='w-8 h-8 text-red-500 mx-auto mb-2' />
                        <p className='text-2xl font-bold text-gray-900'>{match_analysis.skill_match.missing.length}</p>
                        <p className='text-sm text-gray-600'>Skills Missing</p>
                    </div>
                    <div className='text-center p-4 bg-white rounded-lg shadow-sm'>
                        <TrendingUp className='w-8 h-8 text-blue-500 mx-auto mb-2' />
                        <p className='text-sm font-semibold text-gray-900 capitalize'>{match_analysis.experience_level}</p>
                        <p className='text-sm text-gray-600'>Experience Level</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MatchScoreCard
