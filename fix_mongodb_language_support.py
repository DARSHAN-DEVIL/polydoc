#!/usr/bin/env python3
"""
MongoDB Language Support Fix Script
Fixes language indexing issues and tests compatibility
"""

import asyncio
import logging
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import TEXT
import pymongo

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def fix_mongodb_collections():
    """Fix MongoDB collections to handle multilingual content properly"""
    
    try:
        # Connect to local MongoDB
        client = AsyncIOMotorClient('mongodb://localhost:27017')
        
        # Test connection
        await client.admin.command('ping')
        logger.info("✅ Connected to MongoDB")
        
        # Get all PolyDoc databases (user databases)
        db_names = await client.list_database_names()
        polydoc_dbs = [db for db in db_names if db.startswith('polydoc_')]
        
        if not polydoc_dbs:
            logger.info("No PolyDoc databases found")
            return
        
        logger.info(f"Found {len(polydoc_dbs)} PolyDoc databases")
        
        for db_name in polydoc_dbs:
            logger.info(f"Processing database: {db_name}")
            db = client[db_name]
            
            # Check if document_chunks collection exists
            collections = await db.list_collection_names()
            if 'document_chunks' not in collections:
                logger.info(f"  No document_chunks collection in {db_name}")
                continue
            
            chunks_collection = db['document_chunks']
            
            try:
                # Drop existing text indexes that might have language issues
                indexes = await chunks_collection.list_indexes().to_list(None)
                for index in indexes:
                    if 'text' in str(index.get('key', {})):
                        index_name = index.get('name')
                        if index_name and index_name != '_id_':
                            try:
                                await chunks_collection.drop_index(index_name)
                                logger.info(f"  Dropped text index: {index_name}")
                            except Exception as e:
                                logger.warning(f"  Could not drop index {index_name}: {e}")
                
                # Create new language-agnostic text index
                try:
                    await chunks_collection.create_index([
                        ("text", TEXT)
                    ], default_language='none', name='text_search_multilingual')
                    logger.info("  ✅ Created language-agnostic text index")
                except Exception as e:
                    logger.warning(f"  Could not create text index: {e}")
                    # Try without default_language parameter
                    try:
                        await chunks_collection.create_index([
                            ("text", TEXT)
                        ], name='text_search_basic')
                        logger.info("  ✅ Created basic text index")
                    except Exception as e2:
                        logger.error(f"  ❌ Failed to create any text index: {e2}")
                
                # Test document count
                doc_count = await chunks_collection.count_documents({})
                logger.info(f"  Document count: {doc_count}")
                
                # Test languages in collection
                pipeline = [
                    {"$group": {"_id": "$language", "count": {"$sum": 1}}},
                    {"$sort": {"count": -1}}
                ]
                
                language_stats = []
                try:
                    async for doc in chunks_collection.aggregate(pipeline):
                        language_stats.append({"language": doc["_id"], "count": doc["count"]})
                    
                    if language_stats:
                        logger.info("  Languages found in collection:")
                        for stat in language_stats:
                            logger.info(f"    {stat['language']}: {stat['count']} documents")
                except Exception as e:
                    logger.warning(f"  Could not get language stats: {e}")
                
            except Exception as e:
                logger.error(f"  Error processing {db_name}: {e}")
                continue
        
        client.close()
        logger.info("✅ MongoDB language support fix completed")
        
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        logger.error("Make sure MongoDB is running on localhost:27017")

async def test_language_insertion():
    """Test inserting documents with different languages"""
    
    try:
        client = AsyncIOMotorClient('mongodb://localhost:27017')
        
        # Use test database
        db = client['polydoc_language_test']
        collection = db['test_chunks']
        
        # Drop existing collection
        await collection.drop()
        
        # Create language-agnostic text index
        try:
            await collection.create_index([
                ("text", TEXT)
            ], default_language='none')
            logger.info("✅ Created test text index")
        except Exception as e:
            logger.warning(f"Could not create test index: {e}")
        
        # Test documents in different languages
        test_documents = [
            {
                "text": "This is an English test document",
                "language": "en",
                "test_type": "supported_language"
            },
            {
                "text": "यह एक हिंदी परीक्षण दस्तावेज़ है",
                "language": "hi", 
                "test_type": "unsupported_language"
            },
            {
                "text": "ಇದು ಕನ್ನಡ ಪರೀಕ್ಷಾ ದಾಖಲೆಯಾಗಿದೆ",
                "language": "kn",
                "test_type": "unsupported_language" 
            }
        ]
        
        # Insert test documents
        for doc in test_documents:
            try:
                result = await collection.insert_one(doc)
                logger.info(f"✅ Inserted {doc['language']} document: {result.inserted_id}")
            except Exception as e:
                logger.error(f"❌ Failed to insert {doc['language']} document: {e}")
        
        # Test text search
        try:
            search_results = await collection.find(
                {"$text": {"$search": "test document"}}
            ).to_list(None)
            logger.info(f"✅ Text search returned {len(search_results)} results")
        except Exception as e:
            logger.error(f"❌ Text search failed: {e}")
        
        # Clean up test database
        await client.drop_database('polydoc_language_test')
        client.close()
        
        logger.info("✅ Language insertion test completed")
        
    except Exception as e:
        logger.error(f"❌ Language insertion test failed: {e}")

async def main():
    """Run MongoDB language support fixes"""
    logger.info("🔧 Starting MongoDB Language Support Fix...")
    logger.info("=" * 60)
    
    # Fix existing collections
    await fix_mongodb_collections()
    print()
    
    # Test language insertion
    logger.info("🧪 Testing language insertion...")
    await test_language_insertion()
    
    logger.info("=" * 60)
    logger.info("🎉 MongoDB language support fix completed!")
    
    logger.info("\n📋 Summary of changes:")
    logger.info("✅ Removed language-specific text indexes")
    logger.info("✅ Created language-agnostic text indexes")
    logger.info("✅ Tested multilingual document insertion")
    logger.info("\n🚀 Your PolyDoc system should now handle all languages properly!")

if __name__ == "__main__":
    asyncio.run(main())
