import "./OptionBox.css";

function OptionBox({ label, id }) {
  return (
    <>
      <input type="checkbox" id={id} />
      <label htmlFor={id}></label>
    </>
  );
}

export default OptionBox;
