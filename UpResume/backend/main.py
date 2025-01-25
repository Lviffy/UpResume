from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import PyPDF2
import docx
import io
import json
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List, Dict
import re
import logging
import sys
import traceback
import fitz  # PyMuPDF for better PDF handling

# Configure logging to write to both console and file
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('backend.log')
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS with more permissive settings for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting the FastAPI server...")
    try:
        # Download NLTK data
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('wordnet', quiet=True)
        logger.info("NLTK data downloaded successfully")
    except Exception as e:
        logger.error(f"Error downloading NLTK data: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request failed: {str(e)}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        )

# Initialize NLTK components
try:
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
except Exception as e:
    logger.error(f"Error initializing NLTK components: {str(e)}")
    logger.error(traceback.format_exc())
    lemmatizer = None
    stop_words = set()

async def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    try:
        # First try with PyMuPDF (more robust)
        try:
            pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                text += page.get_text() + "\n"
            pdf_document.close()
        except Exception as mupdf_error:
            logger.warning(f"PyMuPDF extraction failed: {str(mupdf_error)}, trying PyPDF2")
            
            # Fallback to PyPDF2
            pdf_file = io.BytesIO(file_bytes)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        
        text = text.strip()
        if not text:
            raise ValueError("No text could be extracted from the PDF. The file might be scanned or image-based.")
            
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        if "scanned or image-based" in str(e):
            raise HTTPException(
                status_code=400,
                detail="This appears to be a scanned or image-based PDF. Please provide a PDF with selectable text."
            )
        raise HTTPException(status_code=500, detail="Failed to extract text from PDF. Please ensure the file is not corrupted.")

async def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        doc_file = io.BytesIO(file_bytes)
        doc = docx.Document(doc_file)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from DOCX: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to extract text from DOCX")

def preprocess_text(text: str) -> str:
    try:
        if not text:
            return ""
            
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and extra whitespace
        text = re.sub(r'[^\w\s]', ' ', text)
        text = ' '.join(text.split())
        
        # Tokenize and lemmatize
        if lemmatizer:
            tokens = word_tokenize(text)
            tokens = [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words]
            return ' '.join(tokens)
        else:
            return text
    except Exception as e:
        logger.error(f"Warning: Error in preprocess_text: {str(e)}")
        logger.error(traceback.format_exc())
        return text

def check_formatting(text: str) -> Dict[str, bool]:
    formatting_checks = {
        "has_sections": False,
        "has_bullet_points": False,
        "appropriate_length": False,
        "has_contact_info": False
    }
    
    # Check for common section headers
    sections = ["experience", "education", "skills", "projects", "summary"]
    text_lower = text.lower()
    formatting_checks["has_sections"] = any(section in text_lower for section in sections)
    
    # Check for bullet points
    formatting_checks["has_bullet_points"] = bool(re.search(r'[•\-\*]', text))
    
    # Check length (between 300 and 1200 words is considered appropriate)
    word_count = len(text.split())
    formatting_checks["appropriate_length"] = 300 <= word_count <= 1200
    
    # Check for contact information patterns
    contact_patterns = [
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # email
        r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',  # phone
        r'linkedin\.com\/in\/[A-Za-z0-9_-]+',  # LinkedIn
    ]
    formatting_checks["has_contact_info"] = any(bool(re.search(pattern, text)) for pattern in contact_patterns)
    
    return formatting_checks

def analyze_resume(text: str, job_description: str = None) -> Dict:
    # Preprocess resume and job description
    processed_resume = preprocess_text(text)
    processed_job = preprocess_text(job_description) if job_description else ""
    
    # Initialize scoring components
    base_score = 0
    feedback = []
    keywords_found = []
    missing_keywords = []
    
    # Check formatting (20% of total score)
    format_checks = check_formatting(text)
    format_score = sum(format_checks.values()) / len(format_checks) * 20
    base_score += format_score
    
    # Add formatting feedback
    if not format_checks["has_sections"]:
        feedback.append("Add clear section headers (e.g., Experience, Education, Skills)")
    if not format_checks["has_bullet_points"]:
        feedback.append("Use bullet points to highlight achievements and responsibilities")
    if not format_checks["appropriate_length"]:
        feedback.append("Adjust resume length to be between 300-1200 words")
    if not format_checks["has_contact_info"]:
        feedback.append("Include contact information (email, phone, LinkedIn)")
    
    # If job description is provided, analyze keyword matching (80% of remaining score)
    if job_description:
        # Use TF-IDF to find important keywords in job description
        vectorizer = TfidfVectorizer(max_features=20)
        try:
            tfidf_matrix = vectorizer.fit_transform([processed_job])
            feature_names = vectorizer.get_feature_names_out()
            
            # Get important keywords from job description
            important_keywords = feature_names.tolist()
            
            # Check which keywords are present in resume
            resume_words = set(processed_resume.split())
            keywords_found = [word for word in important_keywords if word in resume_words]
            missing_keywords = [word for word in important_keywords if word not in resume_words]
            
            # Calculate keyword match score
            keyword_score = len(keywords_found) / len(important_keywords) * 80
            base_score += keyword_score
            
            if len(keywords_found) < len(important_keywords) * 0.5:
                feedback.append(f"Add more relevant keywords from the job description")
                
        except Exception as e:
            logger.error(f"Error in keyword analysis: {str(e)}")
            logger.error(traceback.format_exc())
            base_score += 40  # Add average score if keyword analysis fails
    else:
        # Without job description, assign score based on common resume keywords
        common_keywords = {
            "achieved", "developed", "managed", "created", "improved",
            "team", "project", "experience", "skills", "education",
            "responsible", "leadership", "success", "results"
        }
        resume_words = set(processed_resume.split())
        keywords_found = list(common_keywords.intersection(resume_words))
        missing_keywords = list(common_keywords - resume_words)
        
        keyword_score = len(keywords_found) / len(common_keywords) * 80
        base_score += keyword_score
        
        if len(keywords_found) < len(common_keywords) * 0.5:
            feedback.append("Add more action words and industry-standard terms")
    
    return {
        "score": round(base_score),
        "feedback": feedback,
        "keywords_found": keywords_found,
        "missing_keywords": missing_keywords
    }

async def analyze_with_llama(resume_text: str, job_description: str = None) -> Dict:
    # Return None to fallback to traditional analysis
    return None

@app.post("/analyze/")
async def analyze_file(
    file: UploadFile = File(...),
    job_description: str = Form(None)
):
    try:
        logger.info(f"Analyzing file: {file.filename}")
        contents = await file.read()
        
        if file.filename.lower().endswith('.pdf'):
            text = await extract_text_from_pdf(contents)
        elif file.filename.lower().endswith('.docx'):
            text = await extract_text_from_docx(contents)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF or DOCX file.")

        # Analyze the resume
        analysis_result = analyze_resume(text, job_description)
        
        # Format response according to frontend expectations
        response = {
            "score": analysis_result.get("score", 0),
            "format_score": 0,
            "keyword_score": 0,
            "readability_score": 0,
            "skills_match": [],
            "experience_match": [],
            "education_match": []
        }
        
        return JSONResponse(content=response)
        
    except Exception as e:
        logger.error(f"Error analyzing file: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_file_ai/")
async def analyze_file_ai(
    file: UploadFile = File(...),
    job_description: str = Form(None)
):
    try:
        # Extract text from the uploaded file
        file_bytes = await file.read()
        if file.filename.endswith('.pdf'):
            text = await extract_text_from_pdf(file_bytes)
        elif file.filename.endswith('.docx'):
            text = await extract_text_from_docx(file_bytes)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        # Analyze with Llama model
        llama_analysis = await analyze_with_llama(text, job_description)
        
        if llama_analysis:
            return JSONResponse(content=llama_analysis)
        else:
            # Fallback to traditional analysis if AI analysis fails
            traditional_analysis = analyze_resume(text, job_description)
            return JSONResponse(content=traditional_analysis)
            
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_file/")
async def analyze_file(
    file: UploadFile = File(...),
    job_description: str = Form(None)
):
    try:
        logger.info(f"Received file: {file.filename}")
        
        # Extract text from the uploaded file
        file_bytes = await file.read()
        
        if file.filename.lower().endswith('.pdf'):
            text = await extract_text_from_pdf(file_bytes)
        elif file.filename.lower().endswith('.docx'):
            text = await extract_text_from_docx(file_bytes)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF or DOCX file.")

        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file. Please ensure the file is not empty or corrupted.")

        # Analyze the resume
        result = analyze_resume(text, job_description)
        logger.info("Analysis completed successfully")
        return JSONResponse(content=result)
            
    except HTTPException as he:
        logger.error(f"HTTP error: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="An error occurred while processing your file.")

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
