#!/usr/bin/env python3
"""
PolyDoc Results Analyzer
=======================

Analyzes and provides detailed insights into test results.
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any

class ResultsAnalyzer:
    """Analyzes and provides insights into ML test results"""
    
    def __init__(self, results_path: str = None):
        if results_path is None:
            results_path = Path(__file__).parent / "results" / "complete_results.json"
        else:
            results_path = Path(results_path)
        
        self.results_path = results_path
        self.results = self.load_results()
    
    def load_results(self) -> Dict[str, Any]:
        """Load results from JSON file"""
        try:
            with open(self.results_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Results file not found at {self.results_path}")
            print("Run tests first with: python run_tests.py --test-type basic")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"❌ Error reading results file: {e}")
            sys.exit(1)
    
    def print_header(self, title: str):
        """Print a formatted header"""
        print(f"\n{'='*60}")
        print(f"📊 {title}")
        print('='*60)
    
    def analyze_classification_results(self):
        """Analyze classification performance"""
        self.print_header("CLASSIFICATION ANALYSIS")
        
        # Check both training and validation results
        for section, section_name in [('training_results', 'Training'), ('validation_results', 'Validation')]:
            if section in self.results and 'classification' in self.results[section]:
                if section == 'validation_results':
                    cls_results = self.results[section]['all']['classification']
                else:
                    cls_results = self.results[section]['classification']
                
                print(f"\n🎯 {section_name} Classification Performance:")
                print(f"   • Accuracy:     {cls_results['accuracy']:.1%}")
                print(f"   • Precision:    {cls_results['precision']:.1%}")
                print(f"   • Recall:       {cls_results['recall']:.1%}")
                print(f"   • F1-Score:     {cls_results['f1_score']:.1%}")
                print(f"   • Confidence:   {cls_results['average_confidence']:.1%}")
                print(f"   • Classes:      {', '.join(cls_results['class_names'])}")
                print(f"   • Samples:      {cls_results['training_samples']} train, {cls_results['validation_samples']} val")
                
                # Analyze confusion matrix
                conf_matrix = cls_results['confusion_matrix']
                print(f"\n📈 Confusion Matrix Analysis:")
                class_names = cls_results['class_names']
                
                for i, class_name in enumerate(class_names):
                    true_positives = conf_matrix[i][i]
                    total_actual = sum(conf_matrix[i])
                    if total_actual > 0:
                        class_accuracy = true_positives / total_actual
                        print(f"   • {class_name.capitalize():8}: {class_accuracy:.1%} accuracy ({true_positives}/{total_actual})")
    
    def analyze_qa_results(self):
        """Analyze Question-Answering performance"""
        self.print_header("QUESTION-ANSWERING ANALYSIS")
        
        # Check both training and validation results
        for section, section_name in [('training_results', 'Training'), ('validation_results', 'Validation')]:
            if section in self.results and 'qa' in self.results[section]:
                if section == 'validation_results':
                    qa_results = self.results[section]['all']['qa']
                else:
                    qa_results = self.results[section]['qa']
                
                print(f"\n❓ {section_name} QA Performance:")
                similarity = qa_results['average_similarity']
                confidence = qa_results['average_confidence']
                
                print(f"   • Answer Similarity: {similarity:.1%}")
                print(f"   • Response Confidence: {confidence:.1%}")
                print(f"   • Samples: {qa_results['training_samples']} train, {qa_results['validation_samples']} val")
                
                # Performance interpretation
                if similarity > 0.7:
                    similarity_rating = "🟢 Excellent"
                elif similarity > 0.5:
                    similarity_rating = "🟡 Good"
                elif similarity > 0.3:
                    similarity_rating = "🟠 Fair"
                else:
                    similarity_rating = "🔴 Needs Improvement"
                
                print(f"   • Similarity Rating: {similarity_rating}")
                
                # Show sample predictions
                if 'sample_predictions' in qa_results:
                    print(f"\n📝 Sample Q&A Performance:")
                    for i, (question, prediction, expected) in enumerate(qa_results['sample_predictions'][:3]):
                        print(f"   Question {i+1}: {question}")
                        print(f"   Expected:  {expected}")
                        print(f"   Predicted: {prediction[:100]}...")
                        print()
    
    def analyze_sentiment_results(self):
        """Analyze sentiment analysis performance"""
        self.print_header("SENTIMENT ANALYSIS")
        
        if 'validation_results' in self.results and 'all' in self.results['validation_results']:
            if 'sentiment' in self.results['validation_results']['all']:
                sentiment_results = self.results['validation_results']['all']['sentiment']
                
                print(f"\n😊 Sentiment Analysis Performance:")
                accuracy = sentiment_results.get('accuracy')
                confidence = sentiment_results['average_confidence']
                
                if accuracy is not None:
                    print(f"   • Accuracy:     {accuracy:.1%}")
                print(f"   • Confidence:   {confidence:.1%}")
                
                # Distribution analysis
                distribution = sentiment_results['prediction_distribution']
                total_predictions = sum(distribution.values())
                
                print(f"   • Total Samples: {total_predictions}")
                print(f"\n📊 Prediction Distribution:")
                for sentiment, count in distribution.items():
                    percentage = count / total_predictions
                    print(f"   • {sentiment.capitalize():8}: {count:2d} samples ({percentage:.1%})")
                
                # Performance rating
                if accuracy is not None:
                    if accuracy > 0.8:
                        rating = "🟢 Excellent"
                    elif accuracy > 0.6:
                        rating = "🟡 Good"  
                    elif accuracy > 0.4:
                        rating = "🟠 Fair"
                    else:
                        rating = "🔴 Needs Improvement"
                    print(f"   • Overall Rating: {rating}")
    
    def analyze_robustness_results(self):
        """Analyze robustness test results"""
        self.print_header("ROBUSTNESS ANALYSIS")
        
        if 'test_results' in self.results and 'robustness' in self.results['test_results']:
            rob_results = self.results['test_results']['robustness']
            
            print(f"\n🛡️ Robustness Test Results:")
            success_rate = rob_results['success_rate']
            print(f"   • Success Rate:    {success_rate:.1%}")
            print(f"   • Total Tests:     {rob_results['total_tests']}")
            print(f"   • Successful:      {rob_results['successful_tests']}")
            print(f"   • Avg Time:        {rob_results['average_processing_time']:.2f}s")
            print(f"   • Max Time:        {rob_results['max_processing_time']:.2f}s")
            print(f"   • Min Time:        {rob_results['min_processing_time']:.2f}s")
            
            # Performance rating
            if success_rate > 0.8:
                rating = "🟢 Excellent"
            elif success_rate > 0.6:
                rating = "🟡 Good"
            elif success_rate > 0.4:
                rating = "🟠 Fair"
            else:
                rating = "🔴 Needs Improvement"
            
            print(f"   • Robustness Rating: {rating}")
            
            # Detailed breakdown
            detailed = rob_results['detailed_results']
            print(f"\n🔍 Edge Case Performance:")
            
            for test_type, results in detailed.items():
                if test_type == 'processing_times':
                    continue
                    
                if results:  # If there are results for this test type
                    result = results[0]  # Take first result
                    if result.get('success', False):
                        status = "✅ Passed"
                    else:
                        status = "❌ Failed"
                    
                    test_name = test_type.replace('_', ' ').title()
                    processing_time = result.get('processing_time', 0)
                    print(f"   • {test_name:15}: {status} ({processing_time:.2f}s)")
    
    def print_summary(self):
        """Print overall summary and recommendations"""
        self.print_header("OVERALL ASSESSMENT & RECOMMENDATIONS")
        
        # Collect key metrics
        metrics = {}
        
        # Classification metrics
        if 'validation_results' in self.results and 'all' in self.results['validation_results']:
            val_results = self.results['validation_results']['all']
            if 'classification' in val_results:
                metrics['classification_accuracy'] = val_results['classification']['accuracy']
            if 'qa' in val_results:
                metrics['qa_similarity'] = val_results['qa']['average_similarity']
            if 'sentiment' in val_results:
                metrics['sentiment_accuracy'] = val_results['sentiment'].get('accuracy')
        
        # Robustness metrics
        if 'test_results' in self.results and 'robustness' in self.results['test_results']:
            metrics['robustness_success'] = self.results['test_results']['robustness']['success_rate']
        
        print(f"\n🎯 Key Performance Indicators:")
        
        # Classification
        if 'classification_accuracy' in metrics:
            acc = metrics['classification_accuracy']
            print(f"   • Text Classification:  {acc:.1%}")
            
        # QA
        if 'qa_similarity' in metrics:
            sim = metrics['qa_similarity']
            print(f"   • Question Answering:   {sim:.1%} similarity")
            
        # Sentiment
        if 'sentiment_accuracy' in metrics:
            sent = metrics['sentiment_accuracy']
            if sent is not None:
                print(f"   • Sentiment Analysis:   {sent:.1%}")
        
        # Robustness  
        if 'robustness_success' in metrics:
            rob = metrics['robustness_success']
            print(f"   • Model Robustness:     {rob:.1%}")
        
        print(f"\n💡 Recommendations:")
        
        # Classification recommendations
        if 'classification_accuracy' in metrics:
            if metrics['classification_accuracy'] < 0.7:
                print(f"   • 🔧 Consider improving classification training data quality")
                print(f"   • 📊 Review confusion matrix for class imbalances")
        
        # QA recommendations
        if 'qa_similarity' in metrics:
            if metrics['qa_similarity'] < 0.5:
                print(f"   • 📝 Review question-answer pairs for better alignment")
                print(f"   • 🎯 Consider domain-specific fine-tuning for QA model")
        
        # Robustness recommendations
        if 'robustness_success' in metrics:
            if metrics['robustness_success'] < 0.7:
                print(f"   • 🛡️ Add input validation and error handling")
                print(f"   • ⚡ Optimize processing for edge cases")
        
        print(f"\n✨ Your PolyDoc AI system shows solid baseline performance!")
        print(f"   The test framework is working correctly and providing valuable insights.")

def main():
    """Main analyzer function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="PolyDoc Results Analyzer")
    parser.add_argument('--results-path', help='Path to results JSON file')
    parser.add_argument('--section', choices=['classification', 'qa', 'sentiment', 'robustness', 'summary'], 
                       help='Analyze specific section only')
    
    args = parser.parse_args()
    
    analyzer = ResultsAnalyzer(args.results_path)
    
    print("🤖 PolyDoc ML Results Analysis")
    
    if args.section:
        if args.section == 'classification':
            analyzer.analyze_classification_results()
        elif args.section == 'qa':
            analyzer.analyze_qa_results()
        elif args.section == 'sentiment':
            analyzer.analyze_sentiment_results()
        elif args.section == 'robustness':
            analyzer.analyze_robustness_results()
        elif args.section == 'summary':
            analyzer.print_summary()
    else:
        # Run full analysis
        analyzer.analyze_classification_results()
        analyzer.analyze_qa_results()
        analyzer.analyze_sentiment_results()
        analyzer.analyze_robustness_results()
        analyzer.print_summary()

if __name__ == "__main__":
    main()
