import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateATSResume, enhanceSection } from '../utils/geminiClient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Experience {
    title: string;
    company: string;
    description: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    current: boolean;
    enhancedDescription?: string;
}

interface Education {
    degree: string;
    institution: string;
    location: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    current: boolean;
    description: string;
    shortDescription: string;
}

interface Project {
    title: string;
    technologies: string[];
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    current: boolean;
    description: string;
    shortDescription: string;
    link: string;
}

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    jobTitle: string;
    summary: string;
    experiences: Experience[];
    education: Education[];
    projects: Project[];
    skills: string[];
}

const ResumeBuilder: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        jobTitle: '',
        summary: '',
        experiences: [
            {
                title: '',
                company: '',
                description: '',
                startMonth: '',
                startYear: '',
                endMonth: '',
                endYear: '',
                current: false,
            }
        ],
        education: [
            {
                degree: '',
                institution: '',
                location: '',
                startMonth: '',
                startYear: '',
                endMonth: '',
                endYear: '',
                current: false,
                description: '',
                shortDescription: ''
            }
        ],
        projects: [],
        skills: []
    });

    const [newSkill, setNewSkill] = useState('');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= currentYear - 50; year--) {
            years.push(year);
        }
        return years;
    };

    const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);

    const enhanceWithAI = async (sectionId: string, content: string) => {
        try {
            setIsEnhancing(true);
            const sectionType = sectionId.split('-')[0]; // 'experience', 'education', or 'summary'
            const sectionIndex = parseInt(sectionId.split('-')[1]);
            
            const enhancedContent = await enhanceSection(sectionType, content);
            
            if (sectionType === 'experience') {
                const newExperiences = [...formData.experiences];
                newExperiences[sectionIndex].description = enhancedContent;
                setFormData({ ...formData, experiences: newExperiences });
            } else if (sectionType === 'education') {
                const newEducation = [...formData.education];
                newEducation[sectionIndex].description = enhancedContent;
                setFormData({ ...formData, education: newEducation });
            } else if (sectionType === 'summary') {
                setFormData({ ...formData, summary: enhancedContent });
            }
        } catch (error) {
            console.error('Error enhancing content:', error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!resumePreviewRef.current) return;
        
        setIsGeneratingPDF(true);
        try {
            const canvas = await html2canvas(resumePreviewRef.current, {
                scale: 4, // Increased for better quality
                logging: false,
                useCORS: true,
                backgroundColor: '#FFFFFF',
                windowWidth: resumePreviewRef.current.scrollWidth,
                windowHeight: resumePreviewRef.current.scrollHeight
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${formData.fullName.trim().toLowerCase().replace(/\s+/g, '_')}_resume.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const validateStep = () => {
        switch (step) {
            case 1: // Personal Info
                return formData.fullName.trim() !== '' || formData.email.trim() !== '';
            case 2: // Experience
                return formData.experiences.length > 0;
            case 3: // Education
                return formData.education.length > 0;
            case 4: // Skills
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleAddExperience = () => {
        setFormData({
            ...formData,
            experiences: [
                ...formData.experiences,
                {
                    title: '',
                    company: '',
                    description: '',
                    startMonth: '',
                    startYear: '',
                    endMonth: '',
                    endYear: '',
                    current: false,
                }
            ]
        });
    };

    const handleRemoveExperience = (index: number) => {
        const newExperiences = formData.experiences.filter((_, idx) => idx !== index);
        setFormData({ ...formData, experiences: newExperiences });
    };

    const handleAddEducation = () => {
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                {
                    degree: '',
                    institution: '',
                    location: '',
                    startMonth: '',
                    startYear: '',
                    endMonth: '',
                    endYear: '',
                    current: false,
                    description: '',
                    shortDescription: ''
                }
            ]
        });
    };

    const handleRemoveEducation = (index: number) => {
        const newEducation = formData.education.filter((_, idx) => idx !== index);
        setFormData({ ...formData, education: newEducation });
    };

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;
        if (formData.skills.includes(newSkill.trim())) {
            return;
        }
        setFormData({
            ...formData,
            skills: [...formData.skills, newSkill.trim()]
        });
        setNewSkill('');
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleSkillKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <div className="flex h-screen">
            {/* Form Section */}
            <div className="w-1/2 overflow-y-auto p-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    <h1 className="text-4xl font-bold text-white mb-2">Resume Builder</h1>
                    <p className="text-white/90 mb-8">Create your professional resume in minutes</p>
                    
                    {/* Progress Tabs */}
                    <div className="flex space-x-4 mb-8">
                        <button
                            onClick={() => setStep(1)}
                            className={`px-6 py-2 rounded-md ${
                                step === 1 ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            Summary
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            className={`px-6 py-2 rounded-md ${
                                step === 2 ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            Work Experience
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            className={`px-6 py-2 rounded-md ${
                                step === 3 ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            Education
                        </button>
                        <button
                            onClick={() => setStep(4)}
                            className={`px-6 py-2 rounded-md ${
                                step === 4 ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            Skills
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-4">
                                <label className="block text-white">
                                    Full Name
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="mt-1 w-full p-3 rounded-lg bg-[#1a1a3a] border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                        placeholder="Enter your full name"
                                    />
                                </label>

                                <label className="block text-white">
                                    Email
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="mt-1 w-full p-3 rounded-lg bg-[#1a1a3a] border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                        placeholder="Enter your email"
                                    />
                                </label>

                                <label className="block text-white">
                                    Phone
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="mt-1 w-full p-3 rounded-lg bg-[#1a1a3a] border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                        placeholder="Enter your phone number"
                                    />
                                </label>

                                <label className="block text-white">
                                    Job Title
                                    <input
                                        type="text"
                                        value={formData.jobTitle}
                                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                        className="mt-1 w-full p-3 rounded-lg bg-[#1a1a3a] border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                        placeholder="Enter your job title"
                                    />
                                </label>

                                <div className="bg-[#1a1a3a] p-6 rounded-lg border border-purple-500/30">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-white">Professional Summary</h2>
                                        <button
                                            onClick={async () => {
                                                if (formData.experiences.length === 0) {
                                                    return;
                                                }
                                                const jobTitle = formData.jobTitle || "professional";
                                                try {
                                                    const enhancedContent = await enhanceSection('summary', formData.summary || `${jobTitle} with experience in web development`);
                                                    setFormData({ ...formData, summary: enhancedContent });
                                                } catch (error) {
                                                    console.error('Error generating summary:', error);
                                                }
                                            }}
                                            type="button"
                                            className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                            Enhance
                                        </button>
                                    </div>
                                    <textarea
                                        value={formData.summary}
                                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                        className="w-full h-32 p-3 bg-[#232347] rounded-lg border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                                        placeholder="Write a compelling summary of your professional background and key strengths..."
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                {formData.experiences.map((exp, idx) => (
                                    <div key={idx} className="bg-[#1A1A2F] rounded-lg p-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-white">Work Experience {idx + 1}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={async () => {
                                                        setEnhancingIndex(idx);
                                                        try {
                                                            const enhancedDescription = await enhanceSection(
                                                                'experience',
                                                                exp.description || '',
                                                                {
                                                                    title: exp.title || 'Web Developer',
                                                                    company: exp.company || 'Company'
                                                                }
                                                            );
                                                            const newExp = [...formData.experiences];
                                                            newExp[idx].description = enhancedDescription;
                                                            setFormData({ ...formData, experiences: newExp });
                                                        } catch (error) {
                                                            console.error('Error enhancing description:', error);
                                                        } finally {
                                                            setEnhancingIndex(null);
                                                        }
                                                    }}
                                                    disabled={enhancingIndex === idx}
                                                    type="button"
                                                    className="text-purple-400 hover:text-purple-300 flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {enhancingIndex === idx ? (
                                                        <>
                                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Enhancing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                            Enhance
                                                        </>
                                                    )}
                                                </button>
                                                {formData.experiences.length > 1 && (
                                                    <button
                                                        onClick={() => handleRemoveExperience(idx)}
                                                        className="px-3 py-2 bg-[#FF3B3F]/20 text-[#FF3B3F] rounded-lg hover:bg-[#FF3B3F]/30 transition-all"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <input
                                                    type="hidden"
                                                    value={exp.title}
                                                    onChange={(e) => {
                                                        const newExp = [...formData.experiences];
                                                        newExp[idx].title = e.target.value;
                                                        setFormData({ ...formData, experiences: newExp });
                                                    }}
                                                />
                                                <div className="space-y-2">
                                                    <label className="text-white/90 text-sm font-medium">Company</label>
                                                    <input
                                                        type="text"
                                                        value={exp.company}
                                                        onChange={(e) => {
                                                            const newExp = [...formData.experiences];
                                                            newExp[idx].company = e.target.value;
                                                            setFormData({ ...formData, experiences: newExp });
                                                        }}
                                                        className="w-full p-3 bg-[#1a1a3a] border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                                        placeholder="Enter company name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-white/90 text-sm font-medium">Start Date</label>
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={exp.startMonth}
                                                            onChange={(e) => {
                                                                const newExp = [...formData.experiences];
                                                                newExp[idx].startMonth = e.target.value;
                                                                setFormData({ ...formData, experiences: newExp });
                                                            }}
                                                            className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value="">Month</option>
                                                            {months.map((month) => (
                                                                <option key={month} value={month} className="bg-gray-700 text-gray-200">
                                                                    {month}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={exp.startYear}
                                                            onChange={(e) => {
                                                                const newExp = [...formData.experiences];
                                                                newExp[idx].startYear = e.target.value;
                                                                setFormData({ ...formData, experiences: newExp });
                                                            }}
                                                            className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value="">Year</option>
                                                            {getYearOptions().map((year) => (
                                                                <option key={year} value={year} className="bg-gray-700 text-gray-200">
                                                                    {year}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-white/90 text-sm font-medium">End Date</label>
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={exp.endMonth}
                                                            onChange={(e) => {
                                                                const newExp = [...formData.experiences];
                                                                newExp[idx].endMonth = e.target.value;
                                                                setFormData({ ...formData, experiences: newExp });
                                                            }}
                                                            className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={exp.current}
                                                        >
                                                            <option value="">Month</option>
                                                            {months.map((month) => (
                                                                <option key={month} value={month} className="bg-gray-700 text-gray-200">
                                                                    {month}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={exp.endYear}
                                                            onChange={(e) => {
                                                                const newExp = [...formData.experiences];
                                                                newExp[idx].endYear = e.target.value;
                                                                setFormData({ ...formData, experiences: newExp });
                                                            }}
                                                            className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={exp.current}
                                                        >
                                                            <option value="">Year</option>
                                                            {getYearOptions().map((year) => (
                                                                <option key={year} value={year} className="bg-gray-700 text-gray-200">
                                                                    {year}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={exp.current}
                                                            onChange={(e) => {
                                                                const newExp = [...formData.experiences];
                                                                newExp[idx].current = e.target.checked;
                                                                if (e.target.checked) {
                                                                    newExp[idx].endMonth = '';
                                                                    newExp[idx].endYear = '';
                                                                }
                                                                setFormData({ ...formData, experiences: newExp });
                                                            }}
                                                            className="w-4 h-4 rounded border-[#2A2A3F] bg-[#1A1A2F] text-[#E12FFF] focus:ring-[#E12FFF]/50"
                                                        />
                                                        <label className="text-white/90 text-sm">Current Position</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-white/90 text-sm font-medium">Description</label>
                                            </div>
                                            <textarea
                                                value={exp.description}
                                                onChange={(e) => {
                                                    const newExp = [...formData.experiences];
                                                    newExp[idx].description = e.target.value;
                                                    setFormData({ ...formData, experiences: newExp });
                                                }}
                                                className="w-full p-3 bg-[#232347] rounded-lg border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 min-h-[100px]"
                                                placeholder="• Describe your responsibilities and achievements..."
                                            />
                                        </div>
                                    </div>
                                ))}
                                
                                <button
                                    onClick={handleAddExperience}
                                    className="w-full p-4 border-2 border-dashed border-[#2A2A3F] rounded-lg text-white/60 hover:bg-[#1A1A2F] transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Experience
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                {formData.education.map((edu, idx) => (
                                    <div key={idx} className="bg-[#1A1A2F] rounded-lg p-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-white">Education {idx + 1}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={async () => {
                                                        setEnhancingIndex(idx);
                                                        try {
                                                            const enhancedDescription = await enhanceSection(
                                                                'education',
                                                                edu.description || '',
                                                                {
                                                                    title: edu.degree || 'Degree',
                                                                    company: edu.institution || 'Institution'
                                                                }
                                                            );
                                                            const newEdu = [...formData.education];
                                                            newEdu[idx].description = enhancedDescription;
                                                            setFormData({ ...formData, education: newEdu });
                                                        } catch (error) {
                                                            console.error('Error enhancing description:', error);
                                                        } finally {
                                                            setEnhancingIndex(null);
                                                        }
                                                    }}
                                                    disabled={enhancingIndex === idx}
                                                    className="px-4 py-2 bg-[#E12FFF]/20 text-[#E12FFF] rounded-lg flex items-center gap-2 hover:bg-[#E12FFF]/30 transition-all disabled:opacity-50"
                                                >
                                                    {enhancingIndex === idx ? (
                                                        <>
                                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Enhancing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                            Enhance
                                                        </>
                                                    )}
                                                </button>
                                                {formData.education.length > 1 && (
                                                    <button
                                                        onClick={() => handleRemoveEducation(idx)}
                                                        className="px-3 py-2 bg-[#FF3B3F]/20 text-[#FF3B3F] rounded-lg hover:bg-[#FF3B3F]/30 transition-all"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-white/90 text-sm font-medium">Degree</label>
                                                    <input
                                                        type="text"
                                                        value={edu.degree}
                                                        onChange={(e) => {
                                                            const newEdu = [...formData.education];
                                                            newEdu[idx].degree = e.target.value;
                                                            setFormData({ ...formData, education: newEdu });
                                                        }}
                                                        className="w-full p-3 bg-[#1a1a3a] border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                                        placeholder="e.g., Bachelor of Science in Computer Science"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-white/90 text-sm font-medium">School</label>
                                                    <input
                                                        type="text"
                                                        value={edu.institution}
                                                        onChange={(e) => {
                                                            const newEdu = [...formData.education];
                                                            newEdu[idx].institution = e.target.value;
                                                            setFormData({ ...formData, education: newEdu });
                                                        }}
                                                        className="w-full p-3 bg-[#1a1a3a] border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                                        placeholder="e.g., University of California, Berkeley"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-white/90 text-sm font-medium">Duration</label>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex gap-2 flex-1">
                                                        <select
                                                            value={edu.startMonth}
                                                            onChange={(e) => {
                                                                const newEdu = [...formData.education];
                                                                newEdu[idx].startMonth = e.target.value;
                                                                setFormData({ ...formData, education: newEdu });
                                                            }}
                                                            className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value="">Month</option>
                                                            {months.map((month) => (
                                                                <option key={month} value={month} className="bg-gray-700 text-gray-200">
                                                                    {month}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={edu.startYear}
                                                            onChange={(e) => {
                                                                const newEdu = [...formData.education];
                                                                newEdu[idx].startYear = e.target.value;
                                                                setFormData({ ...formData, education: newEdu });
                                                            }}
                                                            className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value="">Year</option>
                                                            {getYearOptions().map((year) => (
                                                                <option key={year} value={year} className="bg-gray-700 text-gray-200">
                                                                    {year}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <span className="text-white/50">to</span>
                                                    <div className="flex gap-2 flex-1">
                                                        <select
                                                            value={edu.endMonth}
                                                            onChange={(e) => {
                                                                const newEdu = [...formData.education];
                                                                newEdu[idx].endMonth = e.target.value;
                                                                setFormData({ ...formData, education: newEdu });
                                                            }}
                                                            className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={edu.current}
                                                        >
                                                            <option value="">Month</option>
                                                            {months.map((month) => (
                                                                <option key={month} value={month} className="bg-gray-700 text-gray-200">
                                                                    {month}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={edu.endYear}
                                                            onChange={(e) => {
                                                                const newEdu = [...formData.education];
                                                                newEdu[idx].endYear = e.target.value;
                                                                setFormData({ ...formData, education: newEdu });
                                                            }}
                                                            className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={edu.current}
                                                        >
                                                            <option value="">Year</option>
                                                            {getYearOptions().map((year) => (
                                                                <option key={year} value={year} className="bg-gray-700 text-gray-200">
                                                                    {year}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={edu.current}
                                                        onChange={(e) => {
                                                            const newEdu = [...formData.education];
                                                            newEdu[idx].current = e.target.checked;
                                                            if (e.target.checked) {
                                                                newEdu[idx].endMonth = '';
                                                                newEdu[idx].endYear = '';
                                                            }
                                                            setFormData({ ...formData, education: newEdu });
                                                        }}
                                                        className="w-4 h-4 rounded border-[#2A2A3F] bg-[#1A1A2F] text-[#E12FFF] focus:ring-[#E12FFF]/50"
                                                    />
                                                    <label className="text-white/90 text-sm">Current Student</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-white/90 text-sm font-medium">Description</label>
                                            <textarea
                                                value={edu.description}
                                                onChange={(e) => {
                                                    const newEdu = [...formData.education];
                                                    newEdu[idx].description = e.target.value;
                                                    setFormData({ ...formData, education: newEdu });
                                                }}
                                                className="w-full p-3 bg-[#232347] rounded-lg border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-32 resize-none"
                                                placeholder="e.g., Relevant coursework: Data Structures, Algorithms, Machine Learning. GPA: 3.8/4.0"
                                            />
                                        </div>
                                    </div>
                                ))}
                                
                                <button
                                    onClick={handleAddEducation}
                                    className="w-full p-4 border-2 border-dashed border-[#2A2A3F] rounded-lg text-white/60 hover:bg-[#1A1A2F] transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Education
                                </button>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Skills
                                    </label>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={handleSkillKeyPress}
                                            className="flex-1 p-3 bg-[#232347] rounded-lg border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                            placeholder="Enter a skill..."
                                        />
                                        <button
                                            onClick={handleAddSkill}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map((skill, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full"
                                            >
                                                <span>{skill}</span>
                                                <button
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="text-purple-300 hover:text-purple-100"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleDownloadPDF}
                                        disabled={isGeneratingPDF || formData.skills.length === 0}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGeneratingPDF ? 'Generating PDF...' : 'Download Resume'}
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {step > 1 && (
                                <button
                                    onClick={handlePrevious}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    Previous
                                </button>
                            )}
                            {step < 4 && (
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 ml-auto"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="lg:w-1/2">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Preview</h2>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {isGeneratingPDF ? (
                            <span>Generating PDF...</span>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.293 3.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span>Download PDF</span>
                            </>
                        )}
                    </button>
                </div>
                <div className="flex justify-center overflow-auto max-h-[calc(100vh-150px)]">
                    <div 
                        ref={resumePreviewRef}
                        className="bg-white shadow-lg origin-top"
                        style={{
                            width: '210mm',
                            height: '297mm',
                            padding: '20mm',
                            margin: '0 auto',
                            boxSizing: 'border-box',
                            transform: `scale(${Math.min(0.8, (window.innerWidth * 0.4) / 210 / 3.7795275591)})`,
                            fontSize: '11pt',
                            lineHeight: '1.6',
                            color: '#333'
                        }}
                    >
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{formData.fullName || 'Your Name'}</h1>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    {formData.email && <span>{formData.email}</span>}
                                    {formData.phone && <span>{formData.phone}</span>}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-3">Summary</h2>
                                <p className="text-gray-700">{formData.summary || 'Experienced professional with expertise in...'}</p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-3">Work Experience</h2>
                                {formData.experiences.map((exp, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{exp.title}</h3>
                                                <p className="text-gray-600">{exp.company}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {exp.startMonth} {exp.startYear} - {exp.current ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                                            </div>
                                        </div>
                                        <p className="mt-2 text-gray-700">{exp.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-3">Education</h2>
                                {formData.education.map((edu, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{edu.degree}</h3>
                                                <p className="text-gray-600">{edu.institution}</p>
                                                <p className="text-gray-500">{edu.location}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {edu.startMonth} {edu.startYear} - {edu.current ? 'Present' : `${edu.endMonth} ${edu.endYear}`}
                                            </div>
                                        </div>
                                        <p className="mt-2 text-gray-700">{edu.description}</p>
                                    </div>
                                ))}
                            </div>

                            {formData.skills.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-3">Skills</h2>
                                    <div className="flex flex-wrap gap-x-4">
                                        {formData.skills.map((skill, index) => (
                                            <span key={index} className="text-gray-700">
                                                {index !== formData.skills.length - 1 ? `${skill} •` : skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
