from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import Field
from typing import Dict, List, Any, Optional, Union


class Analysis(Document):
    user_id: PydanticObjectId
    company: Optional[str] = ""
    job_title: str = ""
    match_percentage: int = 0
    match_analysis: Dict[str, Any] = Field(default_factory=dict)
    parsed_resume: Dict[str, Any] = Field(default_factory=dict) 
    job_analysis: Dict[str, Any] = Field(default_factory=dict)
    recommendations: List[str] = Field(default_factory=list)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "Analysis"