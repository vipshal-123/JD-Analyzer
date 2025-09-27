from fastapi import APIRouter, Request , Depends, Form, Query
from fastapi import UploadFile, File
from backend.controllers.v1 import agents
from backend.utils.jwt import get_current_user
from typing import Optional

router = APIRouter()

@router.post('/analyse-resume')
async def user_data_wrapper(jd: str = Form(...), job_title: str = Form(...), company: Optional[str]= Form(None), resume: UploadFile = File(None), current_user: dict = Depends(get_current_user)):
    return await agents.analyze_resume(current_user, resume, jd, job_title, company)

@router.get('/past-reports')
async def past_report_wrapper(
    current_user: dict = Depends(get_current_user), 
    page: int = Query(1, ge=1, description="Page number (starting from 1)"),
    limit: int = Query(10, ge=1, le=100, description="Number of items per page (max 100)"),
):
    return await agents.past_reports(current_user=current_user, page=page, limit=limit)
