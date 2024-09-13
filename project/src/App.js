import "./App.css";
import Navbar from "./component/navBar";
import UploadBox from "./component/UploadBox";

function App() {
  return (
    <div className="bg">
      <Navbar />
      <div className="borderLine"></div>
      <UploadBox />
    </div>
  );
}

export default App;
