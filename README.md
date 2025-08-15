# PolyDoc AI - Multi-lingual Document Understanding System

🚀 **A comprehensive, free, and open-source document processing system with real-time AI chat capabilities**

## 🌟 Features

### Core Capabilities
- **Multi-format Document Processing**: PDF, DOCX, PPTX, and image formats
- **Multi-language OCR**: Support for 10+ languages including English, Hindi, Arabic, Chinese, Spanish, French, German, Japanese, Korean, and Russian
- **Layout Preservation**: Advanced document structure detection and preservation
- **Handwritten Text Recognition**: OCR capabilities for handwritten documents
- **Real-time AI Chat**: Interactive chat interface with your documents
- **Vector-based Search**: Semantic search across document content
- **AI Summarization**: Automatic document summarization with page references
- **Free AI Models**: Uses only free, open-source models (no paid APIs required)

### Technical Features
- **Real-time Processing**: WebSocket-based real-time chat interface
- **REST API**: Complete RESTful API for all functionalities
- **Vector Storage**: FAISS-based efficient similarity search
- **Modern Web UI**: Responsive, modern web interface
- **Multi-language Support**: Built-in language detection and processing
- **Document Analytics**: Comprehensive document analysis and statistics

## 🏗️ Architecture

```
PolyDoc AI
├── Document Processing Layer
│   ├── Multi-format parsers (PDF, DOCX, PPTX)
│   ├── OCR engines (Tesseract, EasyOCR)
│   └── Layout analysis (LayoutParser)
├── AI Processing Layer
│   ├── Multilingual models (mBERT, mBART)
│   ├── Question-answering (XLM-RoBERTa)
│   └── Embeddings (SentenceTransformers)
├── Vector Storage Layer
│   ├── FAISS indexing
│   ├── Document chunking
│   └── Semantic search
└── Web Interface Layer
    ├── FastAPI backend
    ├── WebSocket real-time chat
    └── Modern responsive UI
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Windows 10/11 (Linux/macOS compatible with minor adjustments)
- 4GB+ RAM recommended
- Internet connection (for initial model downloads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/polydoc-ai.git
   cd polydoc-ai
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Tesseract OCR:**
   - **Windows**: Download from https://github.com/UB-Mannheim/tesseract/wiki
   - **Linux**: `sudo apt-get install tesseract-ocr`
   - **macOS**: `brew install tesseract`

4. **Install language packs for Tesseract (optional):**
   ```bash
   # For additional language support
   # Download language files from https://github.com/tesseract-ocr/tessdata
   ```

### Running the Application

1. **Start the application:**
   ```bash
   python main.py
   ```

2. **Access the web interface:**
   Open your browser and go to: http://localhost:8000

3. **First-time setup:**
   - The application will download AI models on first run (this may take a few minutes)
   - Models are cached locally for future use

## 📖 Usage Guide

### 1. Document Upload

1. **Drag and drop** or **click to select** your document
2. **Supported formats**: PDF, DOCX, PPTX, PNG, JPG, JPEG, TIFF, BMP
3. **Processing**: The system will automatically:
   - Extract text and preserve layout
   - Perform OCR on images/scanned documents
   - Detect languages
   - Generate document summary
   - Create searchable chunks

### 2. Real-time Chat

1. **Start chatting** with any processed document
2. **Ask questions** like:
   - "What is the main topic of this document?"
   - "Summarize the key findings on page 3"
   - "What are the conclusions?"
   - "Find information about [specific topic]"
3. **Get responses** with:
   - AI-generated answers
   - Page number references
   - Confidence scores
   - Source citations

### 3. Document Analysis

- **View statistics**: Element types, languages, readability scores
- **Explore structure**: Headings, paragraphs, tables, images
- **Analyze sentiment**: Document sentiment analysis
- **Key topics**: Automatically extracted topics

### 4. Advanced Features

- **Multi-document chat**: Ask questions across multiple documents
- **Language selection**: Choose response language
- **Search functionality**: Semantic search across documents
- **Real-time processing**: Live updates and responses

## 🛠️ API Documentation

### REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | System health check |
| `/upload` | POST | Upload and process document |
| `/documents` | GET | List all documents |
| `/chat` | POST | Send chat message |
| `/analyze/{doc_id}` | GET | Get document analysis |
| `/search` | GET | Search documents |
| `/stats` | GET | System statistics |

### WebSocket Endpoints

| Endpoint | Description |
|----------|-------------|
| `/ws/{client_id}` | Real-time chat WebSocket |

### Example API Usage

```python
import requests
import json

# Upload document
files = {'file': open('document.pdf', 'rb')}
response = requests.post('http://localhost:8000/upload', files=files)
doc_data = response.json()

# Chat with document
chat_data = {
    "message": "What is this document about?",
    "document_id": doc_data["document_id"],
    "language": "en"
}
response = requests.post('http://localhost:8000/chat', json=chat_data)
answer = response.json()
```

## 🔧 Configuration

### Environment Variables

```bash
# Optional configuration
export POLYDOC_LOG_LEVEL=INFO
export POLYDOC_HOST=0.0.0.0
export POLYDOC_PORT=8000
export POLYDOC_WORKERS=1
```

### Model Configuration

The system uses these free models:
- **Embeddings**: `paraphrase-multilingual-MiniLM-L12-v2`
- **Summarization**: `facebook/mbart-large-50-many-to-many-mmt`
- **Question-Answering**: `deepset/xlm-roberta-large-squad2`
- **Classification**: `cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual`
- **Language Detection**: `papluca/xlm-roberta-base-language-detection`

## 🚀 Performance Optimization

### Hardware Recommendations

- **Minimum**: 4GB RAM, 2 CPU cores
- **Recommended**: 8GB+ RAM, 4+ CPU cores
- **Optimal**: 16GB+ RAM, GPU support

### Performance Tips

1. **GPU Acceleration**: Install CUDA for GPU support
2. **Memory Management**: Increase swap space for large documents
3. **Batch Processing**: Process multiple documents together
4. **Caching**: Models are cached after first load

## 🔧 Development

### Project Structure

```
polydoc-ai/
├── src/
│   ├── api/           # FastAPI application
│   ├── core/          # Document processing
│   ├── models/        # AI model management
│   ├── ui/           # Web interface components
│   └── utils/        # Utility functions
├── static/           # CSS, JS, assets
├── templates/        # HTML templates
├── uploads/          # Document uploads
├── vector_store/     # Vector database
├── requirements.txt  # Python dependencies
└── main.py          # Application entry point
```

### Running in Development Mode

```bash
# With auto-reload
python -m uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

### Testing

```bash
# Run tests
pytest tests/

# Run with coverage
pytest --cov=src tests/
```

## 📊 Monitoring and Logging

### Built-in Monitoring

- **Health checks**: `/health` endpoint
- **System statistics**: `/stats` endpoint
- **Real-time metrics**: WebSocket connection counts
- **Performance metrics**: Processing times, confidence scores

### Logging

- **Application logs**: `polydoc_ai.log`
- **Access logs**: Console output
- **Error tracking**: Detailed error messages with stack traces

## 🔒 Security Considerations

- **File validation**: Strict file type checking
- **Size limits**: 50MB file size limit
- **Input sanitization**: All inputs are sanitized
- **CORS protection**: Configurable CORS settings
- **Rate limiting**: Built-in request rate limiting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a virtual environment
3. Install development dependencies: `pip install -r requirements-dev.txt`
4. Make your changes
5. Run tests
6. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face**: For providing free, open-source AI models
- **Facebook AI**: For mBART multilingual models
- **Layout Parser**: For document layout analysis
- **Tesseract**: For OCR capabilities
- **FastAPI**: For the excellent web framework
- **FAISS**: For efficient vector search

## 📞 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Community**: Connect with other users and contributors

## 🗺️ Roadmap

### Upcoming Features

- [ ] **PDF Generation**: Export chat conversations as PDF
- [ ] **Batch Processing**: Process multiple documents simultaneously
- [ ] **API Keys**: Optional API key authentication
- [ ] **Cloud Storage**: Support for cloud document storage
- [ ] **Mobile App**: React Native mobile application
- [ ] **Plugins**: Plugin system for custom functionality
- [ ] **Advanced Analytics**: Enhanced document analytics
- [ ] **Multi-user Support**: User management and authentication

### Long-term Goals

- [ ] **Enterprise Features**: Advanced enterprise functionality
- [ ] **Integration APIs**: Integrate with popular document management systems
- [ ] **Advanced AI Models**: Support for newer, more powerful models
- [ ] **Real-time Collaboration**: Multi-user real-time collaboration
- [ ] **Advanced Security**: Enterprise-grade security features

---

**PolyDoc AI** - Making document understanding accessible, free, and intelligent. 🚀

*Built with ❤️ using only free and open-source technologies*
