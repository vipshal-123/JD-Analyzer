from backend.agents.state import AgentState

def generate_recommendations(state: AgentState, gemini_client) -> AgentState:
    prompt = f"""
    Based on the resume analysis and job matching results, provide specific recommendations 
    for improving the resume to better match this job opportunity.
    
    Current Match Score: {state["match_score"]}%
    Resume Data: {state["parsed_resume"]}
    Job Requirements: {state["parsed_jd"]}
    
    Provide actionable recommendations for:
    1. Skills to add or emphasize
    2. Experience descriptions to enhance
    3. Keywords to include
    4. Format improvements
    5. Missing sections to add
    
    Prioritize recommendations by potential impact on match score.
    Return as a list of specific, actionable suggestions.
    """
    
    recommendations = gemini_client.analyze_text(prompt, "")
    
    rec_list = [rec.strip() for rec in recommendations.split('\n') if rec.strip()]
    state["recommendations"] = rec_list
    
    state["messages"].append("Recommendations generated")
    return state
