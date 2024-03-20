import multer from 'multer';
import { Storage } from '@google-cloud/storage';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
    const gcs = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    const bucket = gcs.bucket(process.env.BUCKET_NAME);

    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
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
