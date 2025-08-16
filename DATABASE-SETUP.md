# 📊 Database Setup Guide for PolyDoc AI Backend

## Database Architecture

PolyDoc AI uses a **dual database approach** for optimal performance:

### 🔥 **Firebase Firestore** (Frontend Database)
- **Purpose**: User authentication, session management, user preferences
- **Type**: NoSQL Document Database  
- **Usage**: Real-time updates, user profiles, chat history
- **Setup**: See `FIREBASE-SETUP.md`

### 🗄️ **PostgreSQL/SQLite** (Backend Database) 
- **Purpose**: Document storage, vector embeddings, search indexes
- **Type**: Relational Database
- **Usage**: Document processing, AI embeddings, full-text search
- **Setup**: Configured in Python backend

## Backend Database Configuration

### Option 1: SQLite (Development - Recommended)
```python
# src/core/vector_store.py
DATABASE_URL = "sqlite:///./polydoc.db"
```
**✅ No installation required, perfect for development!**

### Option 2: MongoDB (Production - Recommended)
```python
# Environment variables
MONGO_URL = "mongodb://localhost:27017/polydoc_ai"
# or MongoDB Atlas (cloud):
# MONGO_URL = "mongodb+srv://user:pass@cluster.mongodb.net/polydoc_ai"
```
**✅ Great for document storage, easy to scale**

### Option 3: MySQL (Alternative)
```python
# Environment variables
DATABASE_URL = "mysql://username:password@localhost:3306/polydoc_ai"
```

## Database Schema (Backend)

### Documents Table
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,           -- Firebase UID
    filename VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',    -- pending, processing, completed, failed
    extracted_text TEXT,
    language VARCHAR(10),
    page_count INTEGER,
    metadata JSONB,                          -- Additional file metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Document Chunks Table
```sql
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536),                  -- OpenAI embedding dimension
    metadata JSONB,                          -- Chunk-specific metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Chat Sessions Table  
```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,           -- Firebase UID
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,               -- 'user' or 'assistant'
    content TEXT NOT NULL,
    metadata JSONB,                          -- Token usage, context, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Backend Setup Instructions

### 1. Install Dependencies

```bash
cd Z:\polydoc-ai
pip install -r requirements.txt
```

### 2. Environment Configuration

Create `.env` file in project root:
```env
# Database
DATABASE_URL=sqlite:///./polydoc.db
# or for PostgreSQL:
# DATABASE_URL=postgresql://user:pass@localhost:5432/polydoc_ai

# OpenAI (for document processing)
OPENAI_API_KEY=your_openai_api_key_here

# Document Processing
MAX_FILE_SIZE=10485760  # 10MB
SUPPORTED_EXTENSIONS=.pdf,.docx,.txt,.md
EMBEDDING_MODEL=text-embedding-ada-002

# Vector Search
VECTOR_DIMENSION=1536
SIMILARITY_THRESHOLD=0.7

# FastAPI
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

### 3. Database Migration

```bash
# Initialize database
python -c "from src.core.vector_store import init_db; init_db()"

# Or run the migration script
python src/migrations/create_tables.py
```

### 4. Start Backend Server

```bash
python main.py
```

Backend will be available at: `http://localhost:8000`

## API Endpoints

### Document Management
```
POST   /api/documents/upload          # Upload document
GET    /api/documents                 # List user documents  
GET    /api/documents/{doc_id}        # Get document details
DELETE /api/documents/{doc_id}        # Delete document
POST   /api/documents/{doc_id}/process # Process document
```

### Chat Interface
```
POST   /api/chat/sessions             # Create chat session
GET    /api/chat/sessions             # List chat sessions
POST   /api/chat/sessions/{id}/messages # Send message
GET    /api/chat/sessions/{id}/messages # Get chat history
DELETE /api/chat/sessions/{id}        # Delete session
```

### Search & Retrieval
```
POST   /api/search/semantic           # Semantic document search
POST   /api/search/hybrid             # Hybrid search (semantic + keyword)
GET    /api/search/similar/{doc_id}   # Find similar documents
```

## Data Flow

### Document Upload & Processing
1. **Upload** → Frontend uploads file to backend
2. **Store** → Backend saves file and creates DB record
3. **Process** → Extract text using OCR/parsing
4. **Chunk** → Split text into searchable chunks
5. **Embed** → Generate vector embeddings
6. **Index** → Store embeddings for similarity search

### Chat & Retrieval
1. **Query** → User asks question about document
2. **Embed** → Convert question to vector embedding
3. **Search** → Find relevant document chunks
4. **Context** → Retrieve relevant text passages
5. **Generate** → Send to AI model with context
6. **Response** → Return AI-generated answer
7. **Store** → Save conversation to database

## Security Considerations

### Authentication Flow
1. **Frontend** → User signs in with Google (Firebase)
2. **Token** → Frontend gets Firebase ID token
3. **Verify** → Backend verifies token with Firebase Admin
4. **Authorize** → Backend authorizes user for resources

### Data Protection
- **User Isolation**: Each user can only access their own documents
- **Token Validation**: All requests require valid Firebase token
- **Input Sanitization**: Prevent SQL injection and XSS
- **File Validation**: Check file types and sizes
- **Rate Limiting**: Prevent API abuse

## Performance Optimization

### Database Indexes
```sql
-- User document lookup
CREATE INDEX idx_documents_user_id ON documents(user_id);

-- Chat session lookup  
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);

-- Vector similarity search
CREATE INDEX idx_document_chunks_embedding ON document_chunks 
USING ivfflat (embedding vector_cosine_ops);
```

### Caching Strategy
- **Redis**: Cache frequently accessed documents
- **Memory**: Cache user sessions and embeddings
- **CDN**: Cache processed document content

## Monitoring & Logging

### Database Metrics
- **Query Performance**: Track slow queries
- **Storage Usage**: Monitor database size growth
- **Connection Pool**: Monitor active connections

### Application Metrics
- **Document Processing**: Track success/failure rates
- **API Response Times**: Monitor endpoint performance
- **User Activity**: Track document uploads and chats

---

This dual-database approach gives you the best of both worlds: real-time frontend updates with Firebase and powerful backend processing with PostgreSQL/SQLite!
