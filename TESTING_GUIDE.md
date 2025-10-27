# Quick Testing Guide for PolyDoc Fixes

## 🚀 Start the Application

```bash
# Terminal 1: Start Backend
cd C:\darshan\polydoc
python start_backend.py
# Wait for "Application startup complete" message

# Terminal 2: Start Frontend
npm run dev
# Open http://localhost:5173 (or shown port)
```

## ✅ Test Checklist

### Test 1: JPG Processing (2 minutes)
1. Click "Upload Document"
2. Select any JPG/JPEG image file
3. ✅ **Expected:** File uploads successfully without errors
4. ✅ **Expected:** OCR extracts text from the image
5. ❌ **Before Fix:** Error "name 'time' is not defined"

### Test 2: Larger Summary Window (1 minute)
1. Upload any document (PDF, DOCX, TXT)
2. Look at the summary display area
3. ✅ **Expected:** Chat window is taller (600px vs 400px before)
4. ✅ **Expected:** Summary is fully visible with less scrolling
5. ✅ **Expected:** Multi-line summaries display comfortably

### Test 3: Text-to-Speech - Basic (3 minutes)
1. Look at the top-right header
2. ✅ **Expected:** See volume icon (🔊 or 🔇)
3. Upload a document
4. Wait for summary to appear
5. ✅ **Expected:** Audio starts playing automatically (if volume icon is blue)
6. ✅ **Expected:** You hear the summary being read aloud
7. Look for volume icon on the summary message
8. ✅ **Expected:** See "Playing..." with pause/stop controls

### Test 4: TTS Controls (3 minutes)
1. While audio is playing:
   - Click **Pause** ⏸️
   - ✅ **Expected:** Audio pauses
   - Click **Play** ▶️
   - ✅ **Expected:** Audio resumes from where it paused
   - Click **Stop** 🔇
   - ✅ **Expected:** Audio stops completely

2. Toggle TTS in header:
   - Click volume icon to turn red/gray
   - ✅ **Expected:** TTS disabled, no audio plays
   - Click again to turn blue
   - ✅ **Expected:** TTS enabled again

### Test 5: Manual TTS Playback (2 minutes)
1. Upload document and wait for summary
2. Don't auto-play (or stop it)
3. Click volume icon (🔊) on any message
4. ✅ **Expected:** That specific message plays
5. ✅ **Expected:** Can play different messages independently

### Test 6: Multi-language TTS (5 minutes)
**English Document:**
1. Upload English document
2. ✅ **Expected:** English voice speaks

**Hindi Document (if available):**
1. Upload Hindi document (or create text file with Hindi content)
2. ✅ **Expected:** Hindi voice speaks
3. ✅ **Expected:** Pronunciation is appropriate for Hindi

**Other Languages:**
1. Try Kannada, Tamil, Telugu documents if available
2. ✅ **Expected:** Appropriate language voice is used
3. ⚠️ **Note:** Voice availability depends on your OS and browser

### Test 7: Comprehensive Q&A (3 minutes)
1. Upload a detailed document (multi-page PDF works best)
2. Ask a specific question about the content
3. ✅ **Expected:** Response includes:
   - "According to the document:"
   - "Most Relevant Information" section
   - "Supporting Information" section
   - Multiple sentences (8-12) answering your question
   - Well-organized, detailed response
4. Try asking another question
5. ✅ **Expected:** Comprehensive answer again

## 🎯 Quick Pass/Fail Check

### PASS Criteria (All should be ✅):
- [ ] JPG files upload and process successfully
- [ ] Summary window is visibly taller
- [ ] Audio plays when document is uploaded
- [ ] Can hear summaries in appropriate language
- [ ] Play/pause/stop controls work
- [ ] Can toggle TTS on/off in header
- [ ] Questions get detailed, multi-sentence answers
- [ ] TTS controls appear on each AI message

### FAIL Indicators (None should occur):
- [ ] ❌ "name 'time' is not defined" error
- [ ] ❌ Summary window feels cramped
- [ ] ❌ No audio plays at all
- [ ] ❌ Controls don't respond
- [ ] ❌ Q&A answers are too brief (1-2 sentences only)
- [ ] ❌ TTS icon not visible in header

## 🔧 Troubleshooting

### No Audio Playing
1. Check browser console (F12) for errors
2. Verify browser supports Web Speech API
   - ✅ Chrome/Edge: Full support
   - ✅ Firefox: Good support
   - ⚠️ Safari: Limited support
3. Check if TTS is enabled (blue volume icon in header)
4. Try clicking manual play on a message

### Wrong Language Voice
1. Check your OS language settings
2. Windows: Settings > Time & Language > Speech
3. Install additional language packs if needed
4. Restart browser after installing languages

### JPG Still Failing
1. Check backend logs in terminal
2. Verify Python packages are installed:
   ```bash
   pip install opencv-python pillow easyocr pytesseract
   ```
3. Check if image file is corrupted
4. Try a different JPG file

### Summary Window Not Bigger
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check if Dashboard.jsx has h-[600px] on line 987

## 📊 Expected Results Summary

| Feature | Before | After | Status |
|---------|--------|-------|--------|
| JPG Processing | ❌ Error | ✅ Works | Fixed |
| Summary Height | 400px | 600px | Improved |
| TTS Feature | ❌ None | ✅ Full | Added |
| Q&A Detail | ~5 sentences | 8-12 sentences | Enhanced |
| Language Support | English only | 12+ languages | Added |

## 🎉 Success Indicators

You've successfully verified all fixes if:
1. ✅ Uploaded and processed a JPG file without errors
2. ✅ See a noticeably larger summary display area
3. ✅ Heard summaries read aloud automatically
4. ✅ Successfully used play/pause/stop controls
5. ✅ Toggled TTS on/off globally
6. ✅ Received detailed, comprehensive answers to questions
7. ✅ Tested with at least 2 different file types

## 📞 Need Help?

If tests fail:
1. Check `FIXES_CHANGELOG.md` for detailed technical information
2. Review browser console (F12) for errors
3. Check backend terminal for Python errors
4. Verify all dependencies are installed
5. Try restarting both backend and frontend

---

**Estimated Total Testing Time:** 15-20 minutes
**Recommended:** Test each feature at least once
**Optional:** Test with multiple document types and languages
