import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { request } from 'http';
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

export default async function(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            console.log(req.body)
            if (req.body.requests) {
                const imageUrl = req.body.requests[0].image; // Change this line
                const vision = require('@google-cloud/vision');

                // Creates a client
                const client = new vision.ImageAnnotatorClient();
                
                /**
                 * TODO(developer): Uncomment the following lines before running the sample.
                 */
                // const bucketName = 'Bucket where the file resides, e.g. my-bucket';
                // const fileName = 'Path to file within bucket, e.g. path/to/image.png';
                
                // Performs text detection on the gcs file
                const [result] = await client.textDetection('gs://image_to_text111/test.png');
                const detections = result.textAnnotations;
                const fullText = result.fullTextAnnotation;
                res.status(200).json({text:detections, fullText})
                console.log('Text:');
                console.log(result);
            }

        } catch (error) {
            console.error('Error in POST function:', error);
            res.status(500).json({ message: 'Internal Server Error POST REQUEST' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}