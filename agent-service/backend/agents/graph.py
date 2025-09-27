from langgraph.graph import StateGraph, END

from backend.llm.gemini import GeminiClient
from backend.agents.jd_analysis_agent import analyze_job_description
from backend.agents.match_and_score_agent import calculate_match_score
from backend.agents.recommendation_agent import generate_recommendations
from backend.agents.resume_parsing_agent import parse_resume
from backend.agents.state import AgentState

class JDResumeAnalyzer:
    def __init__(self):
        self.gemini_client = GeminiClient()
        self.workflow = self._create_workflow()
    
    def _create_workflow(self):
        workflow = StateGraph(AgentState)
        
        # Add agent nodes
        workflow.add_node("resume_parser", lambda s: parse_resume(s, self.gemini_client))
        workflow.add_node("jd_analyzer", lambda s: analyze_job_description(s, self.gemini_client))
        workflow.add_node("matcher", lambda s: calculate_match_score(s, self.gemini_client))
        workflow.add_node("recommender", lambda s: generate_recommendations(s, self.gemini_client))
        
        # Define workflow edges
        workflow.set_entry_point("resume_parser")
        workflow.add_edge("resume_parser", "jd_analyzer")
        workflow.add_edge("jd_analyzer", "matcher")
        workflow.add_edge("matcher", "recommender")
        workflow.add_edge("recommender", END)
        
        return workflow.compile()
