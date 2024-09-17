// import "./OptionBox.css";
// import { useState } from "react";

// function OptionBox({ label, id }) {
//   const [number, setNumber] = useState(1);

//   const handleNumberChange = (e) => {
//     const value = e.target.value;
//     if (value >= 1 && value <= 10) {
//       setNumber(value);
//     }
//   };

//   return (
//     <div className="option-box-container">
//       <span>{label}</span>
//       <input type="checkbox" id={id} />
//       <label htmlFor={id}></label>
//       <input
//         type="number"
//         className="number-input"
//         value={number}
//         onChange={handleNumberChange}
//         min="1"
//         max="10"
//       />
//     </div>
//   );
// }

// export default OptionBox;

import "./OptionBox.css";
import React, { useState } from "react";

function OptionBox({ id, onShowSimilar }) {
  const [number, setNumber] = useState(1);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value >= 1 && value <= 10) {
      setNumber(value);
    }
  };

  const handleClick = () => {
    onShowSimilar(number);
  };

  return (
    <div className="option-box-container">
      <span>Search for</span>
      <input
        className="number-input"
        type="number"
        min="1"
        max="10"
        value={number}
        onChange={handleChange}
      />
      <span>similar images</span>
      <button className="show-button" onClick={handleClick}>
        Search
      </button>
    </div>
  );
}

export default OptionBox;