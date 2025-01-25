import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Supercharge = () => {
  return (
    <div className="py-32 relative overflow-hidden">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent" />
      
      {/* Brighter bottom-centered glowing orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/40 via-fuchsia-500/40 to-purple-600/40 rounded-full blur-[100px] opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
            Ready To Supercharge Your Resume?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Start Your Free Trial Today And See Results In No Time. Transform Your Job Search With Our AI-Powered Resume Builder Designed To Boost Your Success Rate
          </p>
          
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-[6px] rounded-full border border-purple-400/30 group-hover:border-purple-500/60 transition-colors duration-300"></div>
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-md group-hover:from-purple-500/40 group-hover:to-pink-500/40 transition-colors duration-300"></div>
              <Link to="/upload">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/90 text-black px-8 py-3 rounded-full font-semibold hover:bg-white/80 transition-all duration-300 shadow-[0_0_15px_rgba(139,91,255,0.3)] group-hover:shadow-[0_0_25px_rgba(139,91,255,0.6)] relative backdrop-blur-sm"
                >
                  Try Now
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Supercharge;
