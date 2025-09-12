import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
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
  Star,
  Sparkles,
  BookOpen,
  Brain,
  Cpu,
  Database
} from 'lucide-react';

// Cinematic background with moving gradients
function CinematicBackground() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 50, -100, 0],
          scale: [1, 0.8, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E')]" />
    </div>
  );
}

// Smooth text reveal with better animation
function SmoothTextReveal({ children, delay = 0, className = "", staggerChildren = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: staggerChildren ? 0.1 : 0,
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)"
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div ref={ref} className={className}>
      <motion.div
        variants={staggerChildren ? containerVariants : itemVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {staggerChildren ? 
          React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          )) : children
        }
      </motion.div>
    </div>
  );
}

// Floating geometric shapes
function FloatingShapes() {
  const shapes = [
    { size: 20, delay: 0, duration: 15 },
    { size: 30, delay: 2, duration: 20 },
    { size: 15, delay: 4, duration: 18 },
    { size: 25, delay: 1, duration: 22 },
    { size: 18, delay: 3, duration: 16 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/5 rounded-lg"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  );
}

// Google Sign-In Modal
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateX: -90 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotateX: 90 }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="text-center space-y-6">
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
                PolyDoc
              </h2>
            </motion.div>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to access your documents and start processing them with our intelligent platform.
              </p>
            </motion.div>

            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                onClick={handleGoogleSignIn}
                size="lg" 
                className="w-full bg-white hover:bg-gray-50 text-black border border-gray-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </motion.div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Enhanced Lenis with more cinematic settings
  useLenis({
    duration: 2.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: "vertical",
    gestureDirection: "vertical",
    smoothTouch: true,
    touchMultiplier: 3,
    infinite: false
  });

  // Advanced scroll effects
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 50, 
    damping: 20, 
    restDelta: 0.001 
  });
  
  // Complex parallax transforms
  const heroY = useTransform(smoothProgress, [0, 1], [0, -300]);
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 0.8]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(smoothProgress, [0, 1], [0, 100]);

  return (
    <div ref={containerRef} className="relative overflow-x-hidden">
      {/* Cinematic Background */}
      <motion.div style={{ y: bgY }}>
        <CinematicBackground />
      </motion.div>
      
      {/* Floating Shapes */}
      <FloatingShapes />
      
      {/* Navbar with glassmorphism */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-2xl border-b border-white/10" />
        <div className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse opacity-75 -z-10" />
              </motion.div>
              
              <div>
                <motion.h1 
                  className="text-2xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  style={{ lineHeight: '1.2' }}
                >
                  PolyDoc
                </motion.h1>
                <p className="text-xs text-white/70 -mt-1">Intelligent Processing</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {["Features", "About"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.8, duration: 0.6 }}
                  className="px-6 py-3 text-white/90 hover:text-white font-medium transition-all duration-300 relative group"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
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
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setShowSignInModal(true)}
                    className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
                  >
                    Sign In
                  </Button>
                  <motion.div 
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59,130,246,0.3)" }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => setShowSignInModal(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-2xl shadow-2xl border-0"
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-2xl shadow-2xl"
                  >
                    Dashboard
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* CINEMATIC HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div 
          className="container mx-auto px-6 text-center relative z-20"
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        >
          
          {/* Epic Badge */}
          <SmoothTextReveal delay={1.2} className="mb-12">
            <motion.div
              className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 text-white text-base font-semibold shadow-2xl"
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 25px 50px rgba(59,130,246,0.25)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 mr-3" />
              </motion.div>
              Revolutionary Document Intelligence Platform
            </motion.div>
          </SmoothTextReveal>

          {/* MASSIVE CINEMATIC TITLE - Fixed text cutoff */}
          <div className="mb-16 space-y-8">
            <SmoothTextReveal delay={1.5}>
              <motion.h1 
                className="text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-black tracking-tighter leading-[0.85]"
                style={{ 
                  lineHeight: '0.85',
                  letterSpacing: '-0.05em'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <span className="block bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                  Poly
                </span>
                <span className="block bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl -mt-4">
                  Doc
                </span>
              </motion.h1>
            </SmoothTextReveal>
            
            <SmoothTextReveal delay={1.8}>
              <motion.h2 
                className="text-2xl md:text-4xl lg:text-5xl font-light text-white/80 tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.8 }}
              >
                Next-Generation Document Processing
              </motion.h2>
            </SmoothTextReveal>

            <SmoothTextReveal delay={2.1}>
              <motion.div 
                className="w-40 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 2.1, ease: "easeOut" }}
              />
            </SmoothTextReveal>
          </div>

          {/* Enhanced Description */}
          <SmoothTextReveal delay={2.4} className="mb-16">
            <p className="text-xl md:text-2xl lg:text-3xl text-white/70 max-w-5xl mx-auto leading-relaxed font-light">
              Transform your documents with 
              <motion.span 
                className="text-blue-300 font-medium"
                whileHover={{ textShadow: "0 0 20px rgba(59,130,246,0.5)" }}
              > cutting-edge AI</motion.span>, 
              <motion.span 
                className="text-purple-300 font-medium"
                whileHover={{ textShadow: "0 0 20px rgba(147,51,234,0.5)" }}
              > intelligent extraction</motion.span>, and 
              <motion.span 
                className="text-pink-300 font-medium"
                whileHover={{ textShadow: "0 0 20px rgba(236,72,153,0.5)" }}
              > seamless workflows</motion.span>.
            </p>
          </SmoothTextReveal>

          {/* Epic CTA Button */}
          <SmoothTextReveal delay={2.7} className="mb-20">
            <motion.div
              whileHover={{ 
                scale: 1.05,
                y: -5,
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                size="lg"
                onClick={() => setShowSignInModal(true)}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl border-0 relative overflow-hidden"
                style={{
                  boxShadow: "0 25px 50px rgba(59,130,246,0.3), 0 0 100px rgba(147,51,234,0.2)"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                Start Processing Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="ml-3 w-6 h-6" />
                </motion.div>
              </Button>
            </motion.div>
          </SmoothTextReveal>

          {/* Animated Stats */}
          <SmoothTextReveal delay={3.0}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { number: "50+", label: "Languages", icon: Globe, color: "from-blue-400 to-cyan-400" },
                { number: "99%", label: "Accuracy", icon: Target, color: "from-purple-400 to-pink-400" },
                { number: "1M+", label: "Documents", icon: FileText, color: "from-green-400 to-emerald-400" },
                { number: "24/7", label: "Available", icon: Zap, color: "from-orange-400 to-red-400" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  custom={index}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                      {stat.number}
                    </div>
                    <div className="text-white/70 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SmoothTextReveal>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <motion.div 
              className="w-1.5 h-4 bg-white/60 rounded-full mt-2"
              animate={{ scaleY: [1, 0.3, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section with Parallax */}
      <motion.section 
        id="features" 
        className="py-32 bg-black/20 backdrop-blur-xl relative"
        style={{ y: useTransform(smoothProgress, [0.2, 1], [0, -100]) }}
      >
        <div className="container mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center mb-24">
            <SmoothTextReveal delay={0.2}>
              <motion.div
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 text-white text-sm font-medium mb-8 shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Cpu className="w-4 h-4 mr-2" />
                Advanced Capabilities
              </motion.div>
            </SmoothTextReveal>
            
            <SmoothTextReveal delay={0.4}>
              <h2 className="text-6xl md:text-7xl font-black text-white mb-8 leading-tight">
                Powerful
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Features
                </span>
              </h2>
            </SmoothTextReveal>
            
            <SmoothTextReveal delay={0.6}>
              <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed font-light">
                Revolutionary technology that transforms how you interact with documents,
                preserving layouts while extracting intelligent insights with unprecedented accuracy.
              </p>
            </SmoothTextReveal>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-8xl mx-auto">
            {[
              { 
                icon: FileText, 
                title: "Multi-Format Support", 
                desc: "Process PDFs, Word docs, PowerPoint, and images with unprecedented accuracy and speed.", 
                gradient: "from-cyan-500 to-blue-500" 
              },
              { 
                icon: Brain, 
                title: "AI-Powered Analysis", 
                desc: "Advanced machine learning models understand context, structure, and meaning in your documents.", 
                gradient: "from-purple-500 to-pink-500" 
              },
              { 
                icon: Globe, 
                title: "50+ Languages", 
                desc: "Support for multilingual documents with mixed-script processing capabilities.", 
                gradient: "from-emerald-500 to-teal-500" 
              },
              { 
                icon: Shield, 
                title: "Enterprise Security", 
                desc: "Bank-level encryption and security protocols protect your sensitive documents.", 
                gradient: "from-orange-500 to-red-500" 
              },
              { 
                icon: Zap, 
                title: "Lightning Fast", 
                desc: "Real-time processing with instant results and comprehensive analysis feedback.", 
                gradient: "from-yellow-500 to-orange-500" 
              },
              { 
                icon: Database, 
                title: "Smart Storage", 
                desc: "Intelligent document organization with powerful search and retrieval capabilities.", 
                gradient: "from-indigo-500 to-purple-500" 
              }
            ].map((feature, index) => (
              <SmoothTextReveal key={index} delay={index * 0.1} className="h-full">
                <motion.div 
                  className="h-full group cursor-pointer"
                  whileHover={{ y: -10, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                    />
                    
                    {/* Feature Icon */}
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Feature Content */}
                    <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors text-lg">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              </SmoothTextReveal>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        id="about" 
        className="py-32 bg-gradient-to-b from-black/20 to-black/40 backdrop-blur-xl"
        style={{ y: useTransform(smoothProgress, [0.4, 1], [0, -50]) }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-8xl mx-auto text-center">
            <SmoothTextReveal delay={0.2}>
              <motion.div
                className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-medium mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <Info className="w-4 h-4 mr-2" />
                About PolyDoc
              </motion.div>
            </SmoothTextReveal>
            
            <SmoothTextReveal delay={0.4}>
              <h2 className="text-6xl md:text-7xl font-black text-white mb-12 leading-tight">
                Transforming Document
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h2>
            </SmoothTextReveal>
            
            <SmoothTextReveal delay={0.6}>
              <p className="text-xl text-white/70 leading-relaxed mb-16 max-w-5xl mx-auto font-light">
                PolyDoc represents the next generation of document intelligence. Our platform combines 
                cutting-edge AI technology with intuitive design to deliver unprecedented accuracy 
                and efficiency in document processing, analysis, and understanding.
              </p>
            </SmoothTextReveal>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-6 py-16">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-3xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                PolyDoc
              </span>
            </div>
            
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              Revolutionary document processing platform with intelligent extraction,
              multi-format support, and seamless workflow integration.
            </p>
            
            <div className="flex justify-center space-x-6 mb-8">
              {[Github, Twitter, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-8">
              <p className="text-white/40 text-sm">
                &copy; {new Date().getFullYear()} PolyDoc. All rights reserved.
              </p>
            </div>
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
