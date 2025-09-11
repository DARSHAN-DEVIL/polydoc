# 🚀 Getting Started - New Laptop Quick Setup

## Step-by-Step Instructions

### 📋 Before You Start
Make sure you have:
- **At least 10GB free disk space**
- **Stable internet connection** (for downloading AI models)
- **Administrator privileges** (for software installation)

---

## 🔧 Step 1: Install Required Software

### Install Python 3.9+
1. Go to https://python.org/downloads/
2. Download latest Python 3.9+ for Windows
3. **✅ CRITICAL**: Check "Add Python to PATH" during installation
4. Verify: Open Command Prompt and run `python --version`

### Install Node.js 18+
1. Go to https://nodejs.org/
2. Download LTS version for Windows
3. Install with default settings
4. Verify: Open Command Prompt and run `node --version` and `npm --version`

### Install MongoDB (Optional)
1. Go to https://mongodb.com/try/download/community
2. Download Community Server for Windows
3. Install as Windows Service
4. Verify: Run `mongod --version`

---

## 📥 Step 2: Clone and Setup Project

```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd polydoc

# Configure Git (IMPORTANT for new laptop)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Run one-time setup script
init-setup.bat
```

The setup script will:
- ✅ Check system requirements
- ✅ Check disk space
- ✅ Install Python dependencies (5-10 minutes)
- ✅ Install Node.js dependencies (2-5 minutes)  
- ✅ Create required directories
- ✅ Test core components

---

## 🚀 Step 3: Start the System

```bash
# Start everything with one command
start-all.bat
```

**What happens:**
1. **Cache Optimization** - Cleans up any incomplete downloads
2. **MongoDB** - Starts database (if installed)
3. **Backend** - Starts AI backend on port 8000
4. **Frontend** - Starts web interface on port 3003
5. **Browser** - Opens http://localhost:3003 automatically

---

## ⏱️ Timing Expectations

### First Run (AI Model Downloads)
- **Time**: 5-10 minutes
- **Progress**: Shows "Loading embedding models (1/4)..." etc.
- **What's happening**: Downloading BART, RoBERTa, sentence transformers
- **Size**: ~3-4GB of AI models

### Subsequent Runs
- **Time**: 30-60 seconds  
- **What's happening**: Loading cached models from disk
- **Much faster**: No downloads needed

---

## 🎯 Success Indicators

You'll know it's working when you see:

### Backend Window
```
✅ Document Processor with multilingual OCR ready
✅ AI Model Manager initialized with optimizations  
✅ MongoDB integration ready
🎉 PolyDoc AI fully loaded - Hindi/Kannada processing ready!
```

### Frontend Browser
- URL: http://localhost:3003
- No "Cannot connect to backend" error
- Shows "Document Assistant" with upload area
- No "Models are still loading..." message

---

## 🧪 Quick Test

1. **Upload a document**: Try a PDF or DOCX file
2. **Check language detection**: Upload Hindi/Kannada text
3. **Test chat**: Ask a question about your document
4. **Verify processing**: Check document appears in "Recent Documents"

---

## 🚨 If Something Goes Wrong

### "Cannot connect to backend"
```bash
# Check if backend is running
netstat -an | findstr :8000

# If not running, restart
python main.py
```

### "Models are still loading"  
- **Just wait**: First run takes time
- **Check space**: Run `python optimize_cache.py`
- **Check logs**: Look at backend command window

### "Out of disk space"
- **Free up space**: Need 10GB+ available
- **Move cache**: Models download to `C:\Users\<name>\.cache\huggingface`
- **Use simple mode**: Run `python simple_backend.py` instead

### Module errors
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
npm install
```

### Git push fails or exits early
```bash
# Configure Git credentials (first time)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set up GitHub authentication (choose one):
# Option A: Personal Access Token (recommended)
# Go to GitHub → Settings → Developer settings → Personal access tokens
# Generate token and use as password

# Option B: SSH key setup
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
# Add the public key to GitHub SSH keys

# Check branch name (might be master vs main)
git branch
# If on master branch, push to master:
git push origin master
# If on main branch:
git push origin main
```

---

## 📞 Getting Help

1. **Check logs**: Backend command window shows detailed errors
2. **Run diagnostics**: `python optimize_cache.py`
3. **Read guide**: Full troubleshooting in [SETUP_GUIDE.md](./SETUP_GUIDE.md)
4. **Create issue**: Include error messages and system specs

---

## 🎉 You're Ready!

Once everything is running:
- **Upload documents** in PDF, DOCX, PPTX, or image format
- **Test Hindi/Kannada processing** with native language documents  
- **Chat with documents** using the AI assistant
- **Explore features** like summarization and search

**Happy document processing! 🚀**
