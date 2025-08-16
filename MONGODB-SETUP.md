# 🍃 MongoDB Setup Guide for PolyDoc AI

## Why MongoDB for PolyDoc AI?
- ✅ **Perfect for documents**: Natural fit for storing document metadata
- ✅ **Flexible schema**: Easy to add new fields as the app grows
- ✅ **Vector search**: Built-in support for AI embeddings
- ✅ **JSON-native**: Works seamlessly with JavaScript/Python
- ✅ **Cloud or local**: Works with Atlas (cloud) or local installation

## 🚀 **Option 1: MongoDB Atlas (Cloud - Recommended)**

### Step 1: Create MongoDB Atlas Account
1. **Go to**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Sign up** for free account
3. **Create a new cluster** (choose M0 free tier)
4. **Wait for cluster** to be created (~2-3 minutes)

### Step 2: Setup Database User
1. **Go to "Database Access"** in Atlas dashboard
2. **Add New Database User**:
   - **Username**: `polydoc_user`
   - **Password**: Generate secure password
   - **Database User Privileges**: Read and write to any database
3. **Click "Add User"**

### Step 3: Setup Network Access
1. **Go to "Network Access"** in Atlas dashboard
2. **Add IP Address**:
   - **Click "Add IP Address"**
   - **Add Current IP Address** (for development)
   - **Or Add 0.0.0.0/0** (allow access from anywhere - for testing only)
3. **Confirm**

### Step 4: Get Connection String
1. **Go to "Databases"** in Atlas dashboard
2. **Click "Connect"** on your cluster
3. **Choose "Connect your application"**
4. **Copy the connection string**, it looks like:
   ```
   mongodb+srv://polydoc_user:<password>@cluster0.xxxxx.mongodb.net/polydoc_ai?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with your actual password

## 🖥️ **Option 2: Local MongoDB Installation**

### For Windows:
1. **Download**: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. **Install** with default settings
3. **Start MongoDB service**:
   ```cmd
   net start MongoDB
   ```
4. **Connection string**: `mongodb://localhost:27017/polydoc_ai`

### For macOS:
```bash
# Install with Homebrew
brew install mongodb/brew/mongodb-community
brew services start mongodb-community
```

### For Linux:
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongod
```

## 🔧 **Configure PolyDoc AI for MongoDB**

### Step 1: Update Environment Variables
Create/update `.env` file:
```env
# MongoDB Configuration
# For Atlas (Cloud):
MONGO_URL=mongodb+srv://polydoc_user:your_password@cluster0.xxxxx.mongodb.net/polydoc_ai?retryWrites=true&w=majority

# For Local MongoDB:
# MONGO_URL=mongodb://localhost:27017/polydoc_ai

# Database Type
DATABASE_TYPE=mongodb

# Other settings...
OPENAI_API_KEY=your_openai_key_here
```

### Step 2: Install MongoDB Dependencies
```bash
pip install pymongo motor  # Add to requirements.txt
```

### Step 3: Update Backend Code
Create `src/core/mongodb_store.py`:
```python
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

class MongoDBStore:
    def __init__(self):
        self.mongo_url = os.getenv('MONGO_URL')
        self.client = None
        self.db = None
        
    async def connect(self):
        self.client = AsyncIOMotorClient(self.mongo_url)
        self.db = self.client.polydoc_ai
        
    async def disconnect(self):
        if self.client:
            self.client.close()

# Global instance
db_store = MongoDBStore()
```

## 📊 **MongoDB Schema for PolyDoc AI**

### Documents Collection
```javascript
// polydoc_ai.documents
{
  "_id": ObjectId("..."),
  "user_id": "firebase_user_uid",
  "filename": "document.pdf",
  "file_size": 1024000,
  "content_type": "application/pdf",
  "upload_date": ISODate("2024-01-01T00:00:00Z"),
  "processed_date": ISODate("2024-01-01T00:05:00Z"),
  "status": "completed", // pending, processing, completed, failed
  "extracted_text": "Full document text...",
  "language": "en",
  "page_count": 10,
  "metadata": {
    "author": "Document Author",
    "creation_date": "2024-01-01",
    "keywords": ["AI", "Document", "Processing"]
  },
  "created_at": ISODate("2024-01-01T00:00:00Z"),
  "updated_at": ISODate("2024-01-01T00:05:00Z")
}
```

### Document Chunks Collection
```javascript
// polydoc_ai.document_chunks
{
  "_id": ObjectId("..."),
  "document_id": ObjectId("..."),
  "user_id": "firebase_user_uid",
  "chunk_index": 0,
  "content": "Text chunk content...",
  "embedding": [0.1, -0.2, 0.3, ...], // 1536 dimensions
  "metadata": {
    "page_number": 1,
    "section": "Introduction"
  },
  "created_at": ISODate("2024-01-01T00:00:00Z")
}
```

### Chat Sessions Collection
```javascript
// polydoc_ai.chat_sessions
{
  "_id": ObjectId("..."),
  "user_id": "firebase_user_uid",
  "document_id": ObjectId("..."),
  "title": "Chat about Document",
  "messages": [
    {
      "role": "user",
      "content": "What is this document about?",
      "timestamp": ISODate("2024-01-01T00:00:00Z")
    },
    {
      "role": "assistant",
      "content": "This document is about...",
      "timestamp": ISODate("2024-01-01T00:00:30Z"),
      "metadata": {
        "tokens_used": 150,
        "model": "gpt-3.5-turbo"
      }
    }
  ],
  "created_at": ISODate("2024-01-01T00:00:00Z"),
  "updated_at": ISODate("2024-01-01T00:05:00Z")
}
```

## 🔍 **Viewing MongoDB Data**

### Option 1: MongoDB Atlas Web Interface
1. **Go to your Atlas cluster**
2. **Click "Browse Collections"**
3. **Navigate through**: `polydoc_ai` → `documents`, `chat_sessions`, etc.
4. **View, edit, and query** your data directly

### Option 2: MongoDB Compass (Desktop App)
1. **Download**: [MongoDB Compass](https://www.mongodb.com/products/compass)
2. **Connect** using your connection string
3. **Browse collections** visually
4. **Run queries** with GUI

### Option 3: Command Line (mongo shell)
```bash
# Connect to Atlas
mongo "mongodb+srv://cluster0.xxxxx.mongodb.net/polydoc_ai" --username polydoc_user

# Or local MongoDB
mongo polydoc_ai

# View collections
show collections

# Query documents
db.documents.find().pretty()

# Query by user
db.documents.find({"user_id": "firebase_uid"}).pretty()

# Query chat sessions
db.chat_sessions.find({"user_id": "firebase_uid"}).pretty()
```

### Option 4: Python Script to View Data
```python
# view_mongodb_data.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def view_data():
    client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
    db = client.polydoc_ai
    
    # View documents
    print("=== DOCUMENTS ===")
    async for doc in db.documents.find():
        print(f"File: {doc['filename']}, User: {doc['user_id'][:8]}...")
    
    # View chat sessions
    print("\n=== CHAT SESSIONS ===")
    async for session in db.chat_sessions.find():
        print(f"Session: {session['title']}, Messages: {len(session.get('messages', []))}")
    
    client.close()

# Run: python view_mongodb_data.py
asyncio.run(view_data())
```

## 📈 **MongoDB Advantages for PolyDoc AI**

### Document Storage
- **Natural JSON structure**: Documents, chunks, and chats fit perfectly
- **Dynamic schema**: Easy to add new fields without migrations
- **Rich queries**: Complex filtering and aggregation

### Vector Search (MongoDB Atlas)
```javascript
// Vector similarity search
db.document_chunks.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: [0.1, -0.2, 0.3, ...],
      numCandidates: 100,
      limit: 10
    }
  }
])
```

### Aggregation Pipelines
```javascript
// Get user's document statistics
db.documents.aggregate([
  { $match: { user_id: "firebase_uid" } },
  { $group: {
      _id: "$status",
      count: { $sum: 1 },
      total_size: { $sum: "$file_size" }
    }
  }
])
```

## 🔐 **Security Best Practices**

### Atlas Security
- **Enable IP Whitelist**: Only allow specific IPs
- **Use strong passwords**: For database users
- **Enable audit logs**: Track database access
- **Regular backups**: Enable automated backups

### Application Security
```python
# Input validation
from bson import ObjectId

def validate_object_id(id_string):
    try:
        return ObjectId(id_string)
    except:
        raise ValueError("Invalid ObjectId")

# User isolation
async def get_user_documents(user_id: str):
    return await db.documents.find({"user_id": user_id}).to_list(None)
```

## 🚀 **Next Steps**

1. **Set up MongoDB Atlas** (free tier)
2. **Update .env file** with connection string
3. **Install dependencies**: `pip install pymongo motor`
4. **Test connection** with sample data
5. **View data** using Atlas web interface

---

**MongoDB is now your document database! Perfect choice for AI applications! 🍃**
