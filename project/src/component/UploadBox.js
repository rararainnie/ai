import React, { useState, useEffect } from "react";
import "./UploadBox.css";
import OptionBox from "./OptionBox.js";

const UploadBox = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/descriptionAI")
      .then((resp) => resp.json())
      .then((jsonData) => setData(jsonData.members || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
          setImage(canvas.toDataURL("image/jpeg"));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="upload-box">
      {image && <img src={image} alt="Uploaded" className="uploaded-image" />}
      <button
        className="custom-button"
        onClick={() => document.getElementById("hidden-file-input").click()}
      >
        Upload Image
      </button>
      <input
        type="file"
        id="hidden-file-input"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <h3>{data.join(", ")}</h3>
      <OptionBox id="option-1" />
      <OptionBox id="option-2" />
    </div>
  );
};

export default UploadBox;
