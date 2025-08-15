#!/usr/bin/env python3
"""
PolyDoc AI - Installation Script
Resolves common pip installation issues and sets up the environment
"""

import subprocess
import sys
import os
import logging
from pathlib import Path

def setup_logging():
    """Set up logging for the installation process"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

def run_command(command, description=""):
    """Run a command and handle errors gracefully"""
    logger = logging.getLogger(__name__)
    logger.info(f"Running: {description or command}")
    
    try:
        result = subprocess.run(
            command.split(),
            capture_output=True,
            text=True,
            check=True
        )
        logger.info(f"✓ Success: {description or command}")
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        logger.error(f"✗ Failed: {description or command}")
        logger.error(f"Error: {e.stderr}")
        return False, e.stderr

def install_package(package, description=""):
    """Install a Python package with multiple fallback methods"""
    logger = logging.getLogger(__name__)
    
    # Try different installation methods
    install_commands = [
        f"pip install {package}",
        f"pip install --user {package}",
        f"pip install --upgrade {package}",
        f"pip install --no-cache-dir {package}",
        f"python -m pip install {package}",
        f"py -m pip install {package}"
    ]
    
    for cmd in install_commands:
        success, output = run_command(cmd, f"Installing {package} with: {cmd}")
        if success:
            return True
    
    logger.error(f"Failed to install {package} with all methods")
    return False

def install_requirements():
    """Install requirements with fallback strategies"""
    logger = logging.getLogger(__name__)
    
    # Essential packages that must be installed first
    essential_packages = [
        "pip>=21.0",
        "setuptools>=60.0",
        "wheel>=0.37.0"
    ]
    
    # Core packages
    core_packages = [
        "fastapi>=0.100.0",
        "uvicorn[standard]>=0.23.0",
        "pydantic>=2.0.0",
        "jinja2>=3.1.0",
        "aiofiles>=23.0.0",
        "python-multipart>=0.0.5",
        "websockets>=11.0.0"
    ]
    
    # Document processing packages
    document_packages = [
        "PyPDF2>=3.0.0",
        "python-docx>=1.0.0",
        "python-pptx>=0.6.21",
        "Pillow>=9.0.0"
    ]
    
    # OCR packages
    ocr_packages = [
        "pytesseract>=0.3.9",
        "opencv-python>=4.7.0",
        "easyocr>=1.6.0"
    ]
    
    # AI packages
    ai_packages = [
        "torch>=1.13.0",
        "transformers>=4.30.0",
        "sentence-transformers>=2.2.0",
        "faiss-cpu>=1.7.0"
    ]
    
    # Utility packages
    utility_packages = [
        "numpy>=1.21.0",
        "pandas>=1.5.0",
        "scikit-learn>=1.0.0",
        "requests>=2.28.0"
    ]
    
    # Windows-specific packages
    if sys.platform == "win32":
        utility_packages.append("python-magic-bin>=0.4.14")
    
    all_package_groups = [
        ("Essential packages", essential_packages),
        ("Core web framework", core_packages),
        ("Document processing", document_packages),
        ("OCR capabilities", ocr_packages),
        ("AI models", ai_packages),
        ("Utility packages", utility_packages)
    ]
    
    failed_packages = []
    
    for group_name, packages in all_package_groups:
        logger.info(f"\n📦 Installing {group_name}...")
        
        for package in packages:
            if not install_package(package, f"{group_name}: {package}"):
                failed_packages.append(package)
    
    return failed_packages

def check_system_requirements():
    """Check system requirements"""
    logger = logging.getLogger(__name__)
    
    # Check Python version
    if sys.version_info < (3, 8):
        logger.error("Python 3.8 or higher is required")
        return False
    
    logger.info(f"✓ Python version: {sys.version}")
    
    # Check pip
    success, _ = run_command("pip --version", "Checking pip")
    if not success:
        logger.error("pip is not available")
        return False
    
    return True

def create_directories():
    """Create necessary directories"""
    logger = logging.getLogger(__name__)
    
    directories = [
        "uploads",
        "vector_store", 
        "static",
        "templates"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        logger.info(f"✓ Directory created/verified: {directory}")

def check_tesseract():
    """Check if Tesseract OCR is installed"""
    logger = logging.getLogger(__name__)
    
    success, _ = run_command("tesseract --version", "Checking Tesseract OCR")
    
    if success:
        logger.info("✓ Tesseract OCR is installed")
        return True
    else:
        logger.warning("⚠ Tesseract OCR not found")
        logger.info("Please install Tesseract OCR:")
        logger.info("  Windows: https://github.com/UB-Mannheim/tesseract/wiki")
        logger.info("  Linux: sudo apt-get install tesseract-ocr")
        logger.info("  macOS: brew install tesseract")
        return False

def main():
    """Main installation process"""
    setup_logging()
    logger = logging.getLogger(__name__)
    
    logger.info("🚀 Starting PolyDoc AI Installation")
    logger.info("=" * 50)
    
    # Check system requirements
    if not check_system_requirements():
        logger.error("❌ System requirements check failed")
        sys.exit(1)
    
    # Upgrade pip first
    logger.info("\n📦 Upgrading pip...")
    run_command("python -m pip install --upgrade pip", "Upgrading pip")
    
    # Install packages
    failed_packages = install_requirements()
    
    # Create directories
    logger.info("\n📁 Creating directories...")
    create_directories()
    
    # Check optional dependencies
    logger.info("\n🔍 Checking optional dependencies...")
    check_tesseract()
    
    # Installation summary
    logger.info("\n" + "=" * 50)
    if failed_packages:
        logger.warning("⚠ Installation completed with some failures:")
        for package in failed_packages:
            logger.warning(f"  ❌ {package}")
        logger.info("\nYou can try installing failed packages manually:")
        logger.info("  pip install <package_name>")
    else:
        logger.info("✅ Installation completed successfully!")
    
    logger.info("\n🎉 Next steps:")
    logger.info("1. Install Tesseract OCR if not already installed")
    logger.info("2. Run: python main.py")
    logger.info("3. Open your browser to: http://localhost:8000")
    
    return len(failed_packages) == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
