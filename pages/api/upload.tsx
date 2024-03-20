import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
    const gcs = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        credentials: {
            client_email: process.env.GCP_CLIENT_EMAIL,
            private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
        },
    });

    const bucketName = process.env.BUCKET_NAME || ''; // Assign a default value if process.env.BUCKET_NAME is undefined
    const bucket = gcs.bucket(bucketName);

    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error(err);
            console.log(bucketName)
            console.log("key : ", process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n') || '')
            console.log(req.file?.filename)
            return res.status(500).json({ error: err.message });
        }
    
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileName = req.file.originalname;
        const file = bucket.file(fileName);
        const blobStream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobStream.on('error', (error) => {
            console.error('Error uploading file:', error);
            res.status(500).json({ error: 'Error uploading file' });
        });

        blobStream.on('finish', () => {
            // Make the file public after it's been uploaded
            file.makePublic().then(() => {
                const publicUrl = `gs://${bucket.name}/${file.name}`;

                // Send the public URL in the response
                res.status(200).json({ message: 'File uploaded and made public successfully', imageUrl: publicUrl });
            }).catch((error) => {
                console.error('Error making file public:', error);
                res.status(500).json({ error: 'Error making file public' });
            });
        });

        // Pipe the file to the blobStream
        blobStream.end(req.file.buffer);
    });
}
