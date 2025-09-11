# 🚀 PolyDoc - Launcher Guide

## 📁 Available Launchers

### 🎯 **QUICK_START.bat** (Recommended for Testing)
**Double-click this for instant backend + browser**

- ✅ Starts backend in 4 seconds
- ✅ Opens browser automatically  
- ✅ Perfect for document testing
- ✅ No frontend complexity

**Use this when:** You want to quickly test Hindi/Kannada document processing

---

### 🔥 **RUN_POLYDOC.bat** (Full-Stack)
**Complete solution with frontend + backend**

- ✅ Checks Python & Node.js
- ✅ Starts backend (port 8000)
- ✅ Starts React frontend (port 3000)
- ✅ Opens appropriate URL
- ✅ Shows all service URLs

**Use this when:** You want the complete experience with React UI

---

### ⚡ **start_backend_only.bat** (Simple)
**Just the backend, no browser opening**

- ✅ Basic backend startup
- ✅ Console stays open with logs
- ✅ Manual browser opening

**Use this when:** You want to see backend logs in detail

---

## 🎯 **RECOMMENDED WORKFLOW**

### **For Quick Testing:**
1. Double-click: `QUICK_START.bat`
2. Wait 4 seconds
3. Browser opens to http://localhost:8000
4. Test document upload/processing

### **For Full Development:**
1. Double-click: `RUN_POLYDOC.bat`
2. Wait for both services
3. Frontend opens at http://localhost:3000
4. Backend available at http://localhost:8000

## 📊 **What Each URL Provides**

### **Backend (http://localhost:8000)**
- 🏠 **Main Interface**: Document upload & testing
- 📚 **API Docs**: http://localhost:8000/docs
- ❤️ **Health Check**: http://localhost:8000/health
- 🧪 **Language Test**: Built-in language detection test

### **Frontend (http://localhost:3000)** 
- 🎨 **Modern UI**: React-based interface
- 💬 **Chat Interface**: Document chat functionality
- 📱 **Responsive**: Mobile-friendly design
- 🔄 **Real-time**: WebSocket connections

## 🔧 **Troubleshooting**

### **Too Many Health Checks?**
- Use `QUICK_START.bat` instead - no frontend polling
- Backend standalone doesn't make health check requests

### **Slow Startup?**
- `QUICK_START.bat` starts fastest (4 seconds)
- `RUN_POLYDOC.bat` takes longer due to npm install

### **Frontend Not Opening?**
- Check Node.js is installed
- Use backend-only at http://localhost:8000
- All features work in backend interface

## ✅ **CURRENT STATUS**

Your system now has:

✅ **Working Backend**: Hindi/Kannada processing perfect  
✅ **Multiple Launchers**: Choose based on your needs  
✅ **Browser Integration**: Auto-opens appropriate URL  
✅ **Service Management**: Separate windows for each service  

**Start with `QUICK_START.bat` for immediate results!** 🎉
