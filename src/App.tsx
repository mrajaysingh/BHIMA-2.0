import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Bot, Brain, Zap, Shield, Users, ArrowRight, Sun, Moon, Menu, X, ChevronUp } from 'lucide-react';
import DecryptedText from './components/DecryptedText';
import Preloader from './components/Preloader';

// Lazy load heavy components for better performance
const Hyperspeed = lazy(() => import('./components/Hyperspeed'));
const Particles = lazy(() => import('./components/Particles'));

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [headerWidth, setHeaderWidth] = useState(100);
  const [isSticky, setIsSticky] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize expensive calculations
  const headerStyle = useMemo(() => ({
    width: `${headerWidth}%`,
    left: `${(100 - headerWidth) / 2}%`,
    borderRadius: headerWidth < 100 ? '40px' : '0px',
    marginTop: headerWidth < 100 ? '12px' : '0px'
  }), [headerWidth]);

  const themeToggleStyle = useMemo(() => ({
    marginTop: headerWidth <= 80 ? '20px' : '0px'
  }), [headerWidth]);

  // Throttle scroll handler for better performance
  const throttledScrollHandler = useCallback(() => {
    let ticking = false;
    
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercentage = (currentScrollY / documentHeight) * 100;

          setScrollY(currentScrollY);

          if (currentScrollY > 0) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }

          if (scrollPercentage >= 2) {
            const widthRange = 30;
            const scrollRange = 23;
            const scrollProgress = Math.min((scrollPercentage - 2) / scrollRange, 1);
            const newWidth = 100 - (widthRange * scrollProgress);
            setHeaderWidth(Math.max(newWidth, 70));
          } else {
            setHeaderWidth(100);
          }

          setShowBackToTop(currentScrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = throttledScrollHandler();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [throttledScrollHandler]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Memoize particle props to prevent unnecessary re-renders
  const particleProps = useMemo(() => ({
    particleCount: 150,
    particleSpread: 8,
    speed: 0.3,
    particleColors: ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"],
    moveParticlesOnHover: true,
    particleHoverFactor: 0.5,
    alphaParticles: true,
    particleBaseSize: 80,
    sizeRandomness: 0.8,
    cameraDistance: 15,
    disableRotation: false,
  }), []);

  return (
    <>
      {/* Preloader */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      
      {/* Main App */}
      <div className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? 'bg-black' : 'bg-gray-50'
      }`}>
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isSticky 
            ? isDarkMode 
              ? 'bg-black/40 backdrop-blur-3xl shadow-2xl border border-gray-700/30' 
              : 'bg-white/40 backdrop-blur-3xl shadow-2xl border border-white/30'
            : isDarkMode 
              ? 'bg-black' 
              : 'bg-white'
        }`}
        style={headerStyle}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 sm:py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-100 to-gray-200' 
                  : 'bg-gradient-to-br from-gray-800 to-gray-900'
              }`}>
                <Bot className={`w-3 h-3 sm:w-5 sm:h-5 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-900' : 'text-white'
                }`} />
              </div>
              <div className="flex flex-col">
                <DecryptedText
                  text="B.H.I.M.A."
                  speed={100}
                  maxIterations={8}
                  sequential={true}
                  revealDirection="start"
                  useOriginalCharsOnly={false}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
                  className={`font-orbitron text-base sm:text-xl font-bold leading-tight tracking-wide transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                  encryptedClassName={`font-orbitron text-base sm:text-xl font-bold leading-tight tracking-wide transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}
                  animateOn="hover"
                />
                <a 
                  href="https://skybersupport.me/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-xs leading-tight -mt-0.5 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  powered by SKYBER
                </a>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <a href="#features" className={`transition-colors text-sm ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}>Features</a>
              <a href="#about" className={`transition-colors text-sm ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}>About</a>
              <a href="#pricing" className={`transition-colors text-sm ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}>Pricing</a>
              {/* Theme Toggle Inside Header - Only visible when header width is 100% */}
              <button
                onClick={toggleTheme}
                className={`w-7 h-7 xl:w-8 xl:h-8 rounded-full flex items-center justify-center transition-all duration-700 hover:scale-105 ${
                  headerWidth === 100 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
                } ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {isDarkMode ? (
                  <Sun className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`} />
                ) : (
                  <Moon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`} />
                )}
              </button>
              <button className={`px-3 py-1.5 xl:px-4 xl:py-2 rounded-full transition-all duration-300 hover:scale-105 text-sm ${
                isDarkMode 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}>
                Get Started
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {isDarkMode ? (
                  <Sun className={`w-4 h-4 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`} />
                ) : (
                  <Moon className={`w-4 h-4 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`} />
                )}
              </button>
              <button
                onClick={toggleMobileMenu}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`} />
                ) : (
                  <Menu className={`w-4 h-4 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden ${
          isSticky 
            ? isDarkMode 
              ? 'bg-black/40 backdrop-blur-3xl border-t border-gray-700/30' 
              : 'bg-white/40 backdrop-blur-3xl border-t border-white/30'
            : isDarkMode 
              ? 'bg-black/95 backdrop-blur-md border-t border-gray-700' 
              : 'bg-white/95 backdrop-blur-md border-t border-slate-200'
        }`}>
          <nav className="px-4 py-2 space-y-2">
            <a 
              href="#features" 
              onClick={closeMobileMenu}
              className={`block transition-colors py-1.5 text-sm font-medium ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Features
            </a>
            <a 
              href="#about" 
              onClick={closeMobileMenu}
              className={`block transition-colors py-1.5 text-sm font-medium ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About
            </a>
            <a 
              href="#pricing" 
              onClick={closeMobileMenu}
              className={`block transition-colors py-1.5 text-sm font-medium ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pricing
            </a>
            <button 
              onClick={closeMobileMenu}
              className={`w-full px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium mt-3 ${
                isDarkMode 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Theme Toggle - Outside Header */}
      <div 
        className={`hidden lg:block fixed top-0 right-4 xl:right-6 z-40 transition-all duration-700 ease-out ${
          headerWidth < 100 && headerWidth <= 80 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={themeToggleStyle}
      >
        <button
          onClick={toggleTheme}
          className={`w-8 h-8 xl:w-10 xl:h-10 backdrop-blur-3xl shadow-2xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-black/40 hover:bg-black/60 border border-gray-700/30' 
              : 'bg-white/40 hover:bg-white/60 border border-white/30'
          }`}
        >
          {isDarkMode ? (
            <Sun className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`} />
          ) : (
            <Moon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`} />
          )}
        </button>
      </div>

      {/* Back to Top Button */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${
          showBackToTop 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          className={`group relative w-12 h-12 backdrop-blur-3xl shadow-2xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
            isDarkMode 
              ? 'bg-black/40 hover:bg-black/60 border border-gray-700/30' 
              : 'bg-white/40 hover:bg-white/60 border border-white/30'
          }`}
          aria-label="Back to top"
        >
          {/* Animated background pulse */}
          <div className={`absolute inset-0 rounded-full transition-all duration-300 group-hover:scale-110 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
              : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
          }`}></div>
          
          {/* Icon with bounce animation */}
          <ChevronUp className={`relative z-10 w-5 h-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 ${
            isDarkMode ? 'text-gray-200' : 'text-slate-700'
          }`} />
          
          {/* Subtle glow effect */}
          <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isDarkMode 
              ? 'shadow-lg shadow-blue-500/25' 
              : 'shadow-lg shadow-blue-500/15'
          }`}></div>
        </button>
      </div>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative w-full flex items-center justify-center text-center" style={{ height: '100vh' }}>
          {/* Animated Background - Dark Theme: Hyperspeed, Light Theme: Particles */}
          {isDarkMode && !isLoading && (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <Suspense fallback={<div className="w-full h-full bg-black" />}>
                <Hyperspeed />
              </Suspense>
            </div>
          )}
          
          {!isDarkMode && !isLoading && (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <Suspense fallback={<div className="w-full h-full bg-gray-50" />}>
                <Particles {...particleProps} />
              </Suspense>
            </div>
          )}
          
          {/* Content */}
          <div className="relative z-10 mb-8 px-4 sm:px-6 lg:px-8">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              The Future of 
              <span className={`block transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>Intelligent Conversation</span>
            </h1>
            <p className={`text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4 transition-colors duration-500 ${
              isDarkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Experience{' '}
              <DecryptedText
                text="B.H.I.M.A."
                speed={100}
                maxIterations={8}
                sequential={true}
                revealDirection="start"
                useOriginalCharsOnly={false}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
                className={`font-orbitron font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
                encryptedClassName={`font-orbitron font-bold ${
                  isDarkMode ? 'text-gray-400' : 'text-slate-500'
                }`}
                animateOn="hover"
              />{' '}
              - next-generation AI that understands context, provides accurate answers, 
              and learns from every interaction to deliver personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 hover:scale-105 font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base ${
                isDarkMode 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}>
                <span>Start Chatting</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button className={`border-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 hover:scale-105 font-semibold text-sm sm:text-base ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-200 hover:border-gray-500' 
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}>
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* Smooth Transition Gradient */}
          <div className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none transition-opacity duration-500 ${
            isDarkMode 
              ? 'bg-gradient-to-t from-black via-black/80 to-transparent' 
              : 'bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent'
          }`}></div>
        </section>

        {/* Transition Buffer Section */}
        <div className={`relative w-full h-16 transition-colors duration-500 ${
          isDarkMode ? 'bg-black' : 'bg-gray-50'
        }`}>
          {/* Subtle blur overlay for smooth transition */}
          <div className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-500 ${
            isDarkMode 
              ? 'bg-black/20' 
              : 'bg-gray-50/20'
          }`}></div>
        </div>

        {/* Features Section */}
        <section id="features" className={`relative w-full sm:w-11/12 lg:w-4/5 mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center transition-colors duration-500 ${
          isDarkMode ? 'bg-black' : 'bg-gray-50'
        }`}>
          {/* Subtle top gradient for seamless blend */}
          <div className={`absolute top-0 left-0 right-0 h-8 pointer-events-none transition-opacity duration-500 ${
            isDarkMode 
              ? 'bg-gradient-to-b from-black/60 to-transparent' 
              : 'bg-gradient-to-b from-gray-50/60 to-transparent'
          }`}></div>
          
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4">
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>Why Choose B.H.I.M.A.?</h2>
            <p className={`text-base sm:text-lg lg:text-xl max-w-xl lg:max-w-2xl mx-auto transition-colors duration-500 ${
              isDarkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Built with cutting-edge technology to provide seamless, intelligent, and secure conversations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-slate-100'
            }`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto transition-colors duration-500 ${
                isDarkMode ? 'bg-gray-700' : 'bg-slate-100'
              }`}>
                <Brain className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-200' : 'text-slate-700'
                }`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>Advanced AI</h3>
              <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Powered by state-of-the-art language models that understand context and provide human-like responses.
              </p>
            </div>
            <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-slate-100'
            }`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto transition-colors duration-500 ${
                isDarkMode ? 'bg-gray-700' : 'bg-slate-100'
              }`}>
                <Zap className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-200' : 'text-slate-700'
                }`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>Lightning Fast</h3>
              <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Get instant responses with our optimized infrastructure designed for speed and reliability.
              </p>
            </div>
            <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 hover:scale-105 md:col-span-2 lg:col-span-1 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-slate-100'
            }`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto transition-colors duration-500 ${
                isDarkMode ? 'bg-gray-700' : 'bg-slate-100'
              }`}>
                <Shield className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-200' : 'text-slate-700'
                }`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>Secure & Private</h3>
              <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Your conversations are encrypted and private. We never store or share your personal data.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className={`relative w-full sm:w-11/12 lg:w-4/5 mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center transition-colors duration-500 ${
          isDarkMode ? 'bg-black' : 'bg-gray-50'
        }`}>
          <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm border transition-colors duration-500 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-slate-100'
          }`}>
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>Revolutionizing Communication</h2>
              <p className={`text-base sm:text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                <DecryptedText
                  text="B.H.I.M.A."
                  speed={100}
                  maxIterations={8}
                  sequential={true}
                  revealDirection="start"
                  useOriginalCharsOnly={false}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
                  className={`font-orbitron font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                  encryptedClassName={`font-orbitron font-bold ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}
                  animateOn="hover"
                />{' '}
                represents the next evolution in artificial intelligence, designed to understand, 
                learn, and adapt to provide the most relevant and helpful responses for every user.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center max-w-5xl mx-auto">
              <div>
                <h3 className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>Intelligent by Design</h3>
                <p className={`text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  <DecryptedText
                    text="B.H.I.M.A."
                    speed={100}
                    maxIterations={8}
                    sequential={true}
                    revealDirection="start"
                    useOriginalCharsOnly={false}
                    characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
                    className={`font-orbitron font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                    encryptedClassName={`font-orbitron font-bold ${
                      isDarkMode ? 'text-gray-400' : 'text-slate-500'
                    }`}
                    animateOn="hover"
                  />{' '}
                  doesn't just respond—it understands. Through advanced natural language processing 
                  and machine learning, our AI provides contextually relevant answers that feel natural 
                  and helpful.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                      isDarkMode ? 'bg-white' : 'bg-slate-900'
                    }`}></div>
                    <span className={`text-sm sm:text-base transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>Multi-language support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                      isDarkMode ? 'bg-white' : 'bg-slate-900'
                    }`}></div>
                    <span className={`text-sm sm:text-base transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>Real-time learning</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                      isDarkMode ? 'bg-white' : 'bg-slate-900'
                    }`}></div>
                    <span className={`text-sm sm:text-base transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>Contextual awareness</span>
                  </li>
                </ul>
              </div>
              <div className={`rounded-2xl p-6 sm:p-8 text-center transition-colors duration-500 ${
                isDarkMode ? 'bg-gray-700' : 'bg-slate-50'
              }`}>
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-colors duration-500 ${
                  isDarkMode ? 'bg-white' : 'bg-slate-900'
                }`}>
                  <Users className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-900' : 'text-white'
                  }`} />
                </div>
                <div className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>1M+</div>
                <div className={`text-sm sm:text-base transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>Active Users</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className={`relative w-full sm:w-11/12 lg:w-4/5 mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center transition-colors duration-500 ${
          isDarkMode ? 'bg-black' : 'bg-gray-50'
        }`}>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4">
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>Simple, Transparent Pricing</h2>
            <p className={`text-base sm:text-lg lg:text-xl transition-colors duration-500 ${
              isDarkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>Choose the plan that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-slate-100'
            }`}>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>Starter</h3>
              <div className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>Free</div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center space-x-2">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                    isDarkMode ? 'bg-white' : 'bg-slate-900'
                  }`}></div>
                  <span className={`text-sm sm:text-base transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>100 messages/month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                    isDarkMode ? 'bg-white' : 'bg-slate-900'
                  }`}></div>
                  <span className={`text-sm sm:text-base transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>Basic support</span>
                </li>
              </ul>
              <button className={`w-full border-2 py-2.5 sm:py-3 rounded-full transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-200 hover:border-gray-500' 
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}>
                Get Started
              </button>
            </div>
            <div className={`p-6 sm:p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 md:scale-105 ${
              isDarkMode 
                ? 'bg-white text-gray-900' 
                : 'bg-slate-900 text-white'
            }`}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Pro</h3>
              <div className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">$19<span className="text-sm font-normal">/month</span></div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center space-x-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isDarkMode ? 'bg-gray-900' : 'bg-white'
                  }`}></div>
                  <span className="text-sm sm:text-base">Unlimited messages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isDarkMode ? 'bg-gray-900' : 'bg-white'
                  }`}></div>
                  <span className="text-sm sm:text-base">Priority support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isDarkMode ? 'bg-gray-900' : 'bg-white'
                  }`}></div>
                  <span className="text-sm sm:text-base">Advanced features</span>
                </li>
              </ul>
              <button className={`w-full py-2.5 sm:py-3 rounded-full transition-all duration-300 hover:scale-105 font-semibold text-sm sm:text-base ${
                isDarkMode 
                  ? 'bg-gray-900 text-white hover:bg-gray-800' 
                  : 'bg-white text-slate-900 hover:bg-slate-50'
              }`}>
                Choose Pro
              </button>
            </div>
            <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-slate-100'
            }`}>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>Enterprise</h3>
              <div className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>Custom</div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center space-x-2">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                    isDarkMode ? 'bg-white' : 'bg-slate-900'
                  }`}></div>
                  <span className={`text-sm sm:text-base transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>Custom integrations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                    isDarkMode ? 'bg-white' : 'bg-slate-900'
                  }`}></div>
                  <span className={`text-sm sm:text-base transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>Dedicated support</span>
                </li>
              </ul>
              <button className={`w-full border-2 py-2.5 sm:py-3 rounded-full transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-200 hover:border-gray-500' 
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}>
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`relative w-full sm:w-11/12 lg:w-4/5 mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center max-w-4xl transition-colors duration-500 ${
          isDarkMode ? 'bg-black' : 'bg-gray-50'
        }`}>
          <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 transition-colors duration-500 ${
            isDarkMode 
              ? 'bg-white text-gray-900' 
              : 'bg-slate-900 text-white'
          }`}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Ready to Experience the Future?</h2>
            <p className={`text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-600' : 'text-slate-300'
            }`}>
              Join millions of users who are already experiencing the power of intelligent conversation.
            </p>
            <button className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 hover:scale-105 font-semibold text-sm sm:text-base ${
              isDarkMode 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-white text-slate-900 hover:bg-slate-50'
            }`}>
              Start Your Journey
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`w-full transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-black text-white' 
          : 'bg-slate-900 text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500 ${
                  isDarkMode ? 'bg-gray-100' : 'bg-white'
                }`}>
                  <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-gray-900" />
                </div>
                <div className="flex flex-col">
                  <DecryptedText
                    text="B.H.I.M.A."
                    speed={100}
                    maxIterations={8}
                    sequential={true}
                    revealDirection="start"
                    useOriginalCharsOnly={false}
                    characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
                    className="font-orbitron text-base sm:text-xl font-bold leading-tight tracking-wide text-white"
                    encryptedClassName="font-orbitron text-base sm:text-xl font-bold leading-tight tracking-wide text-gray-400"
                    animateOn="hover"
                  />
                  <a 
                    href="https://skybersupport.me/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-xs leading-tight -mt-0.5 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-gray-500 hover:text-gray-400' 
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    powered by SKYBER
                  </a>
                </div>
              </div>
              <p className={`text-sm sm:text-base ${
                isDarkMode ? 'text-gray-500' : 'text-slate-400'
              }`}>
                The future of intelligent conversation is here.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className={`space-y-1.5 sm:space-y-2 ${
                isDarkMode ? 'text-gray-500' : 'text-slate-400'
              }`}>
                <li><a href="#features" className="hover:text-white transition-colors text-sm sm:text-base">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors text-sm sm:text-base">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm sm:text-base">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className={`space-y-1.5 sm:space-y-2 ${
                isDarkMode ? 'text-gray-500' : 'text-slate-400'
              }`}>
                <li><a href="#about" className="hover:text-white transition-colors text-sm sm:text-base">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm sm:text-base">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm sm:text-base">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className={`space-y-1.5 sm:space-y-2 ${
                isDarkMode ? 'text-gray-500' : 'text-slate-400'
              }`}>
                <li><a href="#" className="hover:text-white transition-colors text-sm sm:text-base">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm sm:text-base">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm sm:text-base">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className={`border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center ${
            isDarkMode 
              ? 'border-gray-700 text-gray-500' 
              : 'border-slate-800 text-slate-400'
          }`}>
            <p className="text-sm sm:text-base">
              &copy; 2024{' '}
              <DecryptedText
                text="B.H.I.M.A."
                speed={100}
                maxIterations={8}
                sequential={true}
                revealDirection="start"
                useOriginalCharsOnly={false}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
                className={`font-orbitron font-bold ${
                  isDarkMode ? 'text-gray-400' : 'text-slate-400'
                }`}
                encryptedClassName={`font-orbitron font-bold ${
                  isDarkMode ? 'text-gray-600' : 'text-slate-600'
                }`}
                animateOn="hover"
              />{' '}
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

export default React.memo(App);