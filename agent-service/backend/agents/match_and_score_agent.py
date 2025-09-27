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
    Compare this resume against the job requirements and calculate a matching percentage.
    
    Resume: {state['parsed_resume']}
    Job Requirements: {state['parsed_jd']}
    
    Provide:
    1. Overall match percentage (0-100%)
    2. Skill match analysis
    3. Experience level compatibility
    4. Education alignment
    5. Detailed breakdown of matches and gaps
    
    Use this scoring framework:
    - Hard Skills: 40% weight
    - Experience Level: 30% weight  
    - Education: 20% weight
    - Soft Skills: 10% weight
    
    Provide ONLY JSON in the following format:

    {{
        "overall_match_percentage": 0-100,
        "skill_match": {{ "matched": [...], "missing": [...] }},
        "experience_level": "match | partial | mismatch",
        "education_alignment": "match | partial | mismatch",
        "detailed_breakdown": {{
            "skills": "...",
            "experience": "...",
            "education": "...",
            "soft_skills": "..."
        }}
    }}

    Respond ONLY with valid JSON. Do not include any text outside JSON.
    """

    match_analysis = gemini_client.analyze_text(prompt, "")
    print("Raw match analysis response:", match_analysis)

    try:
        cleaned_response = match_analysis.strip()
        
        if cleaned_response.startswith('```'):
            cleaned_response = cleaned_response.replace('```json', '').replace('```', '')
        elif cleaned_response.startswith('```'):
            cleaned_response = cleaned_response.replace('```', '')
        
        match_data = json.loads(cleaned_response)
        state["match_analysis"] = match_data 
        state["match_score"] = match_data.get("overall_match_percentage", 0)
        
        print("Parsed match data:", match_data)
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {match_analysis}")
        
        percentage_match = re.search(r'(\d+(?:\.\d+)?)%?', match_analysis)
        if percentage_match:
            overall_percentage = float(percentage_match.group(1))
        else:
            overall_percentage = 0
            
        state["match_analysis"] = {
            "overall_match_percentage": overall_percentage,
            "error": "Failed to parse JSON response",
            "raw_response": match_analysis
        }
        state["match_score"] = overall_percentage

    state["messages"].append(f"Match score calculated: {state['match_score']}%")
    return state
