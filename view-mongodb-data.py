#!/usr/bin/env python3
"""
PolyDoc AI - MongoDB Data Viewer
View and export data from MongoDB collections
"""

import asyncio
import os
import json
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

class MongoDataViewer:
    def __init__(self, mongo_url=None):
        self.mongo_url = mongo_url or os.getenv('MONGO_URL', 'mongodb://localhost:27017/polydoc_ai')
        self.client = None
        self.db = None

    async def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = AsyncIOMotorClient(self.mongo_url)
            await self.client.admin.command('ping')
            
            db_name = self.mongo_url.split('/')[-1].split('?')[0] or 'polydoc_ai'
            self.db = self.client[db_name]
            
            print(f"✅ Connected to MongoDB database: {db_name}")
            return True
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            return False

    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            print("🔌 Disconnected from MongoDB")

    async def view_database_info(self):
        """View database information"""
        print("\n" + "="*50)
        print("📊 DATABASE INFORMATION")
        print("="*50)
        
        try:
            # List collections
            collections = await self.db.list_collection_names()
            print(f"Database: {self.db.name}")
            print(f"Collections: {', '.join(collections)}")
            
            # Get collection stats
            for collection_name in collections:
                count = await self.db[collection_name].count_documents({})
                print(f"  📁 {collection_name}: {count} documents")
                
        except Exception as e:
            print(f"❌ Error getting database info: {e}")

    async def view_documents(self, limit=10):
        """View documents collection"""
        print("\n" + "="*50)
        print("📄 DOCUMENTS COLLECTION")
        print("="*50)
        
        try:
            cursor = self.db.documents.find().sort("created_at", -1).limit(limit)
            count = 0
            
            async for doc in cursor:
                count += 1
                print(f"\n📑 Document #{count}")
                print(f"   ID: {doc['_id']}")
                print(f"   User ID: {doc.get('user_id', 'N/A')}")
                print(f"   Filename: {doc.get('filename', 'N/A')}")
                print(f"   Status: {doc.get('status', 'N/A')}")
                print(f"   Language: {doc.get('language', 'N/A')}")
                print(f"   Pages: {doc.get('page_count', 'N/A')}")
                print(f"   Created: {doc.get('created_at', 'N/A')}")
                
            if count == 0:
                print("   No documents found")
                
        except Exception as e:
            print(f"❌ Error viewing documents: {e}")

    async def view_chunks(self, document_id=None, limit=5):
        """View document chunks"""
        print("\n" + "="*50)
        print("🧩 DOCUMENT CHUNKS COLLECTION")
        print("="*50)
        
        try:
            query = {}
            if document_id:
                query["document_id"] = document_id
                print(f"Filtering by document_id: {document_id}")
            
            cursor = self.db.document_chunks.find(query).limit(limit)
            count = 0
            
            async for chunk in cursor:
                count += 1
                print(f"\n🔤 Chunk #{count}")
                print(f"   ID: {chunk['_id']}")
                print(f"   Document ID: {chunk.get('document_id', 'N/A')}")
                print(f"   User ID: {chunk.get('user_id', 'N/A')}")
                print(f"   Page: {chunk.get('page_number', 'N/A')}")
                print(f"   Type: {chunk.get('element_type', 'N/A')}")
                print(f"   Language: {chunk.get('language', 'N/A')}")
                print(f"   Text (first 100 chars): {chunk.get('text', '')[:100]}...")
                print(f"   Has Embedding: {'Yes' if chunk.get('embedding') else 'No'}")
                if chunk.get('embedding'):
                    print(f"   Embedding Dimensions: {len(chunk['embedding'])}")
                
            if count == 0:
                print("   No chunks found")
                
        except Exception as e:
            print(f"❌ Error viewing chunks: {e}")

    async def view_chat_sessions(self, user_id=None, limit=5):
        """View chat sessions"""
        print("\n" + "="*50)
        print("💬 CHAT SESSIONS COLLECTION")
        print("="*50)
        
        try:
            query = {}
            if user_id:
                query["user_id"] = user_id
                print(f"Filtering by user_id: {user_id}")
            
            cursor = self.db.chat_sessions.find(query).sort("updated_at", -1).limit(limit)
            count = 0
            
            async for session in cursor:
                count += 1
                print(f"\n💭 Chat Session #{count}")
                print(f"   ID: {session['_id']}")
                print(f"   User ID: {session.get('user_id', 'N/A')}")
                print(f"   Document ID: {session.get('document_id', 'N/A')}")
                print(f"   Title: {session.get('title', 'N/A')}")
                print(f"   Messages: {len(session.get('messages', []))}")
                print(f"   Created: {session.get('created_at', 'N/A')}")
                print(f"   Updated: {session.get('updated_at', 'N/A')}")
                
            if count == 0:
                print("   No chat sessions found")
                
        except Exception as e:
            print(f"❌ Error viewing chat sessions: {e}")

    async def search_by_user(self, user_id):
        """Search all data for a specific user"""
        print("\n" + "="*50)
        print(f"🔍 USER DATA: {user_id}")
        print("="*50)
        
        try:
            # Count user's documents
            doc_count = await self.db.documents.count_documents({"user_id": user_id})
            
            # Count user's chunks
            chunk_count = await self.db.document_chunks.count_documents({"user_id": user_id})
            
            # Count user's chat sessions
            chat_count = await self.db.chat_sessions.count_documents({"user_id": user_id})
            
            print(f"📊 Summary for user {user_id}:")
            print(f"   Documents: {doc_count}")
            print(f"   Chunks: {chunk_count}")
            print(f"   Chat Sessions: {chat_count}")
            
            if doc_count > 0:
                print(f"\n📄 Recent Documents:")
                cursor = self.db.documents.find({"user_id": user_id}).sort("created_at", -1).limit(3)
                async for doc in cursor:
                    print(f"   - {doc.get('filename', 'Unknown')} ({doc.get('status', 'Unknown')})")
            
            if chat_count > 0:
                print(f"\n💬 Recent Chats:")
                cursor = self.db.chat_sessions.find({"user_id": user_id}).sort("updated_at", -1).limit(3)
                async for session in cursor:
                    print(f"   - {session.get('title', 'Untitled')} ({len(session.get('messages', []))} messages)")
                    
        except Exception as e:
            print(f"❌ Error searching user data: {e}")

    async def export_user_data(self, user_id, output_file=None):
        """Export all data for a user to JSON"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"user_data_{user_id}_{timestamp}.json"
        
        print(f"\n📤 Exporting user data to: {output_file}")
        
        try:
            user_data = {
                "user_id": user_id,
                "export_timestamp": datetime.now().isoformat(),
                "documents": [],
                "chunks": [],
                "chat_sessions": []
            }
            
            # Export documents
            cursor = self.db.documents.find({"user_id": user_id})
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
                if "created_at" in doc:
                    doc["created_at"] = doc["created_at"].isoformat()
                if "updated_at" in doc:
                    doc["updated_at"] = doc["updated_at"].isoformat()
                if "upload_date" in doc:
                    doc["upload_date"] = doc["upload_date"].isoformat()
                if "processed_date" in doc:
                    doc["processed_date"] = doc["processed_date"].isoformat()
                user_data["documents"].append(doc)
            
            # Export chunks (without embeddings to save space)
            cursor = self.db.document_chunks.find({"user_id": user_id})
            async for chunk in cursor:
                chunk["_id"] = str(chunk["_id"])
                if "created_at" in chunk:
                    chunk["created_at"] = chunk["created_at"].isoformat()
                # Remove embedding vector to save space
                if "embedding" in chunk:
                    chunk["embedding_dimensions"] = len(chunk["embedding"])
                    del chunk["embedding"]
                user_data["chunks"].append(chunk)
            
            # Export chat sessions
            cursor = self.db.chat_sessions.find({"user_id": user_id})
            async for session in cursor:
                session["_id"] = str(session["_id"])
                if "created_at" in session:
                    session["created_at"] = session["created_at"].isoformat()
                if "updated_at" in session:
                    session["updated_at"] = session["updated_at"].isoformat()
                user_data["chat_sessions"].append(session)
            
            # Write to file
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(user_data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Export completed!")
            print(f"   Documents: {len(user_data['documents'])}")
            print(f"   Chunks: {len(user_data['chunks'])}")
            print(f"   Chat Sessions: {len(user_data['chat_sessions'])}")
            
        except Exception as e:
            print(f"❌ Error exporting user data: {e}")

    async def get_statistics(self):
        """Get comprehensive database statistics"""
        print("\n" + "="*50)
        print("📈 DATABASE STATISTICS")
        print("="*50)
        
        try:
            stats = {}
            
            # Basic counts
            stats["total_documents"] = await self.db.documents.count_documents({})
            stats["total_chunks"] = await self.db.document_chunks.count_documents({})
            stats["total_chat_sessions"] = await self.db.chat_sessions.count_documents({})
            
            # User statistics
            pipeline = [{"$group": {"_id": "$user_id", "count": {"$sum": 1}}}]
            unique_users = []
            async for doc in self.db.documents.aggregate(pipeline):
                unique_users.append(doc["_id"])
            stats["unique_users"] = len(unique_users)
            
            # Language distribution
            pipeline = [
                {"$group": {"_id": "$language", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}}
            ]
            language_stats = []
            async for doc in self.db.documents.aggregate(pipeline):
                language_stats.append({"language": doc["_id"], "count": doc["count"]})
            
            # Document status distribution
            pipeline = [
                {"$group": {"_id": "$status", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}}
            ]
            status_stats = []
            async for doc in self.db.documents.aggregate(pipeline):
                status_stats.append({"status": doc["_id"], "count": doc["count"]})
            
            print(f"📊 Overall Statistics:")
            print(f"   Total Documents: {stats['total_documents']}")
            print(f"   Total Chunks: {stats['total_chunks']}")
            print(f"   Total Chat Sessions: {stats['total_chat_sessions']}")
            print(f"   Unique Users: {stats['unique_users']}")
            
            print(f"\n🌍 Language Distribution:")
            for lang_stat in language_stats:
                print(f"   {lang_stat['language']}: {lang_stat['count']} documents")
            
            print(f"\n📋 Document Status:")
            for status_stat in status_stats:
                print(f"   {status_stat['status']}: {status_stat['count']} documents")
                
        except Exception as e:
            print(f"❌ Error getting statistics: {e}")

async def main():
    """Main function"""
    import sys
    
    viewer = MongoDataViewer()
    
    if not await viewer.connect():
        return
    
    try:
        if len(sys.argv) == 1:
            # Default: show overview
            await viewer.view_database_info()
            await viewer.get_statistics()
            await viewer.view_documents(5)
            await viewer.view_chunks(limit=3)
            await viewer.view_chat_sessions(limit=3)
        
        elif sys.argv[1] == "docs":
            # Show documents
            limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10
            await viewer.view_documents(limit)
        
        elif sys.argv[1] == "chunks":
            # Show chunks
            limit = int(sys.argv[2]) if len(sys.argv) > 2 else 5
            doc_id = sys.argv[3] if len(sys.argv) > 3 else None
            await viewer.view_chunks(doc_id, limit)
        
        elif sys.argv[1] == "chats":
            # Show chat sessions
            limit = int(sys.argv[2]) if len(sys.argv) > 2 else 5
            user_id = sys.argv[3] if len(sys.argv) > 3 else None
            await viewer.view_chat_sessions(user_id, limit)
        
        elif sys.argv[1] == "user":
            # Show data for specific user
            if len(sys.argv) < 3:
                print("Usage: python view-mongodb-data.py user <user_id>")
                return
            user_id = sys.argv[2]
            await viewer.search_by_user(user_id)
        
        elif sys.argv[1] == "export":
            # Export user data
            if len(sys.argv) < 3:
                print("Usage: python view-mongodb-data.py export <user_id> [output_file]")
                return
            user_id = sys.argv[2]
            output_file = sys.argv[3] if len(sys.argv) > 3 else None
            await viewer.export_user_data(user_id, output_file)
        
        elif sys.argv[1] == "stats":
            # Show detailed statistics
            await viewer.get_statistics()
        
        else:
            print("Usage:")
            print("  python view-mongodb-data.py                    # Overview")
            print("  python view-mongodb-data.py docs [limit]       # View documents")
            print("  python view-mongodb-data.py chunks [limit] [doc_id]  # View chunks")
            print("  python view-mongodb-data.py chats [limit] [user_id]  # View chats")
            print("  python view-mongodb-data.py user <user_id>     # View user data")
            print("  python view-mongodb-data.py export <user_id>   # Export user data")
            print("  python view-mongodb-data.py stats              # Database statistics")
    
    finally:
        await viewer.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
