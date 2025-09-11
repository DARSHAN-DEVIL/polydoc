#!/usr/bin/env python3
"""
Test script to verify all dependencies are working for Hindi/Kannada processing
"""
import sys
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

def test_dependencies():
    """Test all critical dependencies"""
    
    print("🧪 Testing PolyDoc Dependencies")
    print("=" * 50)
    
    # Test basic dependencies
    tests = [
        ("FastAPI", "import fastapi"),
        ("Uvicorn", "import uvicorn"),
        ("PyPDF2", "import PyPDF2"),
        ("python-docx", "import docx"),
        ("python-pptx", "import pptx"),
        ("EasyOCR", "import easyocr"),
        ("OpenCV", "import cv2"),
        ("Pytesseract", "import pytesseract"),
        ("Pandas", "import pandas"),
        ("BeautifulSoup", "import bs4"),
        ("Transformers", "import transformers"),
        ("Sentence Transformers", "import sentence_transformers"),
        ("PyMongo", "import pymongo"),
        ("Motor", "import motor"),
        ("Language Detection", "import langdetect"),
        ("PIL/Pillow", "import PIL"),
        ("NumPy", "import numpy"),
        ("scikit-learn", "import sklearn"),
        ("Torch", "import torch"),
    ]
    
    passed = 0
    failed = 0
    
    for name, import_stmt in tests:
        try:
            exec(import_stmt)
            print(f"✅ {name:<20} - OK")
            passed += 1
        except ImportError as e:
            print(f"❌ {name:<20} - MISSING: {e}")
            failed += 1
        except Exception as e:
            print(f"⚠️  {name:<20} - ERROR: {e}")
            failed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All dependencies are working!")
        
        # Test Hindi/Kannada specific functionality
        print("\n🔍 Testing Hindi/Kannada specific functionality...")
        
        try:
            from src.utils.indian_language_detector import detect_indian_language
            
            # Test Hindi
            hindi_result = detect_indian_language("यह एक हिंदी वाक्य है।")
            print(f"✅ Hindi detection: {hindi_result.language_name} ({hindi_result.confidence:.2f})")
            
            # Test Kannada
            kannada_result = detect_indian_language("ಇದು ಕನ್ನಡ ವಾಕ್ಯವಾಗಿದೆ।")
            print(f"✅ Kannada detection: {kannada_result.language_name} ({kannada_result.confidence:.2f})")
            
            print("🎉 Hindi/Kannada processing is working!")
            
        except Exception as e:
            print(f"❌ Hindi/Kannada processing failed: {e}")
            return False
            
        return True
    else:
        print("❌ Some dependencies are missing. Please install them.")
        return False

if __name__ == "__main__":
    success = test_dependencies()
    exit(0 if success else 1)
