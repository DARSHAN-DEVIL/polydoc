import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AnimatedLogo3D from '@/components/AnimatedLogo3D';
import { 
  MagneticButton, 
  ScrollProgress, 
  TextReveal, 
  ModernCard, 
  FloatingOrb,
  LiquidButton,
  AnimatedCounter
} from '@/components/ModernUI';
import { useLenis } from '@/hooks/useLenis';
import { useScrollReveal, useParallax } from '@/hooks/useScrollAnimations';
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
                <div className="h-12 w-12 rounded-3xl overflow-hidden ring-2 ring-primary/20">
                  <img 
                    src="/default-avatar.svg" 
                    alt="PolyDoc AI Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-primary items-center justify-center">
                    <FileText className="h-6 w-6 text-primary-foreground" />
                  </div>
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
  
  // Initialize Lenis smooth scrolling
  useLenis({
    duration: 1.5,
    easing: (t) => 1 - Math.pow(1 - t, 4), // Custom smooth easing
    smooth: true
  });

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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      },
    },
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -60, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient mesh */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(119, 198, 255, 0.3) 0%, transparent 50%)
            `
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 1, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Modern floating orbs */}
        <FloatingOrb 
          className="top-1/4 left-1/6 w-96 h-96"
          color="from-cyan-500/20 to-blue-500/20"
        />
        <FloatingOrb 
          className="bottom-1/4 right-1/6 w-80 h-80"
          color="from-purple-500/20 to-pink-500/20"
        />
        <FloatingOrb 
          className="top-3/4 left-3/4 w-64 h-64"
          color="from-emerald-500/20 to-teal-500/20"
        />
      </div>
      {/* Modern Glass Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 
            ? "bg-slate-900/80 backdrop-blur-xl border-b border-white/10" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with magnetic effect */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                whileHover={{
                  backgroundImage: "linear-gradient(45deg, #06b6d4, #8b5cf6, #06b6d4)",
                  backgroundSize: "200% 200%",
                  backgroundPosition: "200% 0%"
                }}
                transition={{ duration: 0.8 }}
              >
                POLYDOC
              </motion.span>
            </motion.div>

            {/* Navigation with magnetic buttons */}
            <nav className="hidden lg:flex items-center space-x-8">
              {["Features", "About", "Contact"].map((item, index) => (
                <MagneticButton
                  key={item}
                  className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-300"
                  onClick={() => document.querySelector(`#${item.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {item}
                </MagneticButton>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <ThemeToggle className="rounded-2xl" />
              {!user ? (
                <>
                  <MagneticButton
                    className="px-4 py-2 text-white/80 hover:text-white transition-colors"
                    onClick={() => setShowSignInModal(true)}
                  >
                    Sign In
                  </MagneticButton>
                  <LiquidButton
                    className="px-6 py-3 text-white font-medium"
                    onClick={() => setShowSignInModal(true)}
                  >
                    Get Started
                  </LiquidButton>
                </>
              ) : (
                <LiquidButton
                  className="px-6 py-3 text-white font-medium"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </LiquidButton>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button 
              className="lg:hidden p-2 text-white"
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
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
            {["Features", "About", "Contact"].map((item, index) => (
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

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section - Full Screen */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            
            {/* Hero Content */}
            <div className="max-w-6xl mx-auto">
              
              {/* Badge */}
              <TextReveal className="mb-8">
                <motion.div
                  className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-cyan-400 text-sm font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Next-Gen Document Intelligence
                </motion.div>
              </TextReveal>

              {/* Main Heading with Split Text Animation */}
              <div className="mb-8 space-y-4">
                <TextReveal>
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight">
                    <span className="block bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      POLYDOC
                    </span>
                  </h1>
                </TextReveal>
                
                <TextReveal delay={0.2}>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-light text-white/80 tracking-wide">
                    AI Document Understanding
                  </h2>
                </TextReveal>

                <TextReveal delay={0.4}>
                  <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full" />
                </TextReveal>
              </div>

              {/* Description */}
              <TextReveal delay={0.6}>
                <p className="text-xl md:text-2xl text-white/60 max-w-4xl mx-auto leading-relaxed mb-12">
                  Revolutionary multi-lingual document processing with 
                  <span className="text-cyan-400 font-medium"> layout preservation</span>, 
                  <span className="text-purple-400 font-medium"> AI-powered analysis</span>, and 
                  <span className="text-emerald-400 font-medium"> intelligent text extraction</span>.
                </p>
              </TextReveal>

              {/* CTA Buttons */}
              <TextReveal delay={0.8}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <LiquidButton
                    className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-2xl shadow-2xl"
                    onClick={() => setShowSignInModal(true)}
                  >
                    Start Processing
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </LiquidButton>
                  
                  <MagneticButton
                    className="px-12 py-6 text-lg font-medium text-white/80 border border-white/20 rounded-2xl backdrop-blur-xl"
                    onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore Features
                  </MagneticButton>
                </div>
              </TextReveal>

              {/* Stats */}
              <TextReveal delay={1}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                      <AnimatedCounter to={50} suffix="+" />
                    </div>
                    <div className="text-white/60 text-sm">Languages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                      <AnimatedCounter to={99} suffix="%" />
                    </div>
                    <div className="text-white/60 text-sm">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">
                      <AnimatedCounter to={1000} suffix="+" />
                    </div>
                    <div className="text-white/60 text-sm">Documents</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">
                      <AnimatedCounter to={24} suffix="/7" />
                    </div>
                    <div className="text-white/60 text-sm">Available</div>
                  </div>
                </div>
              </TextReveal>
            </div>
          </div>

          {/* 3D Logo - Floating in Background */}
          <motion.div 
            className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 opacity-20"
            animate={{ 
              y: [-20, 20, -20],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <AnimatedLogo3D />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div 
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
                animate={{ scaleY: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section - Modern Grid */}
        <section id="features" className="py-32 relative overflow-hidden">
          
          {/* Section Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/50 to-transparent" />
          
          <div className="container mx-auto px-6 relative z-10">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <TextReveal>
                <motion.div
                  className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-cyan-400 text-sm font-medium mb-8"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Advanced Capabilities
                </motion.div>
              </TextReveal>
              
              <TextReveal delay={0.2}>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
                  Powerful
                  <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Features
                  </span>
                </h2>
              </TextReveal>
              
              <TextReveal delay={0.4}>
                <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                  Revolutionary AI technology that transforms how you interact with documents, 
                  preserving layouts while extracting intelligent insights.
                </p>
              </TextReveal>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: <FileText className="h-8 w-8" />,
                  title: "Multi-Format Support",
                  description: "Process PDFs, Word docs, PowerPoint, and scanned images with unprecedented accuracy.",
                  gradient: "from-cyan-500 to-blue-500",
                  delay: 0
                },
                {
                  icon: <Sparkles className="h-8 w-8" />,
                  title: "Layout Preservation",
                  description: "Maintain original document structure, formatting, and visual hierarchy perfectly.",
                  gradient: "from-purple-500 to-pink-500",
                  delay: 0.1
                },
                {
                  icon: <Code className="h-8 w-8" />,
                  title: "Multi-lingual Processing",
                  description: "Support for 50+ languages with mixed-script document processing capabilities.",
                  gradient: "from-emerald-500 to-teal-500",
                  delay: 0.2
                },
                {
                  icon: <PenTool className="h-8 w-8" />,
                  title: "Handwriting Recognition",
                  description: "Advanced OCR technology for handwritten documents with intelligent analysis.",
                  gradient: "from-orange-500 to-red-500",
                  delay: 0.3
                },
                {
                  icon: <BrainCircuit className="h-8 w-8" />,
                  title: "AI-Powered Analysis",
                  description: "Leverage cutting-edge NLP and GenAI for intelligent content understanding.",
                  gradient: "from-indigo-500 to-purple-500",
                  delay: 0.4
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: "Lightning Fast",
                  description: "Real-time processing with instant results and comprehensive feedback systems.",
                  gradient: "from-yellow-500 to-orange-500",
                  delay: 0.5
                }
              ].map((feature, index) => (
                <TextReveal key={index} delay={feature.delay}>
                  <ModernCard className="h-full group">
                    {/* Feature Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    
                    {/* Feature Content */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                      {feature.description}
                    </p>
                    
                    {/* Hover Arrow */}
                    <motion.div
                      className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                    </motion.div>
                  </ModernCard>
                </TextReveal>
              ))}
            </div>

            {/* Bottom CTA */}
            <TextReveal delay={0.8}>
              <div className="text-center mt-20">
                <LiquidButton
                  className="px-8 py-4 text-lg font-medium"
                  onClick={() => setShowSignInModal(true)}
                >
                  Experience All Features
                  <ArrowRight className="ml-2 w-5 h-5" />
                </LiquidButton>
              </div>
            </TextReveal>
          </div>
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
