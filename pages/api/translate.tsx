import { NextApiRequest, NextApiResponse } from 'next';
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

export default async function(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            if (req.body) {
                const imageUrl = req.body // Change this line
                const vision = require('@google-cloud/vision');

                const client = new vision.ImageAnnotatorClient();
                
                // Performs text detection on the gcs file
                
                const [result] = await client.textDetection(imageUrl.imageUrl);
                const detections = result.textAnnotations;
                const fullText = result.fullTextAnnotation;
                res.status(200).json({text:detections, fullText})
            }

        } catch (error) {
            console.error('Error in POST function:', error);
            res.status(500).json({ message: 'Internal Server Error POST REQUEST' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}