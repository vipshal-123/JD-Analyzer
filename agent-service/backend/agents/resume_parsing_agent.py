from backend.agents.state import AgentState

def parse_resume(state: AgentState, gemini_client) -> AgentState:
    prompt = """
    Extract the following information from this resume:
    1. Personal details (name, contact info)
    2. Skills (technical and soft skills)
    3. Education (degrees, institutions, years)
    4. Work experience (roles, companies, duration, achievements)
    5. Certifications and projects
    
    Return the information in a structured JSON format.
    """
    
    parsed_data = gemini_client.analyze_text(prompt, state["resume_text"])
    
    try:
        import json
        json_string = (
            state["parsed_resume"]
            .strip()
            .replace("```json\n", "")
            .replace("\n```", "")
            .replace("```", "")
        )
        state["parsed_resume"] = json.loads(json_string)
    except:
        state["parsed_resume"] = {"raw_analysis": parsed_data}
    
    state["messages"].append("Resume parsed successfully")
    return state
