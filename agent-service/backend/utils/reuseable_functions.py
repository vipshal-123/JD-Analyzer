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
    """
    If input is a JSON string (possibly with ```json```), clean and parse it.
    If it's already a dict, return as-is.
    """
    if isinstance(raw_data, dict):
        return raw_data

    if not isinstance(raw_data, str):
        # fallback
        return {"raw": str(raw_data)}

    # Remove markdown ```json``` blocks
    cleaned = re.sub(r'^```json\s*|\s*```$', '', raw_data.strip(), flags=re.DOTALL)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {"raw": cleaned}