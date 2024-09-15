// import React, { useState, useEffect } from "react";
// import "./UploadBox.css";
// import OptionBox from "./OptionBox.js";

// const UploadBox = () => {
//   const [image, setImage] = useState(null);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/descriptionAI", {
//       method: "GET",
//     })
//       .then((resp) => resp.json())
//       .then((jsonData) => setData(jsonData.members || []))
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const img = new Image();
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           canvas.width = img.width;
//           canvas.height = img.height;
//           const ctx = canvas.getContext("2d");
//           ctx.drawImage(img, 0, 0);
//           setImage(canvas.toDataURL("image/jpeg"));
//         };
//         img.src = reader.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="upload-box">
//       {image && <img src={image} alt="Uploaded" className="uploaded-image" />}
//       <button
//         className="custom-button"
//         onClick={() => document.getElementById("hidden-file-input").click()}
//       >
//         Upload Image
//       </button>
//       <input
//         type="file"
//         id="hidden-file-input"
//         onChange={handleImageChange}
//         style={{ display: "none" }}
//       />
//       <h3>{data.join(", ")}</h3>
//       <OptionBox id="option-1" />
//       <OptionBox id="option-2" />
//     </div>
//   );
// };

// export default UploadBox;

import React, { useState, useEffect } from "react";
import "./UploadBox.css";
import OptionBox from "./OptionBox.js";

const UploadBox = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [caption, setCaption] = useState(""); // State for caption

  useEffect(() => {
    fetch("http://localhost:5000/descriptionAI", {
      method: "GET",
    })
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
          const base64Image = canvas.toDataURL("image/jpeg").split(",")[1];

          // Update image state
          setImage(canvas.toDataURL("image/jpeg"));

          // Reset caption on new image upload
          setCaption("");

          // Send image to server
          fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64Image }),
          })
            .then((response) => response.json())
            .then((result) => {
              console.log("Prediction:", result.prediction); // Log prediction result
              setPrediction(result.prediction);
            })
            .catch((error) => console.error("Error predicting image:", error));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateCaption = () => {
    if (image) {
      setCaption("This is a caption of the Image");
    } else {
      setCaption("Please upload an image before generating a caption");
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
      <input
        type="file"
        id="hidden-file-input"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      {/* Text box to display caption or error */}
      <div className={`caption-box ${image ? "caption" : "error"}`}>
        {caption}
      </div>
      <h3>{data.join(", ")}</h3>
      <h3>
        Prediction: {prediction ? prediction.join(", ") : "No prediction yet"}
      </h3>
      <OptionBox id="option-1" />
    </div>
  );
};

export default UploadBox;

