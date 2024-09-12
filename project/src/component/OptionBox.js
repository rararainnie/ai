import { useState } from "react";
import "./OptionBox.css";

function OptionBox({ label }) {
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelection = () => {
    const newSelection = !isSelected;
    setIsSelected(newSelection);
    if (newSelection) {
      console.log("ผู้ใช้เลือกคำบรรยาย");
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id="selection-toggle"
        checked={isSelected}
        onChange={toggleSelection}
      />
      <label htmlFor="selection-toggle">{label}</label>
    </>
  );
}

export default OptionBox;
