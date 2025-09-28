import React, { useRef, useState } from 'react'
import {
    X,
    Download,
    Share,
    TrendingUp,
    CheckCircle,
    XCircle,
    User,
    Mail,
    Phone,
    Linkedin,
    Award,
    Code,
    GraduationCap,
    Briefcase,
} from 'lucide-react'
import type { Analysis } from './AnalysisCard'
import { handleDownloadPDF } from '@/utils/pdfDowmload'

export interface AnalysisModalProps {
    analysis: Analysis & {
        parsed_resume?: {
            personal_details?: {
                name?: string
                contact_info?: {
                    email?: string
                    phone?: string
                    linkedin?: string
                }
            }
            skills?: Record<string, string[]>
            education?: Array<{
                degree: string
                major: string
                institution: string
                years: string
                cgpa?: string
            }>
            work_experience?: Array<{
                role: string
                company: string
                duration: string
                achievements?: string[]
            }>
            certifications_and_projects?: {
                projects?: Array<{
                    name: string
                    duration?: string
                    description?: string
                    technologies?: string[]
                }>
            }
        }
        recommendations?: string[]
    }
    onClose: () => void
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ analysis, onClose }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'experience' | 'recommendations'>('overview')
    const contentRef = useRef<HTMLDivElement>(null)

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'skills', label: 'Skills Analysis' },
        { id: 'experience', label: 'Experience' },
        { id: 'recommendations', label: 'Recommendations' },
    ] as const

    const handleShare = async () => {
        const shareData = {
            title: `Resume Analysis - ${analysis.job_title}`,
            text: `Check out this resume analysis: ${analysis.match_percentage}% match for ${analysis.job_title} position`,
            url: window.location.href,
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`)
            alert('Analysis details copied to clipboard!')
        }
    }

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })

    const getMatchScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100'
        if (score >= 60) return 'text-yellow-600 bg-yellow-100'
        return 'text-red-600 bg-red-100'
    }

    return (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden'>
                <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900'>{analysis.job_title}</h2>
                        <p className='text-gray-600'>
                            {analysis.company && `${analysis.company} • `} Analyzed on {formatDate(analysis.created_at)}
                        </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <button
                            onClick={()=>handleDownloadPDF(analysis)}
                            className='flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                        >
                            <Download className='w-4 h-4' />
                            <span>Download</span>
                        </button>
                        <button
                            onClick={handleShare}
                            className='flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                        >
                            <Share className='w-4 h-4' />
                            <span>Share</span>
                        </button>
                        <button onClick={onClose} className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
                            <X className='w-5 h-5' />
                        </button>
                    </div>
                </div>

                <div className='flex border-b border-gray-200'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div ref={contentRef} className='p-6 overflow-y-auto max-h-[calc(90vh-200px)]'>
                    {activeTab === 'overview' && (
                        <div className='space-y-6'>
                            <div className='text-center'>
                                <div
                                    className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getMatchScoreColor(
                                        analysis.match_percentage,
                                    )}`}
                                >
                                    {analysis.match_percentage}%
                                </div>
                                <h3 className='text-xl font-semibold text-gray-900 mt-4'>Overall Match Score</h3>
                                <p className='text-gray-600'>How well this resume matches the job requirements</p>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                <div className='bg-green-50 rounded-lg p-6 text-center'>
                                    <CheckCircle className='w-8 h-8 text-green-500 mx-auto mb-3' />
                                    <div className='text-2xl font-bold text-green-600'>{analysis.match_analysis.skill_match.matched.length}</div>
                                    <div className='text-sm text-gray-600'>Skills Matched</div>
                                </div>
                                <div className='bg-red-50 rounded-lg p-6 text-center'>
                                    <XCircle className='w-8 h-8 text-red-500 mx-auto mb-3' />
                                    <div className='text-2xl font-bold text-red-600'>{analysis.match_analysis.skill_match.missing.length}</div>
                                    <div className='text-sm text-gray-600'>Skills Missing</div>
                                </div>
                                <div className='bg-blue-50 rounded-lg p-6 text-center'>
                                    <TrendingUp className='w-8 h-8 text-blue-500 mx-auto mb-3' />
                                    <div className='text-2xl font-bold text-blue-600 capitalize'>{analysis.match_analysis.experience_level}</div>
                                    <div className='text-sm text-gray-600'>Experience Level</div>
                                </div>
                            </div>

                            <div className='bg-gray-50 rounded-lg p-6'>
                                <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                                    <User className='w-5 h-5 mr-2' />
                                    Candidate Information
                                </h4>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex items-center space-x-3'>
                                        <User className='w-4 h-4 text-gray-500' />
                                        <span className='text-gray-900'>{analysis?.parsed_resume?.personal_details?.name}</span>
                                    </div>
                                    {analysis?.parsed_resume?.personal_details?.contact_info?.email && (
                                        <div className='flex items-center space-x-3'>
                                            <Mail className='w-4 h-4 text-gray-500' />
                                            <span className='text-gray-900'>{analysis.parsed_resume.personal_details.contact_info.email}</span>
                                        </div>
                                    )}
                                    {analysis?.parsed_resume?.personal_details?.contact_info?.phone && (
                                        <div className='flex items-center space-x-3'>
                                            <Phone className='w-4 h-4 text-gray-500' />
                                            <span className='text-gray-900'>{analysis.parsed_resume.personal_details.contact_info.phone}</span>
                                        </div>
                                    )}
                                    {analysis?.parsed_resume?.personal_details?.contact_info?.linkedin && (
                                        <div className='flex items-center space-x-3'>
                                            <Linkedin className='w-4 h-4 text-gray-500' />
                                            <span className='text-gray-900'>{analysis.parsed_resume.personal_details.contact_info.linkedin}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className='space-y-6'>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                                    <CheckCircle className='w-5 h-5 text-green-500 mr-2' />
                                    Matched Skills ({analysis.match_analysis?.skill_match?.matched?.length || 0})
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {analysis.match_analysis?.skill_match?.matched?.map((skill, index) => (
                                        <span key={index} className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'>
                                            {skill}
                                        </span>
                                    )) || <p className='text-gray-500'>No matched skills data available</p>}
                                </div>
                            </div>

                            <div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                                    <XCircle className='w-5 h-5 text-red-500 mr-2' />
                                    Missing Skills ({analysis.match_analysis?.skill_match?.missing?.length || 0})
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {analysis.match_analysis?.skill_match?.missing?.map((skill, index) => (
                                        <span key={index} className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium'>
                                            {skill}
                                        </span>
                                    )) || <p className='text-gray-500'>No missing skills data available</p>}
                                </div>
                            </div>

                            {analysis.parsed_resume?.skills && (
                                <div className='space-y-4'>
                                    <h3 className='text-lg font-semibold text-gray-900'>Candidate's Skills Breakdown</h3>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        {Object.entries(analysis.parsed_resume.skills).map(([category, skills]) => (
                                            <div key={category} className='bg-gray-50 rounded-lg p-4'>
                                                <h4 className='font-medium text-gray-900 mb-2 capitalize flex items-center'>
                                                    <Code className='w-4 h-4 mr-2' />
                                                    {category.replace(/_/g, ' ')}
                                                </h4>
                                                <div className='flex flex-wrap gap-1'>
                                                    {skills.map((skill, index) => (
                                                        <span key={index} className='px-2 py-1 bg-white text-gray-700 rounded text-xs border'>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div className='space-y-6'>
                            {analysis.parsed_resume?.education && (
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                                        <GraduationCap className='w-5 h-5 mr-2' />
                                        Education
                                    </h3>
                                    {analysis.parsed_resume.education.map((edu, index) => (
                                        <div key={index} className='bg-gray-50 rounded-lg p-4 mb-3'>
                                            <h4 className='font-medium text-gray-900'>{edu.degree}</h4>
                                            <p className='text-gray-600'>{edu.major}</p>
                                            <div className='flex gap-4 mt-2 text-sm text-gray-500'>
                                                <span>{edu.institution}</span>
                                                <span>{edu.years}</span>
                                                {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {analysis.parsed_resume?.work_experience && (
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                                        <Briefcase className='w-5 h-5 mr-2' />
                                        Work Experience
                                    </h3>
                                    {analysis.parsed_resume.work_experience.map((exp, index) => (
                                        <div key={index} className='bg-gray-50 rounded-lg p-4 mb-4'>
                                            <div className='flex justify-between items-start mb-2'>
                                                <div>
                                                    <h4 className='font-medium text-gray-900'>{exp.role}</h4>
                                                    <p className='text-gray-600'>{exp.company}</p>
                                                </div>
                                                <span className='text-sm text-gray-500'>{exp.duration}</span>
                                            </div>
                                            <ul className='list-disc list-inside space-y-1 text-sm text-gray-700'>
                                                {exp.achievements?.map((achievement, achIndex) => (
                                                    <li key={achIndex}>{achievement}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {analysis.parsed_resume?.certifications_and_projects?.projects && (
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                                        <Award className='w-5 h-5 mr-2' />
                                        Key Projects
                                    </h3>
                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                        {analysis.parsed_resume.certifications_and_projects.projects.slice(0, 4).map((project, index) => (
                                            <div key={index} className='bg-gray-50 rounded-lg p-4'>
                                                <h4 className='font-medium text-gray-900 mb-1'>{project.name}</h4>
                                                <p className='text-xs text-gray-500 mb-2'>{project.duration}</p>
                                                <p className='text-sm text-gray-700 mb-3'>{project.description}</p>
                                                <div className='flex flex-wrap gap-1'>
                                                    {project.technologies?.slice(0, 6).map((tech, techIndex) => (
                                                        <span key={techIndex} className='px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs'>
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'recommendations' && (
                        <div className='space-y-4'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Improvement Recommendations</h3>
                            {analysis.recommendations && analysis.recommendations.length > 0 ? (
                                analysis.recommendations.map((rec, index) => (
                                    <div key={index} className='bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500'>
                                        <p className='text-gray-800 leading-relaxed whitespace-pre-line'>
                                            {rec.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className='text-center py-8'>
                                    <p className='text-gray-500'>No recommendations available for this analysis.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AnalysisModal
