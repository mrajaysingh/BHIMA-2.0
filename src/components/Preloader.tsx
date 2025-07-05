import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap, Brain, Shield } from 'lucide-react';
import DecryptedText from './DecryptedText';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadingSteps = useMemo(() => [
    { icon: Bot, text: "Initializing B.H.I.M.A.", duration: 800 },
    { icon: Brain, text: "Loading Neural Networks", duration: 600 },
    { icon: Zap, text: "Optimizing Performance", duration: 500 },
    { icon: Shield, text: "Securing Connections", duration: 400 },
  ], []);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.userSelect = '';
      onComplete();
    }, 800);
  }, [onComplete]);

  useEffect(() => {
    // Disable scrolling and right-click
    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';
    
    const handleContextMenu = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    const startTime = Date.now();
    const minimumDuration = 6000; // 6 seconds minimum
    let totalDuration = 0;
    let currentTime = 0;

    // Calculate total duration
    loadingSteps.forEach(step => {
      totalDuration += step.duration;
    });

    // Ensure total duration is at least the minimum duration
    if (totalDuration < minimumDuration) {
      totalDuration = minimumDuration;
    }
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsedTime / totalDuration) * 100);
      setProgress(newProgress);

      // Update current step based on progress
      const stepProgress = (newProgress / 100) * loadingSteps.length;
      const newStep = Math.min(Math.floor(stepProgress), loadingSteps.length - 1);
      setCurrentStep(newStep);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(handleComplete, 500);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
      document.body.style.userSelect = '';
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [loadingSteps, handleComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'grid-move 20s linear infinite'
            }}></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0
                }}
                animate={{
                  y: [null, -100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center px-8 max-w-md w-full">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shadow-2xl border border-gray-700">
                <Bot className="w-10 h-10 text-white" />
                
                {/* Pulsing Ring */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl border-2 border-white/50"
                />
                
                {/* Outer Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 rounded-2xl border border-gray-500/30"
                />
              </div>
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-8"
            >
              <DecryptedText
                text="B.H.I.M.A."
                speed={80}
                maxIterations={12}
                sequential={true}
                revealDirection="center"
                useOriginalCharsOnly={false}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
                className="font-orbitron text-4xl font-bold text-white"
                encryptedClassName="font-orbitron text-4xl font-bold text-gray-400"
                animateOn="view"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="text-gray-400 text-sm mt-2 font-light tracking-wider"
              >
                ADVANCED INTELLIGENCE SYSTEM
              </motion.p>
            </motion.div>

            {/* Loading Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-8 h-8 rounded-lg bg-white/10 border border-gray-600 flex items-center justify-center"
                >
                  {React.createElement(loadingSteps[currentStep]?.icon || Bot, {
                    className: "w-4 h-4 text-white"
                  })}
                </motion.div>
                <motion.span
                  key={`text-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-gray-300 text-sm font-medium"
                >
                  {loadingSteps[currentStep]?.text || "Loading..."}
                </motion.span>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-2 bg-gray-900 border border-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-gray-600 to-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-80, 320] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Progress Percentage */}
              <motion.div
                className="mt-3 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <span className="text-white font-mono text-lg font-bold">
                  {Math.round(progress)}%
                </span>
              </motion.div>
            </motion.div>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex justify-center space-x-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gray-500/50"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gray-500/50"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gray-500/50"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gray-500/50"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(Preloader);