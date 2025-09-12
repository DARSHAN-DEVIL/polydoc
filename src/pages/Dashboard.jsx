import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileUp, 
  FileText,
  Upload,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Download,
  Trash2,
  User,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Upload Component
function UploadZone({ onUpload, isUploading }) {
  const fileInputRef = useRef();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <motion.div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
        dragActive 
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
          : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      
      <motion.div
        className="flex flex-col items-center space-y-4"
        animate={isUploading ? { opacity: 0.6 } : { opacity: 1 }}
      >
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          {isUploading ? (
            <motion.div
              className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {isUploading ? "Uploading..." : "Upload Document"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Drag and drop a file here, or click to browse
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileUp className="w-4 h-4 mr-2" />
            Choose File
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supports: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG (max 10MB)
        </p>
      </motion.div>
    </motion.div>
  );
}

// Document Card Component
function DocumentCard({ document, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200"
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
              {document.filename || document.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(document.size)} • {formatDate(document.upload_date)}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10"
              >
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button 
                    onClick={() => onDelete(document._id)}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {document.processed && (
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600 dark:text-green-400">Processed</span>
        </div>
      )}
      
      {document.summary && (
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
          {document.summary}
        </p>
      )}
    </motion.div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, processed, recent
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDocuments([
        {
          _id: '1',
          filename: 'Contract_Agreement.pdf',
          size: 1048576,
          upload_date: '2024-01-15T10:30:00Z',
          processed: true,
          summary: 'Legal contract document containing terms and conditions for service agreement...'
        },
        {
          _id: '2', 
          filename: 'Financial_Report_Q4.docx',
          size: 2097152,
          upload_date: '2024-01-14T15:45:00Z',
          processed: true,
          summary: 'Quarterly financial report showing revenue growth and market analysis...'
        },
        {
          _id: '3',
          filename: 'Meeting_Notes.txt',
          size: 524288,
          upload_date: '2024-01-13T09:20:00Z',
          processed: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpload = async (file) => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      const newDocument = {
        _id: Date.now().toString(),
        filename: file.name,
        size: file.size,
        upload_date: new Date().toISOString(),
        processed: false
      };
      setDocuments(prev => [newDocument, ...prev]);
      setIsUploading(false);
    }, 2000);
  };

  const handleDeleteDocument = (documentId) => {
    setDocuments(prev => prev.filter(doc => doc._id !== documentId));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'processed' && doc.processed) ||
      (filter === 'recent' && new Date(doc.upload_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">PolyDoc</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gray-600 dark:text-gray-400"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                  {user?.displayName || user?.email}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-600 dark:text-gray-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Upload */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <UploadZone onUpload={handleUpload} isUploading={isUploading} />
              
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Documents</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{documents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Processed</span>
                    <span className="text-sm font-medium text-green-600">{documents.filter(d => d.processed).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
                    <span className="text-sm font-medium text-blue-600">{documents.filter(d => new Date(d.upload_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Documents */}
          <div className="lg:col-span-2">
            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Documents</option>
                    <option value="processed">Processed</option>
                    <option value="recent">This Week</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <motion.div
                    className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchQuery || filter !== 'all' ? 'No documents found' : 'No documents yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery || filter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Upload your first document to get started'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {filteredDocuments.map((document) => (
                      <DocumentCard
                        key={document._id}
                        document={document}
                        onDelete={handleDeleteDocument}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
