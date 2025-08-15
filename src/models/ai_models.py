"""
PolyDoc AI - Free AI Models Integration
Uses Hugging Face transformers for multilingual understanding and summarization
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional, Tuple
import torch
from transformers import (
    AutoTokenizer, AutoModel, AutoModelForSeq2SeqLM,
    pipeline, MarianMTModel, MarianTokenizer
)
from sentence_transformers import SentenceTransformer
import numpy as np
from dataclasses import dataclass

@dataclass
class ModelResponse:
    """Standard response format for AI model outputs"""
    content: str
    confidence: float
    metadata: Dict[str, Any]
    processing_time: float

class AIModelManager:
    """Manages all AI models used in PolyDoc AI"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.logger.info(f"Using device: {self.device}")
        
        # Initialize models
        self._load_models()
    
    def _load_models(self):
        """Load required AI models with fallbacks for stability"""
        self.models_loaded = {'embedding': False, 'summarizer': False, 'qa': False, 'classifier': False, 'lang_detector': False}
        
        try:
            # Essential: Multilingual sentence transformer for embeddings (smaller model)
            self.logger.info("Loading sentence transformer...")
            self.embedding_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
            self.models_loaded['embedding'] = True
            
        except Exception as e:
            self.logger.error(f"Failed to load embedding model: {e}")
            self.embedding_model = None
        
        try:
            # Summarization model (use smaller model for stability)
            self.logger.info("Loading summarization model...")
            self.summarizer = pipeline(
                "summarization",
                model="sshleifer/distilbart-cnn-12-6",
                device=-1  # Force CPU for stability
            )
            self.models_loaded['summarizer'] = True
            
        except Exception as e:
            self.logger.error(f"Failed to load summarization model: {e}")
            self.summarizer = None
        
        try:
            # Question-answering model (smaller multilingual model)
            self.logger.info("Loading QA model...")
            self.qa_model = pipeline(
                "question-answering",
                model="distilbert-base-cased-distilled-squad",
                device=-1  # Force CPU for stability
            )
            self.models_loaded['qa'] = True
            
        except Exception as e:
            self.logger.error(f"Failed to load QA model: {e}")
            self.qa_model = None
        
        try:
            # Text classification for sentiment analysis (lighter model)
            self.logger.info("Loading classification model...")
            self.classifier = pipeline(
                "text-classification",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                device=-1  # Force CPU for stability
            )
            self.models_loaded['classifier'] = True
            
        except Exception as e:
            self.logger.error(f"Failed to load classification model: {e}")
            self.classifier = None
        
        try:
            # Language detection - TEMPORARILY DISABLED to fix startup hang
            self.logger.info("Skipping language detection model (temporarily disabled)...")
            self.lang_detector = None
            self.models_loaded['lang_detector'] = False
            
        except Exception as e:
            self.logger.error(f"Failed to load language detection model: {e}")
            self.lang_detector = None
        
        # Check if we have minimum required models
        if not self.models_loaded['embedding']:
            self.logger.error("Critical: Embedding model failed to load!")
            raise Exception("Essential embedding model could not be loaded")
        
        loaded_models = [k for k, v in self.models_loaded.items() if v]
        self.logger.info(f"Models loaded successfully: {', '.join(loaded_models)}")
        
        if len(loaded_models) < 2:
            self.logger.warning("Only minimal models loaded - some features may not work")
    
    async def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for a list of texts"""
        try:
            # Run embedding generation in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            embeddings = await loop.run_in_executor(
                None, 
                self.embedding_model.encode, 
                texts
            )
            return embeddings
        except Exception as e:
            self.logger.error(f"Error generating embeddings: {e}")
            raise
    
    async def summarize_text(
        self, 
        text: str, 
        max_length: int = 150, 
        min_length: int = 50,
        language: str = 'en'
    ) -> ModelResponse:
        """Summarize text using multilingual model"""
        import time
        start_time = time.time()
        
        # Fallback if summarizer model not loaded
        if not self.summarizer:
            return ModelResponse(
                content=f"Summary unavailable (model not loaded). Text preview: {text[:200]}...",
                confidence=0.0,
                metadata={'fallback': True, 'language': language},
                processing_time=time.time() - start_time
            )
        
        try:
            # Prepare text for summarization
            # Chunk text if too long (max ~1024 tokens)
            max_chunk_size = 1000
            if len(text) > max_chunk_size:
                chunks = [text[i:i+max_chunk_size] for i in range(0, len(text), max_chunk_size)]
                summaries = []
                
                for chunk in chunks:
                    result = self.summarizer(
                        chunk, 
                        max_length=max_length//len(chunks), 
                        min_length=min_length//len(chunks),
                        do_sample=False
                    )
                    summaries.append(result[0]['summary_text'])
                
                # Combine chunk summaries
                combined_summary = ' '.join(summaries)
                
                # Summarize the combined summaries if still too long
                if len(combined_summary) > max_length * 2:
                    final_result = self.summarizer(
                        combined_summary,
                        max_length=max_length,
                        min_length=min_length,
                        do_sample=False
                    )
                    summary = final_result[0]['summary_text']
                else:
                    summary = combined_summary
            else:
                result = self.summarizer(
                    text,
                    max_length=max_length,
                    min_length=min_length,
                    do_sample=False
                )
                summary = result[0]['summary_text']
            
            processing_time = time.time() - start_time
            
            return ModelResponse(
                content=summary,
                confidence=0.8,  # mBART is generally reliable
                metadata={'language': language, 'original_length': len(text)},
                processing_time=processing_time
            )
            
        except Exception as e:
            self.logger.error(f"Error in summarization: {e}")
            return ModelResponse(
                content=f"Error generating summary: {str(e)}",
                confidence=0.0,
                metadata={'error': str(e)},
                processing_time=time.time() - start_time
            )
    
    async def answer_question(
        self, 
        question: str, 
        context: str, 
        language: str = 'en'
    ) -> ModelResponse:
        """Answer question based on document context"""
        import time
        start_time = time.time()
        
        # Fallback if QA model not loaded
        if not self.qa_model:
            return ModelResponse(
                content=f"Question answering unavailable (model not loaded). Based on the context, here's relevant text: {context[:300]}...",
                confidence=0.0,
                metadata={'fallback': True, 'question': question, 'language': language},
                processing_time=time.time() - start_time
            )
        
        try:
            # Chunk context if too long
            max_context_length = 2000
            if len(context) > max_context_length:
                # Use sliding window approach
                stride = max_context_length // 2
                chunks = []
                for i in range(0, len(context), stride):
                    chunks.append(context[i:i+max_context_length])
                
                best_answer = None
                best_score = 0
                
                for chunk in chunks:
                    result = self.qa_model(question=question, context=chunk)
                    if result['score'] > best_score:
                        best_score = result['score']
                        best_answer = result
                
                answer = best_answer['answer'] if best_answer else "No answer found"
                confidence = best_score if best_answer else 0.0
            else:
                result = self.qa_model(question=question, context=context)
                answer = result['answer']
                confidence = result['score']
            
            processing_time = time.time() - start_time
            
            return ModelResponse(
                content=answer,
                confidence=confidence,
                metadata={'question': question, 'language': language},
                processing_time=processing_time
            )
            
        except Exception as e:
            self.logger.error(f"Error in question answering: {e}")
            return ModelResponse(
                content=f"Error answering question: {str(e)}",
                confidence=0.0,
                metadata={'error': str(e), 'question': question},
                processing_time=time.time() - start_time
            )
    
    async def detect_language(self, text: str) -> str:
        """Detect language of text"""
        try:
            if not text.strip():
                return 'unknown'
            
            # Fallback if language detector is disabled
            if not self.lang_detector:
                # Simple heuristic fallback - detect based on character patterns
                import re
                if re.search(r'[а-яё]', text.lower()):
                    return 'ru'
                elif re.search(r'[中文汉语]', text):
                    return 'zh'
                elif re.search(r'[ñáéíóúü]', text.lower()):
                    return 'es'
                elif re.search(r'[àáâäçèéêëïîôöùúûüÿ]', text.lower()):
                    return 'fr'
                else:
                    return 'en'  # Default to English
            
            # Use first 500 characters for language detection
            sample_text = text[:500]
            result = self.lang_detector(sample_text)
            
            if result and len(result) > 0:
                return result[0]['label'].lower()
            else:
                return 'unknown'
                
        except Exception as e:
            self.logger.error(f"Error in language detection: {e}")
            return 'en'  # Default to English on error
    
    async def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of text"""
        try:
            result = self.classifier(text[:500])  # Limit text length
            
            return {
                'sentiment': result[0]['label'],
                'confidence': result[0]['score'],
                'analysis': 'multilingual_sentiment'
            }
            
        except Exception as e:
            self.logger.error(f"Error in sentiment analysis: {e}")
            return {
                'sentiment': 'neutral',
                'confidence': 0.0,
                'analysis': 'error',
                'error': str(e)
            }
    
    async def extract_key_phrases(self, text: str, top_k: int = 5) -> List[str]:
        """Extract key phrases from text using simple TF-IDF approach"""
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
            import re
            
            # Simple preprocessing
            sentences = re.split(r'[.!?]+', text)
            sentences = [s.strip() for s in sentences if s.strip()]
            
            if len(sentences) < 2:
                return [text[:50]] if text else []
            
            # Create TF-IDF vectorizer
            vectorizer = TfidfVectorizer(
                max_features=100,
                stop_words='english',
                ngram_range=(1, 3),
                max_df=0.7,
                min_df=1
            )
            
            # Fit and transform
            tfidf_matrix = vectorizer.fit_transform(sentences)
            feature_names = vectorizer.get_feature_names_out()
            
            # Get average TF-IDF scores
            mean_scores = np.mean(tfidf_matrix.toarray(), axis=0)
            
            # Get top phrases
            top_indices = np.argsort(mean_scores)[-top_k:][::-1]
            key_phrases = [feature_names[i] for i in top_indices if mean_scores[i] > 0]
            
            return key_phrases
            
        except Exception as e:
            self.logger.error(f"Error extracting key phrases: {e}")
            return []
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models"""
        return {
            'embedding_model': 'paraphrase-multilingual-MiniLM-L12-v2',
            'summarizer': 'facebook/mbart-large-50-many-to-many-mmt',
            'qa_model': 'deepset/xlm-roberta-large-squad2',
            'classifier': 'cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual',
            'lang_detector': 'papluca/xlm-roberta-base-language-detection',
            'device': str(self.device),
            'multilingual_support': True,
            'cost': 'free'
        }

class DocumentAnalyzer:
    """Specialized class for document-level analysis"""
    
    def __init__(self, ai_models: AIModelManager):
        self.ai_models = ai_models
        self.logger = logging.getLogger(__name__)
    
    async def analyze_document_structure(self, elements: List) -> Dict[str, Any]:
        """Analyze the overall structure and content of a document"""
        try:
            analysis = {
                'total_elements': len(elements),
                'element_types': {},
                'languages_detected': {},
                'key_topics': [],
                'sentiment_analysis': {},
                'readability_score': 0,
                'structure_quality': 'good'
            }
            
            all_text = []
            
            for element in elements:
                # Count element types
                elem_type = element.element_type
                analysis['element_types'][elem_type] = \
                    analysis['element_types'].get(elem_type, 0) + 1
                
                # Collect all text
                if element.text.strip():
                    all_text.append(element.text)
                    
                    # Detect language for each element
                    lang = await self.ai_models.detect_language(element.text)
                    analysis['languages_detected'][lang] = \
                        analysis['languages_detected'].get(lang, 0) + 1
            
            # Analyze combined text
            if all_text:
                combined_text = ' '.join(all_text)
                
                # Extract key topics
                analysis['key_topics'] = await self.ai_models.extract_key_phrases(
                    combined_text, top_k=10
                )
                
                # Sentiment analysis
                analysis['sentiment_analysis'] = await self.ai_models.analyze_sentiment(
                    combined_text
                )
                
                # Simple readability score based on sentence length
                sentences = combined_text.split('.')
                if sentences:
                    avg_sentence_length = sum(len(s.split()) for s in sentences) / len(sentences)
                    # Simple score: shorter sentences = higher readability
                    analysis['readability_score'] = max(0, min(100, 100 - (avg_sentence_length - 10) * 2))
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Error in document analysis: {e}")
            return {'error': str(e)}
    
    async def generate_document_summary(
        self, 
        elements: List, 
        summary_length: str = 'medium'
    ) -> str:
        """Generate a comprehensive document summary"""
        try:
            # Combine all text from elements
            all_text = []
            page_info = {}
            
            for element in elements:
                if element.text.strip():
                    all_text.append(element.text)
                    
                    # Track content by page
                    page_num = element.page_number
                    if page_num not in page_info:
                        page_info[page_num] = []
                    page_info[page_num].append(element.text)
            
            if not all_text:
                return "No text content found in document."
            
            combined_text = ' '.join(all_text)
            
            # Determine summary parameters based on length preference
            length_configs = {
                'short': {'max_length': 100, 'min_length': 30},
                'medium': {'max_length': 200, 'min_length': 50},
                'long': {'max_length': 400, 'min_length': 100}
            }
            
            config = length_configs.get(summary_length, length_configs['medium'])
            
            # Generate summary
            summary_response = await self.ai_models.summarize_text(
                combined_text,
                max_length=config['max_length'],
                min_length=config['min_length']
            )
            
            # Add page information
            summary_with_pages = f"{summary_response.content}\n\n"
            summary_with_pages += f"Document contains {len(page_info)} page(s) with content distributed across:\n"
            
            for page_num in sorted(page_info.keys()):
                content_preview = ' '.join(page_info[page_num])[:100] + "..."
                summary_with_pages += f"Page {page_num}: {content_preview}\n"
            
            return summary_with_pages
            
        except Exception as e:
            self.logger.error(f"Error generating document summary: {e}")
            return f"Error generating summary: {str(e)}"
