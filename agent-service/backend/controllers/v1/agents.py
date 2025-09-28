from fastapi import UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import Optional
from backend.agents.graph import JDResumeAnalyzer
from backend.utils.reuseable_functions import extract_text_from_docx, extract_text_from_pdf, clean_and_parse
from backend.models.Analysis import Analysis
from beanie import PydanticObjectId
import math

async def analyze_resume(current_user, resume: UploadFile = File(...), jd: str = Form(...), job_title: str = Form(...), company: Optional[str] = Form(None)):
    print("===========", current_user)
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
    
        
        formatted_data = {
            "match_percentage": result["match_score"],
            "match_analysis": result["match_analysis"],
            "parsed_resume": clean_and_parse(result["parsed_resume"]["raw_analysis"]),
            "job_analysis": clean_and_parse(result["parsed_jd"]["raw_analysis"]),
            "recommendations": result["recommendations"],
        }
        
        if(result["match_score"] > 100):
            return JSONResponse({ "success": True, "message": "Gemini api limit exeeded" }, status_code=500)
        
        analysis = Analysis(
            user_id=PydanticObjectId(current_user.get('_id')),
            company=company,
            job_title=job_title,
            match_percentage=result["match_score"],
            match_analysis=result["match_analysis"],
            parsed_resume=clean_and_parse(result["parsed_resume"]["raw_analysis"]),
            job_analysis=clean_and_parse(result["parsed_jd"]["raw_analysis"]),
            recommendations=result["recommendations"],
        )
        
        await analysis.save()
        return JSONResponse({ "success": True, "data": jsonable_encoder(formatted_data)}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse({ "success": False, "message": "Something went wrong"}, status_code=500)
    
async def past_reports(current_user, page: int=1, limit: int=10):
    try:
        user_id = PydanticObjectId(current_user.get("_id"))
        query_filter = {"user_id": user_id}
        skip = (page - 1) * limit
        
        total_count = await Analysis.find(query_filter).count()
        
        total_pages = math.ceil(total_count / limit) if total_count > 0 else 1
        
        find_data = await Analysis.find(query_filter).sort([("_id", -1)]).skip(skip).limit(limit).to_list()
        
        pagination = {
            "current_page": page,
            "per_page": limit,
            "total_items": total_count,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
            "next_page": page + 1 if page < total_pages else None,
            "prev_page": page - 1 if page > 1 else None
        }
        
        if len(find_data) == 0:
            return JSONResponse({ "success": True, "data": [] }, status_code=200)
        
        return JSONResponse({ "success": True, "data": jsonable_encoder(find_data), "paginate": jsonable_encoder(pagination) }, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse({ "success": False, "message": "Something went wrong" }, status_code=500)
    
async def delete_reports(current_user, id):
    try:
        delete_data = await Analysis.find_one({ "_id": PydanticObjectId(id) }).delete()
        
        if delete_data.deleted_count == 0:
            print(delete_data)
            return JSONResponse({ "success": False, "message": "Something went wrong" }, status_code=500)
        
        return JSONResponse({ "success": True, "message": "Report deleted successfully" })
    except Exception as e:
        print(e)
        return JSONResponse({ "success": False, "message": "Something went wrong" }, status_code=500)
    
        