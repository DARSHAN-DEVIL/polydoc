# 🚀 PolyDoc AI - Quick Start Guide

## ✅ Demo Mode Removed ✅
The application now runs with **real Firebase authentication** only. No more demo mode confusion!

## 🔧 **Step 1: Firebase Setup (Required)**

1. **Create Firebase Project**: [Firebase Console](https://console.firebase.google.com/)
2. **Enable Authentication**: Google sign-in method
3. **Create Firestore Database**: Start in test mode
4. **Get Config**: Copy your Firebase config
5. **Update**: `src/config/firebase.js` with your actual Firebase config

**Detailed instructions**: See `FIREBASE-SETUP.md`

## 🗄️ **Step 2: Backend Database (Optional but Recommended)**

1. **Copy environment file**: `cp .env.example .env`
2. **Update .env file** with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_key_here
   DATABASE_URL=sqlite:///./polydoc.db
   ```
3. **Install Python dependencies**: `pip install -r requirements.txt`

**Detailed instructions**: See `DATABASE-SETUP.md`

## 🏃‍♂️ **Step 3: Run the Application**

### **Full Stack (Recommended)**
```cmd
run-fullstack.bat
```
- ✅ Python backend API server
- ✅ React frontend with hot reload
- ✅ Real Google authentication
- ✅ Document upload and AI chat

### **Frontend Only** 
```cmd
run-dev.bat
```
- ✅ React development server
- ⚠️ Limited functionality without backend

## 🌐 **Access URLs**

- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:8000 
- **API Docs**: http://localhost:8000/docs

## 🎯 **What Works Now**

### ✅ **Frontend Features**
- 🎨 **Beautiful landing page** with animations
- 🔐 **Real Google OAuth** (no more demo mode!)
- 🌙 **Dark/Light mode toggle**
- 📱 **Responsive design** 
- 🔒 **Protected dashboard routes**

### ✅ **Backend Features**
- 📄 **Document upload & processing**
- 🤖 **AI-powered document chat**
- 🔍 **Vector similarity search**
- 💾 **SQLite/PostgreSQL storage**
- 🔑 **Firebase token validation**

### ✅ **Authentication Flow**
1. User clicks "Sign In" → Real Google OAuth popup
2. Sign in with Google account → Get Firebase token
3. Redirect to dashboard → Access protected features
4. Upload documents → Chat with AI about them

## 🐛 **Troubleshooting**

### Firebase Errors
- **Check your Firebase config** in `src/config/firebase.js`
- **Make sure Google sign-in is enabled** in Firebase Console
- **Verify project ID and API key** are correct

### Backend Errors
- **Check .env file** has correct values
- **Install Python dependencies**: `pip install -r requirements.txt`
- **Check port 8000** is not in use

### Frontend Not Loading
- **Clear browser cache** and hard refresh (Ctrl+F5)
- **Check browser console** for errors
- **Restart development server**

## 📂 **Project Structure**

```
polydoc-ai/
├── src/                          # Frontend React code
│   ├── components/              # Reusable UI components
│   ├── contexts/               # React contexts (auth, theme)
│   ├── pages/                  # Page components
│   └── config/                 # Firebase configuration
├── main.py                     # Python backend entry point
├── src/                        # Python backend code
│   ├── api/                   # FastAPI routes
│   ├── core/                  # Core business logic
│   └── models/                # Database models
├── FIREBASE-SETUP.md          # Firebase configuration guide
├── DATABASE-SETUP.md          # Backend database guide  
├── run-fullstack.bat          # Run both servers
└── run-dev.bat               # Run frontend only
```

## 🎉 **Next Steps**

1. **Set up Firebase** (required for auth)
2. **Configure OpenAI API** (required for AI features)
3. **Run full stack** with `run-fullstack.bat`
4. **Upload a document** and start chatting!

---

**Need help?** Check the detailed setup guides:
- 🔥 Firebase: `FIREBASE-SETUP.md`
- 📊 Database: `DATABASE-SETUP.md`
- 🏃 Running: `RUN-FRONTEND.md`
