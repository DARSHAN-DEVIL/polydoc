/**
 * Text-to-Speech Utility for PolyDoc
 * Supports multiple languages including English, Hindi, and other Indian languages
 */

// Language codes mapping for better TTS support
const LANGUAGE_VOICE_MAP = {
  'en': 'en-US',
  'en-US': 'en-US',
  'en-GB': 'en-GB',
  'hi': 'hi-IN',
  'hi-IN': 'hi-IN',
  'kn': 'kn-IN',
  'kn-IN': 'kn-IN',
  'ta': 'ta-IN',
  'ta-IN': 'ta-IN',
  'te': 'te-IN',
  'te-IN': 'te-IN',
  'ml': 'ml-IN',
  'ml-IN': 'ml-IN',
  'bn': 'bn-IN',
  'bn-IN': 'bn-IN',
  'gu': 'gu-IN',
  'gu-IN': 'gu-IN',
  'mr': 'mr-IN',
  'mr-IN': 'mr-IN',
  'pa': 'pa-IN',
  'pa-IN': 'pa-IN',
  'or': 'or-IN',
  'or-IN': 'or-IN',
  'as': 'as-IN',
  'as-IN': 'as-IN',
};

// Language names for display
const LANGUAGE_NAMES = {
  'en': 'English',
  'hi': 'Hindi',
  'kn': 'Kannada',
  'ta': 'Tamil',
  'te': 'Telugu',
  'ml': 'Malayalam',
  'bn': 'Bengali',
  'gu': 'Gujarati',
  'mr': 'Marathi',
  'pa': 'Punjabi',
  'or': 'Odia',
  'as': 'Assamese',
};

/**
 * Detect language from text content
 * @param {string} text - Text to analyze
 * @returns {string} - Detected language code
 */
function detectLanguage(text) {
  if (!text || text.trim().length === 0) return 'en';
  
  // Check for Indian language scripts
  const devanagari = /[\u0900-\u097F]/; // Hindi/Marathi
  const kannada = /[\u0C80-\u0CFF]/;
  const tamil = /[\u0B80-\u0BFF]/;
  const telugu = /[\u0C00-\u0C7F]/;
  const malayalam = /[\u0D00-\u0D7F]/;
  const bengali = /[\u0980-\u09FF]/;
  const gujarati = /[\u0A80-\u0AFF]/;
  const gurmukhi = /[\u0A00-\u0A7F]/; // Punjabi
  
  if (devanagari.test(text)) return 'hi';
  if (kannada.test(text)) return 'kn';
  if (tamil.test(text)) return 'ta';
  if (telugu.test(text)) return 'te';
  if (malayalam.test(text)) return 'ml';
  if (bengali.test(text)) return 'bn';
  if (gujarati.test(text)) return 'gu';
  if (gurmukhi.test(text)) return 'pa';
  
  // Default to English for Latin script
  return 'en';
}

/**
 * Clean text for better TTS pronunciation
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
function cleanTextForTTS(text) {
  if (!text) return '';
  
  // Remove markdown formatting
  let cleaned = text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/_([^_]+)_/g, '$1') // Underline
    .replace(/`([^`]+)`/g, '$1') // Code
    .replace(/#{1,6}\s/g, '') // Headers
    .replace(/^\s*[-*+]\s/gm, '') // List markers
    .replace(/^\s*\d+\.\s/gm, '') // Numbered lists
    
  // Remove emojis and special symbols that don't read well
  cleaned = cleaned
    .replace(/[📄📊💡🔍📖📝✅⚠️🔄]/g, '')
    .replace(/•/g, '') // Bullets
    .replace(/\n{3,}/g, '\n\n') // Multiple newlines
    
  // Replace special formatting with pauses
  cleaned = cleaned
    .replace(/\n\n/g, '. ') // Double newline = pause
    .replace(/\n/g, ', ') // Single newline = short pause
    
  return cleaned.trim();
}

/**
 * Get available voices for a specific language
 * @param {string} languageCode - Language code
 * @returns {Promise<SpeechSynthesisVoice[]>} - Array of available voices
 */
async function getVoicesForLanguage(languageCode) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    
    // Function to get voices
    const getVoices = () => {
      const voices = synth.getVoices();
      console.log(`TTS: Available voices:`, voices.map(v => `${v.name} (${v.lang})`));
      
      const targetLang = LANGUAGE_VOICE_MAP[languageCode] || languageCode;
      console.log(`TTS: Looking for voice with language: ${targetLang} (requested: ${languageCode})`);
      
      // Find voices matching the language
      const matchingVoices = voices.filter(voice => 
        voice.lang.startsWith(targetLang) || 
        voice.lang.startsWith(languageCode)
      );
      
      console.log(`TTS: Found ${matchingVoices.length} matching voices for ${languageCode}`);
      
      // If no exact match, try finding any Indian English or English voice for fallback
      if (matchingVoices.length === 0) {
        console.warn(`TTS: No native voice found for ${languageCode}, trying fallback...`);
        
        // For Indian languages, try Indian English first, then any English
        if (languageCode !== 'en') {
          const indianEnglish = voices.filter(voice => voice.lang.startsWith('en-IN'));
          if (indianEnglish.length > 0) {
            console.log(`TTS: Using Indian English voice as fallback`);
            resolve(indianEnglish);
            return;
          }
          
          const anyEnglish = voices.filter(voice => voice.lang.startsWith('en'));
          if (anyEnglish.length > 0) {
            console.log(`TTS: Using English voice as fallback`);
            resolve(anyEnglish);
            return;
          }
        }
        
        // Last resort: use default voice
        console.warn(`TTS: No suitable voice found, using default`);
        resolve([voices[0]]);
      } else {
        console.log(`TTS: Using native voice: ${matchingVoices[0]?.name}`);
        resolve(matchingVoices);
      }
    };
    
    // Chrome loads voices asynchronously
    if (synth.getVoices().length > 0) {
      getVoices();
    } else {
      synth.addEventListener('voiceschanged', getVoices, { once: true });
      // Fallback timeout
      setTimeout(() => getVoices(), 1000);
    }
  });
}

/**
 * Split text into chunks for better TTS handling
 * @param {string} text - Text to split
 * @param {number} maxLength - Maximum chunk length
 * @returns {string[]} - Array of text chunks
 */
function splitTextIntoChunks(text, maxLength = 1000) {
  if (!text) return [];
  
  // If text is short enough, return as single chunk
  if (text.length <= maxLength) return [text];
  
  // Try to split by sentences first (. ! ? followed by space or newline)
  const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [];
  
  // If no sentences found, split by reasonable breaks
  if (sentences.length === 0) {
    // Split by paragraphs or newlines
    const paragraphs = text.split(/\n+/).filter(p => p.trim());
    if (paragraphs.length > 1) {
      return paragraphs;
    }
    // Last resort: split by character limit at word boundaries
    const words = text.split(/\s+/);
    const chunks = [];
    let currentChunk = '';
    
    for (const word of words) {
      if ((currentChunk + ' ' + word).length > maxLength) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = word;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + word;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  }
  
  // Build chunks from sentences
  const chunks = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const potentialChunk = currentChunk + sentence;
    if (potentialChunk.length <= maxLength) {
      currentChunk = potentialChunk;
    } else {
      // Current chunk is full, save it and start new one
      if (currentChunk) chunks.push(currentChunk.trim());
      // If single sentence is longer than maxLength, split it by words
      if (sentence.length > maxLength) {
        const words = sentence.split(/\s+/);
        let wordChunk = '';
        for (const word of words) {
          if ((wordChunk + ' ' + word).length > maxLength) {
            if (wordChunk) chunks.push(wordChunk.trim());
            wordChunk = word;
          } else {
            wordChunk += (wordChunk ? ' ' : '') + word;
          }
        }
        currentChunk = wordChunk;
      } else {
        currentChunk = sentence;
      }
    }
  }
  
  // Don't forget the last chunk
  if (currentChunk && currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Main TTS class for managing speech synthesis
 */
export class TextToSpeech {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.onStateChange = null;
    this.queue = [];
  }
  
  /**
   * Speak the given text in the detected or specified language
   * @param {string} text - Text to speak
   * @param {Object} options - Options for speech
   * @returns {Promise<void>}
   */
  async speak(text, options = {}) {
    const {
      language = null,
      rate = 0.9,
      pitch = 1.0,
      volume = 1.0,
      onStart = null,
      onEnd = null,
      onError = null,
      onPause = null,
      onResume = null,
    } = options;
    
    // Stop any ongoing speech
    this.stop();
    
    console.log('TTS: Original text length:', text.length);
    console.log('TTS: Original text preview:', text.substring(0, 200));
    
    // Detect language if not provided
    const detectedLang = language || detectLanguage(text);
    console.log(`TTS: Detected language: ${detectedLang}`);
    
    const cleanedText = cleanTextForTTS(text);
    console.log('TTS: Cleaned text length:', cleanedText.length);
    console.log('TTS: Cleaned text preview:', cleanedText.substring(0, 200));
    
    if (!cleanedText) {
      console.warn('TTS: No text to speak after cleaning');
      if (onEnd) onEnd();
      return;
    }
    
    // Get voices for the language
    console.log(`TTS: Getting voices for ${detectedLang}...`);
    const voices = await getVoicesForLanguage(detectedLang);
    
    if (voices.length === 0) {
      console.error(`TTS: No voice found for language: ${detectedLang}`);
      console.error('TTS: Cannot proceed without a voice');
      if (onEnd) onEnd();
      return;
    }
    
    console.log(`TTS: Will use voice: ${voices[0].name} (${voices[0].lang})`);
    
    // Split text into manageable chunks (increased from 200 to 2000 for longer content)
    const chunks = splitTextIntoChunks(cleanedText, 2000);
    this.queue = chunks;
    
    console.log(`TTS: Speaking ${chunks.length} chunks, total length: ${cleanedText.length} chars`);
    if (chunks.length > 0) {
      console.log('TTS: First chunk preview:', chunks[0].substring(0, 100) + '...');
    }
    
    // Speak each chunk
    for (let i = 0; i < chunks.length; i++) {
      console.log(`TTS: Speaking chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`);
      
      try {
        await this._speakChunk(chunks[i], {
          voice: voices[0],
          rate,
          pitch,
          volume,
          isFirst: i === 0,
          isLast: i === chunks.length - 1,
          onStart: i === 0 ? onStart : null,
          onEnd: i === chunks.length - 1 ? onEnd : null,
          onError,
          onPause,
          onResume,
        });
        console.log(`TTS: Chunk ${i + 1} completed successfully`);
      } catch (error) {
        console.error(`TTS: Chunk ${i + 1} failed:`, error);
        // Continue to next chunk instead of stopping completely
        if (error.error === 'interrupted') {
          console.log('TTS: Playback was interrupted');
          break;
        }
        // For other errors, try to continue with next chunk
        console.log('TTS: Attempting to continue with next chunk...');
      }
      
      // Stop if interrupted
      if (!this.isPlaying) {
        console.log('TTS: Playback stopped by user');
        break;
      }
    }
    
    console.log('TTS: All chunks completed or stopped');
  }
  
  /**
   * Speak a single chunk of text
   * @private
   */
  _speakChunk(text, options) {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      
      // Set voice and parameters
      if (options.voice) utterance.voice = options.voice;
      utterance.rate = options.rate;
      utterance.pitch = options.pitch;
      utterance.volume = options.volume;
      
      // Event handlers
      utterance.onstart = () => {
        this.isPlaying = true;
        this.isPaused = false;
        if (options.isFirst && options.onStart) options.onStart();
        if (this.onStateChange) this.onStateChange({ playing: true, paused: false });
      };
      
      utterance.onend = () => {
        this.isPlaying = false;
        if (options.isLast && options.onEnd) options.onEnd();
        if (options.isLast && this.onStateChange) {
          this.onStateChange({ playing: false, paused: false });
        }
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        this.isPlaying = false;
        if (options.onError) options.onError(event);
        if (this.onStateChange) this.onStateChange({ playing: false, paused: false, error: event });
        reject(event);
      };
      
      utterance.onpause = () => {
        this.isPaused = true;
        if (options.onPause) options.onPause();
        if (this.onStateChange) this.onStateChange({ playing: true, paused: true });
      };
      
      utterance.onresume = () => {
        this.isPaused = false;
        if (options.onResume) options.onResume();
        if (this.onStateChange) this.onStateChange({ playing: true, paused: false });
      };
      
      // Start speaking
      this.synth.speak(utterance);
    });
  }
  
  /**
   * Pause the current speech
   */
  pause() {
    if (this.isPlaying && !this.isPaused) {
      this.synth.pause();
    }
  }
  
  /**
   * Resume the paused speech
   */
  resume() {
    if (this.isPlaying && this.isPaused) {
      this.synth.resume();
    }
  }
  
  /**
   * Stop the current speech
   */
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.queue = [];
    if (this.onStateChange) this.onStateChange({ playing: false, paused: false });
  }
  
  /**
   * Check if speech synthesis is supported
   * @returns {boolean}
   */
  static isSupported() {
    return 'speechSynthesis' in window;
  }
  
  /**
   * Get all available voices
   * @returns {Promise<SpeechSynthesisVoice[]>}
   */
  static async getAllVoices() {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const getVoices = () => resolve(synth.getVoices());
      
      if (synth.getVoices().length > 0) {
        getVoices();
      } else {
        synth.addEventListener('voiceschanged', getVoices, { once: true });
        setTimeout(() => getVoices(), 1000);
      }
    });
  }
}

// Export utility functions
export {
  detectLanguage,
  cleanTextForTTS,
  getVoicesForLanguage,
  splitTextIntoChunks,
  LANGUAGE_VOICE_MAP,
  LANGUAGE_NAMES,
};

// Default export
export default TextToSpeech;
