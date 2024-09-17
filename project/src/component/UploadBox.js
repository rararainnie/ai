import React, { useState } from "react";
import "./UploadBox.css";
import OptionBox from "./OptionBox.js";

const UploadBox = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [caption, setCaption] = useState(
    "Please upload an image before generating a caption"
  );
  const [captionClass, setCaptionClass] = useState("await"); // Default caption color

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
          setPrediction(result.caption);
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

  return (
    <div className="upload-box">
      <div className="image-box">
        {image ? (
          <img src={image} alt="Uploaded" className="uploaded-image" />
        ) : (
          <div className="placeholder">Upload an Image</div>
        )}
      </div>
      <div className="button-group">
        <button
          className="custom-button"
          onClick={() => document.getElementById("hidden-file-input").click()}
        >
          Upload Image
        </button>
        <button
          className="custom-button generate-caption-button"
          onClick={handleGenerateCaption}
        >
          Generate Caption
        </button>
      </div>
      <OptionBox label="similar images" />
      <input
        type="file"
        id="hidden-file-input"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      {/* Text box to display caption or error */}
      <div className={`caption-box ${captionClass}`}>{caption}</div>
    </div>
  );
};

export default UploadBox;
