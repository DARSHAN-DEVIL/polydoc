# Installing Indian Language TTS Voices on Windows

## Problem
Hindi, Kannada, and other Indian language summaries are being skipped during Text-to-Speech playback, jumping directly to the English "Document Statistics" section.

## Root Cause
**Your Windows system doesn't have Hindi/Kannada TTS voices installed.**

By default, Windows only includes English voices. Indian language voices need to be installed separately.

---

## Solution: Install Indian Language Speech Packs

### Method 1: Windows Settings (Recommended)

#### For Windows 10/11:

1. **Open Settings**
   - Press `Win + I`
   - Or click Start → Settings

2. **Go to Time & Language**
   - Click "Time & Language"
   - Click "Language" (or "Language & Region")

3. **Add Hindi Language**
   - Click "Add a language"
   - Search for "Hindi" (हिंदी)
   - Select "Hindi (India)"
   - Click "Next" and "Install"

4. **Add Kannada Language**
   - Click "Add a language" again
   - Search for "Kannada" (ಕನ್ನಡ)
   - Select "Kannada (India)"
   - Click "Next" and "Install"

5. **Install Speech Features**
   - After adding the language, click on it
   - Click "Options"
   - Under "Speech", click "Download" for Text-to-speech
   - Wait for download to complete (may take 5-10 minutes per language)

6. **Verify Installation**
   - Go to Settings → Time & Language → Speech
   - Under "Choose a voice", you should see Hindi and Kannada voices listed

---

### Method 2: PowerShell (Quick Install)

Run PowerShell as Administrator and execute:

```powershell
# Install Hindi language pack
Add-WindowsCapability -Online -Name "Language.Speech~~~hi-IN~0.0.1.0"

# Install Kannada language pack
Add-WindowsCapability -Online -Name "Language.Speech~~~kn-IN~0.0.1.0"
```

---

### Method 3: Control Panel (Legacy)

1. Open Control Panel
2. Clock and Region → Region
3. Administrative tab
4. Click "Copy settings"
5. Check "Welcome screen and system accounts"
6. Click OK and restart

---

## Available Indian Language Voices on Windows

| Language | Language Code | Windows Support |
|----------|---------------|-----------------|
| Hindi | hi-IN | ✅ Available |
| Kannada | kn-IN | ✅ Available |
| Tamil | ta-IN | ✅ Available |
| Telugu | te-IN | ✅ Available |
| Marathi | mr-IN | ✅ Available |
| Bengali | bn-IN | ✅ Available |
| Gujarati | gu-IN | ✅ Available |
| Malayalam | ml-IN | ⚠️ Limited |
| Punjabi | pa-IN | ⚠️ Limited |

---

## Testing After Installation

### 1. Restart Browser
After installing language packs, **close and restart your browser** (Chrome/Edge/Firefox).

### 2. Check Available Voices
Open browser console (F12) and run:
```javascript
speechSynthesis.getVoices().forEach(voice => {
  console.log(voice.name, '-', voice.lang);
});
```

You should see something like:
```
Microsoft Swara - hi-IN
Microsoft Sundar - hi-IN
Microsoft Gagan - kn-IN
```

### 3. Test in PolyDoc
1. Upload a Hindi or Kannada document
2. Open browser console (F12)
3. Click "Listen" on the summary
4. Check console logs:
   ```
   TTS: Detected language: hi
   TTS: Found 2 matching voices for hi
   TTS: Using native voice: Microsoft Swara (hi-IN)
   ```

---

## Troubleshooting

### Issue: Voices Still Not Available After Installation

**Solution 1: Restart Computer**
- Language packs may require a full restart
- Don't just restart the browser, restart Windows

**Solution 2: Check Windows Update**
- Go to Settings → Update & Security → Windows Update
- Click "Check for updates"
- Install any pending language pack updates

**Solution 3: Verify Language Pack Installation**
```powershell
Get-WindowsCapability -Online | Where-Object {$_.Name -like "*Speech*"}
```

Should show:
```
State: Installed - Language.Speech~~~hi-IN~0.0.1.0
State: Installed - Language.Speech~~~kn-IN~0.0.1.0
```

---

### Issue: Hindi/Kannada Text Still Skipped

**Check Browser Console Logs:**

Press F12 → Console tab → Click "Listen"

**Good Output:**
```
TTS: Detected language: hi
TTS: Found 2 matching voices for hi
TTS: Will use voice: Microsoft Swara (hi-IN)
TTS: Speaking 1 chunks, total length: 1234 chars
```

**Bad Output (No Voice):**
```
TTS: Detected language: hi
TTS: Found 0 matching voices for hi
TTS: No native voice found for hi, trying fallback...
TTS: Using English voice as fallback
```

If you see "Using English voice as fallback", the language pack isn't properly installed.

---

### Issue: Console Shows "Using English voice as fallback"

This means:
1. Language detected correctly (Hindi/Kannada)
2. But no native voice found
3. System falls back to English voice

**Fix:**
1. Verify language pack is installed (Settings → Language)
2. Check "Text-to-speech" is downloaded for that language
3. Restart browser completely
4. If still doesn't work, restart Windows

---

## What Happens Without Indian Voices

When Hindi/Kannada voices are not available:

1. **Text is detected** as Hindi/Kannada ✅
2. **No native voice found** ❌
3. **Falls back to English voice** ⚠️
4. **English voice can't pronounce Devanagari/Kannada script** ❌
5. **TTS skips that text and moves to next English section** ❌

**Result:** You only hear the "Document Statistics" part (which is in English).

---

## Alternative: Use Online TTS Services

If you can't install language packs, you can use:

### Option 1: Google Cloud Text-to-Speech
- Supports 220+ voices in 40+ languages
- Including Hindi, Kannada, Tamil, Telugu
- Requires API key and paid service

### Option 2: Microsoft Azure Speech
- WavNet quality voices
- Supports Indian languages
- Pay-as-you-go pricing

### Option 3: Browser Extensions
- "Read Aloud" extension for Chrome
- "Natural Reader" extension
- These often have built-in multilingual support

---

## Quick Fix Summary

1. ✅ **Install Hindi language pack** (Settings → Language → Add Hindi)
2. ✅ **Download Text-to-speech** for Hindi (Language Options → Speech)
3. ✅ **Install Kannada language pack** (same steps)
4. ✅ **Restart browser**
5. ✅ **Test in PolyDoc**

**Expected Result:**
- Hindi summaries read in Hindi voice
- Kannada summaries read in Kannada voice
- English sections read in English voice
- Complete, uninterrupted playback

---

## Verification Checklist

After installation:

- [ ] Hindi language pack installed
- [ ] Kannada language pack installed
- [ ] Speech features downloaded for both
- [ ] Browser restarted
- [ ] Console shows: "Found X matching voices for hi"
- [ ] Console shows: "Using native voice: Microsoft [Name]"
- [ ] Hindi/Kannada text plays without skipping
- [ ] Full summary plays from start to finish

---

## Support

If you still face issues after following all steps:

1. **Check Windows version**: Language packs require Windows 10 version 1803 or later
2. **Check browser**: Chrome/Edge have best support for TTS
3. **Check console logs**: Share the TTS console output for debugging
4. **Try with English document first**: Verify TTS works at all

---

## Example: What You Should See in Console

### With Hindi Voice Installed:
```
TTS: Original text length: 2456
TTS: Detected language: hi
TTS: Available voices: ["Microsoft Swara - hi-IN", "Microsoft Sundar - hi-IN", ...]
TTS: Looking for voice with language: hi-IN
TTS: Found 2 matching voices for hi
TTS: Using native voice: Microsoft Swara (hi-IN)
TTS: Speaking 1 chunks, total length: 2456 chars
TTS: Speaking chunk 1/1 (2456 chars)
TTS: Chunk 1 completed successfully
```

### Without Hindi Voice (Current Issue):
```
TTS: Original text length: 2456
TTS: Detected language: hi
TTS: Available voices: ["Microsoft David - en-US", "Microsoft Zira - en-US"]
TTS: Looking for voice with language: hi-IN
TTS: Found 0 matching voices for hi
TTS: No native voice found for hi, trying fallback...
TTS: Using English voice as fallback
[Text skips because English voice can't read Hindi]
```

---

**After installing the language packs, you should be able to hear the complete summary in the appropriate language!**
