import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { PDFParser } from 'pdf2json';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const analyzeResume = async (filePath: string): Promise<{
  score: number;
  feedback: string[];
}> => {
  const content = await extractTextFromFile(filePath);
  const keywords = ['experience', 'skills', 'education', 'projects', 'achievements'];
  const feedback: string[] = [];
  let score = 0;

  // Basic keyword analysis
  keywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword)) {
      score += 20;
      feedback.push(`Found section for ${keyword}`);
    } else {
      feedback.push(`Missing ${keyword} section`);
    }
  });

  // Add more detailed feedback
  if (content.length < 500) {
    feedback.push('Resume content seems too short. Consider adding more details.');
    score -= 10;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return {
    score,
    feedback,
  };
};

const extractTextFromFile = async (filePath: string): Promise<string> => {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.pdf') {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        const text = pdfData.Pages.map(page => 
          page.Texts.map(text => text.R.map(r => r.T).join(' ')).join(' ')
        ).join('\n');
        resolve(text);
      });

      pdfParser.on('pdfParser_dataError', (error) => {
        reject(error);
      });
      
      pdfParser.loadPDF(filePath);
    });
  }
  
  // For other file types, return empty string for now
  // TODO: Add support for DOC and DOCX files
  return '';
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'tmp'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    // Create upload directory if it doesn't exist
    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    const [fields, files] = await form.parse(req);

    if (!files.resume || !files.resume[0]) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = files.resume[0];
    
    // Validate file type
    const ext = path.extname(file.originalFilename || '').toLowerCase();
    if (!['.pdf', '.doc', '.docx'].includes(ext)) {
      return res.status(400).json({ error: 'Invalid file type. Only PDF, DOC, and DOCX files are supported.' });
    }

    const result = await analyzeResume(file.filepath);

    // Clean up the temporary file
    fs.unlinkSync(file.filepath);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error processing resume:', error);
    return res.status(500).json({ error: 'Error processing resume' });
  }
}
