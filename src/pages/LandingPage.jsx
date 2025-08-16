import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Menu, 
  X, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  Code,
  PenTool,
  BrainCircuit,
  Zap,
  Mail,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

// Mock AI Chat Interface for Demo (non-authenticated users)
function DemoAIChatInterface() {
  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl overflow-hidden shadow-2xl border border-indigo-500/20">
      <div className="bg-indigo-600/30 backdrop-blur-sm p-4 border-b border-indigo-500/30 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-indigo-300 h-5 w-5" />
          <h2 className="text-white font-medium">PolyDoc AI Demo</h2>
        </div>
      </div>
      
      <div className="p-4 h-[calc(100%-200px)] overflow-y-auto bg-slate-900/50">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Sparkles className="h-12 w-12 text-indigo-400 mb-4" />
          <h3 className="text-indigo-200 text-xl mb-2">Welcome to PolyDoc AI</h3>
          <p className="text-slate-400 text-sm max-w-xs mb-6">
            Upload documents and ask questions about them. I support multiple languages and preserve document layouts!
          </p>
          <div className="space-y-2">
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl"
              onClick={() => {
                // This will trigger Google Sign-In
                document.dispatchEvent(new CustomEvent('showSignIn'));
              }}
            >
              Sign In to Get Started
            </Button>
            <p className="text-xs text-slate-400">
              Sign in with Google to try the full demo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Google Sign-In Modal
function GoogleSignInModal({ isOpen, onClose }) {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        onClose();
        navigate('/dashboard');
      } else {
        console.error('Sign in failed:', result.error);
        alert('Sign in failed: ' + result.error);
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background dark:bg-slate-900 rounded-3xl shadow-2xl border border-muted p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-12 w-12 rounded-3xl bg-primary flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">PolyDoc AI</h2>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Welcome Back!</h3>
            <p className="text-muted-foreground">
              Sign in to access your documents and chat with AI about them.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleGoogleSignIn}
              size="lg" 
              className="w-full rounded-3xl bg-white hover:bg-gray-50 text-black border border-gray-200 flex items-center justify-center gap-3"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleShowSignIn = () => {
      setShowSignInModal(true);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener('showSignIn', handleShowSignIn);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener('showSignIn', handleShowSignIn);
    };
  }, []);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${scrollY > 50 ? "shadow-md" : ""}`}
      >
        <div className="container flex h-16 items-center justify-between border-x border-muted">
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="h-10 w-10 rounded-3xl bg-primary flex items-center justify-center"
              >
                <FileText className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span className="font-bold text-xl">PolyDoc AI</span>
            </div>
          </div>
          <nav className="hidden md:flex gap-3">
            <a href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </a>
            <a href="#demo" className="text-sm font-medium transition-colors hover:text-primary">
              Demo
            </a>
            <a href="#about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </a>
            <a href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle className="rounded-3xl" />
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-3xl"
              onClick={() => setShowSignInModal(true)}
            >
              Sign In
            </Button>
            <Button 
              size="sm" 
              className="rounded-3xl"
              onClick={() => setShowSignInModal(true)}
            >
              Get Started
            </Button>
          </div>
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle className="rounded-3xl" />
            <button onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background md:hidden"
        >
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-3xl bg-primary flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">PolyDoc AI</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle className="rounded-3xl" />
              <button onClick={toggleMenu}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
          </div>
          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="container grid gap-3 pb-8 pt-6"
          >
            {["Features", "Demo", "About", "Contact"].map((item, index) => (
              <motion.div key={index} variants={itemFadeIn}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="flex items-center justify-between rounded-3xl px-3 py-2 text-lg font-medium hover:bg-accent"
                  onClick={toggleMenu}
                >
                  {item}
                  <ChevronRight className="h-4 w-4" />
                </a>
              </motion.div>
            ))}
            <motion.div variants={itemFadeIn} className="flex flex-col gap-3 pt-4">
              <Button 
                variant="outline" 
                className="w-full rounded-3xl"
                onClick={() => {
                  setShowSignInModal(true);
                  toggleMenu();
                }}
              >
                Sign In
              </Button>
              <Button 
                className="w-full rounded-3xl"
                onClick={() => {
                  setShowSignInModal(true);
                  toggleMenu();
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="container px-4 md:px-6 border border-muted rounded-3xl bg-gradient-to-br from-background to-muted/30">
            <div className="grid gap-3 lg:grid-cols-[1fr_400px] lg:gap-3 xl:grid-cols-[1fr_600px]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="flex flex-col justify-center space-y-4 py-10"
              >
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center rounded-3xl bg-muted px-3 py-1 text-sm"
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    Multi-lingual Document AI
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                  >
                    Intelligent Document Understanding with{" "}
                    <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      Layout Preservation
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                  >
                    Extract text from multi-lingual documents while preserving original layouts. Supports handwritten documents, PDFs, Word files, and images with advanced NLP and GenAI technology.
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <Button 
                    size="lg" 
                    className="rounded-3xl group"
                    onClick={() => setShowSignInModal(true)}
                  >
                    Get Started
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-3xl"
                    onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Try Demo
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center"
              >
                <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px] xl:h-[550px] overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <FileText className="h-24 w-24 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-medium">Document Processing</p>
                    <p className="text-sm opacity-80">Multi-lingual • Layout Preserved</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container px-4 md:px-6 border border-muted rounded-3xl"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                >
                  Features
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                >
                  Powerful Document Processing
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  Advanced AI technology for comprehensive document understanding and text extraction
                </motion.p>
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl items-center gap-3 py-12 md:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  icon: <FileText className="h-10 w-10 text-primary" />,
                  title: "Multi-format Support",
                  description:
                    "Process PDFs, Word documents, PowerPoint slides, and scanned images with high accuracy.",
                },
                {
                  icon: <Sparkles className="h-10 w-10 text-primary" />,
                  title: "Layout Preservation",
                  description:
                    "Maintain original document structure, formatting, and visual hierarchy during text extraction.",
                },
                {
                  icon: <Code className="h-10 w-10 text-primary" />,
                  title: "Multi-lingual Processing",
                  description: "Support for English, Arabic, Hindi, Chinese and mixed-script documents with high precision.",
                },
                {
                  icon: <PenTool className="h-10 w-10 text-primary" />,
                  title: "Handwriting Recognition",
                  description:
                    "Advanced OCR technology for handwritten documents with intelligent text extraction.",
                },
                {
                  icon: <BrainCircuit className="h-10 w-10 text-primary" />,
                  title: "AI-Powered Analysis",
                  description:
                    "Leverage NLP and GenAI for intelligent document understanding and content analysis.",
                },
                {
                  icon: <Zap className="h-10 w-10 text-primary" />,
                  title: "Fast Processing",
                  description: "Quick and efficient document processing with real-time results and feedback.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md bg-background/80"
                >
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"></div>
                  <div className="relative space-y-3">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/10"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                >
                  Interactive Demo
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                >
                  Try PolyDoc AI
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  Sign in with Google to upload documents and experience the power of intelligent document processing
                </motion.p>
              </div>
            </div>
            <div className="flex justify-center py-12">
              <DemoAIChatInterface />
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container grid items-center gap-3 px-4 md:px-6 lg:grid-cols-2 border border-muted rounded-3xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3 p-6"
            >
              <div className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm">Contact</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Get Started with PolyDoc AI</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Ready to transform your document processing workflow? Contact us to learn more about PolyDoc AI.
              </p>
              <div className="mt-8 space-y-4">
                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
                  <div className="rounded-3xl bg-muted p-2">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-sm text-muted-foreground">contact@polydocai.com</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
                  <div className="rounded-3xl bg-muted p-2">
                    <Github className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Open Source</h3>
                    <p className="text-sm text-muted-foreground">Built with Python, NLP & GenAI</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border bg-background p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold">Get in Touch</h3>
              <p className="text-sm text-muted-foreground">
                Send us a message and we'll get back to you shortly.
              </p>
              <form className="mt-6 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="first-name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      First name
                    </label>
                    <Input id="first-name" placeholder="Enter your first name" className="rounded-3xl" />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="last-name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last name
                    </label>
                    <Input id="last-name" placeholder="Enter your last name" className="rounded-3xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Enter your email" className="rounded-3xl" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <Textarea id="message" placeholder="Tell us about your document processing needs" className="min-h-[120px] rounded-3xl" />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full rounded-3xl">
                    Send Message
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="container grid gap-3 px-4 py-10 md:px-6 lg:grid-cols-4 border-x border-muted"
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="h-10 w-10 rounded-3xl bg-primary flex items-center justify-center"
              >
                <FileText className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span className="font-bold text-xl">PolyDoc AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Intelligent multi-lingual document understanding with layout preservation using advanced AI technology.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <Github className="h-5 w-5" />, label: "GitHub" },
                { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
                { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
              ].map((social, index) => (
                <motion.div key={index} whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    {social.icon}
                    <span className="sr-only">{social.label}</span>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <h3 className="text-lg font-medium">Product</h3>
              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <a href="#features" className="text-muted-foreground hover:text-foreground">
                  Features
                </a>
                <a href="#demo" className="text-muted-foreground hover:text-foreground">
                  Demo
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  API Documentation
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </a>
              </nav>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <h3 className="text-lg font-medium">Technology</h3>
              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Python & NLP
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  GenAI Models
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  OCR Technology
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Open Source
                </a>
              </nav>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest updates on PolyDoc AI features and improvements.
            </p>
            <form className="flex space-x-3">
              <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1 rounded-3xl" />
              <Button type="submit" className="rounded-3xl">
                Subscribe
              </Button>
            </form>
          </div>
        </motion.div>
        <div className="border-t">
          <div className="container flex flex-col items-center justify-between gap-3 py-6 md:h-16 md:flex-row md:py-0">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} PolyDoc AI. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">Built with Python, NLP & GenAI</p>
          </div>
        </div>
      </footer>

      {/* Google Sign-In Modal */}
      <GoogleSignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .delay-75 {
          animation-delay: 0.2s;
        }
        
        .delay-150 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
