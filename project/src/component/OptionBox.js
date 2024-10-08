import "./OptionBox.css";
import React, { useState } from "react";

function OptionBox({ onShowSimilar }) {
  const [number, setNumber] = useState(1);
  const min = 1;
  const max = 50;

  const handleChange = (e) => {
    const value = e.target.value;
    if (value >= min && value <= max) {
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
        min="min"
        max="max"
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
