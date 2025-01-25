import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Target, FileCheck, Award, Zap, Search, Bot, Users } from 'lucide-react';

const comparisonData = {
  traditional: {
    title: "Traditional Resume Building",
    metrics: [
      {
        icon: Clock,
        title: "Time Investment",
        value: "4-6 hours",
        description: "Manual formatting and content writing"
      },
      {
        icon: Target,
        title: "ATS Success Rate",
        value: "~30%",
        description: "Lower pass rate due to inconsistent formatting"
      },
      {
        icon: FileCheck,
        title: "Customization Time",
        value: "60+ mins",
        description: "Per job application adjustment"
      },
      {
        icon: Award,
        title: "Interview Rate",
        value: "~15%",
        description: "Standard application success rate"
      }
    ]
  },
  ai: {
    title: "AI-Powered Resume Building",
    metrics: [
      {
        icon: Zap,
        title: "Time Investment",
        value: "15-30 mins",
        description: "Automated formatting and suggestions"
      },
      {
        icon: Search,
        title: "ATS Success Rate",
        value: "~85%",
        description: "Optimized for ATS compatibility"
      },
      {
        icon: Bot,
        title: "Customization Time",
        value: "5 mins",
        description: "AI-powered quick adjustments"
      },
      {
        icon: Users,
        title: "Interview Rate",
        value: "~45%",
        description: "Enhanced success with AI optimization"
      }
    ]
  }
};

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function Comparison() {
  return (
    <div className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-3">
            <span className="relative">
              <span className="absolute inset-0 bg-[linear-gradient(to_left,#4d4d4d,#848484_20%,#ffffff_50%,#848484_80%,#4d4d4d_100%)] bg-clip-text text-transparent blur-[2px] brightness-150"></span>
              <span className="relative bg-[linear-gradient(to_left,#6b6b6b,#848484_20%,#ffffff_50%,#848484_80%,#6b6b6b_100%)] bg-clip-text text-transparent animate-shine-fast">
                AI Tech vs Traditional Resume Building
              </span>
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            See how our AI-powered platform revolutionizes the resume building process compared to traditional methods.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {[comparisonData.traditional, comparisonData.ai].map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              variants={fadeInUpVariant}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-white text-center mb-8">{section.title}</h3>
              <motion.div 
                variants={containerVariant}
                className="grid grid-cols-1 gap-6"
              >
                {section.metrics.map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    variants={fadeInUpVariant}
                    transition={{ duration: 0.3 }}
                    className="bg-[#151524]/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:bg-[#1A1A2E]/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${sectionIndex === 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-purple-500/10 border-purple-500/20'} border`}>
                        <metric.icon className={`w-6 h-6 ${sectionIndex === 0 ? 'text-blue-400' : 'text-purple-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-lg font-medium text-white">{metric.title}</h4>
                          <span className={`text-lg font-bold ${sectionIndex === 0 ? 'text-blue-400' : 'text-purple-400'}`}>
                            {metric.value}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{metric.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-300">
            Join thousands of successful job seekers who have already transformed their job search with our AI-powered platform.
          </p>
          <div className="flex justify-center mt-8">
            <div className="relative group">
              <div className="absolute -inset-[6px] rounded-full border border-purple-400/30 group-hover:border-purple-500/60 transition-colors duration-300"></div>
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-md group-hover:from-purple-500/40 group-hover:to-pink-500/40 transition-colors duration-300"></div>
              <Link to="/pricing">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/90 text-black px-8 py-3 rounded-full font-semibold hover:bg-white/80 transition-all duration-300 shadow-[0_0_15px_rgba(139,91,255,0.3)] group-hover:shadow-[0_0_25px_rgba(139,91,255,0.6)] relative backdrop-blur-sm"
                >
                  Pricing
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
