import jsPDF from 'jspdf'

export const handleDownloadPDF = async (analysis: any) => {

    try {
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 20
        let yPosition = margin

        // Helper function to add text with automatic line wrapping
        const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10, isBold = false) => {
            pdf.setFontSize(fontSize)
            pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
            const lines = pdf.splitTextToSize(text, maxWidth)
            pdf.text(lines, x, y)
            return y + lines.length * (fontSize * 0.4)
        }

        // Helper function to check if we need a new page
        const checkNewPage = (requiredSpace: number) => {
            if (yPosition + requiredSpace > pageHeight - margin) {
                pdf.addPage()
                yPosition = margin
            }
        }

        // Header with colored background
        pdf.setFillColor(59, 130, 246) // Blue background
        pdf.rect(0, 0, pageWidth, 40, 'F')

        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(20)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Resume Analysis Report', margin, 25)

        yPosition = 50
        pdf.setTextColor(0, 0, 0)

        // Job Information Section
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Job Information', margin, yPosition)
        yPosition += 10

        pdf.setDrawColor(200, 200, 200)
        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 8

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Position: ${analysis.job_title}`, margin, yPosition)
        yPosition += 6

        if (analysis.company) {
            pdf.text(`Company: ${analysis.company}`, margin, yPosition)
            yPosition += 6
        }

        pdf.text(`Analysis Date: ${new Date(analysis.created_at).toLocaleDateString()}`, margin, yPosition)
        yPosition += 15

        // Match Score Section
        checkNewPage(50)
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Match Score Analysis', margin, yPosition)
        yPosition += 10

        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 15

        // Match score circle representation
        const matchColor = analysis.match_percentage >= 80 ? [34, 197, 94] : analysis.match_percentage >= 60 ? [251, 191, 36] : [239, 68, 68]

        pdf.setFontSize(36)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(...matchColor)
        pdf.text(`${analysis.match_percentage}%`, margin, yPosition)

        pdf.setFontSize(12)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Overall Match Score', margin + 40, yPosition - 10)
        yPosition += 20

        // Statistics
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Skills Matched: ${analysis.match_analysis.skill_match.matched.length}`, margin, yPosition)
        pdf.text(`Skills Missing: ${analysis.match_analysis.skill_match.missing.length}`, margin + 70, yPosition)
        pdf.text(`Experience Match: ${analysis.match_analysis.experience_level}`, margin + 140, yPosition)
        yPosition += 20

        // Candidate Information
        if (analysis.parsed_resume?.personal_details) {
            checkNewPage(50)
            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Candidate Information', margin, yPosition)
            yPosition += 10

            pdf.line(margin, yPosition, pageWidth - margin, yPosition)
            yPosition += 8

            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'normal')

            if (analysis.parsed_resume.personal_details.name) {
                pdf.text(`Name: ${analysis.parsed_resume.personal_details.name}`, margin, yPosition)
                yPosition += 6
            }

            if (analysis.parsed_resume.personal_details.contact_info?.email) {
                pdf.text(`Email: ${analysis.parsed_resume.personal_details.contact_info.email}`, margin, yPosition)
                yPosition += 6
            }

            if (analysis.parsed_resume.personal_details.contact_info?.phone) {
                pdf.text(`Phone: ${analysis.parsed_resume.personal_details.contact_info.phone}`, margin, yPosition)
                yPosition += 6
            }

            if (analysis.parsed_resume.personal_details.contact_info?.linkedin) {
                pdf.text(`LinkedIn: ${analysis.parsed_resume.personal_details.contact_info.linkedin}`, margin, yPosition)
                yPosition += 6
            }
            yPosition += 10
        }

        // Skills Analysis
        checkNewPage(70)
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Skills Analysis', margin, yPosition)
        yPosition += 10

        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 8

        // Matched Skills
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(34, 197, 94)
        pdf.text('✓ Matched Skills', margin, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0)

        const matchedSkills = analysis.match_analysis?.skill_match?.matched || []
        if (matchedSkills.length > 0) {
            yPosition = addWrappedText(matchedSkills.join(', '), margin, yPosition, pageWidth - 2 * margin)
        } else {
            pdf.text('No matched skills data available', margin, yPosition)
            yPosition += 4
        }
        yPosition += 8

        // Missing Skills
        checkNewPage(30)
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(239, 68, 68)
        pdf.text('✗ Missing Skills', margin, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0)

        const missingSkills = analysis.match_analysis?.skill_match?.missing || []
        if (missingSkills.length > 0) {
            yPosition = addWrappedText(missingSkills.join(', '), margin, yPosition, pageWidth - 2 * margin)
        } else {
            pdf.text('No missing skills data available', margin, yPosition)
            yPosition += 4
        }
        yPosition += 15

        // Candidate's Skills Breakdown
        if (analysis.parsed_resume?.skills) {
            checkNewPage(40)
            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.setTextColor(0, 0, 0)
            pdf.text('Candidate Skills Breakdown', margin, yPosition)
            yPosition += 10

            pdf.line(margin, yPosition, pageWidth - margin, yPosition)
            yPosition += 8

            Object.entries(analysis.parsed_resume.skills).forEach(([category, skills]) => {
                checkNewPage(20)
                pdf.setFontSize(12)
                pdf.setFont('helvetica', 'bold')
                pdf.text(category.replace(/_/g, ' ').toUpperCase(), margin, yPosition)
                yPosition += 6

                pdf.setFont('helvetica', 'normal')
                pdf.setFontSize(10)
                yPosition = addWrappedText(skills.join(', '), margin + 5, yPosition, pageWidth - 2 * margin - 5)
                yPosition += 8
            })
        }

        // Education
        if (analysis.parsed_resume?.education && analysis.parsed_resume.education.length > 0) {
            checkNewPage(40)
            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Education', margin, yPosition)
            yPosition += 10

            pdf.line(margin, yPosition, pageWidth - margin, yPosition)
            yPosition += 8

            analysis.parsed_resume.education.forEach((edu) => {
                checkNewPage(20)
                pdf.setFontSize(12)
                pdf.setFont('helvetica', 'bold')
                pdf.text(edu.degree, margin, yPosition)
                yPosition += 6

                pdf.setFont('helvetica', 'normal')
                pdf.text(`${edu.major} - ${edu.institution}`, margin, yPosition)
                yPosition += 4
                pdf.text(`${edu.years}${edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}`, margin, yPosition)
                yPosition += 10
            })
        }

        // Work Experience
        if (analysis.parsed_resume?.work_experience && analysis.parsed_resume.work_experience.length > 0) {
            checkNewPage(40)
            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Work Experience', margin, yPosition)
            yPosition += 10

            pdf.line(margin, yPosition, pageWidth - margin, yPosition)
            yPosition += 8

            analysis.parsed_resume.work_experience.forEach((exp) => {
                checkNewPage(30)
                pdf.setFontSize(12)
                pdf.setFont('helvetica', 'bold')
                pdf.text(`${exp.role} at ${exp.company}`, margin, yPosition)
                yPosition += 6

                pdf.setFont('helvetica', 'normal')
                pdf.text(exp.duration, margin, yPosition)
                yPosition += 6

                if (exp.achievements && exp.achievements.length > 0) {
                    exp.achievements.forEach((achievement) => {
                        checkNewPage(15)
                        yPosition = addWrappedText(`• ${achievement}`, margin + 5, yPosition, pageWidth - 2 * margin - 5, 9)
                        yPosition += 2
                    })
                }
                yPosition += 8
            })
        }

        // Key Projects
        if (analysis.parsed_resume?.certifications_and_projects?.projects && analysis.parsed_resume.certifications_and_projects.projects.length > 0) {
            checkNewPage(40)
            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Key Projects', margin, yPosition)
            yPosition += 10

            pdf.line(margin, yPosition, pageWidth - margin, yPosition)
            yPosition += 8

            analysis.parsed_resume.certifications_and_projects.projects.slice(0, 4).forEach((project) => {
                checkNewPage(25)
                pdf.setFontSize(12)
                pdf.setFont('helvetica', 'bold')
                pdf.text(project.name, margin, yPosition)
                yPosition += 6

                pdf.setFont('helvetica', 'normal')
                pdf.setFontSize(10)
                if (project.duration) {
                    pdf.text(project.duration, margin, yPosition)
                    yPosition += 4
                }

                if (project.description) {
                    yPosition = addWrappedText(project.description, margin, yPosition, pageWidth - 2 * margin, 10)
                    yPosition += 4
                }

                if (project.technologies && project.technologies.length > 0) {
                    yPosition = addWrappedText(`Technologies: ${project.technologies.join(', ')}`, margin, yPosition, pageWidth - 2 * margin, 9)
                }
                yPosition += 8
            })
        }

        // Recommendations
        if (analysis.recommendations && analysis.recommendations.length > 0) {
            checkNewPage(40)
            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Improvement Recommendations', margin, yPosition)
            yPosition += 10

            pdf.line(margin, yPosition, pageWidth - margin, yPosition)
            yPosition += 8

            analysis.recommendations.forEach((rec, index) => {
                checkNewPage(20)
                const cleanRec = rec.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')
                yPosition = addWrappedText(`${index + 1}. ${cleanRec}`, margin, yPosition, pageWidth - 2 * margin, 10)
                yPosition += 5
            })
        }

        // Detailed Analysis Breakdown
        if (analysis.match_analysis?.detailed_breakdown) {
            checkNewPage(40)
            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Detailed Analysis', margin, yPosition)
            yPosition += 10

            pdf.line(margin, yPosition, pageWidth - margin, yPosition)
            yPosition += 8

            const breakdown = analysis.match_analysis.detailed_breakdown

            if (breakdown.skills) {
                checkNewPage(20)
                pdf.setFontSize(14)
                pdf.setFont('helvetica', 'bold')
                pdf.text('Skills Analysis:', margin, yPosition)
                yPosition += 8

                pdf.setFontSize(10)
                pdf.setFont('helvetica', 'normal')
                yPosition = addWrappedText(breakdown.skills, margin, yPosition, pageWidth - 2 * margin)
                yPosition += 8
            }

            if (breakdown.experience) {
                checkNewPage(20)
                pdf.setFontSize(14)
                pdf.setFont('helvetica', 'bold')
                pdf.text('Experience Analysis:', margin, yPosition)
                yPosition += 8

                pdf.setFontSize(10)
                pdf.setFont('helvetica', 'normal')
                yPosition = addWrappedText(breakdown.experience, margin, yPosition, pageWidth - 2 * margin)
                yPosition += 8
            }

            if (breakdown.education) {
                checkNewPage(20)
                pdf.setFontSize(14)
                pdf.setFont('helvetica', 'bold')
                pdf.text('Education Analysis:', margin, yPosition)
                yPosition += 8

                pdf.setFontSize(10)
                pdf.setFont('helvetica', 'normal')
                yPosition = addWrappedText(breakdown.education, margin, yPosition, pageWidth - 2 * margin)
                yPosition += 8
            }
        }

        const totalPages = pdf.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i)
            pdf.setFontSize(8)
            pdf.setTextColor(128, 128, 128)
            pdf.text(`Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages} | Resume Analyzer`, margin, pageHeight - 10)
        }

        const candidateName = analysis.parsed_resume?.personal_details?.name?.replace(/\s+/g, '_') || 'Candidate'
        const jobTitle = analysis.job_title.replace(/\s+/g, '_')
        const fileName = `Resume_Analysis_${jobTitle}_${candidateName}_${new Date().toISOString().split('T')[0]}.pdf`

        pdf.save(fileName)
    } catch (error) {
        console.error('Error generating PDF:', error)
        alert('Failed to generate PDF. Please try again.')
    }
}
