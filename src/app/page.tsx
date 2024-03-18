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
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          if (!images.includes(imageUrl)) {
            setImages(prevImages => [...prevImages, imageUrl]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleTranslate = async () => {
    console.log(images);
    let combinedText = '';

const fetchPromises = images.map(async (imageUrl, index) => {
  // Convert the data URL to a Blob
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  // Create a new File object
  const file = new File([blob], `image${index}.jpg`, { type: 'image/jpeg' });
  
  // Create a FormData object
  let formData = new FormData();

  // Append the file to the FormData object
  formData.append('file', file);
  console.log(file.name)
  formData.append('mimetype', file.type);
  formData.append('filename', file.name);
  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (uploadResponse.ok) {
    console.log('Uploaded successfully!');
    const responseJson = await uploadResponse.json();
    console.log(responseJson);
    const imageUrl = responseJson.imageUrl;   
      // Call the translation API
    const translateResponse = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
    console.log(translateResponse);
    if (translateResponse.ok) {
      // Get the translation from the response
      const responseJson = await translateResponse.json();

      // Get the description from the first item in the text array
      const description = responseJson.text[0].description;
      console.log('Description:', description);
    
      // Add the description to previewText
      setPreviewText(prevText => prevText + description + '\n');
    } else {
      console.error('Translation failed.');
    }
    } else {
      console.error('Upload failed.');
    }
});

await Promise.all(fetchPromises);
};
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" accept="image/*" name="file" onChange={handleImageChange} multiple />
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