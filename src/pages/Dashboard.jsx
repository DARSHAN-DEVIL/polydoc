import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileUp, 
  Paperclip, 
  X, 
  CornerRightUp, 
  Sparkles,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserProfile } from '@/components/ui/user-profile';
import { cn } from '@/lib/utils';

// File Display Component
function FileDisplay({ fileName, onClear }) {
  return (
    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 w-fit px-3 py-1 rounded-lg group border dark:border-white/10">
      <FileUp className="w-4 h-4 dark:text-white" />
      <span className="text-sm dark:text-white">{fileName}</span>
      <button
        type="button"
        onClick={onClear}
        className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-3 h-3 dark:text-white" />
      </button>
    </div>
  );
}

// Custom hooks (same as before)
function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = (reset) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (reset) {
      textarea.style.height = `${minHeight}px`;
      return;
    }

    textarea.style.height = `${minHeight}px`;
    const newHeight = Math.max(
      minHeight,
      Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
    );
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { textareaRef, adjustHeight };
}

function useFileInput({ accept, maxSize }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setError("");

    if (file) {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        return;
      }

      if (accept && !file.type.match(accept.replace("/*", "/"))) {
        setError(`File type must be ${accept}`);
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const clearFile = () => {
    setFileName("");
    setError("");
    setSelectedFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    fileName,
    error,
    fileInputRef,
    handleFileSelect,
    validateAndSetFile,
    clearFile,
    selectedFile,
  };
}

// Upload Input Component
function UploadInput({
  id = "upload-input",
  placeholder = "Upload documents and ask questions about them...",
  minHeight = 52,
  maxHeight = 200,
  accept = ".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg",
  maxFileSize = 10,
  onSubmit,
  className
}) {
  const [inputValue, setInputValue] = useState("");
  const { fileName, fileInputRef, handleFileSelect, clearFile, selectedFile } =
    useFileInput({ accept, maxSize: maxFileSize });

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  const handleSubmit = () => {
    if (inputValue.trim() || selectedFile) {
      onSubmit?.(inputValue, selectedFile);
      setInputValue("");
      adjustHeight(true);
    }
  };

  return (
    <div className={cn("w-full py-2 sm:py-4 px-2 sm:px-0", className)}>
      <div className="relative max-w-2xl w-full mx-auto flex flex-col gap-2">
        {fileName && <FileDisplay fileName={fileName} onClear={clearFile} />}

        <div className="relative">
          <div
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 sm:h-8 w-7 sm:w-8 rounded-lg bg-black/5 dark:bg-white/5 hover:cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-3.5 sm:w-4 h-3.5 sm:h-4 transition-opacity transform scale-x-[-1] rotate-45 dark:text-white" />
          </div>

          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={accept}
          />

          <Textarea
            id={id}
            placeholder={placeholder}
            className={cn(
              "max-w-2xl bg-black/5 dark:bg-white/5 w-full rounded-2xl sm:rounded-3xl pl-10 sm:pl-12 pr-12 sm:pr-16",
              "placeholder:text-black/70 dark:placeholder:text-white/70",
              "border-none ring-black/30 dark:ring-white/30",
              "text-black dark:text-white text-wrap py-3 sm:py-4",
              "text-sm sm:text-base",
              "max-h-[200px] overflow-y-auto resize-none leading-[1.2]",
              `min-h-[${minHeight}px]`
            )}
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <button
            onClick={handleSubmit}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1"
            type="button"
          >
            <CornerRightUp
              className={cn(
                "w-3.5 sm:w-4 h-3.5 sm:h-4 transition-opacity dark:text-white",
                (inputValue || selectedFile) ? "opacity-100" : "opacity-30"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const messagesEndRef = useRef(null);

  const simulateResponse = (userMessage) => {
    setIsTyping(true);
    
    let response = "I can help you analyze and understand your documents. Please upload a document and ask me questions about it!";
    
    if (userMessage.toLowerCase().includes("document") || userMessage.toLowerCase().includes("pdf")) {
      response = "I can extract text from various document formats including PDFs, Word documents, and images. What would you like to know about your document?";
    } else if (userMessage.toLowerCase().includes("multilingual") || userMessage.toLowerCase().includes("language")) {
      response = "PolyDoc AI supports multiple languages including English, Arabic, Hindi, Chinese, and many others. I can preserve the original layout while extracting text.";
    } else if (userMessage.toLowerCase().includes("handwritten") || userMessage.toLowerCase().includes("handwriting")) {
      response = "Yes! I can process handwritten documents using advanced OCR technology. The system preserves the document structure while extracting readable text.";
    }
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { text: response, isUser: false, timestamp: new Date() }]);
    }, 1500);
  };

  const handleSubmit = (message, file) => {
    if (message.trim() === "" && !file) return;
    
    let userMessage = message;
    if (file) {
      userMessage = `${message} [Uploaded: ${file.name}]`;
      setCurrentDocument(file);
    }
    
    setMessages((prev) => [...prev, { text: userMessage, isUser: true, timestamp: new Date() }]);
    simulateResponse(userMessage);
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentDocument(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="h-8 w-8 rounded-2xl bg-primary flex items-center justify-center"
              >
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </motion.div>
              <span className="font-semibold">PolyDoc AI</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle className="rounded-3xl" />
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl py-6 px-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-background border border-muted rounded-3xl overflow-hidden shadow-sm">
              {/* Chat Header */}
              <div className="p-4 border-b border-muted flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-primary h-5 w-5" />
                  <h2 className="font-medium">Document Assistant</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={clearChat}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="p-4 h-[400px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sparkles className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-primary text-xl mb-2">Welcome back, {user?.displayName?.split(' ')[0]}!</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Upload your documents below and start asking questions. I'll help you understand and analyze them!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.isUser
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-muted text-foreground rounded-tl-none"
                          } animate-fade-in`}
                        >
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-2xl bg-muted text-foreground rounded-tl-none">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-muted">
                <UploadInput 
                  onSubmit={handleSubmit}
                  placeholder="Upload a document or ask about your files..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Document */}
            {currentDocument && (
              <div className="bg-background border border-muted rounded-3xl p-4">
                <h3 className="font-medium mb-3">Current Document</h3>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-xl">
                  <FileUp className="h-8 w-8 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{currentDocument.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(currentDocument.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}

            {/* Recent Documents */}
            <div className="bg-background border border-muted rounded-3xl p-4">
              <h3 className="font-medium mb-3">Recent Documents</h3>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground text-center py-4">
                  No recent documents yet
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
