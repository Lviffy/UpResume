import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Comparison from './components/Comparison';
import Footer from './components/Footer';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';
import Upload from './pages/Upload';
import ResumeTips from './components/ResumeTips';
import Reviews from './components/Reviews';
import Supercharge from './components/Supercharge';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthCallback from './components/auth/AuthCallback';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ResetPassword from './components/auth/ResetPassword';
import ResumeBuilder from './pages/ResumeBuilder';
import EnhanceResume from './pages/EnhanceResume';
import ATSChecker from './pages/ATSChecker';

// Layout component
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#0B0B1F] overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-purple-900/10 to-[#0B0B1F]" />
      
      {/* Glowing orbs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px]" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow pt-14">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

// Main page content
const MainContent = () => {
  return (
    <>
      <Hero />
      <div id="features" className="pt-32">
        <Features />
      </div>
      <div id="how-it-works" className="pt-32">
        <HowItWorks />
      </div>
      <div id="comparison" className="pt-32">
        <Comparison />
      </div>
      <div id="resume-tips" className="pt-32">
        <ResumeTips />
      </div>
      <div id="reviews" className="pt-32">
        <Reviews />
      </div>
      <div id="supercharge">
        <Supercharge />
      </div>
    </>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Layout><MainContent /></Layout>} />
      <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
      <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      
      {/* Protected routes */}
      <Route 
        path="/upload" 
        element={
          <ProtectedRoute>
            <Layout><Upload /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/resume-builder" 
        element={
          <ProtectedRoute>
            <Layout><ResumeBuilder /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/enhance-resume" 
        element={
          <ProtectedRoute>
            <Layout><EnhanceResume /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ats-checker" 
        element={
          <ProtectedRoute>
            <Layout>
              <ATSChecker />
            </Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;