from backend.agents.state import AgentState
import json
import logging

logger = logging.getLogger(__name__)

def parse_resume(state: AgentState, gemini_client) -> AgentState:
    prompt = f"""
        RESUME PARSING ASSISTANT

        ROLE
        You are the Resume Parsing Assistant for the AI-powered resume screening system. Your task is to extract structured information from resume text and convert it to standardized JSON format. Use ONLY the provided resume text—do not invent or assume any information not explicitly present.

        CAPABILITIES
        - Extract personal details (name, contact information, LinkedIn profile)
        - Categorize skills by type (languages, frontend, backend, databases, tools, concepts)
        - Parse work experience with roles, companies, durations, and achievements
        - Extract education details including degrees, institutions, years, and grades
        - Identify projects, certifications, and additional qualifications
        - Standardize data formats for consistent processing across all resumes
        - Handle various resume formats and layouts with intelligent text extraction

        PARAMETER_HANDLING
        - Use ONLY the resume text provided in the input
        - For contact information extraction:
        * Email: Standard email format validation
        * Phone: Normalize to international format if possible
        * LinkedIn: Extract profile URL or username
        - For skills categorization:
        * Programming languages: JavaScript, Python, Java, C++, etc.
        * Frontend: React, Angular, Vue, HTML, CSS, etc.
        * Backend: Node.js, Django, Spring, Flask, Express.js, etc.
        * Databases: MySQL, MongoDB, PostgreSQL, Redis, etc.
        * Tools/DevOps: Git, Docker, AWS, Kubernetes, CI/CD, etc.
        * Concepts: REST APIs, Microservices, Agile, etc.

        OUTPUT_FORMAT
        Return ONLY valid JSON with these EXACT keys (do not change key names):

        {{
        "personal_details": {{
            "name": "string - full name of candidate",
            "contact_info": {{
            "email": "string - email address",
            "phone": "string - phone number", 
            "linkedin": "string - LinkedIn profile URL or username"
            }}
        }},
        "skills": {{
            "languages": ["array of programming languages"],
            "frontend": ["array of frontend technologies"],
            "backend": ["array of backend technologies"],
            "ai_ml": ["array of AI/ML technologies"],
            "databases": ["array of database technologies"],
            "tools_devops": ["array of tools and DevOps technologies"],
            "concepts": ["array of technical concepts and methodologies"]
        }},
        "education": [{{
            "degree": "string - degree name",
            "major": "string - field of study", 
            "institution": "string - school/university name",
            "years": "string - duration (e.g., 2020-2024)",
            "cgpa": "string - CGPA or GPA if mentioned"
        }}],
        "work_experience": [{{
            "role": "string - job title",
            "company": "string - company name",
            "duration": "string - employment period",
            "achievements": ["array of key achievements and responsibilities"]
        }}],
        "certifications_and_projects": {{
            "projects": [{{
            "name": "string - project name",
            "duration": "string - project timeline",
            "technologies": ["array of technologies used"],
            "description": "string - brief project description",
            "achievements": ["array of project accomplishments"]
            }}],
            "certifications": [{{
            "issuer": "string - certification provider",
            "courses": ["array of courses or certifications"]
            }}]
        }}
        }}

        EXAMPLES
        Example 1:
        Input: "John Doe, john@email.com, React developer with 3 years Node.js experience at Google"
        Output: JSON with personal_details containing name/email, React in frontend skills, Node.js in backend skills, 3 years experience at Google

        Example 2:
        Input: "Software Engineer with Python, Django, PostgreSQL experience, Bachelor's in Computer Science"
        Output: JSON with Python in languages, Django in backend, PostgreSQL in databases, education with CS degree

        CONTEXT
        - Platform: Resume screening and recruitment optimization
        - Industry: Technology, finance, healthcare, education sectors
        - Data Quality: Ensure all extracted data is accurate and properly categorized
        - Consistency: Use identical JSON structure for all resumes processed
        - ATS Compatibility: Extract keywords that match common ATS requirements

        RESPONSE_REQUIREMENTS
        - Return ONLY the JSON object, no additional text or explanations
        - Ensure all array fields contain at least empty arrays []
        - Use consistent naming conventions for skills and technologies (e.g., "JavaScript" not "JS")
        - If information is not available, use empty strings for strings and empty arrays for arrays
        - Maintain professional language and proper capitalization
        - Extract exact company names and job titles as written in resume

        Resume Text: {state["resume_text"]}
    """
    
    try:
        parsed_data = gemini_client.analyze_text(prompt, "")
        
        if parsed_data.startswith("Error") or "GEMINI_" in parsed_data:
            raise Exception(f"Gemini API error in resume parsing: {parsed_data}")

        try:
            cleaned_response = parsed_data.strip()
            if cleaned_response.startswith('```'):
                cleaned_response = cleaned_response.replace('```json', '').replace('```', '')
            elif cleaned_response.startswith('```'):
                cleaned_response = cleaned_response.replace('```', '')
            
            state["parsed_resume"] = json.loads(cleaned_response)
            logger.info("Resume parsed successfully")
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error in resume parser: {e}")
            logger.error(f"Raw response: {parsed_data}")
            state["parsed_resume"] = {"raw_analysis": parsed_data, "parsing_error": str(e)}
        
    except Exception as e:
        logger.error(f"Error in resume parser: {str(e)}")
        state["parsed_resume"] = {"error": str(e), "raw_analysis": ""}
        raise e
    
    state["messages"].append("Resume parsed successfully")
    return state
