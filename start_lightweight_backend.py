#!/usr/bin/env python3
"""
Lightweight PolyDoc Backend
Starts without heavy AI models for faster startup and Hindi/Kannada document processing
"""
import sys
import os
import logging
from pathlib import Path
import asyncio
from typing import Dict, List, Any, Optional
import json

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Import our document processing modules
from src.core.document_processor import DocumentProcessor
from src.utils.indian_language_detector import detect_indian_language

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Pydantic models
class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    status: str
    total_elements: int
    languages_detected: Dict[str, int]
    processing_time: float

class HealthResponse(BaseModel):
    status: str
    message: str
    features: Dict[str, bool]

# Create FastAPI app
app = FastAPI(
    title="PolyDoc AI - Lightweight",
    description="Multi-lingual Document Processing with Hindi/Kannada support",
    version="1.0.0"
)

# Global document processor
document_processor: Optional[DocumentProcessor] = None

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("static", exist_ok=True)
os.makedirs("templates", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.on_event("startup")
async def startup_event():
    """Initialize the document processor on startup"""
    global document_processor
    
    logger.info("🚀 Starting PolyDoc Lightweight Backend")
    logger.info("✅ Hindi and Kannada processing enabled")
    
    try:
        # Initialize document processor (this includes OCR)
        logger.info("📄 Initializing document processor...")
        document_processor = DocumentProcessor()
        logger.info("✅ Document processor ready!")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize document processor: {e}")
        # Continue without document processor
        document_processor = None

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve a simple homepage"""
    return """
    <html>
        <head>
            <title>PolyDoc AI - Hindi/Kannada Support</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #2c3e50; text-align: center; }
                .feature { background: #e8f5e8; padding: 15px; margin: 10px 0; border-radius: 5px; }
                .status { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
                .upload-area { border: 2px dashed #007bff; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
                button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
                button:hover { background: #0056b3; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 PolyDoc AI - Hindi/Kannada Document Processing</h1>
                
                <div class="status">
                    ✅ Backend is running successfully with Hindi & Kannada support!
                </div>
                
                <div class="feature">
                    <h3>📄 Supported Formats</h3>
                    <p>PDF, DOCX, PPTX, TXT, Images (PNG, JPG, TIFF, BMP)</p>
                </div>
                
                <div class="feature">
                    <h3>🌐 Language Support</h3>
                    <p>Hindi (हिन्दी), Kannada (ಕನ್ನಡ), English, Telugu, Bengali</p>
                </div>
                
                <div class="feature">
                    <h3>🔧 API Endpoints</h3>
                    <p><strong>Upload Document:</strong> POST /upload</p>
                    <p><strong>Health Check:</strong> GET /health</p>
                    <p><strong>API Docs:</strong> <a href="/docs" target="_blank">/docs</a></p>
                </div>
                
                <div class="upload-area">
                    <h3>📤 Test Document Upload</h3>
                    <p>Use the <a href="/docs" target="_blank">API documentation</a> to test file uploads</p>
                    <button onclick="window.open('/docs', '_blank')">Open API Docs</button>
                </div>
            </div>
        </body>
    </html>
    """

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    
    features = {
        "document_processor": document_processor is not None,
        "hindi_support": True,
        "kannada_support": True,
        "ocr_support": document_processor is not None,
        "pdf_support": True,
        "docx_support": True
    }
    
    status = "healthy" if document_processor is not None else "partial"
    message = "All systems operational" if status == "healthy" else "Running with limited features"
    
    return HealthResponse(
        status=status,
        message=message,
        features=features
    )

@app.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document"""
    
    if not document_processor:
        raise HTTPException(status_code=503, detail="Document processor not available")
    
    import time
    import uuid
    
    start_time = time.time()
    document_id = str(uuid.uuid4())
    
    try:
        # Save uploaded file
        upload_path = Path("uploads") / f"{document_id}_{file.filename}"
        
        with open(upload_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        logger.info(f"📁 File saved: {upload_path}")
        
        # Process the document
        logger.info(f"🔄 Processing document: {file.filename}")
        processed_doc = await document_processor.process_document(str(upload_path))
        
        # Analyze languages
        languages_detected = {}
        for element in processed_doc.elements:
            if element.language:
                languages_detected[element.language] = languages_detected.get(element.language, 0) + 1
        
        processing_time = time.time() - start_time
        
        logger.info(f"✅ Document processed successfully in {processing_time:.2f}s")
        logger.info(f"📊 Elements: {len(processed_doc.elements)}, Languages: {languages_detected}")
        
        return DocumentUploadResponse(
            document_id=document_id,
            filename=file.filename,
            status="success",
            total_elements=len(processed_doc.elements),
            languages_detected=languages_detected,
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"❌ Error processing document: {e}")
        # Clean up file
        if upload_path.exists():
            upload_path.unlink()
        
        raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")

@app.post("/test-language")
async def test_language_detection(text: str):
    """Test language detection on provided text"""
    
    try:
        detection = detect_indian_language(text)
        
        return {
            "input_text": text,
            "detected_language": detection.language_code,
            "language_name": detection.language_name,
            "native_name": detection.native_name,
            "confidence": detection.confidence,
            "script": detection.script,
            "family": detection.family
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Language detection failed: {str(e)}")

def main():
    """Start the lightweight backend server"""
    
    logger.info("🚀 PolyDoc Lightweight Backend")
    logger.info("=" * 60)
    logger.info("✅ Hindi & Kannada Document Processing")
    logger.info("✅ Fast startup without heavy AI models")
    logger.info("✅ OCR and language detection included")
    logger.info("=" * 60)
    
    try:
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            log_level="info",
            access_log=True
        )
    except Exception as e:
        logger.error(f"❌ Failed to start server: {e}")
        return 1

if __name__ == "__main__":
    main()
