#!/usr/bin/env python3
"""
Quick test script to identify and fix summarization issues
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

import asyncio
import logging
from src.models.ai_models import AIModelManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_summarization():
    """Test document summarization with various languages"""
    
    print("=== Quick Summarization Test ===")
    
    # Initialize AI models
    print("\n1. Initializing AI models...")
    ai_models = AIModelManager()
    
    try:
        await ai_models.initialize()
        print("✅ AI models initialized successfully")
    except Exception as e:
        print(f"❌ AI models failed to initialize: {e}")
        print("⚠️ Continuing with fallback methods...")
    
    # Test with sample elements
    test_cases = [
        {
            'name': 'English Text',
            'text': 'Artificial Intelligence is transforming the world. Machine learning algorithms are becoming more sophisticated. Deep learning has enabled breakthrough applications in computer vision and natural language processing.',
            'language': 'en'
        },
        {
            'name': 'Hindi Text', 
            'text': 'भारत में कृत्रिम बुद्धिमत्ता का विकास तेजी से हो रहा है। मशीन लर्निंग और डीप लर्निंग के अनुप्रयोग विभिन्न क्षेत्रों में देखे जा रहे हैं। यह तकनीक शिक्षा और स्वास्थ्य सेवा में क्रांति ला सकती है।',
            'language': 'hi'
        },
        {
            'name': 'Kannada Text',
            'text': 'ಕೃತ್ರಿಮ ಬುದ್ಧಿಮತ್ತೆ ಜಗತ್ತನ್ನು ಬದಲಾಯಿಸುತ್ತಿದೆ. ಯಂತ್ರ ಕಲಿಕೆ ಅಲ್ಗೊರಿದಮ್‌ಗಳು ಹೆಚ್ಚು ಅತ್ಯಾಧುನಿಕವಾಗುತ್ತಿವೆ. ಆಳವಾದ ಕಲಿಕೆಯು ಕಂಪ್ಯೂಟರ್ ದೃಷ್ಟಿ ಮತ್ತು ನೈಸರ್ಗಿಕ ಭಾಷಾ ಸಂಸ್ಕರಣೆಯಲ್ಲಿ ಪ್ರಗತಿಯ ಅನುಪ್ರಯೋಗಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿದೆ.',
            'language': 'kn'
        }
    ]
    
    print("\n2. Testing summarization for different languages...")
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n--- Test {i}: {test_case['name']} ---")
        
        # Create mock elements
        from src.core.document_processor import DocumentElement
        
        elements = [
            DocumentElement(
                text=test_case['text'],
                page_number=1,
                element_type='paragraph',
                bbox=(0, 0, 500, 100),
                confidence=1.0,
                language=test_case['language']
            )
        ]
        
        try:
            # Test generate_document_summary
            print(f"Testing summary generation for {test_case['name']}...")
            
            from src.models.ai_models import DocumentAnalyzer
            doc_analyzer = DocumentAnalyzer(ai_models)
            
            summary_result = await doc_analyzer.generate_document_summary(
                elements, 
                summary_length='medium'
            )
            
            print(f"✅ Summary generated successfully!")
            print(f"Summary type: {type(summary_result)}")
            print(f"Summary keys: {list(summary_result.keys()) if isinstance(summary_result, dict) else 'Not a dict'}")
            
            if isinstance(summary_result, dict):
                summary_text = summary_result.get('summary', summary_result.get('english_summary', 'No summary found'))
                print(f"Summary preview: {summary_text[:200]}...")
            else:
                print(f"Summary content: {summary_result}")
                
        except Exception as e:
            print(f"❌ Summary generation failed: {e}")
            import traceback
            traceback.print_exc()
    
    print("\n3. Testing direct dual-language summary...")
    try:
        text = "Machine learning is a subset of artificial intelligence that enables computers to learn automatically."
        result = await ai_models.generate_dual_language_summary(text, 'en')
        print(f"✅ Dual-language summary works")
        print(f"Result keys: {list(result.keys())}")
        print(f"Original: {result.get('original', 'Missing')[:100]}...")
        print(f"English: {result.get('english', 'Missing')[:100]}...")
    except Exception as e:
        print(f"❌ Dual-language summary failed: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    asyncio.run(test_summarization())
