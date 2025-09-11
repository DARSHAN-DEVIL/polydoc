#!/usr/bin/env python3
"""
PolyDoc - MongoDB Setup and Verification Script
Ensures local MongoDB is running and properly configured
"""

import asyncio
import logging
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError, ConfigurationError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def check_mongodb_connection():
    """Check if MongoDB is running and accessible"""
    try:
        # Get MongoDB URL from environment or use default
        mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
        
        logger.info(f"Testing MongoDB connection to: {mongo_url}")
        
        # Create client with short timeout for quick test
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        
        # Test connection
        await client.admin.command('ping')
        
        # Get server info
        server_info = await client.admin.command('buildinfo')
        
        logger.info("✅ MongoDB connection successful!")
        logger.info(f"MongoDB version: {server_info.get('version', 'unknown')}")
        
        # Test creating a database (will only be created when data is inserted)
        test_db = client.polydoc_test
        test_collection = test_db.test_collection
        
        # Insert a test document
        result = await test_collection.insert_one({"test": "document", "setup": True})
        logger.info(f"✅ Test document inserted with ID: {result.inserted_id}")
        
        # Read it back
        doc = await test_collection.find_one({"_id": result.inserted_id})
        if doc:
            logger.info("✅ Test document retrieved successfully")
        
        # Clean up test document
        await test_collection.delete_one({"_id": result.inserted_id})
        logger.info("✅ Test document cleaned up")
        
        # List available databases
        db_list = await client.list_database_names()
        logger.info(f"Available databases: {db_list}")
        
        client.close()
        return True
        
    except ServerSelectionTimeoutError:
        logger.error("❌ MongoDB connection failed: Server selection timeout")
        logger.error("   Make sure MongoDB is running on localhost:27017")
        logger.error("   You can start MongoDB with: mongod --dbpath /path/to/your/db")
        return False
        
    except ConfigurationError as e:
        logger.error(f"❌ MongoDB configuration error: {e}")
        return False
        
    except Exception as e:
        logger.error(f"❌ Unexpected error connecting to MongoDB: {e}")
        return False

def print_setup_instructions():
    """Print MongoDB setup instructions"""
    logger.info("\n" + "="*60)
    logger.info("MONGODB SETUP INSTRUCTIONS")
    logger.info("="*60)
    logger.info("\nIf MongoDB is not installed or running, follow these steps:\n")
    
    logger.info("1. INSTALL MONGODB:")
    logger.info("   Windows: Download from https://www.mongodb.com/try/download/community")
    logger.info("   macOS:   brew install mongodb-community")
    logger.info("   Ubuntu:  sudo apt-get install mongodb")
    logger.info("")
    
    logger.info("2. CREATE DATA DIRECTORY:")
    logger.info("   Windows: mkdir C:\\data\\db")
    logger.info("   Linux/Mac: sudo mkdir -p /data/db && sudo chown $USER /data/db")
    logger.info("")
    
    logger.info("3. START MONGODB:")
    logger.info("   Windows: mongod --dbpath C:\\data\\db")
    logger.info("   Linux/Mac: mongod --dbpath /data/db")
    logger.info("")
    
    logger.info("4. VERIFY MONGODB IS RUNNING:")
    logger.info("   Open new terminal and run: mongo")
    logger.info("   Or run this script again: python setup_mongodb.py")
    logger.info("")
    
    logger.info("For more detailed instructions, visit:")
    logger.info("https://docs.mongodb.com/manual/installation/")
    logger.info("="*60)

async def create_sample_user_data():
    """Create sample user data for testing"""
    try:
        mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
        client = AsyncIOMotorClient(mongo_url)
        
        # Create a sample user database
        sample_user_db = client.polydoc_user_sample_user_123
        
        # Create sample user record
        users_collection = sample_user_db.users
        sample_user = {
            "user_id": "sample_user_123",
            "email": "sample@example.com",
            "display_name": "Sample User",
            "created_at": "2024-01-01T00:00:00Z",
            "total_documents": 0,
            "settings": {
                "language": "en",
                "theme": "system"
            }
        }
        
        # Insert only if doesn't exist
        existing_user = await users_collection.find_one({"user_id": "sample_user_123"})
        if not existing_user:
            await users_collection.insert_one(sample_user)
            logger.info("✅ Sample user data created")
        else:
            logger.info("✅ Sample user data already exists")
        
        client.close()
        
    except Exception as e:
        logger.error(f"Error creating sample data: {e}")

async def main():
    """Main setup function"""
    logger.info("PolyDoc - MongoDB Setup and Verification")
    logger.info("=" * 50)
    
    # Check MongoDB connection
    if await check_mongodb_connection():
        logger.info("\n✅ MongoDB is ready for PolyDoc!")
        
        # Create sample data
        await create_sample_user_data()
        
        logger.info("\n🚀 You can now start PolyDoc:")
        logger.info("   python main.py")
        
    else:
        print_setup_instructions()
        
    logger.info("\n" + "=" * 50)

if __name__ == "__main__":
    asyncio.run(main())
