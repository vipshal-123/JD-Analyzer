from backend.agents.state import AgentState
import json
import re

def generate_recommendations(state: AgentState, gemini_client) -> AgentState:
    prompt = f"""
        RESUME IMPROVEMENT RECOMMENDATIONS ASSISTANT

        ROLE
        You are the Resume Improvement Recommendations Assistant for the AI-powered resume screening system. Your task is to generate prioritized, actionable recommendations to improve resume-job match scores. Use ONLY the provided match analysis, resume data, and job requirements—do not suggest improvements for unrelated skills or positions.

        CAPABILITIES
        - Generate prioritized recommendations based on match score gaps and missing requirements
        - Identify high-impact improvements that directly address job requirements
        - Provide specific, actionable advice for skills, experience, keywords, and formatting
        - Categorize recommendations by potential impact on overall match score:
        * High Impact: Address critical missing skills and experience gaps
        * Medium Impact: Enhance existing qualifications and add relevant keywords
        * Low Impact: Format improvements and optimization suggestions
        - Create concise, implementable recommendations under 15 words each
        - Focus on evidence-based suggestions derived from actual job-resume comparison

        PARAMETER HANDLING
        - Use ONLY the match analysis, parsed resume, and job requirements provided
        - For skill recommendations:
        * Prioritize missing "must-have" skills over "nice-to-have" skills
        * Suggest specific skill names as listed in job requirements
        * Focus on skills with highest frequency in job requirements
        - For experience recommendations:
        * Address experience level mismatches with specific guidance
        * Suggest quantification of existing achievements
        * Recommend role title optimization for better ATS matching
        - For keyword recommendations:
        * Extract exact keywords from job description
        * Suggest industry-specific terminology
        * Focus on terms that improve ATS compatibility
        - Generate 5-10 recommendations maximum, ranked by impact potential

        OUTPUT FORMAT
        Return ONLY a JSON array of recommendation strings in this EXACT format:

        [
        "recommendation text 1",
        "recommendation text 2", 
        "recommendation text 3",
        "recommendation text 4",
        "recommendation text 5"
        ]

        RECOMMENDATION GUIDELINES
        1. High Impact Recommendations (Address match score gaps >20%):
        - "Add [specific missing skill] to technical skills section"
        - "Gain [specific certification] to meet educational requirements" 
        - "Emphasize [specific experience] with quantified metrics"

        2. Medium Impact Recommendations (Address match score gaps 10-20%):
        - "Include [specific keyword] in job descriptions"
        - "Highlight [soft skill] with concrete examples"
        - "Update job titles to include [relevant terms]"

        3. Low Impact Recommendations (Address match score gaps <10%):
        - "Reorganize skills by relevance to job requirements"
        - "Add LinkedIn profile URL to contact information"
        - "Use bullet points for better readability"

        EXAMPLES

        Example 1:
        Match Score: 65%, Missing: PostgreSQL, Docker, Senior experience
        Output: ["Add PostgreSQL database skills to technical section", "Include Docker containerization experience", "Emphasize leadership roles for senior positioning", "Quantify team management achievements", "Add database project examples"]

        Example 2:
        Match Score: 45%, Missing: Java, 5+ years experience, Bachelor's degree
        Output: ["Learn Java programming fundamentals", "Highlight 3+ years relevant experience prominently", "Consider completing Bachelor's degree or equivalent certification", "Add Java-related projects to portfolio", "Emphasize transferable programming skills"]

        CONTEXT
        - Platform: Professional resume optimization and ATS compatibility
        - Industry: Corporate recruitment across technology, finance, healthcare, education
        - Goal: Maximize resume-job match scores through targeted improvements
        - Timeline: Recommendations should be achievable within 1-6 months
        - Impact: Direct influence on interview callback rates and hiring success

        RESPONSE REQUIREMENTS
        - Return ONLY the JSON array, no additional text or formatting
        - Each recommendation must be actionable and specific
        - Keep recommendations under 15 words for clarity
        - Prioritize recommendations by potential match score impact
        - Use professional language appropriate for resume improvement
        - Focus on improvements that directly address the specific job requirements provided

        Current Analysis Data:
        Match Score: {state["match_score"]}%
        Resume Data: {state["parsed_resume"]}
        Job Requirements: {state["parsed_jd"]}
        Match Analysis: {state.get("match_analysis", {})}
    """
    
    print("Recommendations prompt loaded successfully")
    recommendations = gemini_client.analyze_text(prompt, "")
    
    try:
        cleaned_response = recommendations.strip()

        if cleaned_response.startswith('```'):
            cleaned_response = cleaned_response.replace('```json', '').replace('```', '')
        elif cleaned_response.startswith('```'):
            cleaned_response = cleaned_response.replace('```', '')

        rec_list = json.loads(cleaned_response)

        if not isinstance(rec_list, list):
            raise ValueError("Response is not a JSON array")

        rec_list = [str(rec).strip() for rec in rec_list if rec and str(rec).strip()]

        rec_list = rec_list[:10]

        rec_list = [rec for rec in rec_list if len(rec) >= 10]
        
    except (json.JSONDecodeError, ValueError) as e:
        print(f"JSON parsing error for recommendations: {e}")
        print(f"Raw response: {recommendations}")
        
        lines = recommendations.split('\n')
        rec_list = []
        
        for line in lines:
            clean_line = re.sub(r'^\d+\.?\s*[-- *]?\s*', '', line.strip())
            clean_line = clean_line.strip('"\'')
            
            if len(clean_line) >= 10 and len(clean_line) <= 100:
                rec_list.append(clean_line)
        
        rec_list = rec_list[:10]
    
    except Exception as e:
        print(f"Unexpected error generating recommendations: {e}")
        
        match_score = state.get("match_score", 0)
        rec_list = []
        
        if match_score < 70:
            rec_list.extend([
                "Add missing technical skills from job requirements",
                "Quantify achievements with specific metrics and numbers",
                "Include relevant keywords from job description"
            ])
        
        if match_score < 50:
            rec_list.extend([
                "Gain additional experience in required technologies",
                "Consider relevant certifications or training programs"
            ])
        
        rec_list.extend([
            "Optimize resume format for ATS compatibility",
            "Highlight most relevant experience prominently"
        ])
    
    if not rec_list:
        rec_list = [
            "Review job requirements and align resume content accordingly",
            "Quantify achievements with specific metrics and results",
            "Include relevant keywords throughout resume sections",
            "Highlight most applicable experience and skills",
            "Consider additional training in required technologies"
        ]
    
    state["recommendations"] = rec_list
    state["messages"].append(f"Generated {len(rec_list)} recommendations")
    return state
