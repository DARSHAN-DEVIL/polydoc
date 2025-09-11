#!/usr/bin/env python3
"""
Test script for PolyDoc language processing fixes
Tests English, Hindi, and Kannada document processing
"""

import asyncio
import logging
import sys
import os
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

# Import our modules
from src.core.document_processor import DocumentProcessor
from src.models.ai_models import AIModelManager, DocumentAnalyzer
from src.utils.indian_language_detector import detect_indian_language

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Test texts in different languages
TEST_TEXTS = {
    'english': """
    This is a sample English document. It contains multiple sentences to test 
    the language detection and summarization capabilities. The system should 
    properly identify this as English and provide appropriate summaries.
    """,
    
    'hindi': """
    यह एक हिंदी भाषा का नमूना दस्तावेज़ है। इसमें भाषा पहचान और सारांश क्षमताओं का परीक्षण करने के लिए 
    कई वाक्य शामिल हैं। सिस्टम को इसे हिंदी के रूप में पहचानना चाहिए और उचित सारांश प्रदान करना चाहिए।
    """,
    
    'kannada': """
    ಇದು ಕನ್ನಡ ಭಾಷೆಯ ಒಂದು ಮಾದರಿ ದಾಖಲೆಯಾಗಿದೆ. ಭಾಷೆ ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಸಾರಾಂಶ ಸಾಮರ್ಥ್ಯಗಳನ್ನು ಪರೀಕ್ಷಿಸಲು 
    ಇದರಲ್ಲಿ ಹಲವು ವಾಕ್ಯಗಳನ್ನು ಒಳಗೊಂಡಿದೆ. ಸಿಸ್ಟಮ್ ಇದನ್ನು ಕನ್ನಡ ಎಂದು ಗುರುತಿಸಬೇಕು ಮತ್ತು ಸೂಕ್ತವಾದ ಸಾರಾಂಶಗಳನ್ನು ಒದಗಿಸಬೇಕು.
    """
}

async def test_language_detection():
    """Test language detection functionality"""
    logger.info("🔍 Testing Language Detection...")
    
    for lang_name, text in TEST_TEXTS.items():
        try:
            detection = detect_indian_language(text)
            logger.info(f"✅ {lang_name.upper()}: Detected as '{detection.language_code}' "
                       f"({detection.language_name}) with {detection.confidence:.2f} confidence")
        except Exception as e:
            logger.error(f"❌ {lang_name.upper()}: Detection failed - {e}")

async def test_ai_model_initialization():
    """Test AI model initialization with fallback support"""
    logger.info("🤖 Testing AI Model Initialization...")
    
    try:
        ai_models = AIModelManager()
        logger.info("✅ AI Model Manager initialized successfully")
        
        # Test embedding generation
        try:
            embeddings = await ai_models.generate_embeddings(["Test text", "परीक्षण पाठ"])
            logger.info(f"✅ Embedding generation successful: {embeddings.shape}")
        except Exception as e:
            logger.warning(f"⚠️ Embedding generation failed, but system should still work: {e}")
        
        return ai_models
    except Exception as e:
        logger.error(f"❌ AI Model initialization failed: {e}")
        return None

async def test_document_processing():
    """Test document processor initialization"""
    logger.info("📄 Testing Document Processor Initialization...")
    
    try:
        processor = DocumentProcessor()
        logger.info("✅ Document Processor initialized successfully")
        
        # Check OCR availability
        if processor.primary_ocr_reader:
            logger.info("✅ EasyOCR is available")
        elif processor.use_tesseract_fallback:
            logger.info("✅ Tesseract OCR fallback is available")
        else:
            logger.warning("⚠️ No OCR available - image processing will be limited")
        
        return processor
    except Exception as e:
        logger.error(f"❌ Document Processor initialization failed: {e}")
        return None

async def test_summarization(ai_models):
    """Test summarization with bilingual support"""
    if not ai_models:
        logger.warning("⚠️ Skipping summarization test - no AI models")
        return
    
    logger.info("📝 Testing Summarization...")
    
    for lang_name, text in TEST_TEXTS.items():
        try:
            # Detect language first
            detection = detect_indian_language(text)
            
            # Generate summary
            summary_result = await ai_models.generate_dual_language_summary(text, detection.language_code)
            
            logger.info(f"✅ {lang_name.upper()} Summary Generated:")
            logger.info(f"   Original Language: {summary_result.get('original_language', 'unknown')}")
            logger.info(f"   Translation Needed: {summary_result.get('translation_needed', False)}")
            logger.info(f"   Summary: {summary_result.get('summary', '')[:100]}...")
            
            if summary_result.get('english_summary'):
                logger.info(f"   English Summary: {summary_result.get('english_summary', '')[:100]}...")
                
        except Exception as e:
            logger.error(f"❌ {lang_name.upper()} summarization failed: {e}")

async def test_document_analysis(ai_models):
    """Test document analyzer"""
    if not ai_models:
        logger.warning("⚠️ Skipping document analysis test - no AI models")
        return
    
    logger.info("🔬 Testing Document Analysis...")
    
    try:
        analyzer = DocumentAnalyzer(ai_models)
        
        # Create mock elements for testing
        from src.core.document_processor import DocumentElement
        
        elements = []
        for i, (lang_name, text) in enumerate(TEST_TEXTS.items()):
            detection = detect_indian_language(text)
            element = DocumentElement(
                text=text.strip(),
                page_number=i+1,
                element_type='paragraph',
                bbox=(0, i*100, 500, (i+1)*100),
                confidence=0.9,
                language=detection.language_code
            )
            elements.append(element)
        
        # Test document summary generation
        summary_data = await analyzer.generate_document_summary(
            elements, 
            summary_length='medium',
            dual_language=True
        )
        
        logger.info("✅ Document Analysis completed:")
        logger.info(f"   Summary: {summary_data.get('summary', '')[:150]}...")
        logger.info(f"   English Summary: {summary_data.get('english_summary', '')[:150]}...")
        logger.info(f"   Original Language: {summary_data.get('original_language', 'unknown')}")
        logger.info(f"   Languages Detected: {summary_data.get('languages_detected', {})}")
        
    except Exception as e:
        logger.error(f"❌ Document analysis failed: {e}")

def create_test_document():
    """Create a simple test document for processing"""
    test_dir = Path("test_documents")
    test_dir.mkdir(exist_ok=True)
    
    # Create a simple text file with mixed content
    test_file = test_dir / "multilingual_test.txt"
    
    with open(test_file, 'w', encoding='utf-8') as f:
        f.write("English Test Content\n")
        f.write("This is a sample English paragraph for testing.\n\n")
        f.write("हिंदी परीक्षण सामग्री\n")
        f.write("यह परीक्षण के लिए एक नमूना हिंदी पैराग्राफ है।\n\n")
        f.write("ಕನ್ನಡ ಪರೀಕ್ಷಾ ವಿಷಯ\n")
        f.write("ಇದು ಪರೀಕ್ಷೆಗಾಗಿ ಒಂದು ಮಾದರಿ ಕನ್ನಡ ಪ್ಯಾರಾಗ್ರಾಫ್.\n")
    
    logger.info(f"✅ Test document created: {test_file}")
    return test_file

async def test_file_processing(processor, ai_models):
    """Test actual file processing"""
    if not processor:
        logger.warning("⚠️ Skipping file processing test - no processor")
        return
    
    logger.info("📁 Testing File Processing...")
    
    try:
        test_file = create_test_document()
        
        # Process the test document
        processed_doc = await processor.process_document(str(test_file))
        
        logger.info("✅ File processing completed:")
        logger.info(f"   Filename: {processed_doc.filename}")
        logger.info(f"   Total Pages: {processed_doc.total_pages}")
        logger.info(f"   Elements: {len(processed_doc.elements)}")
        
        # Show some extracted elements
        for i, element in enumerate(processed_doc.elements[:3]):
            logger.info(f"   Element {i+1}: {element.text[:50]}... (Language: {element.language})")
        
        # Test document analysis if we have AI models
        if ai_models:
            analyzer = DocumentAnalyzer(ai_models)
            summary_data = await analyzer.generate_document_summary(
                processed_doc.elements,
                dual_language=True
            )
            
            logger.info("✅ Document summary generated:")
            logger.info(f"   Summary: {summary_data.get('summary', '')[:100]}...")
    
    except Exception as e:
        logger.error(f"❌ File processing failed: {e}")

async def main():
    """Run all tests"""
    logger.info("🚀 Starting PolyDoc Language Processing Tests...")
    logger.info("=" * 60)
    
    # Test language detection
    await test_language_detection()
    print()
    
    # Test AI model initialization
    ai_models = await test_ai_model_initialization()
    print()
    
    # Test document processor
    processor = await test_document_processing()
    print()
    
    # Test summarization
    await test_summarization(ai_models)
    print()
    
    # Test document analysis
    await test_document_analysis(ai_models)
    print()
    
    # Test file processing
    await test_file_processing(processor, ai_models)
    
    logger.info("=" * 60)
    logger.info("🎉 All tests completed!")
    
    # Clean up test files
    try:
        import shutil
        if Path("test_documents").exists():
            shutil.rmtree("test_documents")
        logger.info("🧹 Test files cleaned up")
    except Exception as e:
        logger.warning(f"⚠️ Cleanup failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
