#!/usr/bin/env python3
"""
PolyDoc - Simple Document Processing Backend
Focuses on core document processing without heavy AI models
"""

import os
import sys
import logging
import time
import uuid
from pathlib import Path
from typing import List, Dict, Any

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from fastapi import FastAPI, File, UploadFile, HTTPException, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import only essential components
from src.core.document_processor import DocumentProcessor
from src.utils.indian_language_detector import IndianLanguageDetector

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="PolyDoc Simple Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Global components
document_processor = None
language_detector = None

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    status: str
    summary: str
    statistics: Dict[str, Any]
    processing_time: float

class ChatMessage(BaseModel):
    message: str
    user_id: str

@app.on_event("startup")
async def startup():
    global document_processor, language_detector
    
    logger.info("🚀 Starting PolyDoc Simple Backend...")
    
    # Create directories
    for d in ["uploads", "static", "templates"]:
        os.makedirs(d, exist_ok=True)
    
    try:
        # Initialize document processor
        logger.info("📄 Initializing document processor...")
        document_processor = DocumentProcessor()
        logger.info("✅ Document processor ready")
        
        # Initialize language detector
        logger.info("🌐 Initializing language detector...")
        language_detector = IndianLanguageDetector()
        logger.info("✅ Language detector ready")
        
        logger.info("🎉 Simple backend ready!")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")

@app.options("/{path:path}")
async def options_handler(path: str):
    return JSONResponse({"message": "OK"})

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "components": {
            "document_processor": document_processor is not None,
            "language_detector": language_detector is not None
        }
    }

@app.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Header(..., alias="user-id")
):
    start_time = time.time()
    
    try:
        if not document_processor:
            raise HTTPException(status_code=503, detail="Document processor not ready")
        
        # Validate file
        supported_extensions = {'.pdf', '.docx', '.pptx', '.txt', '.png', '.jpg', '.jpeg'}
        file_extension = Path(file.filename).suffix.lower()
        
        if file_extension not in supported_extensions:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_extension}")
        
        # Save file
        document_id = str(uuid.uuid4())
        file_path = f"uploads/{document_id}_{file.filename}"
        
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Process document
        logger.info(f"Processing {file.filename}...")
        processed_doc = await document_processor.process_document(file_path)
        
        # Create simple summary from first few sentences
        text_elements = [elem for elem in processed_doc.elements if elem.get('type') == 'text']
        summary_text = ""
        if text_elements:
            for elem in text_elements[:3]:  # First 3 text elements
                summary_text += elem.get('text', '')[:200] + " "
            summary_text = summary_text.strip()[:300] + "..."
        else:
            summary_text = f"Document {file.filename} processed successfully."
        
        # Detect language
        detected_language = "unknown"
        if language_detector and text_elements:
            try:
                sample_text = " ".join([elem.get('text', '')[:100] for elem in text_elements[:5]])
                detected_language = language_detector.detect_language(sample_text)
            except Exception:
                pass
        
        # Get stats
        stats = {
            "total_pages": processed_doc.metadata.get('page_count', 0),
            "total_elements": len(processed_doc.elements),
            "text_elements": len(text_elements),
            "detected_language": detected_language,
            "file_size_mb": len(content) / (1024*1024)
        }
        
        processing_time = time.time() - start_time
        
        return DocumentUploadResponse(
            document_id=document_id,
            filename=file.filename,
            status="processed",
            summary=summary_text,
            statistics=stats,
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Error processing {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(message: ChatMessage):
    return {
        "response": f"Thank you for your message: '{message.message}'. Document processing is ready, but chat features require the full AI backend.",
        "confidence": 0.5,
        "sources": [],
        "processing_time": 0.1,
        "timestamp": time.time()
    }

@app.get("/documents")
async def list_documents(user_id: str = Header(..., alias="user-id")):
    # Simple implementation - list uploaded files
    upload_dir = Path("uploads")
    documents = []
    
    if upload_dir.exists():
        for file_path in upload_dir.glob("*"):
            if file_path.is_file():
                documents.append({
                    "id": file_path.stem.split("_")[0],
                    "filename": "_".join(file_path.stem.split("_")[1:]) + file_path.suffix,
                    "upload_date": file_path.stat().st_mtime,
                    "size": file_path.stat().st_size
                })
    
    return {"documents": documents, "total_count": len(documents)}

@app.get("/")
async def root():
    return {
        "message": "PolyDoc Simple Backend",
        "status": "operational",
        "features": [
            "Document upload (PDF, DOCX, PPTX, TXT, Images)",
            "Hindi/Kannada OCR processing", 
            "Language detection",
            "Basic text extraction",
            "File management"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting PolyDoc Simple Backend...")
    print("📄 Document processing with Hindi/Kannada support")
    print("🌐 No heavy AI models - stable and fast")
    print("🔗 Access at: http://localhost:8000")
    
    uvicorn.run(
        "simple_backend:app",
        host="127.0.0.1",
        port=8000,
        log_level="info",
        reload=False
    )
