import { NextApiRequest, NextApiResponse } from 'next';
import { generateContent } from '../../utils/geminiClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, temperature = 0.7, maxTokens = 150 } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const content = await generateContent(prompt);
        
        if (!content) {
            return res.status(500).json({ error: 'No content generated' });
        }

        return res.status(200).json({ content });
    } catch (error) {
        console.error('Error in generate API:', error);
        return res.status(500).json({ error: 'Failed to generate content' });
    }
}
