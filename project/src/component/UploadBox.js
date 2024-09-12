import React, { useState } from "react";
import "./UploadBox.css";

const UploadBox = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    document.getElementById("hidden-file-input").click();
  };

  return (
    <div className="upload-box">
      {image && <img src={image} alt="Uploaded" className="uploaded-image" />}

      <button className="custom-button" onClick={handleClick}>
        Upload Image
      </button>

      <input
        type="file"
        id="hidden-file-input"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadBox;
