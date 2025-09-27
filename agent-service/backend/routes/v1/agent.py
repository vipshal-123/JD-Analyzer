from fastapi import APIRouter, Request , Depends, Form
from fastapi import UploadFile, File
from backend.controllers.v1 import agents

router = APIRouter()

@router.post('/analyse-resume')
async def user_data_wrapper(jd: str = Form(...), resume: UploadFile = File(None)):
    return await agents.analyze_resume(resume, jd)
