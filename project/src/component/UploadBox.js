import React, { useState } from "react";
import "./UploadBox.css";
import OptionBox from "./OptionBox.js";

const UploadBox = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState(
    "Please upload an image before generating a caption"
  );
  const [captionClass, setCaptionClass] = useState("await"); // Default caption color
  const [similarImages, setSimilarImages] = useState([]); // Declare state for similar images
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const API_KEY = "AIzaSyAjlKL_sXQ62ZgcP845whRhFjgII1duj5Q";
  const SEARCH_ENGINE_ID = "11c6d9c6a0fff4aa1";

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          // Update image state
          setImage(canvas.toDataURL("image/jpeg"));

          // Reset caption state on image upload
          setCaption("Please generate a caption for the uploaded image");
          setCaptionClass("await");
          setSimilarImages([]); // Reset similar images on new upload
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateCaption = async () => {
    if (image) {
      // If an image is uploaded, display the caption after model processing
      setCaption("Generating caption, please wait...");
      setCaptionClass("await");

      try {
        // Send image to server and receive prediction
        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: image.split(",")[1] }), // Send base64 string only
        });

        if (response.ok) {
          const result = await response.json();
          setCaption(`${result.caption}`);
          setCaptionClass("predicted");
        } else {
          throw new Error("Failed to fetch caption");
        }
      } catch (error) {
        console.error("Error predicting image:", error);
        setCaption("Failed to generate caption");
        setCaptionClass("error");
      }
    } else {
      // If no image is uploaded, show error message in red
      setCaption("Image is not uploaded yet");
      setCaptionClass("error");
    }
  };

  // Function to validate if the image URL is valid
  const isValidImageUrl = async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleShowSimilar = async (number) => {
    setSimilarImages([]);
    if (
      caption &&
      caption !== "Please upload an image before generating a caption" &&
      caption !== "Please generate a caption for the uploaded image" &&
      caption !== "Image is not uploaded yet"
    ) {
      setLoadingSimilar(true);

      const totalResults = number;
      const allImages = [];
      let allFetchedResults = 0;
      let resultsUsed = 0;
  
      // ทำการเรียก API หลายครั้งเพื่อดึงภาพ
      while (resultsUsed < totalResults) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(caption)}&searchType=image&num=10&start=${allFetchedResults + 1}`
          );

          allFetchedResults += 10;

          if (response.ok) {
            const data = await response.json();
            const images = data.items.map((item) => ({
              link: item.link, // URL ของรูปภาพ
              pageLink: item.image.contextLink, // URL ของหน้าเว็บที่มีรูปภาพ
            }));

            // Check which images are valid and filter out the invalid ones
            const validImages = await Promise.all(
              images.map(async (image) => ({
                ...image,
                isValid: await isValidImageUrl(image.link),
              }))
            );

            validImages.forEach((image) => {
              if (image.isValid) {
                allImages.push(image);
                resultsUsed++;
              }
            });

          } else {
            throw new Error("Failed to fetch similar images");
          }
        } catch (error) {
          console.error("Error fetching similar images:", error);
          setSimilarImages([]);
          setLoadingSimilar(false);
          return;
        }
      }
      // ตัดภาพให้เหลือเพียงจำนวนที่ต้องการ
      setSimilarImages(allImages.slice(0, totalResults));
      setLoadingSimilar(false);
    } else {
      alert("Please generate a caption first.");
    }
  };

  return (
    <div className="container">
      <div className="upload-box">
        {/* กล่องใส่รูปที่ผู้ใช้นำเข้ามา*/}
        <div className="image-box">
          <div className="inside-image-box">
            {image ? (
              <img src={image} alt="Uploaded" className="uploaded-image" />
            ) : (
              <div className="placeholder">Upload an Image</div>
            )}
          </div>
        </div>
        {/* จบกล่องรูปที่ผู้ใช้นำเข้า */}

        {/* กล่องอธิบายวิธีการใช้งานเว็บ & ปุ่ม upload, generate */}
        <div className="textDescription-And-AllButton">
          {/* กล่องคำอธิบาย */}
          <div className="textDescription">
            <h1>How to Generate Image to Text</h1>
            <h4> 1. Upload Picture</h4>
            <h4> 2. Select how many similar image you want</h4>
            <h4> 3. Press the Generate button</h4>
          </div>
          {/* จบกล่องคำอธิบาย */}

          {/* กล่องปุ่ม upload, generate */}
          <div className="button-group">
            <button
              className="custom-button"
              onClick={() =>
                document.getElementById("hidden-file-input").click()
              }
            >
              Upload
            </button>
            <button
              className="custom-button generate-caption-button"
              onClick={handleGenerateCaption}
            >
              Generate
            </button>
          </div>
          {/* จบกล่องปุ่ม upload, generate */}

          {/* กล่องปุ่ม similar image */}
          <div className="similarBtn">
            <OptionBox onShowSimilar={handleShowSimilar} />
            <input
              type="file"
              id="hidden-file-input"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          {/* จบกล่องปุ่ม similar image */}

          {/* กล่องใส่คำอธิบายที่ถูก generate มา */}
          <div className={`caption-box ${captionClass}`}>{caption}</div>
          {/* จบกล่องใส่คำอธิบายที่ถูก generate มา */}
        </div>
      </div>

      {/* กล่องใส่รูปภาพใกล้เคียง */}
      <h1 className="similar-text">Similar Image</h1>
      <div className="similar-images-container">
        {loadingSimilar && <div className="loading-similar">please wait...</div>}
        {similarImages.map((imageData, index) => (
          <div key={index} className="similar-image">
            {/* Wrap the image in an <a> tag to link to the page */}
            <a
              href={imageData.pageLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imageData.link}
                alt={`Similar ${index + 1}`}
                className="similar-image-item"
              />
            </a>
            <p>{imageData.link}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadBox;
