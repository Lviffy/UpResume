import { NextApiRequest, NextApiResponse } from 'next';
import { generateContent } from '../../utils/geminiClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const description = await generateContent(prompt);
        return res.status(200).json({ description });
    } catch (error) {
        console.error('Error generating description:', error);
        return res.status(500).json({ error: 'Failed to generate description' });
    }
}
