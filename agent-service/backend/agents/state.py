from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    resume_text: str
    job_description: str
    parsed_resume: dict
    match_analysis: dict
    parsed_jd: dict
    match_score: float
    recommendations: list
    messages: Annotated[list, operator.add]