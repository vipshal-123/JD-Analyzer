import React from 'react'
import { User, Mail, Phone, LinkedinIcon, Code, GraduationCap, Briefcase, Award } from 'lucide-react'

interface ContactInfo {
    email: string
    phone: string
    linkedin: string
}

interface PersonalDetails {
    name: string
    contact_info: ContactInfo
}

interface Skills {
    languages: string[]
    frontend: string[]
    backend: string[]
    ai_ml: string[]
    databases: string[]
    tools_devops: string[]
}

interface Education {
    degree: string
    major: string
    institution: string
    years: string
    cgpa: string
}

interface WorkExperience {
    role: string
    company: string
    duration: string
    achievements: string[]
}

interface Project {
    name: string
    duration: string
    description: string
    technologies: string[]
    achievements?: string[]
}

interface CertificationsAndProjects {
    projects: Project[]
}

interface ResumeData {
    personal_details: PersonalDetails
    skills: Skills
    education: Education[]
    work_experience: WorkExperience[]
    certifications_and_projects: CertificationsAndProjects
}

interface ResumeAnalysisProps {
    data: ResumeData
}

const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ data }) => {
    const SkillSection: React.FC<{
        title: string
        skills: string[]
        icon: React.ElementType
        color: string
    }> = ({ title, skills, icon: Icon, color }) => (
        <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center space-x-2 mb-4'>
                <Icon className={`w-5 h-5 ${color}`} />
                <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
            </div>
            <div className='flex flex-wrap gap-2'>
                {skills.map((skill, index) => (
                    <span key={index} className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm'>
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    )

    return (
        <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>Personal Information</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-center space-x-3'>
                        <User className='w-5 h-5 text-gray-500' />
                        <div>
                            <p className='text-sm text-gray-500'>Name</p>
                            <p className='font-semibold text-gray-900'>{data.personal_details.name}</p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <Mail className='w-5 h-5 text-gray-500' />
                        <div>
                            <p className='text-sm text-gray-500'>Email</p>
                            <p className='font-semibold text-gray-900'>{data.personal_details.contact_info.email}</p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <Phone className='w-5 h-5 text-gray-500' />
                        <div>
                            <p className='text-sm text-gray-500'>Phone</p>
                            <p className='font-semibold text-gray-900'>{data.personal_details.contact_info.phone}</p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <LinkedinIcon className='w-5 h-5 text-gray-500' />
                        <div>
                            <p className='text-sm text-gray-500'>LinkedIn</p>
                            <p className='font-semibold text-gray-900'>{data.personal_details.contact_info.linkedin}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>Skills Overview</h2>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <SkillSection title='Programming Languages' skills={data.skills.languages} icon={Code} color='text-blue-500' />
                    <SkillSection title='Frontend Technologies' skills={data.skills.frontend} icon={Code} color='text-green-500' />
                    <SkillSection title='Backend Technologies' skills={data.skills.backend} icon={Code} color='text-purple-500' />
                    <SkillSection title='AI/ML Technologies' skills={data.skills.ai_ml} icon={Code} color='text-red-500' />
                    <SkillSection title='Databases' skills={data.skills.databases} icon={Code} color='text-yellow-500' />
                    <SkillSection title='Tools & DevOps' skills={data.skills.tools_devops} icon={Code} color='text-indigo-500' />
                </div>
            </div>

            <div className='bg-white rounded-lg shadow p-6'>
                <div className='flex items-center space-x-2 mb-6'>
                    <GraduationCap className='w-6 h-6 text-blue-500' />
                    <h2 className='text-2xl font-bold text-gray-900'>Education</h2>
                </div>
                {data.education.map((edu, index) => (
                    <div key={index} className='border-l-4 border-blue-500 pl-6 pb-6'>
                        <h3 className='text-lg font-semibold text-gray-900'>{edu.degree}</h3>
                        <p className='text-gray-600'>{edu.major}</p>
                        <div className='flex flex-wrap gap-4 mt-2 text-sm text-gray-500'>
                            <span>{edu.institution}</span>
                            <span>{edu.years}</span>
                            <span>CGPA: {edu.cgpa}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className='bg-white rounded-lg shadow p-6'>
                <div className='flex items-center space-x-2 mb-6'>
                    <Briefcase className='w-6 h-6 text-green-500' />
                    <h2 className='text-2xl font-bold text-gray-900'>Work Experience</h2>
                </div>
                <div className='space-y-6'>
                    {data.work_experience.map((exp, index) => (
                        <div key={index} className='border-l-4 border-green-500 pl-6'>
                            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2'>
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-900'>{exp.role}</h3>
                                    <p className='text-gray-600'>{exp.company}</p>
                                </div>
                                <span className='text-sm text-gray-500 mt-1 sm:mt-0'>{exp.duration}</span>
                            </div>
                            <ul className='list-disc list-inside space-y-1 text-gray-700'>
                                {exp.achievements.map((achievement, achIndex) => (
                                    <li key={achIndex} className='text-sm'>
                                        {achievement}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className='bg-white rounded-lg shadow p-6'>
                <div className='flex items-center space-x-2 mb-6'>
                    <Award className='w-6 h-6 text-purple-500' />
                    <h2 className='text-2xl font-bold text-gray-900'>Projects</h2>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {data.certifications_and_projects.projects.map((project, index) => (
                        <div key={index} className='border border-gray-200 rounded-lg p-4'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-2'>{project.name}</h3>
                            <p className='text-sm text-gray-500 mb-3'>{project.duration}</p>
                            <p className='text-gray-700 mb-3'>{project.description}</p>
                            <div className='flex flex-wrap gap-1 mb-3'>
                                {project.technologies.map((tech, techIndex) => (
                                    <span key={techIndex} className='px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs'>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            {project.achievements && project.achievements.length > 0 && (
                                <ul className='list-disc list-inside space-y-1 text-sm text-gray-600'>
                                    {project.achievements.map((achievement, achIndex) => (
                                        <li key={achIndex}>{achievement}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ResumeAnalysis
