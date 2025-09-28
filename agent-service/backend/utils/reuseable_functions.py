import PyPDF2
from docx import Document
import io
import json
import re

def extract_text_from_pdf(file_content: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_content))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_content: bytes) -> str:
    doc = Document(io.BytesIO(file_content))
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

def clean_and_parse(raw_data):
    if isinstance(raw_data, dict):
        return raw_data

    if not isinstance(raw_data, str):
        return {"raw": str(raw_data)}

    cleaned = re.sub(r'^```json\s*|\s*```$', '', raw_data.strip(), flags=re.DOTALL)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {"raw": cleaned}
    

def safe_process_data(data, data_type="resume"):
    try:
        if not data:
            return {}
         
        print(f"Processing {data_type} data type: {type(data)}")
        if isinstance(data, dict):
            print(f"{data_type} keys: {data.keys()}")
         
        if isinstance(data, dict) and "raw_analysis" not in data and "error" not in data:
            print(f"{data_type}: Using structured data directly")
            return data
         
        elif isinstance(data, dict) and "raw_analysis" in data:
            print(f"{data_type}: Found raw_analysis, cleaning and parsing")
            raw_text = data["raw_analysis"]
            if raw_text and isinstance(raw_text, str):
                return clean_and_parse(raw_text)
            else:
                print(f"{data_type}: raw_analysis is empty or not string")
                return {}
         
        elif isinstance(data, dict) and "error" in data:
            print(f"{data_type}: Error in data: {data.get('error')}")
            return {}
         
        elif isinstance(data, str):
            print(f"{data_type}: Data is string, cleaning and parsing")
            return clean_and_parse(data)

        else:
            print(f"{data_type}: Using data as-is")
            return data if isinstance(data, dict) else {}
                    
    except Exception as e:
        print(f"Error processing {data_type} data: {e}")
        import traceback
        traceback.print_exc()
        return {}