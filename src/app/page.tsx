"use client";
import { useState, useRef } from 'react';
import { Input } from "../../components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { saveAs } from 'file-saver';
import * as React from "react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export default function InputFile() {
  const [progress, setProgress] = React.useState(0);
  const [imageDetails, setImageDetails] = React.useState({ name: '', size: '', timeLeft: '' });
  const [images, setImages] = React.useState([]);
  const [previewText, setPreviewText] = useState<string>('');
  const [imageData, setImageData] = useState([]);
  const fileInputRef = useRef(null);

  const handleDownload = () => {
    const blob = new Blob([previewText], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "output.doc");
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  
  const handleDragEnter = (event) => {
    event.preventDefault();
  };
  
  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      handleImageUpload({ target: { files: event.dataTransfer.files } });
    }
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
  const handleImageUpload = (event) => {
    if (event.target.files) {
      Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          if (!images.includes(imageUrl)) {
            setImages(prevImages => [...prevImages, imageUrl]);
  
            const fileSize = (file.size / (1024 * 1024)).toFixed(2); // size in MB
  
            // Create a new image data object
            const newImageData = {
              url: imageUrl,
              details: { name: file.name, size: `${fileSize} MB`, timeLeft: 'Calculating...' },
              progress: 0,
            };
  
            setImageData(prevData => [...prevData, newImageData]);
  
            // Simulate image upload
            let progress = 0;
            const increment = () => {
              progress = progress + 1;
              setImageData(prevData =>
                prevData.map(data =>
                  data.url === imageUrl
                    ? {
                        ...data,
                        progress: progress > 100 ? 100 : progress,
                        details: {
                          ...data.details,
                          timeLeft: progress >= 100 ? 'Done' : data.details.timeLeft,
                        },
                      }
                    : data
                )
              );
              if (progress < 100) {
                setTimeout(increment, 10);
              }
            };
            increment();
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
    // <div className="grid w-full max-w-sm items-center gap-1.5">
    //   <Label htmlFor="picture">Picture</Label>
    //   <Input id="picture" type="file" accept="image/*" name="file" onChange={handleImageChange} multiple />
    //   <div className="image-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
    //     {images.map((image, index) => (
    //       <img key={index} src={image} alt={` ${index}`} style={{ width: '100px', height: '50px' }} />
    //     ))}
    //   </div>
    //   <Button onClick={handleTranslate}>Translate Images</Button>
    //   <Label>Preview Text:</Label>
    //   <textarea value={previewText} readOnly style={{ width: '500px', height: '200px' }} /> 
    //   <Button onClick={handleDownload}>Download as Doc</Button>
    //   </div>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%', 
      height: '100vh', 
      padding: "10px", 
      fontFamily:"Verdana, sans-serif" 
    }}>
      <Card style={{ width: '100%', height: '50%'}}>
      <CardContent style={{ display: 'flex', flexDirection: 'row', gap: '10px', height:"100%" }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{padding: "10px" }}></p>
         <label htmlFor="picture" style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
          <Card             
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
             style={{ border: '1px dashed #000', width: '100%', height: '100%', backgroundColor: 'rgb(250, 250, 250)' }}>
              <input
                ref={fileInputRef}
                id="picture"
                type="file"
                accept="image/*"
                name="file"
                onChange={handleImageUpload}
                multiple
                style={{ display: 'none' }}
              />
            <CardContent style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40%', padding:"10px" }}>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" style={{ width: '20%', height: 'auto' }} fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"/>
              </svg>
            </div>
            <p style={{ textAlign: 'center' }}>            Drag and drop files here or click to select files</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60%' }}>
            </div>
          </div>
              </CardContent>
          </Card>
          </label>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4" style={{ border: 'transparent', width: '100%', height: '100%' }}>
          <div className="image-container" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' , width:"100%"}}>
            {imageData.map((data, index) => (
              <Card key={index} style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding:"10px" }}>
                  <img src={data.url} alt={` ${index}`} style={{ width: '50px', height: '20px' }} />
                </div>
                <div style={{ marginLeft: '10px', width:"100%", padding:"10px", fontSize: '0.8em' }}>
                <div style={{ fontWeight: 'bold',fontSize: '0.8em' }}>{data.details.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'gray',fontSize: '0.8em', padding:"3px" }}>
                  <div>{data.details.size}</div>
                  <div>{data.progress}%</div>
                </div>
                    <Progress value={data.progress} color="green" style={{ alignSelf: 'stretch', height: '5px' , width:"100%"}} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
       </div>
      </CardContent>
    </Card>

  </div>
  )
}