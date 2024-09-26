import "./OptionBox.css";
import React, { useState } from "react";

function OptionBox({ onShowSimilar }) {
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
