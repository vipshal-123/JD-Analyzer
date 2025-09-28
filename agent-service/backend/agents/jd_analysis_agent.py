from backend.agents.state import AgentState
import json

def analyze_job_description(state: AgentState, gemini_client) -> AgentState:
    prompt = """
        JOB DESCRIPTION ANALYSIS ASSISTANT

        ROLE
        You are the Job Description Analysis Assistant for the AI-powered resume screening system. Your task is to parse job descriptions and extract structured requirements data in a consistent JSON format. Use ONLY the provided job description text—do not invent or assume any requirements not explicitly stated.

        CAPABILITIES
        - Extract and categorize job requirements into must-have vs nice-to-have skills
        - Identify experience level requirements (entry, junior, mid-level, senior, executive)
        - Parse educational requirements and preferred qualifications
        - Extract key responsibilities and primary job functions
        - Identify industry-specific keywords and technical terms
        - Detect soft skills and behavioral requirements mentioned
        - Standardize requirement categorization for consistent matching

        PARAMETER HANDLING
        - Use ONLY the job description text provided
        - For skill extraction:
        - Must-have skills: explicitly required, mandatory, essential
        - Nice-to-have skills: preferred, desired, plus, bonus
        - Experience level indicators:
        - Years mentioned (e.g., "3+ years", "5-7 years")
        - Seniority levels (junior, senior, lead, principal)
        - Experience descriptors (proven, extensive, solid)
        - Educational requirements should distinguish between required vs preferred
        - Extract exact keywords for ATS compatibility

        OUTPUT FORMAT
        Return ONLY valid JSON with these EXACT keys (do not change key names):

        {
        "job_title": "string - extracted or inferred position title",
        "required_skills": {
            "must_have": ["array of essential skills"],
            "nice_to_have": ["array of preferred skills"]
        },
        "experience_level_required": "string - experience level description",
        "educational_requirements": "string - education requirements",
        "key_responsibilities": ["array of main job duties"],
        "industry_specific_keywords": ["array of technical/industry terms"],
        "soft_skills_mentioned": ["array of soft skills and traits"],
        "employment_type": "string - full-time/part-time/contract/remote",
        "company_size_indicators": "string - startup/enterprise/SME indicators if mentioned"
        }

        EXAMPLES

        Example 1:
        Input: "Senior Software Engineer position requiring 5+ years Python experience, AWS knowledge preferred"
        Output: JSON with must_have: ["Python"], nice_to_have: ["AWS"], experience_level_required: "Senior (5+ years)"

        Example 2:
        Input: "Junior Data Analyst, Bachelor's degree required, SQL essential, Tableau a plus"
        Output: JSON with must_have: ["SQL"], nice_to_have: ["Tableau"], educational_requirements: "Bachelor's degree required"

        CONTEXT
        - Platform: Resume screening and recruitment optimization
        - Industry: Corporate hiring across technology, finance, healthcare, education sectors
        - Consistency: Maintain identical JSON structure for all analyses
        - Accuracy: Extract only explicitly mentioned requirements, avoid assumptions

        RESPONSE REQUIREMENTS
        - Return ONLY the JSON object, no additional text
        - Ensure all array fields contain at least empty arrays []
        - Use consistent skill naming (e.g., "JavaScript" not "JS" or "Javascript")
        - Maintain professional language in all extracted text
        - If information is not available, use "Not specified" for strings and [] for arrays
    """
    print("Job analysis prompt loaded successfully")
    
    jd_analysis = gemini_client.analyze_text(prompt, state["job_description"])
    
    try:
        
        cleaned_response = jd_analysis.strip()
        
        if cleaned_response.startswith('```'):
            cleaned_response = cleaned_response.replace('```json', '').replace('```', '')
        elif cleaned_response.startswith('```'):
            cleaned_response = cleaned_response.replace('```', '')
        
        parsed_jd = json.loads(cleaned_response)
        
        required_structure = {
            "job_title": "Not specified",
            "required_skills": {
                "must_have": [],
                "nice_to_have": []
            },
            "experience_level_required": "Not specified",
            "educational_requirements": "Not specified", 
            "key_responsibilities": [],
            "industry_specific_keywords": [],
            "soft_skills_mentioned": [],
            "employment_type": "Not specified",
            "company_size_indicators": "Not specified"
        }
        
        for key, default_value in required_structure.items():
            if key not in parsed_jd:
                parsed_jd[key] = default_value
            elif key == "required_skills" and isinstance(parsed_jd[key], dict):
                if "must_have" not in parsed_jd[key]:
                    parsed_jd[key]["must_have"] = []
                if "nice_to_have" not in parsed_jd[key]:
                    parsed_jd[key]["nice_to_have"] = []
        
        state["parsed_jd"] = parsed_jd
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {jd_analysis}")
        
        state["parsed_jd"] = {
            "job_title": "Not specified",
            "required_skills": {
                "must_have": [],
                "nice_to_have": []
            },
            "experience_level_required": "Not specified",
            "educational_requirements": "Not specified",
            "key_responsibilities": [],
            "industry_specific_keywords": [],
            "soft_skills_mentioned": [],
            "employment_type": "Not specified", 
            "company_size_indicators": "Not specified",
            "raw_analysis": jd_analysis,
            "parsing_error": str(e)
        }
    except Exception as e:
        print(f"Unexpected error: {e}")
        state["parsed_jd"] = {
            "job_title": "Error in analysis",
            "required_skills": {"must_have": [], "nice_to_have": []},
            "experience_level_required": "Error in analysis",
            "educational_requirements": "Error in analysis",
            "key_responsibilities": [],
            "industry_specific_keywords": [],
            "soft_skills_mentioned": [],
            "employment_type": "Error in analysis",
            "company_size_indicators": "Error in analysis",
            "raw_analysis": jd_analysis,
            "error": str(e)
        }
    
    state["messages"].append("Job description analyzed")
    return state
