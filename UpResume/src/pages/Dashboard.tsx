import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'Professional' | 'Creative' | 'Simple' | 'Modern';
}

const templates: Template[] = [
  {
    id: 'template1',
    name: 'Professional Classic',
    description: 'Traditional layout perfect for corporate roles',
    thumbnail: '/1.png',
    category: 'Professional'
  },
  {
    id: 'template2',
    name: 'Creative Portfolio',
    description: 'Modern design for creative professionals',
    thumbnail: '/2.png',
    category: 'Creative'
  },
  {
    id: 'template3',
    name: 'Minimalist',
    description: 'Clean and simple design that focuses on content',
    thumbnail: '/3.png',
    category: 'Simple'
  },
  {
    id: 'template4',
    name: 'Tech Modern',
    description: 'Contemporary layout for tech industry',
    thumbnail: '/4.png',
    category: 'Modern'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<Template['category'] | 'All'>('All');

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Dashboard</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Create, customize, and enhance your professional resume
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white/5 rounded-xl space-y-4 flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-white">Create New Resume</h2>
            <p className="text-white/70">
              Build a professional resume from scratch using our intuitive builder.
              Add your experience, education, projects, and skills.
            </p>
            <button
              onClick={() => navigate('/resume-builder')}
              className="w-full px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <span>Start Building</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="p-6 bg-white/5 rounded-xl space-y-4 flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-white">Enhance Your Resume</h2>
            <p className="text-white/70">
              Use AI to improve your existing resume content. Get suggestions for
              better phrasing, achievements, and professional language.
            </p>
            <button
              onClick={() => navigate('/enhance-resume')}
              className="w-full px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <span>Enhance Resume</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="p-6 bg-white/5 rounded-xl space-y-4 flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-white">ATS Score Check</h2>
            <p className="text-white/70">
              Check how well your resume performs against Applicant Tracking Systems.
              Get instant feedback and improvement suggestions.
            </p>
            <button
              onClick={() => navigate('/ats-checker')}
              className="w-full px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <span>Check ATS Score</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a4 4 0 11-8 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your Resumes</h2>
          </div>

          {/* Templates Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Resume Templates</h3>
              <div className="flex gap-2">
                {['All', 'Professional', 'Creative', 'Simple', 'Modern'].map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as Template['category'] | 'All')}
                    className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  className="bg-black/30 rounded-2xl overflow-hidden border border-white/[0.08] group hover:border-purple-500/50 transition-colors"
                >
                  <div className="aspect-[3/4] bg-black/50 relative">
                    <img 
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-white mb-1">{template.name}</h4>
                    <p className="text-white/70 text-sm mb-4">{template.description}</p>
                    <Link
                      to={`/resume/new?template=${template.id}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-colors text-sm"
                    >
                      Use Template
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-md border border-white/[0.08]">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.08]">
                  <div>
                    <h4 className="font-medium text-white">Software Engineer Resume</h4>
                    <p className="text-white/70 text-sm">Last edited 2 days ago</p>
                  </div>
                  <Link 
                    to="/resume/edit/1"
                    className="px-4 py-2 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 transition-colors text-sm"
                  >
                    Edit
                  </Link>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.08]">
                  <div>
                    <h4 className="font-medium text-white">Project Manager CV</h4>
                    <p className="text-white/70 text-sm">Last edited 5 days ago</p>
                  </div>
                  <Link 
                    to="/resume/edit/2"
                    className="px-4 py-2 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 transition-colors text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
