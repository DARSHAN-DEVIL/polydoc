# PolyDoc Startup Guide

This guide will help you resolve all the current issues with your PolyDoc installation and get it running smoothly.

## Current Issues Summary

Based on the error logs, you're experiencing:
1. MongoDB connection failures (MongoDB not running)
2. Firebase offline/authentication issues
3. CORS/browser policy errors
4. Document upload failures due to missing dependencies

## Step-by-Step Solution

### 1. Start MongoDB (CRITICAL)

**Option A: Using the provided script**
```powershell
# Navigate to project directory
cd "D:\Poly-Doc-Ai\polydoc"

# Run the MongoDB startup script
.\start_mongodb.bat
```

**Option B: Manual startup**
```powershell
# Create data directory if it doesn't exist
mkdir -Force "C:\data\db"

# Start MongoDB
mongod --dbpath "C:\data\db"
```

**Keep this terminal window open** - MongoDB will run in this window. You'll see logs like:
```
[initandlisten] waiting for connections on port 27017
```

### 2. Verify MongoDB Connection

In a **new terminal**, test the connection:
```powershell
# Test MongoDB connection
python setup_mongodb.py
```

You should see:
```
✅ MongoDB is running and accessible
✅ Connection test successful
```

### 3. Start the Backend Server

In another **new terminal**:
```powershell
cd "D:\Poly-Doc-Ai\polydoc"

# Start the FastAPI backend
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

Wait for the initialization to complete. You should see:
```
INFO: System ready!
INFO: AI models loaded successfully
```

### 4. Start the Frontend

In another **new terminal**:
```powershell
cd "D:\Poly-Doc-Ai\polydoc"

# Start the React frontend
npm start
```

The browser should open to `http://localhost:3000`

### 5. Test the System

1. **Check health endpoint**: Visit `http://localhost:8000/health`
2. **Test Firebase auth**: Try to sign in with Google
3. **Upload a document**: Try uploading a small PDF
4. **Ask a question**: Test the chat functionality

## Troubleshooting Common Issues

### MongoDB Won't Start

**Error**: `mongod: command not found` or similar
**Solution**: Install MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

**Error**: `Data directory not found`
**Solution**: Run the startup script which creates the directory automatically

### Firebase Offline Errors

**Symptoms**: "client is offline" errors in browser console

**Solution 1**: Check your internet connection and firewall

**Solution 2**: Verify Firebase config in `.env`:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

**Solution 3**: Try clearing browser cache and cookies

### CORS Errors

**Symptoms**: Cross-origin errors in browser console

**Solution**: The backend is configured to allow all origins. If you still see CORS errors:
1. Ensure both frontend (port 3000) and backend (port 8000) are running
2. Check that you're accessing the frontend via `http://localhost:3000`
3. Try in an incognito/private browser window

### Document Upload Failures

**Symptoms**: "Internal Server Error" during upload

**Solution**: Check the backend terminal for specific error messages. Common causes:
1. MongoDB not running (see step 1)
2. AI models not initialized (wait for "System ready!" message)
3. File too large or unsupported format

### AI Models Not Loading

**Symptoms**: "AI models not initialized" errors

**Solution**: 
1. Ensure you have enough RAM (models need ~2GB)
2. Check internet connection (models are downloaded on first run)
3. Wait longer - initial model download can take 5-10 minutes
4. Check backend logs for specific model loading errors

## System Requirements

- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: 5GB free space for models and data
- **Network**: Internet connection for initial model download
- **Ports**: 3000 (frontend), 8000 (backend), 27017 (MongoDB)

## Terminal Windows You Should Have Open

1. **MongoDB Server**: Running `mongod` command (keep open)
2. **Backend Server**: Running `uvicorn` command (keep open)
3. **Frontend Server**: Running `npm start` command (keep open)
4. **Optional**: Additional terminal for testing commands

## Success Indicators

✅ **MongoDB**: Logs show "waiting for connections on port 27017"
✅ **Backend**: Logs show "System ready!" and "AI models loaded successfully"
✅ **Frontend**: Browser opens to working React app
✅ **Health Check**: `http://localhost:8000/health` returns status "healthy"

## Getting Help

If you encounter issues:

1. **Check logs**: Look at the terminal outputs for specific error messages
2. **Test components individually**: Use the health endpoint to check backend status
3. **Restart services**: Sometimes a clean restart of all services helps
4. **Check ports**: Ensure no other applications are using ports 3000, 8000, or 27017

## Quick Status Check Commands

```powershell
# Check if MongoDB is running
netstat -an | findstr "27017"

# Check if backend is running
netstat -an | findstr "8000"

# Check if frontend is running
netstat -an | findstr "3000"

# Test backend health
curl http://localhost:8000/health

# Test MongoDB connection
python setup_mongodb.py
```

---

**Note**: Always start MongoDB first, then the backend, then the frontend. This ensures proper initialization order.
