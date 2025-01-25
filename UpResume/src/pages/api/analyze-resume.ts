import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export const config = {
  api: {
    bodyParser: false,
  },
};

const getTextFromPDF = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
};

const getTextFromDOCX = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer: dataBuffer });
  return result.value;
};

const analyzeResume = (text: string) => {
  // Initialize scoring criteria
  const criteria = {
    keywordPresence: 0,
    formatting: 0,
    length: 0,
    contactInfo: 0,
    education: 0,
    experience: 0,
  };

  const keywords = [
    'experience', 'skills', 'education', 'projects', 'achievements',
    'leadership', 'team', 'development', 'management', 'analysis',
  ];

  // Check keyword presence (20 points)
  const keywordCount = keywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  criteria.keywordPresence = (keywordCount / keywords.length) * 20;

  // Check formatting (20 points)
  const hasGoodFormatting = text.split('\n').length > 10;
  criteria.formatting = hasGoodFormatting ? 20 : 10;

  // Check length (15 points)
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 700) {
    criteria.length = 15;
  } else if (wordCount > 700) {
    criteria.length = 10;
  } else {
    criteria.length = 5;
  }

  // Check contact information (15 points)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+\d{1,3}[-.]?)?\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text);
  criteria.contactInfo = (hasEmail ? 7.5 : 0) + (hasPhone ? 7.5 : 0);

  // Check education section (15 points)
  const hasEducation = /education|university|college|degree|bachelor|master/i.test(text);
  criteria.education = hasEducation ? 15 : 0;

  // Check experience section (15 points)
  const hasExperience = /experience|work|job|position|role/i.test(text);
  criteria.experience = hasExperience ? 15 : 0;

  // Calculate total score
  const totalScore = Object.values(criteria).reduce((a, b) => a + b, 0);

  // Generate feedback
  const feedback = [];
  if (criteria.keywordPresence < 15) {
    feedback.push("Consider adding more relevant industry keywords to improve visibility.");
  }
  if (criteria.formatting < 15) {
    feedback.push("Improve resume formatting with clear sections and bullet points.");
  }
  if (criteria.length < 10) {
    feedback.push("Your resume might be too short. Aim for 300-700 words.");
  }
  if (criteria.contactInfo < 15) {
    feedback.push("Ensure your contact information is clearly visible.");
  }
  if (criteria.education < 15) {
    feedback.push("Add or make your education section more prominent.");
  }
  if (criteria.experience < 15) {
    feedback.push("Enhance your experience section with detailed achievements.");
  }

  return {
    score: Math.round(totalScore),
    feedback,
    criteria,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);
    const file = files.resume?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';
    if (file.mimetype === 'application/pdf') {
      text = await getTextFromPDF(file.filepath);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await getTextFromDOCX(file.filepath);
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    const analysis = analyzeResume(text);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ error: 'Error processing resume' });
  }
}
