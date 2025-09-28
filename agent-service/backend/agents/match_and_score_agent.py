from backend.agents.state import AgentState
import json
import re

def calculate_match_score(state: AgentState, gemini_client) -> AgentState:
    
    if (state.get("match_analysis") and 
        isinstance(state["match_analysis"], dict) and 
        "overall_match_percentage" in state["match_analysis"]):
        
        state["match_score"] = state["match_analysis"].get("overall_match_percentage", 0)
        state["messages"].append(f"Reusing previously calculated match score: {state['match_score']}%")
        return state

    prompt = f"""
        RESUME MATCH SCORING ASSISTANT

        ROLE
        You are the Resume Match Scoring Assistant for the AI-powered resume screening system. Your task is to calculate precise match percentages between candidate resumes and job requirements using standardized scoring algorithms. Use ONLY the provided resume and job requirement data—do not make assumptions about unlisted qualifications or requirements.

        CAPABILITIES
        - Calculate weighted match scores using industry-standard methodology:
        * Hard Skills: 40% weight (technical competencies, programming languages, tools)
        * Experience Level: 30% weight (years, seniority, role progression)
        * Education: 20% weight (degree level, field relevance, certifications)
        * Soft Skills: 10% weight (leadership, communication, teamwork)
        - Perform comprehensive skill gap analysis identifying matched vs missing competencies
        - Assess experience level compatibility (entry/junior/mid/senior alignment)
        - Evaluate educational qualification alignment and relevance
        - Generate detailed explanations for scoring rationale in each category

        PARAMETER HANDLING
        - Use ONLY the parsed resume and job requirements data provided
        - For skill matching:
        * Perform case-insensitive comparisons
        * Consider skill variants (e.g., "JS" = "JavaScript", "React" = "React.js")
        * Match against both must-have and nice-to-have requirements
        - Experience level evaluation:
        * Extract years from duration strings and job titles
        * Consider role progression and increasing responsibilities
        * Match against stated experience requirements
        - Education alignment:
        * Compare degree levels (Bachelor's, Master's, PhD)
        * Assess field relevance to job requirements
        * Include professional certifications and training
        - Generate precise percentage scores with mathematical justification

        OUTPUT FORMAT
        Return ONLY valid JSON with these EXACT keys (do not change key names):

        {{
            "overall_match_percentage": integer (0-100),
            "skill_match": {{
                "matched": ["array of skills found in resume that match job requirements"],
                "missing": ["array of required skills not found in resume"]
            }},
            "experience_level": "match | partial | mismatch",
            "education_alignment": "match | partial | mismatch",
            "detailed_breakdown": {{
                "skills": "string - detailed explanation of skill matching with specific examples",
                "experience": "string - analysis of experience level compatibility with reasoning",
                "education": "string - educational background alignment assessment",
                "soft_skills": "string - soft skills evaluation and evidence from resume"
            }}
        }}

        SCORING ALGORITHM
        1. Hard Skills (40% weight):
        - Count matched must-have skills vs total required
        - Add bonus for nice-to-have skills matched
        - Deduct for critical missing skills
        
        2. Experience Level (30% weight):
        - "match": 100% if experience meets or exceeds requirement
        - "partial": 70% if close but slightly below requirement  
        - "mismatch": 30% if significantly below requirement

        3. Education (20% weight):
        - "match": 100% if degree level and field align
        - "partial": 70% if degree level matches but field differs
        - "mismatch": 40% if neither level nor field align

        4. Soft Skills (10% weight):
        - Assess based on evidence in achievements, descriptions, leadership roles
        - Score based on percentage of required soft skills demonstrated

        EXAMPLES

        Example 1:
        Resume: 3 years Node.js, Bachelor's CS, team collaboration mentioned
        Job: 2-4 years Node.js, Bachelor's required, teamwork essential
        Output: {{"overall_match_percentage": 85, "skill_match": {{"matched": ["Node.js"], "missing": []}}, "experience_level": "match"}}

        Example 2:  
        Resume: Junior developer, 1 year Python, no degree
        Job: Senior developer, 5+ years Python, Bachelor's preferred
        Output: {{"overall_match_percentage": 45, "skill_match": {{"matched": ["Python"], "missing": []}}, "experience_level": "mismatch"}}

        CONTEXT
        - Platform: Professional recruitment and resume screening
        - Industry: Technology, finance, healthcare, education sectors  
        - Accuracy: Provide mathematically justified scores with detailed reasoning
        - Consistency: Use identical scoring methodology for all comparisons
        - Business Impact: Scores directly influence hiring decisions and candidate ranking

        RESPONSE REQUIREMENTS
        - Return ONLY the JSON object, no additional text or explanations
        - Ensure overall_match_percentage is an integer between 0-100
        - Provide specific examples in detailed_breakdown explanations
        - Maintain consistent skill naming and categorization
        - If data is insufficient for scoring, use conservative estimates with explanations

        Resume Data: {state['parsed_resume']}
        Job Requirements: {state['parsed_jd']}
    """
    
    try:
        match_analysis = gemini_client.analyze_text(prompt, "")
        print("Raw match analysis response:")
    except Exception as e:
        print(e)

    try:
        cleaned_response = match_analysis.strip()
        
        if cleaned_response.startswith('```'):
            cleaned_response = cleaned_response.replace('```json', '').replace('```', '')
        elif cleaned_response.startswith('```'):
            cleaned_response = cleaned_response.replace('```', '')
        
        match_data = json.loads(cleaned_response)
        
        required_structure = {
            "overall_match_percentage": 0,
            "skill_match": {
                "matched": [],
                "missing": []
            },
            "experience_level": "mismatch",
            "education_alignment": "mismatch",
            "detailed_breakdown": {
                "skills": "No analysis available",
                "experience": "No analysis available", 
                "education": "No analysis available",
                "soft_skills": "No analysis available"
            }
        }
        
        def merge_with_defaults(data, defaults):
            for key, default_value in defaults.items():
                if key not in data:
                    data[key] = default_value
                elif isinstance(default_value, dict) and isinstance(data.get(key), dict):
                    merge_with_defaults(data[key], default_value)
            return data
        
        match_data = merge_with_defaults(match_data, required_structure)
        
        try:
            match_data["overall_match_percentage"] = int(float(match_data["overall_match_percentage"]))
            match_data["overall_match_percentage"] = max(0, min(100, match_data["overall_match_percentage"]))
        except (ValueError, TypeError):
            match_data["overall_match_percentage"] = 0
        
        valid_alignment_values = ["match", "partial", "mismatch"]
        if match_data["experience_level"] not in valid_alignment_values:
            match_data["experience_level"] = "mismatch"
        if match_data["education_alignment"] not in valid_alignment_values:
            match_data["education_alignment"] = "mismatch"
        
        if not isinstance(match_data["skill_match"]["matched"], list):
            match_data["skill_match"]["matched"] = []
        if not isinstance(match_data["skill_match"]["missing"], list):
            match_data["skill_match"]["missing"] = []
        
        state["match_analysis"] = match_data
        state["match_score"] = match_data.get("overall_match_percentage", 0)
        
        print("Parsed and validated match data:", match_data)
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {match_analysis}")
        
        percentage_match = re.search(r'(\d+(?:\.\d+)?)%?', match_analysis)
        if percentage_match:
            overall_percentage = int(float(percentage_match.group(1)))
            overall_percentage = max(0, min(100, overall_percentage))
        else:
            overall_percentage = 0
            
        state["match_analysis"] = {
            "overall_match_percentage": overall_percentage,
            "skill_match": {
                "matched": [],
                "missing": []
            },
            "experience_level": "mismatch",
            "education_alignment": "mismatch",
            "detailed_breakdown": {
                "skills": "Unable to parse detailed skill analysis",
                "experience": "Unable to parse experience analysis",
                "education": "Unable to parse education analysis",
                "soft_skills": "Unable to parse soft skills analysis"
            },
            "parsing_error": str(e),
            "raw_response": match_analysis
        }
        state["match_score"] = overall_percentage
        
    except Exception as e:
        print(f"Unexpected error during match calculation: {e}")
        
        state["match_analysis"] = {
            "overall_match_percentage": 0,
            "skill_match": {
                "matched": [],
                "missing": []
            },
            "experience_level": "mismatch",
            "education_alignment": "mismatch",
            "detailed_breakdown": {
                "skills": "Error occurred during analysis",
                "experience": "Error occurred during analysis",
                "education": "Error occurred during analysis",
                "soft_skills": "Error occurred during analysis"
            },
            "error": str(e),
            "raw_response": match_analysis
        }
        state["match_score"] = 0

    state["messages"].append(f"Match score calculated: {state['match_score']}%")
    return state
