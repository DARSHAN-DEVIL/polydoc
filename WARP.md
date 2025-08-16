# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

PolyDoc AI is a multi-lingual document understanding system with real-time AI chat capabilities. It processes PDF, DOCX, PPTX, and image files with OCR support, preserves document layouts, and provides AI-powered question answering using only free, open-source models.

## Common Development Commands

### Start the Application
```bash
python main.py
```
The application runs on http://localhost:8000

### Development Mode (with auto-reload)
```bash
python -m uvicorn src.api.main:app --reload --host 127.0.0.1 --port 8000
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Test Static Files
```bash
# Access test endpoint for debugging static file serving
# Navigate to http://localhost:8000/test
```

### API Health Check
```bash
curl http://localhost:8000/health
```

### Run with Different Log Levels
```bash
# Set environment variable for logging
$env:POLYDOC_LOG_LEVEL="DEBUG"  # Windows PowerShell
export POLYDOC_LOG_LEVEL=DEBUG  # Linux/macOS
python main.py
```

## Architecture Overview

### Core Components

1. **Document Processing Layer** (`src/core/document_processor.py`)
   - Handles PDF, DOCX, PPTX, and image files
   - Uses PyPDF2, python-docx, python-pptx for structured documents
   - Integrates Tesseract OCR and EasyOCR for image text extraction
   - Preserves document layout and structure using bounding boxes
   - Supports multi-language document processing

2. **AI Models Layer** (`src/models/ai_models.py`)
   - **AIModelManager**: Central hub for all AI operations
   - Uses only free Hugging Face models to avoid API costs
   - Embedding model: `paraphrase-multilingual-MiniLM-L12-v2`
   - Summarization: `sshleifer/distilbart-cnn-12-6`
   - Question-Answering: `distilbert-base-cased-distilled-squad`
   - Sentiment Analysis: `cardiffnlp/twitter-roberta-base-sentiment-latest`
   - All models run on CPU by default for stability

3. **Vector Storage** (`src/core/vector_store.py`)
   - FAISS-based similarity search with IndexFlatIP (cosine similarity)
   - Chunks documents with smart sentence boundary detection
   - Stores document metadata with page numbers and element types
   - Provides context retrieval for question answering
   - Persistent storage with automatic save/load

4. **FastAPI Backend** (`src/api/main.py`)
   - RESTful API with complete CRUD operations
   - WebSocket support for real-time chat interface
   - Background model initialization to avoid blocking startup
   - Comprehensive error handling and health monitoring
   - CORS enabled for web interface integration

5. **Web Interface**
   - Modern React-style UI with responsive design
   - Real-time chat with WebSocket connections
   - Drag-and-drop file upload with progress tracking
   - Multi-language support in the interface

### Key Architecture Patterns

- **Async/Await**: All heavy operations (document processing, AI inference) are async to prevent blocking
- **Background Initialization**: AI models load in background while web server starts immediately
- **Chunking Strategy**: Documents are split into overlapping chunks for better context retrieval
- **Error Resilience**: Each AI model has fallback behavior if it fails to load
- **Memory Management**: Models forced to CPU to avoid CUDA memory issues

## Development Guidelines

### Model Loading and Performance
- First startup will download models (can take several minutes)
- Models are cached locally after first download
- All AI operations run in thread pool executors to prevent blocking
- FAISS index rebuilds automatically when documents are removed

### Document Processing Flow
1. File validation and type detection
2. Format-specific processing (PDF → PyPDF2, DOCX → python-docx, etc.)
3. OCR for images using EasyOCR with multilingual support
4. Text chunking with sentence boundary preservation
5. Embedding generation and vector store addition
6. Document summary generation using AI models

### API Design Principles
- All endpoints return consistent error responses
- Processing time included in all responses
- WebSocket and REST APIs provide same functionality
- Health check endpoint monitors all system components
- Background tasks don't block API responses

### WebSocket Chat Flow
1. Client connects to `/ws/{client_id}`
2. Message processing happens asynchronously
3. Status updates sent during processing
4. Final response includes source page references
5. Error messages handled gracefully

## Important Implementation Details

### Vector Search Context Building
- Uses sliding window approach for large contexts
- Prioritizes high-relevance chunks over quantity
- Includes page numbers in context for source attribution
- Limits context to 2000 characters for optimal AI performance

### Model Fallback Strategy
- Essential embedding model must load or system fails
- Other models have fallback responses if they fail to load
- Language detection disabled by default (known to cause startup hangs)
- CPU-only inference for stability across environments

### File Storage Structure
```
uploads/          # Uploaded documents (UUID_filename format)
vector_store/     # FAISS index and metadata
├── faiss_index.idx   # FAISS vector index
├── chunks.json       # Document chunks without embeddings
└── metadata.json     # Document metadata and statistics
static/           # Frontend assets
templates/        # HTML templates
```

### Error Handling Philosophy
- Never crash the main application due to model failures
- Provide meaningful fallback responses when AI models fail
- Log detailed error information but show user-friendly messages
- Graceful degradation when optional features are unavailable

## Troubleshooting Common Issues

### Startup Problems
- If models hang during loading, check available memory (need 4GB+ RAM)
- Language detection model is disabled by default due to startup issues
- Force restart if initialization gets stuck (models will be cached)

### Performance Issues
- Large documents (>10MB) may take several minutes to process
- OCR processing is CPU-intensive for image files
- Consider increasing system memory if processing times are excessive

### WebSocket Connection Issues
- Client ID must be unique for each connection
- Connection manager automatically handles disconnects
- Multiple tabs require separate client IDs

This codebase prioritizes reliability and free operation over cutting-edge performance, making it suitable for production deployment without ongoing API costs.
