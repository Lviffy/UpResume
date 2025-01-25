import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  const [gridItems, setGridItems] = useState<number>(0);

  useEffect(() => {
    const calculateGrid = () => {
      const vh = Math.ceil(window.innerHeight / 40);
      const vw = Math.ceil(window.innerWidth / 40);
      setGridItems(vh * vw);
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#0A0F1B] to-[#897IFF] relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] auto-rows-[40px] opacity-30">
          {Array.from({ length: gridItems }).map((_, i) => (
            <div
              key={i}
              className="border-[0.5px] border-gray-500/20"
              style={{ aspectRatio: '1/1' }}
            />
          ))}
        </div>
      </div>
      
      {/* Purple Blur Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-700/30 rounded-full blur-[128px]" />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10"
      >
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 text-center"
          >
            Land Your Dream Job with an <br></br>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-[#E36FFF]"
            >
              AI-Powered Resume
            </motion.span>
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-300 mb-4"
          >
            Transform your job applications with our cutting-edge technology.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Upload your resume, paste a job link, and get a perfectly tailored version in seconds.
          </motion.p>
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-[6px] rounded-full border border-purple-400/30 group-hover:border-purple-500/60 transition-colors duration-300"></div>
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-md group-hover:from-purple-500/40 group-hover:to-pink-500/40 transition-colors duration-300"></div>
              <Link to="/dashboard">
                <button className="bg-white/90 text-black px-8 py-3 rounded-full font-semibold hover:bg-white/80 transition-all duration-300 shadow-[0_0_15px_rgba(139,91,255,0.3)] group-hover:shadow-[0_0_25px_rgba(139,91,255,0.6)] relative backdrop-blur-sm">
                  Try Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}