# 🤖 AI-Powered Resume Analyzer - Backend

An intelligent resume screening system that analyzes candidate resumes against job descriptions using Google's Gemini AI, built with FastAPI.

![Python](https://img.shields.io/badge/python-v3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

- **Intelligent Resume Parsing**: Extract structured data from PDF/DOCX resumes using AI
- **Job Description Analysis**: Parse job requirements and categorize skills
- **Match Scoring**: Calculate weighted match percentages (Skills: 40%, Experience: 30%, Education: 20%, Soft Skills: 10%)
- **Smart Recommendations**: Generate prioritized improvement suggestions
- **Multi-format Support**: Handle PDF and DOCX resume uploads
- **Real-time Processing**: LangGraph workflow for efficient AI agent orchestration
- **Secure Authentication**: JWT-based auth with OTP verification
- **Scalable Storage**: MongoDB with Beanie ODM for document management
- **Comprehensive API**: RESTful endpoints

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.12+
- **LLM**: Google Gemini 2.5 Flash
- **Database**: MongoDB with Beanie ODM
- **Workflow Engine**: LangGraph for AI agent orchestration
- **Authentication**: JWT tokens with bcrypt
- **File Processing**: PyPDF2, python-docx

## 🔧 Installation

1. **Clone the repository**
[git clone https://github.com/vipshal-123/JD-Analyzer/tree/main/agent-service](https://github.com/vipshal-123/JD-Analyzer.git)

2. **Create virtual environment**
```bash
source venv/bin/activate     # Linux
venv\Scripts\activate        # Windows
```

3. **Install dependencies**
```bash
poetry install
```

4. **Environment Configuration**
```env
MONGO_URI="mongodb://localhost:27017/jd-analyzer"
PORT=5002

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


GEMINI_API_KEY=
```

## 🚀 Running the Application

### Development Mode
```bash
poetry run server
```

