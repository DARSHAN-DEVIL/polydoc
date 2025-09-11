#!/usr/bin/env python3
"""
PolyDoc Cache Optimizer
Cleans up incomplete downloads and optimizes HuggingFace cache for faster loading
"""

import os
import shutil
from pathlib import Path

def optimize_huggingface_cache():
    """Clean up and optimize HuggingFace cache"""
    cache_dir = Path(os.path.expanduser("~/.cache/huggingface"))
    
    if not cache_dir.exists():
        print("✅ No HuggingFace cache found - starting fresh")
        return
    
    print(f"🔧 Optimizing HuggingFace cache at: {cache_dir}")
    
    # Remove incomplete downloads
    incomplete_count = 0
    for incomplete_file in cache_dir.rglob("*.incomplete"):
        try:
            incomplete_file.unlink()
            incomplete_count += 1
        except Exception:
            pass
    
    if incomplete_count > 0:
        print(f"🧹 Removed {incomplete_count} incomplete downloads")
    
    # Remove temporary files
    temp_count = 0
    for temp_file in cache_dir.rglob("*.tmp"):
        try:
            temp_file.unlink()
            temp_count += 1
        except Exception:
            pass
    
    if temp_count > 0:
        print(f"🗑️ Removed {temp_count} temporary files")
    
    # Calculate cache size
    try:
        total_size = sum(f.stat().st_size for f in cache_dir.rglob('*') if f.is_file())
        size_gb = total_size / (1024**3)
        print(f"📊 Cache size: {size_gb:.2f} GB")
        
        # Check available space
        free_space = shutil.disk_usage(cache_dir).free / (1024**3)
        print(f"💾 Available space: {free_space:.2f} GB")
        
        if free_space < 2.0:
            print("⚠️ Warning: Low disk space may slow model loading")
            print("💡 Consider freeing up disk space for optimal performance")
        else:
            print("✅ Sufficient disk space for model loading")
            
    except Exception as e:
        print(f"Could not calculate cache size: {e}")

if __name__ == "__main__":
    print("🚀 PolyDoc Cache Optimizer")
    print("=" * 40)
    optimize_huggingface_cache()
    print("=" * 40)
    print("✅ Cache optimization complete!")
