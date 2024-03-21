"use client";
import { useState, useRef, useEffect } from "react";
import PreviewModal from "@/components/ui/PreviewModal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
export default function InputFile() {
  const [images, setImages] = useState<string[]>([]);
  const [previewText, setPreviewText] = useState<string>("");
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const fileInputRef = useRef(null);
  const [hoverStates, setHoverStates] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslationDone, setIsTranslationDone] = useState(false);
  const [items, setItems] = useState([]);
  interface ImageDetails {
    timeLeft: string;
    size: string;
    name: string;
    // other properties...
  }

  interface ImageData {
    url: string;
    progress: number;
    details: ImageDetails;
    size: string;
    // other properties...
  }
  useEffect(() => {
    setHoverStates(new Array<boolean>(imageData.length).fill(false));
  }, [imageData]);
  const [draggingIndex, setDraggingIndex] = useState(-1);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ): void => {
    event.dataTransfer.setData("text/plain", index.toString());
    setDraggingIndex(index);
  };

  const handleDragOverImage = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ): void => {
    event.preventDefault();

    if (draggingIndex === index) {
      return;
    }

    const items: ImageData[] = Array.from(imageData);
    const [draggingItem] = items.splice(draggingIndex, 1);
    items.splice(index, 0, draggingItem);

    setDraggingIndex(index);
    setImageData(items);
  };

  const handleDragEnd = () => {
    setItems((prevItems) => {
      if (draggingIndex < 0 || draggingIndex >= prevItems.length) {
        return prevItems;
      }
      const newItems = [...prevItems];
      const draggedItem = newItems.splice(draggingIndex, 1)[0];
      newItems.push(draggedItem);
      return newItems;
    });
    setDraggingIndex(-1);
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      Array.from(event.dataTransfer.files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("hehehe");
          const imageUrl = reader.result as string;
          console.log(imageUrl);
          if (!images.includes(imageUrl)) {
            setImages((prevImages) => [...prevImages, imageUrl]);

            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2); // size in MB
            const newImageData = {
              url: imageUrl,
              details: {
                name: file.name,
                size: `${fileSizeMB} MB`,
                timeLeft: "Calculating...",
              },
              progress: 0,
              size: `${fileSizeMB} MB`,
            };
            setImageData((prevData) => [...prevData, newImageData]);
            let progress = 0;
            const increment = () => {
              progress = progress + 1;
              setImageData((prevData) =>
                prevData.map((data) =>
                  data.url === imageUrl
                    ? {
                        ...data,
                        progress: progress > 100 ? 100 : progress,
                        details: {
                          ...data.details,
                          timeLeft:
                            progress >= 100 ? "Done" : data.details.timeLeft,
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
        reader.readAsDataURL(file); // start reading the file
      });
    }
  };
  function handleDelete(index: number) {
    const deletedImage = imageData[index];
    setImageData((prevImageData) =>
      prevImageData.filter((_, i) => i !== index)
    );
    setImages((prevImages) =>
      prevImages.filter((imageUrl) => imageUrl !== deletedImage.url)
    );
  }

  function handleMouseEnter(index: number): void {
    setHoverStates((prevHoverStates) =>
      prevHoverStates.map((hoverState, i) => (i === index ? true : hoverState))
    );
    console.log(hoverStates[index]);
  }

  function handleMouseLeave() {
    setHoverStates((prevHoverStates) => prevHoverStates.map(() => false));
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      Array.from(event.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          console.log(imageUrl);
          if (!images.includes(imageUrl)) {
            setImages((prevImages) => [...prevImages, imageUrl]);

            const fileSize = (file.size / (1024 * 1024)).toFixed(2); // size in MB
            const newImageData = {
              url: imageUrl,
              details: {
                name: file.name,
                size: `${fileSize} MB`,
                timeLeft: "Calculating...",
              },
              progress: 0,
              size: `${fileSize} MB`, // add size property here
            };
            setImageData((prevData) => [...prevData, newImageData]);
            // Simulate image upload
            let progress = 0;
            const increment = () => {
              progress = progress + 1;
              setImageData((prevData) =>
                prevData.map((data) =>
                  data.url === imageUrl
                    ? {
                        ...data,
                        progress: progress > 100 ? 100 : progress,
                        details: {
                          ...data.details,
                          timeLeft:
                            progress >= 100 ? "Done" : data.details.timeLeft,
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
    event.target.value = "";
  };

  const handleTranslate = async () => {
    setIsLoading(true);
    console.log("test translate");
    const fetchPromises = images.map(async (imageUrl, index) => {
      // Convert the data URL to a Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      // Create a new File object
      const file = new File([blob], `image${index}.jpg`, {
        type: "image/jpeg",
      });

      // Create a FormData object
      let formData = new FormData();

      // Append the file to the FormData object
      formData.append("file", file);
      console.log(file.name);
      formData.append("mimetype", file.type);
      formData.append("filename", file.name);
      console.log(formData);
      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        console.log("page.tsx", uploadResponse);
        if (uploadResponse.ok) {
          console.log("Uploaded successfully!");
          const responseJson = await uploadResponse.json();
          console.log(responseJson);
          const imageUrl = responseJson.imageUrl;
          // Call the translation API
          const translateResponse = await fetch("/api/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrl }),
          });
          console.log(translateResponse);
          if (translateResponse.ok) {
            // Get the translation from the response
            const responseJson = await translateResponse.json();

            // Get the description from the first item in the text array
            const description = responseJson.text[0].description;
            console.log("Description:", description);

            // Add the description to previewText
            setPreviewText((prevText) => prevText + description + "\n");
          } else {
            console.error("Translation failed.");
          }
        } else {
          console.error("Upload failed.");
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });
    await Promise.all(fetchPromises);
    setIsLoading(false);
    setIsTranslationDone(true);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        padding: "10px",
        fontFamily: "Verdana, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          gap: "10px",
        }}
      >
        <Card style={{ width: "100%", height: "50%" }}>
          <CardContent
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              height: "100%",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ padding: "10px" }}></p>
              <label
                htmlFor="picture"
                style={{ width: "100%", height: "100%", cursor: "pointer" }}
              >
                <Card
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDrop={handleDrop}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px dashed #000",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgb(250, 250, 250)",
                  }}
                >
                  <CardContent
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      paddingTop: "25%",
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      id="picture"
                      type="file"
                      accept="image/*"
                      name="file"
                      onChange={handleImageUpload}
                      multiple
                      style={{ display: "none" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "40%",
                          padding: "10px",
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ width: "20%", height: "auto" }}
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
                          />
                        </svg>
                      </div>
                      <p style={{ textAlign: "center", paddingTop: "10%" }}>
                        Drag and drop files here or click to select files
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "60%",
                        }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              </label>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  padding: "10px",
                }}
              >
                Uploaded Files
              </p>
              <ScrollArea
                className=" w-[350px] rounded-md border"
                style={{
                  border: "transparent",
                  width: "100%",
                  height: "300px",
                }}
              >
                <div
                  className="image-container"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {imageData.map((data, index) => (
                    <Card
                      draggable="true"
                      onDragStart={(event) => handleDragStart(event, index)}
                      onDragOver={(event) => handleDragOverImage(event, index)}
                      onDragEnd={handleDragEnd}
                      key={index}
                      style={{
                        flex: 1,
                        border: "1.5px solid #D3D3D3",
                        cursor: "pointer",
                        opacity: draggingIndex === index ? 0.5 : 1,
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "10px",
                          }}
                        >
                          <img
                            src={data.url}
                            alt={` ${index}`}
                            style={{ width: "30px", height: "30px" }}
                          />
                        </div>
                        <div
                          style={{
                            marginLeft: "10px",
                            width: "100%",
                            padding: "10px",
                            fontSize: "0.8em",
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <div style={{ flex: "0 0 100%" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "0.8em",
                                  }}
                                >
                                  {data.details.name}
                                </div>
                                <svg
                                  onClick={() => handleDelete(index)}
                                  onMouseEnter={() => handleMouseEnter(index)}
                                  onMouseLeave={handleMouseLeave}
                                  className="w-5 h-5 text-gray-800 dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill={hoverStates[index] ? "red" : "gray"}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  color: "gray",
                                  fontSize: "0.8em",
                                  padding: "3px",
                                }}
                              >
                                <div>{data.details.size}</div>
                                <div>{data.progress}%</div>
                              </div>
                            </div>
                          </div>
                          <Progress
                            value={data.progress}
                            color="green"
                            style={{
                              alignSelf: "stretch",
                              height: "5px",
                              width: "100%",
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleTranslate}>Translate Images</Button>
          <PreviewModal
            isOpen={isLoading || isTranslationDone}
            onClose={() => {
              setPreviewText("");
              setIsTranslationDone(false);
            }}
            previewText={previewText}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
