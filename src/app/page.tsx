"use client";
import { useState } from 'react';
import { Input } from "../../components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { saveAs } from 'file-saver';

export default function InputFile() {
  const [images, setImages] = useState<string[]>([]);
  const [previewText, setPreviewText] = useState<string>('');
  const handleDownload = () => {
    const blob = new Blob([previewText], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "output.doc");
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prevImages => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleTranslate = async () => {
    const imageUrl = 'gs://image_to_text111/test.png';
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: imageUrl,
            features: [
              {
                type: "DOCUMENT_TEXT_DETECTION"
              }
            ],
            imageContext: {
              languageHints: ["en-t-i0-handwrit"]
            }
          },
        ],
      }),
    });
    console.log(response)
    if (!response.ok) {
      console.error('Failed to translate image');
      return;
    }
    console.log('Response status:', response.status, response.statusText);
    const data = await response.json();
    setPreviewText(data.fullText.text);

    console.log(data)
  };
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} multiple />
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Selected ${index}`} />
      ))}
      <Button onClick={handleTranslate}>Translate Images</Button>
      <Label>Preview Text:</Label>
      <textarea value={previewText} readOnly style={{ width: '500px', height: '200px' }} /> 
      <Button onClick={handleDownload}>Download as Doc</Button>
      </div>
  )
}