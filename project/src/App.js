import "./App.css";
import Navbar from "./component/navBar";
import UploadBox from "./component/UploadBox";
import OptionBox from "./component/OptionBox";

function App() {
  return (
    <div className="bg">
      <Navbar />
      <div className="borderLine"></div>
      <UploadBox />
      <OptionBox />
    </div>
  );
}

export default App;
