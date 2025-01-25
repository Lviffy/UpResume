import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0F1B] mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/logo.png" alt="Upresume" className="h-8 mb-4" />
            <p className="text-gray-400 text-sm">
              AI-powered resume optimization to help you land your dream job.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-[#E36FFF] text-sm">Features</a></li>
              <li><a href="/pricing" className="text-gray-400 hover:text-[#E36FFF] text-sm">Pricing</a></li>
              <li><a href="#demo" className="text-gray-400 hover:text-[#E36FFF] text-sm">Try Demo</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-[#E36FFF] text-sm">About</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy-policy" className="text-gray-400 hover:text-[#E36FFF] text-sm">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-[#E36FFF] text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm"> {new Date().getFullYear()} Upresume. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#E36FFF]"><Linkedin size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-[#E36FFF]"><Mail size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}