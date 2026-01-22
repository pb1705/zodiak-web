'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function ComingSoonModal({ 
  isOpen, 
  onClose, 
  title = "Coming Soon",
  message = "We're working hard to bring you this feature. Stay tuned!"
}: ComingSoonModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop with gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998]"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/95 via-[#0F172A]/90 to-[#0F172A]/95" />
            {/* Blur backdrop */}
            <div className="absolute inset-0 backdrop-blur-xl" />
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-[#63B3ED]/5" />
          </motion.div>
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full pointer-events-auto"
            >
              {/* Glassmorphic Card with Premium Styling */}
              <div 
                className="relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.75) 100%)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '0px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 179, 237, 0.1) inset'
                }}
              >
                {/* Animated gradient orb background */}
                <motion.div
                  animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                    opacity: [0.15, 0.25, 0.15]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(99, 179, 237, 0.4) 0%, transparent 70%)',
                    filter: 'blur(40px)'
                  }}
                />
                
                <motion.div
                  animate={{
                    x: [0, -20, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.15, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(129, 140, 248, 0.3) 0%, transparent 70%)',
                    filter: 'blur(35px)'
                  }}
                />

                {/* Content Container */}
                <div className="relative z-10 p-10 md:p-14">
                  {/* Close Button - Premium Styling */}
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center 
                             rounded-full bg-white/[0.03] border border-white/[0.08] 
                             hover:bg-white/[0.06] hover:border-white/[0.15]
                             text-white/40 hover:text-white/80 
                             transition-all duration-300"
                    aria-label="Close"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>

                  {/* Content */}
                  <div className="text-center">
                    {/* Icon with Premium Animation */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.15, 
                        type: "spring", 
                        stiffness: 200,
                        damping: 15
                      }}
                      className="relative mx-auto mb-8 w-24 h-24"
                    >
                      {/* Outer glow ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'conic-gradient(from 0deg, transparent, rgba(99, 179, 237, 0.1), transparent)',
                        }}
                      />
                      
                      {/* Icon container */}
                      <div 
                        className="absolute inset-0 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(99, 179, 237, 0.15) 0%, rgba(129, 140, 248, 0.1) 100%)',
                          border: '1px solid rgba(99, 179, 237, 0.2)',
                          boxShadow: '0 0 30px rgba(99, 179, 237, 0.2), inset 0 0 20px rgba(99, 179, 237, 0.05)'
                        }}
                      >
                        <motion.svg 
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-12 h-12 text-[#63B3ED]" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          style={{ filter: 'drop-shadow(0 0 8px rgba(99, 179, 237, 0.5))' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </motion.svg>
                      </div>
                    </motion.div>

                    {/* Title with Premium Typography */}
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-4xl md:text-5xl font-light mb-5 text-white leading-tight tracking-tight"
                      style={{
                        textShadow: '0 2px 20px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {title}
                    </motion.h2>

                    {/* Message with Elegant Styling */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-base md:text-lg text-white/50 font-light mb-10 leading-relaxed max-w-sm mx-auto"
                    >
                      {message}
                    </motion.p>

                    {/* Premium Button */}
                    <motion.button
                      onClick={onClose}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative px-10 py-4 text-sm tracking-[0.15em] uppercase font-medium
                               bg-[#63B3ED] text-white
                               hover:bg-[#7DD3FC] 
                               transition-all duration-300
                               overflow-hidden group"
                      style={{
                        boxShadow: '0 4px 20px rgba(99, 179, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {/* Button shine effect */}
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                      <span className="relative z-10">Got it</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
