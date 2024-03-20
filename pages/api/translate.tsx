"use client";
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            if (req.body) {
                const imageUrl = req.body; // Change this line
                const API_KEY = process.env.GCV_API_KEY;
                const ENDPOINT = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

                const request = {
                    requests: [
                        {
                            image: {
                                source: {
                                    imageUri: imageUrl.imageUrl
                                }
                            },
                            features: [
                                {
                                    type: 'TEXT_DETECTION'
                                }
                            ]
                        }
                    ]
                };

                const visionRes = await fetch(ENDPOINT, {
                    method: 'POST',
                    body: JSON.stringify(request),
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = await visionRes.json();
                const detections = result.responses[0].textAnnotations;
                const fullText = result.responses[0].fullTextAnnotation;

                res.status(200).json({text:detections, fullText});
            }

        } catch (error) {
            console.error('Error in POST function:', error);
            res.status(500).json({ message: 'Internal Server Error POST REQUEST' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}