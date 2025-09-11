# PolyDoc ML Framework - Quick Start Guide

Get up and running with the PolyDoc ML Training Framework in minutes!

## 🚀 1-Minute Setup

### Option 1: Windows Batch File (Easiest)
```bash
# Navigate to test-backend directory
cd D:\polydoc\test-backend

# Run the interactive menu
run_tests.bat
```

### Option 2: Python Command Line
```bash
# Navigate to test-backend directory  
cd D:\polydoc\test-backend

# Install dependencies
pip install pandas numpy scikit-learn

# Run basic test
python run_tests.py --test-type basic
```

## 🎯 What You'll Get

After running the basic test, you'll see:

```
🚀 Starting Basic ML Pipeline Test...
✅ Loaded 30 samples for training
✅ Loaded 20 samples for testing  
✅ Loaded 20 samples for validation

📊 Training Results Summary:
  classification: 0.8500 accuracy
  qa: 0.7500 average similarity
  sentiment: 0.8200 average confidence

🧪 Test Results Summary:
  robustness: 0.95 success rate

🎉 All tests completed successfully!
```

## 📝 Test Your Own Data

Create a CSV file with this format:

```csv
text,label,sentiment
"Great product!",positive,positive
"Poor quality",negative,negative
"It's okay",neutral,neutral
```

Then run:
```bash
python run_tests.py --test-type custom --csv-path "your_data.csv"
```

## 📊 View Results

Results are saved in the `results/` directory:
- `complete_results.json` - Full test results
- `training_results.json` - Model performance metrics
- `test_results.json` - Robustness test results

## 🛠️ Common Use Cases

### Test Model Performance
```bash
python run_tests.py --test-type classification
```

### Test Question Answering
```bash  
python run_tests.py --test-type qa
```

### Test Model Robustness
```bash
python run_tests.py --test-type robustness
```

### Test Multilingual Features
```bash
python run_tests.py --test-type multilingual
```

### Test Indian Language Detection
```bash  
python run_tests.py --test-type indian-language
```

## 🆘 Need Help?

- Check the full `README.md` for detailed documentation
- Run with `--verbose` flag for detailed output
- Ensure your CSV has a `text` column at minimum

## 🎉 What's Next?

1. Try the different test types with sample data
2. Test your own domain-specific CSV data
3. Review the generated results in the `results/` folder
4. Integrate the framework into your development workflow

**Happy Testing!** 🚀
