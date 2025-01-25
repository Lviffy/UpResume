import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import PDFViewer from '../components/PDFViewer';

interface ResumeSection {
    title: string;
    content: string;
    suggestions: string[];
    loading: boolean;
}

interface ATSStats {
    score: number;
    format: number;
    keywords: number;
    readability: number;
}

interface RequirementStats {
    skills: { name: string; present: boolean }[];
    experience: { required: string; match: boolean }[];
    education: { required: string; match: boolean }[];
}

const EnhanceResume = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [sections, setSections] = useState<ResumeSection[]>([]);
    const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string | null }>({ name: '', url: null });
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [atsStats, setAtsStats] = useState<ATSStats>({ score: 0, format: 0, keywords: 0, readability: 0 });
    const [reqStats, setReqStats] = useState<RequirementStats>({
        skills: [],
        experience: [],
        education: []
    });
    const [jobRole, setJobRole] = useState('');
    const [jobUrl, setJobUrl] = useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);
        setShowAnalysis(false);

        try {
            if (!file.name.toLowerCase().endsWith('.pdf')) {
                throw new Error('Please upload a PDF file');
            }

            if (file.size > 5 * 1024 * 1024) {
                throw new Error('File size should be less than 5MB');
            }

            const fileUrl = URL.createObjectURL(file);
            setUploadedFile({ name: file.name, url: fileUrl });

        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Failed to upload resume');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);
        setShowAnalysis(false);

        try {
            if (!file.name.toLowerCase().endsWith('.pdf')) {
                throw new Error('Please upload a PDF file');
            }

            if (file.size > 5 * 1024 * 1024) {
                throw new Error('File size should be less than 5MB');
            }

            const fileUrl = URL.createObjectURL(file);
            setUploadedFile({ name: file.name, url: fileUrl });

        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Failed to upload resume');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const analyzeResume = async () => {
        if (!jobRole) {
            setUploadError('Please enter the job role you are applying for');
            return;
        }
        setIsAnalyzing(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate ATS stats
            setAtsStats({
                score: 85,
                format: 90,
                keywords: 80,
                readability: 85
            });

            // Simulate requirement stats
            setReqStats({
                skills: [
                    { name: 'React', present: true },
                    { name: 'TypeScript', present: true },
                    { name: 'Node.js', present: false },
                    { name: 'Python', present: true }
                ],
                experience: [
                    { required: '3+ years React', match: true },
                    { required: '2+ years TypeScript', match: true }
                ],
                education: [
                    { required: "Bachelor's Degree", match: true }
                ]
            });

            // Simulate section analysis
            setSections([
                {
                    title: 'Professional Summary',
                    content: 'Your current summary is clear but could be more impactful.',
                    suggestions: [
                        'Add quantifiable achievements',
                        'Highlight leadership experience',
                        'Include industry-specific keywords'
                    ],
                    loading: false
                },
                {
                    title: 'Work Experience',
                    content: 'Good use of action verbs, but could use more metrics.',
                    suggestions: [
                        'Add specific numbers and percentages',
                        'Focus on achievements rather than duties',
                        'Include more technical details'
                    ],
                    loading: false
                }
            ]);

            setShowAnalysis(true);
        } catch (error) {
            setUploadError('Failed to analyze resume. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mt-8 mb-12 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Enhance Your Resume</h1>
                <p className="text-white/70 max-w-2xl mx-auto">
                    Upload your resume and let our AI help you improve it for your target role. We'll analyze your content and provide suggestions for improvement.
                </p>
            </div>

            {!uploadedFile.url ? (
                <div className="mb-12 p-6 bg-white/5 rounded-xl space-y-4 max-w-2xl mx-auto flex justify-center">
                    <div className="w-full max-w-md">
                        <h2 className="text-xl font-semibold text-white text-center">Upload Your Resume</h2>
                        <p className="text-white/70 text-center">
                            Upload your resume in PDF format (max 5MB).
                            We'll analyze it and provide suggestions for improvement.
                        </p>
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
                                isDragging
                                    ? 'border-purple-500 bg-purple-500/10'
                                    : 'border-white/10 hover:border-white/20'
                            }`}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center justify-center gap-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".pdf"
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Upload Resume
                                            </>
                                        )}
                                    </button>
                                    <p className="mt-2 text-sm text-white/70">
                                        or drag and drop your file here
                                    </p>
                                </div>
                                <div className="text-center text-sm text-white/50">
                                    Supports: PDF only (max 5MB)
                                </div>
                            </div>
                            {uploadError && (
                                <p className="text-red-400 text-sm text-center mt-4">{uploadError}</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-12 space-y-8">
                    <div className="p-6 bg-white/5 rounded-xl">
                        <div className="flex flex-col space-y-6">
                            {/* Header with file info and actions */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Uploaded Resume</h2>
                                    <p className="text-white/70 text-sm mt-1">{uploadedFile.name}</p>
                                </div>
                                
                                {/* Form and actions */}
                                <div className="flex flex-col md:flex-row items-start gap-6">
                                    {/* Job details form */}
                                    <div className="w-full md:w-80 space-y-4">
                                        <div>
                                            <label htmlFor="jobRole" className="block text-sm font-medium text-white/70 mb-1">
                                                Target Job Role*
                                            </label>
                                            <input
                                                type="text"
                                                id="jobRole"
                                                value={jobRole}
                                                onChange={(e) => setJobRole(e.target.value)}
                                                placeholder="e.g. Senior Frontend Developer"
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="jobUrl" className="block text-sm font-medium text-white/70 mb-1">
                                                LinkedIn Job URL (Optional)
                                            </label>
                                            <input
                                                type="url"
                                                id="jobUrl"
                                                value={jobUrl}
                                                onChange={(e) => setJobUrl(e.target.value)}
                                                placeholder="https://www.linkedin.com/jobs/view/..."
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-col gap-3 w-full md:w-auto">
                                        <button
                                            onClick={() => {
                                                setUploadedFile({ name: '', url: null });
                                                setSections([]);
                                                setShowAnalysis(false);
                                                setJobRole('');
                                                setJobUrl('');
                                            }}
                                            className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
                                        >
                                            Upload Different Resume
                                        </button>
                                        {!showAnalysis && (
                                            <button
                                                onClick={analyzeResume}
                                                disabled={isAnalyzing || !jobRole}
                                                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                                            >
                                                {isAnalyzing ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Analyzing...
                                                    </>
                                                ) : (
                                                    'Enhance Resume'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* PDF Viewer */}
                            {uploadedFile.url && (
                                <div className="w-full h-[600px] rounded-lg overflow-hidden bg-white">
                                    <PDFViewer url={uploadedFile.url} />
                                </div>
                            )}
                        </div>
                    </div>

                    {showAnalysis && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ATS Score Card */}
                                <div className="p-6 bg-white/5 rounded-xl">
                                    <h3 className="text-xl font-semibold text-white mb-4">ATS Compatibility</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-white/70">Overall Score</span>
                                                <span className="text-white">{atsStats.score}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div 
                                                    className="bg-purple-500 h-2 rounded-full" 
                                                    style={{ width: `${atsStats.score}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-white/70">Format</span>
                                                <span className="text-white">{atsStats.format}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-500 h-2 rounded-full" 
                                                    style={{ width: `${atsStats.format}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-white/70">Keywords</span>
                                                <span className="text-white">{atsStats.keywords}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full" 
                                                    style={{ width: `${atsStats.keywords}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-white/70">Readability</span>
                                                <span className="text-white">{atsStats.readability}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div 
                                                    className="bg-yellow-500 h-2 rounded-full" 
                                                    style={{ width: `${atsStats.readability}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Requirements Match */}
                                <div className="p-6 bg-white/5 rounded-xl">
                                    <h3 className="text-xl font-semibold text-white mb-4">Requirements Match</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-white/70 mb-2">Required Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {reqStats.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className={`px-3 py-1 rounded-full text-sm ${
                                                            skill.present
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : 'bg-red-500/20 text-red-400'
                                                        }`}
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-white/70 mb-2">Experience</h4>
                                            <ul className="space-y-2">
                                                {reqStats.experience.map((exp, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        {exp.match ? (
                                                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        )}
                                                        <span className="text-white/70">{exp.required}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Target Role */}
                            <div className="p-6 bg-white/5 rounded-xl">
                                <h3 className="text-xl font-semibold text-white mb-4">Target Role</h3>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-white/70">Job Role:</span>
                                        <span className="text-white ml-2">{jobRole}</span>
                                    </div>
                                    {jobUrl && (
                                        <div>
                                            <span className="text-white/70">Job URL:</span>
                                            <a 
                                                href={jobUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-purple-400 hover:text-purple-300 ml-2 break-all"
                                            >
                                                {jobUrl}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Improvement Suggestions */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">Improvement Suggestions</h2>
                                {sections.map((section, index) => (
                                    <div key={section.title} className="p-6 bg-white/5 rounded-xl space-y-4">
                                        <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                                        <div className="text-white/70">
                                            <p className="font-medium mb-2">Analysis:</p>
                                            <p className="whitespace-pre-wrap">{section.content}</p>
                                        </div>
                                        <div className="text-white/70">
                                            <p className="font-medium mb-2">Suggestions:</p>
                                            <ul className="list-disc list-inside space-y-2">
                                                {section.suggestions.map((suggestion, i) => (
                                                    <li key={i}>{suggestion}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EnhanceResume;
