import React, { useState, useRef } from 'react';
import './upload-file.css'; // Import your CSS file
import './image-container.css';

const ImageContainer = ({ images }) => {
  return (
    <div className="image-container">
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Dropped Image ${index + 1}`} />
      ))}
    </div>
  );
};


const FileUpload = () => {
  const [droppedImages, setDroppedImages] = useState([]);
  const [isSpellcheck, setIsSpellcheck] = useState(true);
  const fileInputRef = useRef(null);

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    highlightDropArea();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    unhighlightDropArea();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    unhighlightDropArea();

    const files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileSelect = () => {
    const files = fileInputRef.current.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const newImages = [];

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
          newImages.push(reader.result);
          setDroppedImages((prevImages) => [...prevImages, ...newImages]);
        };
      } else {
        alert('Please select a valid image file.');
      }
    }
  };

  const highlightDropArea = () => {
    document.getElementById('drop-area').classList.add('highlight');
  };

  const unhighlightDropArea = () => {
    document.getElementById('drop-area').classList.remove('highlight');
  };

  const handleSpellcheckToggle = () => {
    setIsSpellcheck(!isSpellcheck);
  };
  const handleClickToSelect = (event) => {
    event.stopPropagation();
    fileInputRef.current.click();
  };
  
  return (
    <div>
      <label htmlFor="fileInput">
        <div
          id="drop-area"
          className="drop-area"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickToSelect}
        >
          <div className="drop-icon">
            <i className="fa-light fa-file-upload"></i>
          </div>
          <div className="drop-text">Drag and drop images here or click to select</div>
          <input
            id="fileInput"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            multiple
          />
        </div>
      </label>
      <ImageContainer images={droppedImages} />
    </div>
  );
};

export default FileUpload;
