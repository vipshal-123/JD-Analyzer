from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import Field
from typing import List, Optional


class Analysis(Document):
    user_id: PydanticObjectId
    company: Optional[str] = ""
    job_title: str = ""
    match_percentage: int = 0
    match_analysis: dict
    parsed_resume: dict
    job_analysis: dict
    recommendations: List[str]

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "Analysis"