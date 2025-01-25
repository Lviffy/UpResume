import React, { useState, useRef } from 'react';

export default function Upload() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsOptimizing(true);
    // Add your optimization logic here
    setTimeout(() => setIsOptimizing(false), 2000); // Temporary simulation
  };

  return (
    <div className="bg-gradient-to-r from-[#0A0F1B] to-[#897IFF] min-h-screen flex items-center justify-center px-4">
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Optimize Your Resume
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PDF Upload */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Upload Resume (PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                
                {pdfFile ? (
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
                    <span className="text-white text-sm truncate">{pdfFile.name}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="ml-2 text-white hover:text-red-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-3 rounded-lg border border-dashed border-white/30 text-white/80 hover:border-white/50 hover:text-white transition-colors text-sm text-center"
                  >
                    Click to upload PDF
                  </button>
                )}
              </div>
            </div>

            {/* LinkedIn Job URL */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                LinkedIn Job URL
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://www.linkedin.com/jobs/..."
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Optimize Button */}
            <button
              type="submit"
              disabled={isOptimizing || !pdfFile || !jobUrl}
              className={`w-full py-3 rounded-full font-semibold transition-all duration-300
                ${isOptimizing || !pdfFile || !jobUrl
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-white/90 text-black hover:bg-white/80 shadow-[0_0_15px_rgba(139,91,255,0.3)] hover:shadow-[0_0_25px_rgba(139,91,255,0.6)]'
                }`}
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize Resume'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
