#!/usr/bin/env python3
"""
Test script for Indian language detection and processing in PolyDoc
"""
import sys
import logging
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.utils.indian_language_detector import IndianLanguageDetector, detect_indian_language

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_language_detection():
    """Test language detection for Hindi and Kannada text"""
    
    # Test texts
    test_texts = {
        'hindi': 'यह एक हिंदी पाठ का उदाहरण है। हमें इसे सही तरीके से पहचानना चाहिए।',
        'kannada': 'ಇದು ಕನ್ನಡ ಪಠ್ಯದ ಒಂದು ಉದಾಹರಣೆಯಾಗಿದೆ। ನಾವು ಇದನ್ನು ಸರಿಯಾಗಿ ಗುರುತಿಸಬೇಕು।',
        'english': 'This is an example of English text. We should identify this correctly.',
        'mixed_hindi': 'This is mixed text with हिंदी और English words together.',
        'mixed_kannada': 'This is mixed text with ಕನ್ನಡ and English words together.'
    }
    
    detector = IndianLanguageDetector()
    
    print("=" * 60)
    print("LANGUAGE DETECTION TEST RESULTS")
    print("=" * 60)
    
    for lang_type, text in test_texts.items():
        print(f"\n🔍 Testing {lang_type.upper()} text:")
        print(f"Text: {text}")
        print("-" * 50)
        
        try:
            detection = detector.detect_language(text)
            print(f"✅ Detected Language: {detection.language_name} ({detection.language_code})")
            print(f"   Native Name: {detection.native_name}")
            print(f"   Script: {detection.script}")
            print(f"   Family: {detection.family}")
            print(f"   Confidence: {detection.confidence:.2f}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Test multiple language detection
    print("\n" + "=" * 60)
    print("MULTIPLE LANGUAGE DETECTION TEST")
    print("=" * 60)
    
    mixed_text = "This document contains multiple languages including हिंदी text and ಕನ್ನಡ content as well."
    print(f"Mixed text: {mixed_text}")
    print("-" * 50)
    
    try:
        multiple_detections = detector.detect_multiple_languages(mixed_text, threshold=0.1)
        print(f"✅ Detected {len(multiple_detections)} languages:")
        for i, detection in enumerate(multiple_detections, 1):
            print(f"   {i}. {detection.language_name} ({detection.language_code}) - Confidence: {detection.confidence:.2f}")
    except Exception as e:
        print(f"❌ Error in multiple language detection: {e}")

def test_ocr_setup():
    """Test OCR initialization with Indian languages"""
    print("\n" + "=" * 60)
    print("OCR SETUP TEST")
    print("=" * 60)
    
    try:
        import easyocr
        
        # Test with current configuration
        print("Testing current OCR configuration...")
        current_langs = ['en', 'hi']  # Start with a simple, compatible combination
        reader = easyocr.Reader(current_langs)
        print(f"✅ Current OCR initialized with: {current_langs}")
        
        # Test with additional Indian languages
        print("\nTesting extended Indian language support...")
        # Common EasyOCR language codes for Indian languages
        indian_langs = ['hi', 'bn', 'te', 'kn', 'ml', 'ta', 'gu', 'pa', 'or']
        
        for lang in indian_langs:
            try:
                test_reader = easyocr.Reader(['en', lang])
                print(f"✅ {lang} - Supported")
                del test_reader  # Clean up memory
            except Exception as e:
                print(f"❌ {lang} - Not supported: {e}")
                
    except Exception as e:
        print(f"❌ OCR test failed: {e}")

def test_document_processing():
    """Test basic document processing functionality"""
    print("\n" + "=" * 60)
    print("DOCUMENT PROCESSING TEST")
    print("=" * 60)
    
    try:
        from src.core.document_processor import DocumentProcessor
        
        processor = DocumentProcessor()
        print("✅ DocumentProcessor initialized successfully")
        print(f"   Supported formats: {processor.supported_formats}")
        
        # Test language detection within document processor
        print("\nTesting document processor language detection...")
        
        test_texts = {
            'hindi': 'यह एक हिंदी दस्तावेज़ है।',
            'kannada': 'ಇದು ಕನ್ನಡ ದಾಖಲೆಯಾಗಿದೆ।',
            'english': 'This is an English document.'
        }
        
        for lang, text in test_texts.items():
            detected = processor._detect_language(text)
            print(f"   {lang.capitalize()}: '{text}' -> Detected as: {detected}")
            
    except Exception as e:
        print(f"❌ Document processor test failed: {e}")

def main():
    """Main test function"""
    print("🧪 POLYDOC INDIAN LANGUAGE SUPPORT TEST")
    print("Testing Hindi and Kannada language processing capabilities")
    
    try:
        test_language_detection()
        test_ocr_setup()
        test_document_processing()
        
        print("\n" + "=" * 60)
        print("✅ TEST COMPLETED")
        print("Check the results above to identify any issues with Indian language support.")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
