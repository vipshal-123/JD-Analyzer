import React from 'react'
import { Briefcase, Target, Star, Users, MapPin } from 'lucide-react'

export interface JobData {
    job_title: string
    required_skills: {
        must_have: string[]
        nice_to_have: string[]
    } 
    nice_to_have_skills: string[]
    experience_level_required?: string
    educational_requirements?: string
    key_responsibilities: string[]
    industry_specific_keywords: string[]
    soft_skills_mentioned: string[]
}

interface JobAnalysisProps {
    data: JobData
}

const JobAnalysis: React.FC<JobAnalysisProps> = ({ data }) => {
    console.log('data===: ', data);
    const SkillList: React.FC<{ skills?: string[]; type: 'must' | 'nice' }> = ({ skills = [], type }) => (
        <div className='flex flex-wrap gap-2'>
            {skills.map((skill, index) => (
                <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                        type === 'must' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}
                >
                    {skill}
                </span>
            ))}
        </div>
    )

    return (
        <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow p-6'>
                <div className='flex items-center space-x-2 mb-6'>
                    <Briefcase className='w-6 h-6 text-blue-500' />
                    <h2 className='text-2xl font-bold text-gray-900'>Job Overview</h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <div className='flex items-center space-x-2 mb-4'>
                            <Target className='w-5 h-5 text-gray-500' />
                            <div>
                                <p className='text-sm text-gray-500'>Position</p>
                                <p className='font-semibold text-gray-900'>{data.job_title}</p>
                            </div>
                        </div>
                        <div className='flex items-center space-x-2 mb-4'>
                            <MapPin className='w-5 h-5 text-gray-500' />
                            <div>
                                <p className='text-sm text-gray-500'>Experience Level</p>
                                <p className='font-semibold text-gray-900'>{data?.experience_level_required}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center space-x-2 mb-4'>
                            <Users className='w-5 h-5 text-gray-500' />
                            <div>
                                <p className='text-sm text-gray-500'>Education Requirements</p>
                                <p className='font-semibold text-gray-900'>{data?.educational_requirements}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-lg shadow p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
                    <Star className='w-5 h-5 text-red-500' />
                    <span>Must-Have Skills</span>
                </h3>
                <SkillList skills={data.required_skills?.must_have || []} type='must' />
            </div>

            <div className='bg-white rounded-lg shadow p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
                    <Star className='w-5 h-5 text-blue-500' />
                    <span>Nice-to-Have Skills</span>
                </h3>
                <SkillList skills={data?.required_skills?.nice_to_have} type='nice' />
            </div>

            <div className='bg-white rounded-lg shadow p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Key Responsibilities</h3>
                <ul className='space-y-3'>
                    {data?.key_responsibilities.map((responsibility, index) => (
                        <li key={index} className='flex items-start space-x-3'>
                            <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                            <p className='text-gray-700'>{responsibility}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='bg-white rounded-lg shadow p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Industry Keywords</h3>
                <div className='flex flex-wrap gap-2'>
                    {data?.industry_specific_keywords.map((keyword, index) => (
                        <span key={index} className='px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm'>
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>

            <div className='bg-white rounded-lg shadow p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Desired Soft Skills</h3>
                <div className='flex flex-wrap gap-2'>
                    {data?.soft_skills_mentioned.map((skill, index) => (
                        <span key={index} className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm'>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default JobAnalysis
