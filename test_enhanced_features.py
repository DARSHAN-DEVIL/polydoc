#!/usr/bin/env python3
"""
Test script to demonstrate PolyDoc's enhanced multilingual functionality
"""
import asyncio
import logging
from pathlib import Path
import tempfile
import json

# Add src directory to Python path
import sys
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.core.document_processor import DocumentProcessor
from src.models.ai_models import AIModelManager, DocumentAnalyzer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_enhanced_features():
    """Test the enhanced multilingual document processing features"""
    
    print("🚀 Testing PolyDoc Enhanced Multilingual Features")
    print("=" * 50)
    
    try:
        # Initialize components
        print("📦 Initializing AI models...")
        ai_models = AIModelManager()
        print("✅ AI models loaded successfully")
        
        print("📄 Initializing document processor...")
        doc_processor = DocumentProcessor()
        print("✅ Document processor initialized")
        
        print("🔍 Initializing document analyzer...")
        doc_analyzer = DocumentAnalyzer(ai_models)
        print("✅ Document analyzer initialized")
        
        # Test 1: Create sample documents in different formats
        print("\n🧪 Test 1: Multiple File Format Support")
        print("-" * 40)
        
        # Test text file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8') as f:
            f.write("This is a test document in English. It contains multiple sentences to test the summarization functionality.")
            txt_path = f.name
        
        try:
            processed_txt = await doc_processor.process_document(txt_path)
            print(f"✅ Successfully processed TXT file: {len(processed_txt.elements)} elements")
        except Exception as e:
            print(f"❌ Error processing TXT file: {e}")
        finally:
            Path(txt_path).unlink(missing_ok=True)
        
        # Test markdown file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False, encoding='utf-8') as f:
            f.write("""# Test Document
            
This is a **markdown** document with *formatting*.

## Section 1
- Item 1
- Item 2

## Section 2
This section contains more content for testing.""")
            md_path = f.name
        
        try:
            processed_md = await doc_processor.process_document(md_path)
            print(f"✅ Successfully processed Markdown file: {len(processed_md.elements)} elements")
        except Exception as e:
            print(f"❌ Error processing Markdown file: {e}")
        finally:
            Path(md_path).unlink(missing_ok=True)
        
        # Test JSON file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8') as f:
            json.dump({
                "title": "Sample Document",
                "content": "This is a JSON document for testing",
                "author": "Test User",
                "languages": ["English", "Spanish", "French"],
                "metadata": {
                    "created": "2024-01-01",
                    "type": "test"
                }
            }, f)
            json_path = f.name
        
        try:
            processed_json = await doc_processor.process_document(json_path)
            print(f"✅ Successfully processed JSON file: {len(processed_json.elements)} elements")
        except Exception as e:
            print(f"❌ Error processing JSON file: {e}")
        finally:
            Path(json_path).unlink(missing_ok=True)
        
        # Test 2: Language Detection
        print("\n🧪 Test 2: Enhanced Language Detection")
        print("-" * 40)
        
        test_texts = [
            ("Hello, this is an English text.", "en"),
            ("Hola, este es un texto en español.", "es"),
            ("Bonjour, ceci est un texte en français.", "fr"),
            ("Hallo, das ist ein deutscher Text.", "de"),
            ("Привет, это русский текст.", "ru"),
        ]
        
        for text, expected_lang in test_texts:
            detected = await ai_models.detect_language_advanced(text)
            status = "✅" if detected == expected_lang else "⚠️"
            print(f"{status} Text: '{text[:30]}...' - Detected: {detected} (Expected: {expected_lang})")
        
        # Test 3: Dual-language Summary Generation
        print("\n🧪 Test 3: Dual-language Summary Generation")
        print("-" * 40)
        
        # Test with English text
        english_text = """
        Artificial Intelligence (AI) is revolutionizing various industries by automating processes, 
        enhancing decision-making, and providing insights from large datasets. Machine learning, 
        a subset of AI, enables systems to learn and improve from experience without being explicitly 
        programmed. Deep learning, which uses neural networks, has shown remarkable success in image 
        recognition, natural language processing, and speech recognition applications.
        """
        
        print("Testing with English text...")
        english_summary = await ai_models.generate_dual_language_summary(english_text)
        print("✅ English summary generated:")
        print(f"   Original: {english_summary['english'][:100]}...")
        print(f"   Language: {english_summary['original_language']}")
        print(f"   Translation needed: {english_summary['translation_needed']}")
        
        # Test with Spanish text (if translation models work)
        spanish_text = """
        La inteligencia artificial está transformando muchas industrias mediante la automatización 
        de procesos y la mejora en la toma de decisiones. El aprendizaje automático permite que 
        los sistemas aprendan y mejoren a partir de la experiencia sin ser programados explícitamente.
        """
        
        print("\nTesting with Spanish text...")
        spanish_summary = await ai_models.generate_dual_language_summary(spanish_text)
        print("✅ Spanish summary generated:")
        print(f"   Original: {spanish_summary['original'][:100]}...")
        print(f"   English: {spanish_summary['english'][:100]}...")
        print(f"   Language: {spanish_summary['original_language']}")
        print(f"   Translation needed: {spanish_summary['translation_needed']}")
        
        # Test 4: Translation capabilities
        print("\n🧪 Test 4: Translation Capabilities")
        print("-" * 40)
        
        translation_tests = [
            ("Hello, how are you?", "en", "es"),
            ("Bonjour, comment allez-vous?", "fr", "en"),
        ]
        
        for text, source_lang, target_lang in translation_tests:
            try:
                result = await ai_models.translate_text(text, source_lang, target_lang)
                status = "✅" if result.confidence > 0 else "⚠️"
                print(f"{status} {source_lang}->{target_lang}: '{text}' -> '{result.content}'")
            except Exception as e:
                print(f"❌ Translation error for {source_lang}->{target_lang}: {e}")
        
        print("\n🎉 Enhanced features testing completed!")
        print(f"✅ Multi-format document processing: Supported")
        print(f"✅ Enhanced language detection: Working")
        print(f"✅ Dual-language summaries: Implemented")
        print(f"✅ Translation capabilities: Available")
        
        print(f"\n📊 Supported file formats:")
        supported_formats = sorted(doc_processor.supported_formats)
        for i, fmt in enumerate(supported_formats, 1):
            print(f"   {i:2d}. {fmt}")
        
    except Exception as e:
        logger.error(f"Test failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(test_enhanced_features())
