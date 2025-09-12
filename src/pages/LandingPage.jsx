import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useLenis } from '@/hooks/useLenis';
import {
  ArrowRight,
  FileText,
  Menu,
  X,
  ChevronRight,
  Users,
  Globe,
  Shield,
  Zap,
  Download,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Info,
  Target,
  Layers,
  Workflow,
  Play,
  Star
} from 'lucide-react';

// Smooth reveal text component
function SmoothRevealText({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
        transition={{ 
          duration: 0.8, 
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Parallax container
function ParallaxSection({ children, speed = 0.5, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Floating particles background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

// Google Sign-In Modal (keeping the same functionality)
function GoogleSignInModal({ isOpen, onClose }) {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">PolyDoc</h2>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome Back!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to access your documents and start processing them.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleGoogleSignIn}
              size="lg" 
              className="w-full bg-white hover:bg-gray-50 text-black border border-gray-200 flex items-center justify-center gap-3"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
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
  const containerRef = useRef(null);
  
  // Initialize Lenis with cinematic settings
  useLenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
    smooth: true,
    direction: "vertical",
    gestureDirection: "vertical",
    smoothTouch: true,
    touchMultiplier: 2
  });

  // Scroll progress for effects
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Parallax transforms
  const heroY = useTransform(smoothProgress, [0, 1], [0, -200]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const navbarBg = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  useEffect(() => {
    const updateScrollY = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', updateScrollY);
    return () => window.removeEventListener('scroll', updateScrollY);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 relative overflow-x-hidden">
      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Cinematic Navbar */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: useTransform(navbarBg, [0, 1], [
            "rgba(255, 255, 255, 0)", 
            "rgba(255, 255, 255, 0.95)"
          ])
        }}
      >
        <div className="absolute inset-0 backdrop-blur-xl border-b border-white/10" />
        <div className="container mx-auto px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo with smooth animation */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
              >
                <FileText className="w-5 h-5 text-white" />
              </motion.div>
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                PolyDoc
              </motion.span>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {["Features", "About"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {!user ? (
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setShowSignInModal(true)}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Sign In
                  </Button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setShowSignInModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg"
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg"
                  >
                    Dashboard
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button 
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300"
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Cinematic */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div 
          className="container mx-auto px-6 text-center relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          
          {/* Hero Badge */}
          <SmoothRevealText delay={0.2} className="mb-8">
            <motion.div
              className="inline-flex items-center px-6 py-3 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 text-sm font-medium backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Star className="w-4 h-4 mr-2" />
              Advanced Document Intelligence Platform
            </motion.div>
          </SmoothRevealText>

          {/* Hero Title - Fixed text cutoff */}
          <div className="mb-8 space-y-4">
            <SmoothRevealText delay={0.4}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-tight">
                <span className="block bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  PolyDoc
                </span>
              </h1>
            </SmoothRevealText>
            
            <SmoothRevealText delay={0.6}>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-light text-gray-600 dark:text-gray-300 tracking-wide">
                Intelligent Document Processing
              </h2>
            </SmoothRevealText>

            <SmoothRevealText delay={0.8}>
              <motion.div 
                className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </SmoothRevealText>
          </div>

          {/* Hero Description */}
          <SmoothRevealText delay={1.0} className="mb-12">
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Transform your documents with advanced processing capabilities, 
              <span className="text-blue-600 dark:text-blue-400 font-medium"> multi-format support</span>, 
              <span className="text-purple-600 dark:text-purple-400 font-medium"> intelligent extraction</span>, and 
              <span className="text-green-600 dark:text-green-400 font-medium"> seamless workflows</span>.
            </p>
          </SmoothRevealText>

          {/* Hero CTA */}
          <SmoothRevealText delay={1.2} className="mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => setShowSignInModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-2xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 text-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl group"
                >
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </SmoothRevealText>

          {/* Hero Stats */}
          <SmoothRevealText delay={1.4}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "50+", label: "Languages", color: "text-blue-600" },
                { number: "99%", label: "Accuracy", color: "text-purple-600" },
                { number: "1000+", label: "Documents", color: "text-green-600" },
                { number: "24/7", label: "Available", color: "text-orange-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`text-3xl md:text-4xl font-bold ${stat.color} dark:${stat.color.replace('600', '400')} mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </SmoothRevealText>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-gray-500 dark:bg-gray-400 rounded-full mt-2"
              animate={{ scaleY: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section with Parallax */}
      <ParallaxSection speed={0.3}>
        <section id="features" className="py-32 bg-gray-50 dark:bg-gray-800/50 relative">
          <div className="container mx-auto px-6">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <SmoothRevealText delay={0.2}>
                <motion.div
                  className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Key Features
                </motion.div>
              </SmoothRevealText>
              
              <SmoothRevealText delay={0.4}>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Everything You Need for
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Document Processing
                  </span>
                </h2>
              </SmoothRevealText>
              
              <SmoothRevealText delay={0.6}>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  Advanced document processing platform with intelligent extraction,
                  multi-format support, and seamless workflow integration.
                </p>
              </SmoothRevealText>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                { icon: FileText, title: "Multi-Format Support", desc: "Process PDFs, Word docs, PowerPoint, and images with high accuracy.", color: "blue" },
                { icon: Users, title: "Collaborative Workflows", desc: "Share documents and collaborate with your team in real-time.", color: "purple" },
                { icon: Globe, title: "Multi-Language Support", desc: "Process documents in 50+ languages with intelligent recognition.", color: "green" },
                { icon: Shield, title: "Secure Processing", desc: "Enterprise-grade security with encrypted document handling.", color: "red" },
                { icon: Zap, title: "Fast Processing", desc: "Lightning-fast document analysis with real-time results.", color: "yellow" },
                { icon: Download, title: "Easy Export", desc: "Export processed documents in multiple formats instantly.", color: "indigo" }
              ].map((feature, index) => (
                <SmoothRevealText key={index} delay={index * 0.1} className="h-full">
                  <motion.div 
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 group h-full cursor-pointer"
                    whileHover={{ y: -10, rotateY: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-100 dark:bg-${feature.color}-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-8 h-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      {feature.desc}
                    </p>
                  </motion.div>
                </SmoothRevealText>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* About Section with Parallax */}
      <ParallaxSection speed={0.2}>
        <section id="about" className="py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto text-center">
              <SmoothRevealText delay={0.2}>
                <motion.div
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <Info className="w-4 h-4 mr-2" />
                  About PolyDoc
                </motion.div>
              </SmoothRevealText>
              
              <SmoothRevealText delay={0.4}>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                  Transforming Document Processing
                </h2>
              </SmoothRevealText>
              
              <SmoothRevealText delay={0.6}>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-12 max-w-4xl mx-auto">
                  PolyDoc is a modern document intelligence platform that combines advanced OCR technology
                  with intelligent analysis capabilities. Our platform supports multiple document formats,
                  preserves original layouts, and provides accurate text extraction with comprehensive
                  multilingual support.
                </p>
              </SmoothRevealText>
              
              <div className="grid md:grid-cols-3 gap-12 mt-16">
                {[
                  { icon: Target, title: "Accuracy First", desc: "High-precision document processing with 99% accuracy rates", color: "blue" },
                  { icon: Layers, title: "Format Support", desc: "Process PDFs, images, Word docs, and more seamlessly", color: "green" },
                  { icon: Workflow, title: "Easy Integration", desc: "Simple API and web interface for seamless workflows", color: "purple" }
                ].map((item, index) => (
                  <SmoothRevealText key={index} delay={0.8 + index * 0.2}>
                    <motion.div 
                      className="text-center group"
                      whileHover={{ y: -5 }}
                    >
                      <div className={`w-20 h-20 bg-${item.color}-100 dark:bg-${item.color}-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className={`w-10 h-10 text-${item.color}-600 dark:text-${item.color}-400`} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  </SmoothRevealText>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 relative">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <SmoothRevealText delay={0.2}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-2xl text-gray-900 dark:text-white">PolyDoc</span>
                </div>
              </SmoothRevealText>
              
              <SmoothRevealText delay={0.4}>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
                  Modern document processing platform with intelligent extraction,
                  multi-format support, and seamless workflow integration.
                </p>
              </SmoothRevealText>
              
              <SmoothRevealText delay={0.6}>
                <div className="flex space-x-4">
                  {[Github, Twitter, Linkedin].map((Icon, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </SmoothRevealText>
            </div>
            
            {/* Product Links */}
            <SmoothRevealText delay={0.8}>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">Product</h3>
                <ul className="space-y-3">
                  {["Features", "About", "Documentation"].map((item, index) => (
                    <motion.li key={index} whileHover={{ x: 5 }}>
                      <a href={`#${item.toLowerCase()}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </SmoothRevealText>
            
            {/* Technology */}
            <SmoothRevealText delay={1.0}>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">Technology</h3>
                <ul className="space-y-3">
                  {["Python & NLP", "OCR Technology", "Open Source"].map((item, index) => (
                    <motion.li key={index} whileHover={{ x: 5 }}>
                      <span className="text-gray-600 dark:text-gray-400">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </SmoothRevealText>
          </div>
          
          <motion.div 
            className="border-t border-gray-200 dark:border-gray-700 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <p className="text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} PolyDoc. All rights reserved.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-4 md:mt-0">
              Built with modern web technologies
            </p>
          </motion.div>
        </div>
      </footer>

      {/* Google Sign-In Modal */}
      <GoogleSignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </div>
  );
}
