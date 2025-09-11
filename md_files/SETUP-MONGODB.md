# 🚀 PolyDoc AI - MongoDB Setup Guide for Teammates

**Updated Version: 2.0.0 with MongoDB Integration**

This guide will help you set up PolyDoc AI with the new MongoDB backend on your local machine.

## 🎯 What Changed?

- **Database**: SQLite/FAISS → **MongoDB** (primary storage + vector search)
- **Vector Storage**: Built-in MongoDB vector operations (no more FAISS dependency)
- **User Isolation**: All data is now properly isolated by Firebase user ID
- **Scalability**: Ready for production deployment

---

## 📋 Prerequisites

Before you start, make sure you have:

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **Git** installed
- **MongoDB** access (Atlas cloud OR local installation)
- **Firebase project** (for authentication)

---

## 🛠️ Initial Setup Commands

### **Step 1: Clone and Navigate**
```bash
git clone <repository-url>
cd D:\Poly-Doc-Ai\polydoc
```

### **Step 2: Set Up MongoDB**

#### **Option A: MongoDB Atlas (Recommended - Cloud)**
1. **Go to** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create free account** and cluster (M0 tier is free)
3. **Create database user**:
   - Username: `polydoc_user`
   - Password: Generate secure password
4. **Whitelist your IP** (or 0.0.0.0/0 for development)
5. **Get connection string**: 
   ```
   mongodb+srv://polydoc_user:your_password@cluster0.xxxxx.mongodb.net/polydoc_ai?retryWrites=true&w=majority
   ```

#### **Option B: Local MongoDB**
```bash
# Windows (with Chocolatey)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
# Then start the service:
net start MongoDB
```

### **Step 3: Environment Configuration**
```bash
# Copy environment template
copy .env.example .env

# Edit .env file with your actual values:
# - MONGO_URL=your_mongodb_connection_string
# - Firebase credentials (from Firebase console)
# - OpenAI API key (optional, for enhanced features)
```

### **Step 4: Install Dependencies**

#### **Backend (Python) Dependencies**
```bash
# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt
```

#### **Frontend (Node.js) Dependencies**
```bash
# Install Node.js packages
npm install
```

### **Step 5: Firebase Setup**
1. **Go to** [Firebase Console](https://console.firebase.google.com/)
2. **Create project** or use existing one
3. **Enable Authentication** → Sign-in methods → Google
4. **Enable Firestore** (for user profiles only)
5. **Get config** from Project Settings → Your apps
6. **Update** `src/config/firebase.js` with your config values

---

## ⚡ Running the Application

### **Quick Start (Recommended)**
```bash
# This starts both frontend and backend
run-fullstack.bat
```

### **Manual Start (Development)**

#### **Terminal 1: Backend (MongoDB + Python)**
```bash
# Activate virtual environment
venv\Scripts\activate

# Start backend server
python main.py
# Backend will be at: http://localhost:8000
```

#### **Terminal 2: Frontend (React + Vite)**
```bash
# Start frontend development server
npm run dev
# Frontend will be at: http://localhost:3003
```

---

## 🔍 Verifying the Setup

### **1. Check Backend Health**
Visit: http://localhost:8000/health

Should show:
```json
{
  "status": "healthy",
  "mongodb_ready": true,
  "models_ready": true
}
```

### **2. Check Frontend**
Visit: http://localhost:3003

Should show:
- Landing page with Google Sign-In
- Dark/Light mode toggle
- No console errors

### **3. Test MongoDB Connection**
```bash
# View MongoDB data
python view-mongodb-data.py

# Should show:
# ✅ Connected to MongoDB database: polydoc_ai
# 📊 DATABASE INFORMATION
```

---

## 🗃️ Database Structure

### **MongoDB Collections:**
- **`documents`**: Document metadata and processing status
- **`document_chunks`**: Text chunks with vector embeddings
- **`chat_sessions`**: Chat conversations and history
- **`users`**: User management (optional)

### **Firebase (Still Used For):**
- **User authentication** (Google OAuth)
- **User profiles** and preferences
- **Real-time session management**

---

## 🚨 Common Issues & Solutions

### **MongoDB Connection Issues**
```bash
# Check your connection string format:
# mongodb+srv://username:password@cluster.mongodb.net/database?options

# Test connection:
python -c "import os; from motor.motor_asyncio import AsyncIOMotorClient; print('Testing MongoDB...')"
```

### **Firebase Authentication Issues**
1. **Check Firebase config** in `src/config/firebase.js`
2. **Verify domain whitelist** in Firebase Console
3. **Ensure Google OAuth is enabled**

### **Python Package Issues**
```bash
# If you get import errors:
pip install --upgrade -r requirements.txt

# If motor/pymongo issues:
pip install motor pymongo --upgrade
```

### **Frontend Build Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# If Vite issues:
npm run build
```

---

## 🧪 Testing Your Setup

### **1. Upload a Document**
1. **Sign in** with Google
2. **Upload** a PDF/DOCX file
3. **Check MongoDB**: `python view-mongodb-data.py docs`
4. **Should see** your document processed

### **2. Chat with Document**
1. **Ask a question** about your uploaded document
2. **Should get** AI-powered response with page references
3. **Check chat history** in MongoDB

### **3. View Your Data**
```bash
# View all your data (replace with your Firebase UID)
python view-mongodb-data.py user YOUR_FIREBASE_USER_ID

# Export your data
python view-mongodb-data.py export YOUR_FIREBASE_USER_ID
```

---

## 📊 Accessing Your Data

### **MongoDB Atlas Dashboard**
- Go to your Atlas cluster
- Click "Browse Collections"
- Navigate: `polydoc_ai` → `documents`, `document_chunks`, etc.

### **MongoDB Compass (Desktop App)**
- Download: [MongoDB Compass](https://www.mongodb.com/products/compass)
- Connect with your connection string
- Visual interface for browsing data

### **Command Line Tools**
```bash
# View data via Python script
python view-mongodb-data.py

# Export user data
python view-mongodb-data.py export YOUR_USER_ID

# Get statistics
python view-mongodb-data.py stats
```

### **Firebase Console**
- Go to [Firebase Console](https://console.firebase.google.com)
- Your Project → Firestore Database
- Browse user profiles and preferences

---

## 🚀 Production Deployment

### **Environment Variables for Production**
```bash
# Set these in your production environment:
MONGO_URL=mongodb+srv://user:pass@production-cluster.mongodb.net/polydoc_ai
DATABASE_TYPE=mongodb
OPENAI_API_KEY=your_production_key
DEBUG=False
```

### **MongoDB Security**
- **Enable authentication**
- **Use SSL/TLS**
- **Restrict IP access**
- **Enable audit logging**

### **Firebase Security**
- **Update Firestore rules**
- **Configure authorized domains**
- **Enable App Check** for production

---

## 🤝 Team Collaboration

### **Sharing MongoDB Data**
```bash
# Export data for sharing
python view-mongodb-data.py export user_id shared_data.json

# Each team member needs their own Firebase account
# But can share the same MongoDB cluster
```

### **Git Workflow**
```bash
# Always pull latest changes
git pull origin main

# Install any new dependencies
pip install -r requirements.txt
npm install

# Check if MongoDB connection still works
python view-mongodb-data.py
```

### **Environment Management**
- **Never commit** `.env` file
- **Share** `.env.example` with new values
- **Each developer** needs their own Firebase project for testing

---

## 📞 Need Help?

### **Quick Diagnostics**
```bash
# Check system status
curl http://localhost:8000/health

# Check MongoDB data
python view-mongodb-data.py stats

# Check logs
tail -f polydoc_ai.log
```

### **Common Commands**
```bash
# Restart everything
run-fullstack.bat

# View latest documents
python view-mongodb-data.py docs 5

# Check specific user's data
python view-mongodb-data.py user YOUR_USER_ID

# Export and backup data
python view-mongodb-data.py export YOUR_USER_ID backup.json
```

---

## 🎉 You're All Set!

Your PolyDoc AI installation with MongoDB is now ready! 

**Key URLs:**
- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **MongoDB Admin**: http://localhost:8000/admin/mongodb-data

**Next Steps:**
1. **Sign in** with your Google account
2. **Upload** some documents to test
3. **Chat** with your documents
4. **Explore** the MongoDB data structure
5. **Share** your setup experience with the team!

---

*Happy coding! 🚀*
