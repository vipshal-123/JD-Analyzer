from fastapi import UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from backend.agents.graph import JDResumeAnalyzer
from backend.utils.reuseable_functions import extract_text_from_docx, extract_text_from_pdf, clean_and_parse

async def analyze_resume(resume: UploadFile = File(...), jd: str = Form(...)):
    try:
        file_content = await resume.read()
        
        if resume.filename.endswith('.pdf'):
            resume_text = extract_text_from_pdf(file_content=file_content)
        elif resume.filename.endswith('.docx'):
            resume_text = extract_text_from_docx(file_content=file_content)
        else:
            return JSONResponse({ "success": False, "message": "Invalid file format Accepts(PDF/DOCX)"}, status_code=400)
        
        initial_state = {
            "resume_text": resume_text,
            "job_description": jd,
            "parsed_resume": {},
            "parsed_jd": {},
            "match_analysis": {},
            "match_score": 0,
            "recommendations": [],
            "messages": []
        }
        
        analyzer = JDResumeAnalyzer()
        result = analyzer.workflow.invoke(initial_state)
        
        print("result====", result)
        
        formatted_data = {
            "match_percentage": result["match_score"],
            "match_analysis": result["match_analysis"],
            "parsed_resume": clean_and_parse(result["parsed_resume"]["raw_analysis"]),
            "job_analysis": clean_and_parse(result["parsed_jd"]["raw_analysis"]),
            "recommendations": result["recommendations"],
            "processing_log": result["messages"]
        }
        
        return JSONResponse({ "success": True, "data": jsonable_encoder(formatted_data)}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse({ "success": False, "message": "Something went wrong"}, status_code=500)
        