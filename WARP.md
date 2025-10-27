# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development

```bash
# Backend (FastAPI)
python start_backend.py                    # Start backend server (http://localhost:8000)
uvicorn src.api.main_mongodb:app --reload --host 0.0.0.0 --port 8000  # Alternative backend start

# Frontend (React + Vite)
npm run dev                                # Start frontend dev server (usually http://localhost:5173)
npm run build                              # Build production bundle
npm run preview                            # Preview production build

# Full Stack (Windows)
start-all.bat                              # Start both backend and frontend
```

### Testing

```bash
# Backend tests
python -m pytest test-backend/ -v         # Run all backend tests
python test_chat_lightweight.py           # Test core chat functionality
python test-backend/run_tests.py          # Comprehensive integration tests

# Frontend tests  
npm test                                   # Run React tests
npm test -- --coverage                     # Run tests with coverage
```

### Linting and Type Checking

```bash
# Frontend
npm run lint                               # ESLint for JavaScript/React
npm run type-check                         # TypeScript type checking (tsc --noEmit)

# Backend - Python follows PEP 8, use:
black src/                                 # Code formatter (if installed)
isort src/                                 # Import sorter (if installed)
```

### Database

```bash
# MongoDB (must be running locally)
mongod --version                           # Check MongoDB installation
# Connection: mongodb://localhost:27017
# Database naming: polydoc_user_{user_id} per user
```

## Architecture Overview

### Technology Stack

**Backend:**
- **FastAPI** - REST API and WebSocket endpoints
- **MongoDB** (Motor async driver) - Document storage with per-user databases
- **PyTorch + Transformers** - AI models for NLP
- **Sentence-Transformers** - Multilingual embeddings (paraphrase-multilingual-MiniLM-L12-v2)
- **EasyOCR/Tesseract** - OCR with fallback mechanisms
- **Python 3.8+**

**Frontend:**
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Firebase** - Authentication (optional)
- **Framer Motion** - Animations

### Core Architecture Patterns

#### 1. **User-Isolated MongoDB Databases**
Each user gets their own MongoDB database (`polydoc_user_{user_id}`). The system creates user-specific `MongoDBStore` instances on-demand. This provides data isolation and supports multi-tenancy at the database level.

```
MongoDB Structure:
├── polydoc_user_abc123/         # User-specific database
│   ├── documents                # Document metadata
│   ├── document_chunks          # Chunked text with embeddings
│   ├── chat_sessions            # Chat history
│   └── users                    # User settings
└── polydoc_ai_default/          # Fallback for no user_id
```

#### 2. **Lazy AI Model Loading with Fallbacks**
AI models load asynchronously during startup to avoid blocking. The system includes multiple fallback strategies:
- Primary models: Large, accurate models
- Fallback models: Lighter models if memory/disk constrained
- Emergency mode: Document processing without AI if all models fail

Models are cached in `~/.cache/huggingface/` and `~/.cache/sentence-transformers/`.

#### 3. **Multi-Layer Search with Fallback Chain**
Search follows this priority chain (implemented in `mongodb_store.py`):
1. **Vector Similarity Search** - Primary semantic search using embeddings
2. **Text Search with Regex** - Pattern matching on indexed text
3. **General Document Chunks** - All chunks for the user
4. **Emergency Content Retrieval** - Raw document content as last resort

#### 4. **OCR Multi-Reader Strategy**
The document processor initializes multiple EasyOCR readers for language compatibility:
- Primary: English-only for stability
- Secondary: English + Hindi (Devanagari)
- Tertiary: English + Kannada
- Fallback: Tesseract if EasyOCR memory issues occur

Language-specific readers are selected dynamically based on detected content.

#### 5. **Indian Language Support**
The `IndianLanguageDetector` uses script-based detection analyzing Unicode ranges:
- Devanagari (Hindi, Marathi)
- Kannada, Telugu, Tamil, Bengali, Gujarati, Malayalam, Punjabi, Odia, Assamese
- Falls back to langdetect library for additional languages
- Returns confidence scores based on script character percentages

### Key Components

**Backend Core (`src/`):**
- `api/main_mongodb.py` - FastAPI app, WebSocket manager, endpoints, CORS config
- `core/document_processor.py` - Multi-format processor (PDF, DOCX, PPTX, images, CSV, Excel, HTML, Markdown, ODT)
- `core/mongodb_store.py` - User-isolated storage, vector search, document chunking
- `models/ai_models.py` - AIModelManager (embedding, summarization, QA models)
- `utils/indian_language_detector.py` - Script-based language detection

**Frontend (`src/`):**
- `pages/Dashboard.jsx` - Main document management interface
- `pages/LandingPage.jsx` - Marketing page
- `components/` - Reusable UI components
- `contexts/AuthContext.jsx` - Firebase authentication state
- `utils/textToSpeech.js` - TTS functionality for multilingual audio

### Data Flow

#### Document Upload Flow
```
Upload → DocumentProcessor.process_file() 
       → Language detection + OCR (if image)
       → Text chunking (500 tokens)
       → Embedding generation
       → MongoDB storage (user's database)
       → Summary generation
       → Response to client
```

#### Chat Query Flow
```
User question → WebSocket or REST endpoint
             → MongoDBStore.search_documents()
             → Vector similarity search (primary)
             → Text search fallback (if needed)
             → Context retrieval (top-k chunks)
             → AI model inference (QA or summarization)
             → Format response with sources
             → Stream to client
```

## Development Practices

### Adding New File Format Support
1. Update `supported_formats` set in `DocumentProcessor.__init__`
2. Add format-specific extraction method (e.g., `_extract_from_xyz()`)
3. Call new method in `process_file()` based on file extension
4. Update tests in `test-backend/`
5. Update README supported formats table

### Adding New Language Support
1. Check if EasyOCR supports the language
2. Add language metadata to `IndianLanguageDetector.INDIAN_LANGUAGES`
3. Add script Unicode ranges to `SCRIPT_RANGES` if new script
4. Update `_script_to_language()` mapping
5. Test with sample documents in the target language

### Working with AI Models
- Models lazy-load on first request (not at startup)
- Memory optimization: `low_cpu_mem_usage=True` in model kwargs
- Cache is critical: Never use `force_download=True`
- Always include fallback to lighter models
- Check disk space before loading: Models need 5-10GB total

### Summary Generation
- Uses AI abstractive summarization (BART model) for actual summaries, not just sentence extraction
- Fallback to extractive summarization only when AI models fail to load
- For Indian languages: generates bilingual summaries (original + English)
- For English: generates single concise summary
- Summary cleaning removes metadata headers to show only content

### MongoDB Best Practices
- Always use user_id to isolate data
- Indexes are created automatically on first connection
- User-specific databases prevent cross-user data leaks
- Text search index uses `default_language='none'` for multilingual support

### WebSocket Communication
Connection format: `ws://localhost:8000/ws/chat/{user_id}`

Message format:
```json
{
  "message": "Your question here",
  "language": "en",
  "document_id": "optional_specific_doc"
}
```

Response includes: `response`, `confidence`, `sources` (page numbers), `processing_time`

## Configuration

### Environment Variables
```bash
# MongoDB (optional, defaults to localhost)
MONGO_URL=mongodb://localhost:27017

# AI Models (optional)
HUGGINGFACE_CACHE_DIR=~/.cache/huggingface
MODEL_DEVICE=cpu  # or cuda for GPU

# API (configured in start_backend.py)
API_HOST=0.0.0.0
API_PORT=8000

# Firebase (optional, for authentication)
# Configure in src/config/firebase.js
```

### First-Time Setup Requirements
- **Disk Space**: 10GB+ free (for AI models)
- **RAM**: 8GB minimum, 16GB recommended
- **MongoDB**: Must be installed and running locally
- **Python**: 3.8+ with pip
- **Node.js**: 18+

First startup takes 5-10 minutes to download and cache all AI models. Subsequent startups are ~30-60 seconds.

## Important Notes

### Memory Management
- EasyOCR readers are memory-intensive (~500MB each)
- System limits to 2 OCR reader combinations for efficiency
- Tesseract fallback activates on memory allocation failures
- Monitor `~/.cache/` directories as they grow large

### CORS Configuration
The backend allows all localhost ports (3000-3003, 8000) for development. Review `allow_origins` in `main_mongodb.py` before production deployment.

### Testing Guidance
- `test_chat_lightweight.py` - Fast sanity check for core imports
- `test-backend/run_tests.py` - Comprehensive suite including ML training tests
- Manual testing checklist in `TESTING_GUIDE.md`
- Test with both English and Indian language documents

### Known Limitations
- MongoDB must be local (no Atlas support in current implementation)
- GPU acceleration disabled by default (CPU only)
- Maximum document size: 50 pages per document (configurable in user limits)
- Some language pairs incompatible in EasyOCR (system auto-detects and skips)

## Project-Specific Patterns

### Error Handling Philosophy
The codebase prioritizes graceful degradation:
- If AI models fail to load → Continue with document processing only
- If vector search fails → Fall back to text search
- If EasyOCR fails → Fall back to Tesseract
- If all OCR fails → Log warning and continue without OCR

Always include fallback mechanisms rather than failing completely.

### Async/Await Usage
- All database operations are async (Motor driver)
- Document processing is sync but called from async context
- Model inference is CPU-bound, consider `asyncio.to_thread()` for large workloads
- WebSocket handlers must be async

### Code Organization
- Keep AI model code separate from business logic (`models/` vs `api/`)
- Document processing independent of storage layer
- Utilities like language detection are self-contained
- Frontend contexts manage global state (Auth, Theme)

### Naming Conventions
- User IDs: Cleaned for MongoDB database names (replace special chars)
- Document IDs: MongoDB ObjectId as string
- Collection names: Plural (documents, document_chunks, chat_sessions)
- Language codes: ISO 639-1 (en, hi, kn, etc.)
