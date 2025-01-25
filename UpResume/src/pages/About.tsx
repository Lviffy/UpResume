import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0A0F1B] to-[#897IFF] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">About Upresume</h1>
          <p className="text-xl text-gray-400">Empowering job seekers with AI-powered resume optimization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
            <p className="text-gray-400">
              At Upresume, we're on a mission to revolutionize the job search process. We believe everyone deserves a fair chance at their dream job, and your resume shouldn't be a barrier to getting there.
            </p>
            <p className="text-gray-400">
              Using cutting-edge AI technology, we help job seekers optimize their resumes to better match job descriptions, increasing their chances of landing interviews and ultimately, their ideal positions.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Our Vision</h2>
            <p className="text-gray-400">
              We envision a future where the job application process is more transparent, efficient, and fair. Where candidates are evaluated based on their true potential, not just their ability to write the perfect resume.
            </p>
            <p className="text-gray-400">
              Through continuous innovation and improvement of our AI algorithms, we're working to make this vision a reality.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#1A1F2B] p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Innovation</h3>
            <p className="text-gray-400">
              We leverage the latest advancements in AI and machine learning to provide cutting-edge resume optimization solutions.
            </p>
          </div>
          <div className="bg-[#1A1F2B] p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Accessibility</h3>
            <p className="text-gray-400">
              We believe career advancement tools should be accessible to everyone, regardless of their background or experience level.
            </p>
          </div>
          <div className="bg-[#1A1F2B] p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Support</h3>
            <p className="text-gray-400">
              Our team is committed to providing exceptional support and guidance throughout your resume optimization journey.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-6">Ready to Optimize Your Resume?</h2>
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-[6px] rounded-full border border-purple-400/30 group-hover:border-purple-500/60 transition-colors duration-300"></div>
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-md group-hover:from-purple-500/40 group-hover:to-pink-500/40 transition-colors duration-300"></div>
              <Link to="/upload">
                <button className="bg-white/90 text-black px-8 py-3 rounded-full font-semibold hover:bg-white/80 transition-all duration-300 shadow-[0_0_15px_rgba(139,91,255,0.3)] group-hover:shadow-[0_0_25px_rgba(139,91,255,0.6)] relative backdrop-blur-sm">
                  Try Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;