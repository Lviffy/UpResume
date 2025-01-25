import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('Gemini API key is not set. Please check your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

interface ResumeData {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    experiences?: any[];
    education?: any[];
    projects?: any[];
    skills?: string[];
}

// Clean up markdown and special characters
function cleanText(text: string): string {
    // Remove any markdown-style formatting
    return text
        .replace(/^[•\-*]\s*/gm, '• ') // Standardize bullet points
        .replace(/^#+\s*/gm, '') // Remove heading markers
        .replace(/^\s+|\s+$/g, '') // Trim whitespace
        .replace(/\n{3,}/g, '\n\n'); // Reduce multiple newlines
}

function formatExperiences(experiences: any[] = []) {
    return experiences.map(exp => ({
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startMonth && exp.startYear ? `${exp.startMonth}/${exp.startYear}` : '',
        endDate: exp.current ? 'Present' : 
                (exp.endMonth && exp.endYear ? `${exp.endMonth}/${exp.endYear}` : ''),
        description: exp.description || '',
        shortDescription: exp.shortDescription || ''
    })).filter(exp => 
        exp.company || 
        exp.description || 
        exp.shortDescription
    );
}

function formatEducation(education: any[] = []) {
    return education.map(edu => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        location: edu.location || '',
        startYear: edu.startYear || '',
        endYear: edu.current ? 'Present' : (edu.endYear || ''),
        description: edu.description || '',
        shortDescription: edu.shortDescription || ''
    })).filter(edu => 
        edu.degree || 
        edu.institution || 
        edu.description || 
        edu.shortDescription
    );
}

function formatProjects(projects: any[] = []) {
    return projects.map(proj => ({
        title: proj.title || '',
        technologies: proj.technologies || [],
        startDate: proj.startMonth && proj.startYear ? `${proj.startMonth}/${proj.startYear}` : '',
        endDate: proj.current ? 'Present' : 
                (proj.endMonth && proj.endYear ? `${proj.endMonth}/${proj.endYear}` : ''),
        description: proj.description || '',
        shortDescription: proj.shortDescription || '',
        link: proj.link || ''
    })).filter(proj => 
        proj.title || 
        proj.technologies.length > 0 || 
        proj.description || 
        proj.shortDescription
    );
}

// Function to enhance specific sections
export async function enhanceSection(sectionType: string, content: string, context?: { title?: string; company?: string }): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        let prompt = '';

        if (sectionType === 'summary') {
            prompt = `
                Generate a compelling professional summary based on this context: "${content}"
                
                Guidelines:
                - Write 2-3 impactful sentences
                - Highlight key expertise and value proposition
                - Use strong action verbs
                - Focus on professional achievements and skills
                - Keep it concise and powerful
                - Do not add any information not implied by the context
                
                Return only the enhanced summary text, without any additional formatting or explanation.
            `;
        } else if (sectionType === 'experience') {
            const jobContext = context?.title && context?.company 
                ? `for the position of ${context.title} at ${context.company}`
                : '';
            
            prompt = `
                Generate a professional job description ${jobContext}:
                
                Original Description:
                "${content || 'No description provided'}"
                
                Guidelines:
                - Create exactly 2 bullet points
                - Start each point with a strong action verb
                - First point should focus on a key achievement or impact
                - Second point should highlight main responsibility
                - Include metrics where relevant
                - Keep each point concise and impactful
                - Maintain relevance to the job title and company
                
                Return exactly 2 bullet points, one per line, starting with "•". No additional text or formatting.
            `;
        } else if (sectionType === 'education') {
            const educationContext = context?.title && context?.company 
                ? `for ${context.title} at ${context.company}`
                : '';
            
            prompt = `
                Enhance and restructure this education description ${educationContext}:
                
                Original Description:
                "${content || 'No description provided'}"
                
                Guidelines:
                - Create exactly 2 bullet points from ONLY the information provided above
                - DO NOT add any achievements, grades, or details that are not explicitly mentioned
                - First point should focus on academic details mentioned in the original text
                - Second point should focus on coursework or projects mentioned in the original text
                - If certain information is not provided, keep the bullet point simple and factual
                - Maintain absolute truthfulness - no embellishment
                
                Return exactly 2 bullet points, one per line, starting with "•". No additional text or formatting.
            `;
        } else {
            throw new Error('Invalid section type');
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return cleanText(response.text());
    } catch (error) {
        console.error('Error enhancing section:', error);
        throw error;
    }
}

export async function generateContent(prompt: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
}

export async function generateATSResume(formData: ResumeData) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Format experiences and education
        const experiencesText = formatExperiences(formData.experiences);
        const educationText = formatEducation(formData.education);

        const prompt = `
            Create an ATS-optimized version of this resume content:

            CONTACT INFORMATION:
            ${formData.fullName}
            ${formData.email}
            ${formData.phone}

            PROFESSIONAL SUMMARY:
            ${formData.summary}

            WORK EXPERIENCE:
            ${experiencesText}

            EDUCATION:
            ${educationText}

            SKILLS:
            ${formData.skills}

            Instructions:
            1. Keep the same basic information but optimize for ATS systems
            2. Use clear section headings
            3. Remove any special characters or formatting
            4. Focus on keywords and achievements
            5. Keep dates in a consistent format

            Return the rephrased content using ONLY the information provided. Do not add any new information or assumptions.
        `;

        const result = await generateContent(prompt);
        return result;
    } catch (error) {
        console.error('Error generating ATS resume:', error);
        throw error;
    }
}
