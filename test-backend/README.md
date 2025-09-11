# PolyDoc ML Training & Testing Framework

This directory contains a comprehensive machine learning training, testing, and validation framework for the PolyDoc AI system. It provides tools to evaluate and test the AI models using CSV datasets.

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip package manager
- Access to PolyDoc source code (src/ directory)

### Installation

1. **Clone or navigate to the test-backend directory:**
   ```bash
   cd D:\polydoc\test-backend
   ```

2. **Install required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the interactive test runner (Windows):**
   ```bash
   run_tests.bat
   ```

4. **Or run tests directly with Python:**
   ```bash
   python run_tests.py --test-type basic
   ```

## 📁 Directory Structure

```
test-backend/
├── README.md                    # This documentation
├── requirements.txt             # Python dependencies
├── ml_trainer.py               # Main ML framework
├── run_tests.py                # Test runner script
├── run_tests.bat              # Windows batch runner
├── sample_training_data.csv    # Sample training dataset
├── sample_test_data.csv        # Sample test dataset  
├── sample_validation_data.csv  # Sample validation dataset
└── results/                    # Generated test results (created automatically)
    ├── training_results.json
    ├── test_results.json
    ├── validation_results.json
    └── complete_results.json
```

## 🔧 Core Components

### 1. MLTrainingFramework (`ml_trainer.py`)

The main framework class that provides:

- **Model Initialization**: Loads PolyDoc's AI models (embeddings, QA, sentiment analysis, etc.)
- **Data Loading**: Reads CSV files with various formats
- **Training/Evaluation**: Evaluates pre-trained models on datasets
- **Testing**: Robustness testing with edge cases
- **Validation**: Performance validation on separate datasets
- **Results Storage**: Saves results in JSON format

### 2. Test Runner (`run_tests.py`)

Command-line interface for running different types of tests:

```bash
python run_tests.py --test-type [basic|classification|qa|robustness|custom] [--csv-path path/to/file.csv] [--verbose]
```

### 3. Sample Datasets

Three pre-built CSV datasets for testing:

- **Training Data**: 30 samples with text, labels, questions, and answers
- **Test Data**: Edge cases and robustness testing scenarios
- **Validation Data**: Clean validation set for final performance assessment

## 📊 CSV Data Format

### Required Columns

At minimum, your CSV must contain:
- `text`: The input text to be processed

### Optional Columns (depending on test type)

- `label`: Target labels for classification (values: positive, negative, neutral)
- `sentiment`: Expected sentiment (values: positive, negative, neutral)
- `question`: Questions for QA testing
- `answer`: Expected answers for QA validation
- `context`: Context for question-answering (defaults to `text` if missing)

### Example CSV Format

```csv
text,label,sentiment,question,answer,context
"This movie was fantastic!",positive,positive,"What did the reviewer think?","The reviewer loved it","This movie was fantastic!"
"Poor customer service",negative,negative,"How was the service?","Poor customer service","Poor customer service"
```

## 🧪 Test Types

### 1. Basic Test (`--test-type basic`)
Runs complete pipeline with all sample datasets:
- Classification evaluation
- Question-answering testing  
- Sentiment analysis validation
- Robustness testing
- Model performance validation

### 2. Classification Test (`--test-type classification`)
Focuses on text classification performance:
- Accuracy, Precision, Recall, F1-Score
- Confusion matrix analysis
- Class distribution

### 3. Question-Answering Test (`--test-type qa`)
Evaluates QA model performance:
- Answer similarity scoring
- Confidence analysis
- Sample predictions review

### 4. Robustness Test (`--test-type robustness`)
Tests model stability with edge cases:
- Empty text handling
- Very long text processing
- Special character handling
- Multilingual text support
- Processing time analysis

### 5. Custom CSV Test (`--test-type custom`)
Run tests with your own CSV data:
```bash
python run_tests.py --test-type custom --csv-path "path/to/your/data.csv"
```

### 6. Multilingual Features Test (`--test-type multilingual`)
Tests multilingual summary generation and QA for Indian languages:
- Bilingual summary generation (Indian language + English)
- Multilingual question-answering with bilingual responses
- Indian language detection accuracy
- Language distribution analysis

### 7. Indian Language Detection Test (`--test-type indian-language`)
Focused testing of Indian language detection:
- Detection accuracy for 11 supported Indian languages + English
- Confidence scoring and performance metrics
- Script-based language identification

## 📈 Results and Metrics

Results are saved in the `results/` directory:

### Training Results (`training_results.json`)
```json
{
  "classification": {
    "accuracy": 0.8500,
    "precision": 0.8200,
    "recall": 0.8300,
    "f1_score": 0.8250,
    "confusion_matrix": [[10, 2], [1, 7]]
  },
  "qa": {
    "average_similarity": 0.7500,
    "average_confidence": 0.8200
  }
}
```

### Test Results (`test_results.json`)
```json
{
  "robustness": {
    "success_rate": 0.95,
    "average_processing_time": 0.234,
    "total_tests": 20
  }
}
```

## 🎯 Use Cases

### 1. Model Performance Assessment
Evaluate how well PolyDoc's AI models perform on your specific domain data:

```bash
python run_tests.py --test-type custom --csv-path "my_domain_data.csv"
```

### 2. Robustness Validation
Test model stability before production deployment:

```bash
python run_tests.py --test-type robustness
```

### 3. Continuous Integration Testing
Integrate into your CI/CD pipeline:

```bash
python run_tests.py --test-type basic --verbose
```

### 4. Dataset Quality Assessment
Evaluate your training data quality and model fit:

```bash
python -c "
import asyncio
from ml_trainer import MLTrainingFramework

async def assess_data():
    framework = MLTrainingFramework()
    await framework.initialize_models()
    data = framework.load_csv_dataset('your_data.csv', 'training')
    results = await framework.validate_sentiment_analysis(data)
    print(f'Data quality score: {results[\"average_confidence\"]:.3f}')

asyncio.run(assess_data())
"
```

## ⚙️ Configuration

### Environment Variables
Set these environment variables to customize behavior:

```bash
export POLYDOC_LOG_LEVEL=DEBUG        # Enable detailed logging
export POLYDOC_MODEL_CACHE=/path/to/cache  # Model cache directory
export POLYDOC_RESULTS_DIR=./custom_results  # Custom results directory
```

### Programmatic Usage

```python
import asyncio
from ml_trainer import MLTrainingFramework

async def custom_training():
    # Initialize framework
    framework = MLTrainingFramework()
    await framework.initialize_models()
    
    # Load your data
    data = framework.load_csv_dataset('path/to/data.csv', 'training')
    
    # Run specific tests
    if 'label' in data.columns:
        results = await framework.train_classification_model(data)
        print(f"Classification Accuracy: {results['accuracy']:.4f}")
    
    # Save results
    framework.save_results('./my_results')

# Run the custom training
asyncio.run(custom_training())
```

## 🔍 Troubleshooting

### Common Issues

1. **Import Errors**
   ```
   ModuleNotFoundError: No module named 'models.ai_models'
   ```
   **Solution**: Ensure you're running from the test-backend directory and that the PolyDoc src/ directory is accessible.

2. **Memory Issues**
   ```
   CUDA out of memory
   ```
   **Solution**: The framework forces CPU usage for stability. If you still encounter issues, reduce batch sizes or use smaller datasets.

3. **CSV Format Errors**
   ```
   ValueError: Missing required columns: ['text']
   ```
   **Solution**: Ensure your CSV has at least a 'text' column with string content.

### Debug Mode

Run with verbose logging to diagnose issues:

```bash
python run_tests.py --test-type basic --verbose
```

## 📚 Advanced Usage

### Custom Metrics

Add your own evaluation metrics:

```python
class CustomMLFramework(MLTrainingFramework):
    async def custom_metric_evaluation(self, dataset):
        # Your custom evaluation logic here
        pass
```

### Batch Processing

Process multiple CSV files:

```bash
# Create a simple batch script
for csv_file in *.csv; do
    echo "Processing $csv_file"
    python run_tests.py --test-type custom --csv-path "$csv_file"
done
```

### Integration with PolyDoc API

Test live API endpoints:

```python
import requests
import asyncio
from ml_trainer import MLTrainingFramework

async def test_api_integration():
    framework = MLTrainingFramework()
    
    # Test API endpoint
    response = requests.post('http://localhost:8000/chat', 
                           json={'message': 'test query', 'document_id': 'test'})
    
    # Compare with framework results
    api_result = response.json()
    framework_result = await framework.ai_models.answer_question('test query', 'test context')
    
    print(f"API vs Framework confidence: {api_result.get('confidence', 0)} vs {framework_result.confidence}")
```

## 🤝 Contributing

To extend this framework:

1. Fork the repository
2. Add your improvements to `ml_trainer.py` or create new modules
3. Update tests in `run_tests.py`  
4. Add documentation to this README
5. Submit a pull request

## 📄 License

This testing framework is part of the PolyDoc project and follows the same licensing terms.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the log files generated in the results directory
3. Run with `--verbose` flag for detailed output
4. Open an issue in the main PolyDoc repository

---

**Happy Testing! 🎉**

*This framework helps ensure your PolyDoc AI models are robust, accurate, and ready for production use.*
