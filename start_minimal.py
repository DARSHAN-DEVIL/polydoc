#!/usr/bin/env python3
"""
PolyDoc - Minimal Startup Script
Handles disk space and memory constraints
"""

import os
import sys
import logging
import shutil
from pathlib import Path

# Set minimal configuration
os.environ['POLYDOC_MINIMAL_MODELS'] = '1'
os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'

def cleanup_cache():
    """Clean up HuggingFace cache to free disk space"""
    cache_dir = os.path.expanduser("~/.cache/huggingface")
    if os.path.exists(cache_dir):
        try:
            # Check disk space
            free_space = shutil.disk_usage(cache_dir).free / (1024**3)  # GB
            print(f"Available disk space: {free_space:.2f} GB")
            
            if free_space < 1.0:  # Less than 1GB free
                print("⚠️ Low disk space detected. Cleaning cache...")
                
                # Remove incomplete downloads
                incomplete_files = list(Path(cache_dir).rglob("*.incomplete"))
                for f in incomplete_files:
                    try:
                        f.unlink()
                        print(f"Removed incomplete download: {f.name}")
                    except Exception:
                        pass
                
                # Remove cached models over 500MB
                for model_dir in Path(cache_dir).glob("models--*"):
                    if model_dir.is_dir():
                        try:
                            size = sum(f.stat().st_size for f in model_dir.rglob('*') if f.is_file())
                            if size > 500 * 1024 * 1024:  # 500MB
                                shutil.rmtree(model_dir)
                                print(f"Removed large model cache: {model_dir.name}")
                        except Exception:
                            pass
                
                print("✅ Cache cleanup completed")
        except Exception as e:
            print(f"Cache cleanup failed: {e}")

def main():
    """Main startup function"""
    print("🚀 Starting PolyDoc with minimal configuration...")
    
    # Cleanup cache if needed
    cleanup_cache()
    
    # Add src directory to Python path
    sys.path.insert(0, str(Path(__file__).parent / "src"))
    
    # Setup minimal logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # Create required directories
    for directory in ['uploads', 'static', 'templates']:
        os.makedirs(directory, exist_ok=True)
    
    print("📁 Directories ready")
    print("🔧 Starting with document processing and basic AI features...")
    print("🌐 Access at: http://localhost:8000")
    
    # Import and run the app
    try:
        import uvicorn
        uvicorn.run(
            "src.api.main_mongodb:app",
            host="127.0.0.1",
            port=8000,
            log_level="info",
            reload=False
        )
    except KeyboardInterrupt:
        print("👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
