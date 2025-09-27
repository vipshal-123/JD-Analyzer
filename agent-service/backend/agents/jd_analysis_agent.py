from backend.agents.state import AgentState

def analyze_job_description(state: AgentState, gemini_client) -> AgentState:
    prompt = """
    Analyze this job description and extract:
    1. Required skills (must-have vs nice-to-have)
    2. Experience level required
    3. Educational requirements
    4. Key responsibilities
    5. Industry-specific keywords
    6. Soft skills mentioned
    
    Categorize requirements by priority and return in JSON format.
    """
    
    jd_analysis = gemini_client.analyze_text(prompt, state["job_description"])
    
    try:
        import json
        state["parsed_jd"] = json.loads(jd_analysis)
    except:
        state["parsed_jd"] = {"raw_analysis": jd_analysis}
    
    state["messages"].append("Job description analyzed")
    return state
