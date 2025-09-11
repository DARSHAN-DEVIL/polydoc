#!/usr/bin/env python3
"""
Comprehensive test for Hindi and Kannada document processing in PolyDoc
"""
import sys
import logging
import asyncio
from pathlib import Path
import tempfile
from io import BytesIO

# Add src directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.core.document_processor import DocumentProcessor
from src.utils.indian_language_detector import detect_indian_language

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_test_documents():
    """Create test documents in memory for testing"""
    
    # Create simple text files for testing
    test_docs = {}
    
    # Hindi text file
    hindi_content = """यह एक हिंदी दस्तावेज़ का उदाहरण है।

मुख्य शीर्षक
============

यह एक पैराग्राफ है जिसमें हिंदी पाठ है। हमें इसे सही तरीके से पहचानना चाहिए।

दूसरा शीर्षक
-----------

यह दूसरा पैराग्राफ है। इसमें कुछ और हिंदी पाठ है।

Mixed content: This paragraph has English text with हिंदी शब्द mixed in.
"""
    
    # Kannada text file
    kannada_content = """ಇದು ಕನ್ನಡ ದಾಖಲೆಯ ಒಂದು ಉದಾಹರಣೆಯಾಗಿದೆ।

ಮುಖ್ಯ ಶೀರ್ಷಿಕೆ
===============

ಇದು ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಹೊಂದಿರುವ ಪ್ಯಾರಾಗ್ರಾಫ್ ಆಗಿದೆ। ನಾವು ಇದನ್ನು ಸರಿಯಾಗಿ ಗುರುತಿಸಬೇಕು।

ಎರಡನೆಯ ಶೀರ್ಷಿಕೆ
-----------------

ಇದು ಎರಡನೆಯ ಪ್ಯಾರಾಗ್ರಾಫ್. ಇದರಲ್ಲಿ ಇನ್ನೂ ಕೆಲವು ಕನ್ನಡ ಪಠ್ಯವಿದೆ।

Mixed content: This paragraph has English text with ಕನ್ನಡ ಪದಗಳು mixed in.
"""

    # Create temporary files
    test_docs['hindi_text'] = create_temp_file(hindi_content, 'hindi_test.txt')
    test_docs['kannada_text'] = create_temp_file(kannada_content, 'kannada_test.txt')
    
    return test_docs

def create_temp_file(content, filename):
    """Create a temporary file with given content"""
    temp_dir = Path(tempfile.gettempdir()) / 'polydoc_test'
    temp_dir.mkdir(exist_ok=True)
    
    file_path = temp_dir / filename
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return file_path

async def test_document_processing():
    """Test document processing with Hindi and Kannada files"""
    
    print("=" * 60)
    print("DOCUMENT PROCESSING TEST")
    print("=" * 60)
    
    try:
        # Initialize document processor
        processor = DocumentProcessor()
        print("✅ DocumentProcessor initialized successfully")
        
        # Create test documents
        print("\n📄 Creating test documents...")
        test_docs = create_test_documents()
        
        for doc_type, file_path in test_docs.items():
            print(f"\n🔍 Testing {doc_type.upper()} processing...")
            print(f"File: {file_path}")
            print("-" * 50)
            
            try:
                # Process document
                result = await processor.process_document(str(file_path))
                
                print(f"✅ Processing successful!")
                print(f"   📊 Total elements: {len(result.elements)}")
                print(f"   📄 Total pages: {result.total_pages}")
                print(f"   📁 File type: {result.metadata.get('file_type', 'unknown')}")
                
                # Analyze language detection in elements
                languages = {}
                for element in result.elements:
                    if element.language:
                        languages[element.language] = languages.get(element.language, 0) + 1
                
                print(f"   🌐 Languages detected: {languages}")
                
                # Show first few elements
                print("   📝 First few elements:")
                for i, element in enumerate(result.elements[:3]):
                    print(f"      {i+1}. [{element.element_type}] {element.text[:80]}...")
                    print(f"         Language: {element.language}, Confidence: {element.confidence:.2f}")
                
                # Test individual language detection on elements
                print("   🔍 Individual language detection test:")
                for i, element in enumerate(result.elements[:2]):  # Test first 2 elements
                    detected = detect_indian_language(element.text)
                    print(f"      Element {i+1}: '{element.text[:50]}...'")
                    print(f"      → Detected: {detected.language_name} ({detected.language_code}) - {detected.confidence:.2f}")
                
            except Exception as e:
                print(f"❌ Processing failed: {e}")
                import traceback
                traceback.print_exc()
            
            print()
    
    except Exception as e:
        print(f"❌ Document processor initialization failed: {e}")
        import traceback
        traceback.print_exc()

def test_mixed_language_detection():
    """Test mixed language detection improvements"""
    
    print("=" * 60)
    print("MIXED LANGUAGE DETECTION TEST")
    print("=" * 60)
    
    mixed_texts = [
        "This document contains हिंदी text in the middle.",
        "Here we have ಕನ್ನಡ script mixed with English.",
        "यह mostly Hindi है with some English words.",
        "ಇದು mostly Kannada with some English words.",
        "Complete English text without any Indian languages.",
        "पूरी तरह से हिंदी पाठ बिना किसी अंग्रेजी के।",
        "ಸಂಪೂರ್ಣವಾಗಿ ಕನ್ನಡ ಪಠ್ಯ ಯಾವುದೇ ಇಂಗ್ಲೀಷ್ ಇಲ್ಲದೆ।",
    ]
    
    for i, text in enumerate(mixed_texts, 1):
        print(f"\n🔍 Test {i}: {text}")
        print("-" * 50)
        
        try:
            detection = detect_indian_language(text)
            print(f"✅ Result: {detection.language_name} ({detection.language_code})")
            print(f"   Script: {detection.script}")
            print(f"   Confidence: {detection.confidence:.2f}")
        except Exception as e:
            print(f"❌ Error: {e}")

def cleanup_test_files(test_docs):
    """Clean up temporary test files"""
    for doc_type, file_path in test_docs.items():
        try:
            if file_path.exists():
                file_path.unlink()
                print(f"🗑️  Cleaned up {file_path.name}")
        except Exception as e:
            print(f"⚠️  Could not clean up {file_path.name}: {e}")

async def main():
    """Main test function"""
    print("🧪 POLYDOC COMPREHENSIVE HINDI & KANNADA TEST")
    print("Testing document processing and language detection")
    
    test_docs = {}
    try:
        # Test mixed language detection first
        test_mixed_language_detection()
        
        # Then test document processing
        await test_document_processing()
        
        print("\n" + "=" * 60)
        print("✅ COMPREHENSIVE TEST COMPLETED")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Clean up test files if any were created
        if test_docs:
            cleanup_test_files(test_docs)

if __name__ == "__main__":
    asyncio.run(main())
