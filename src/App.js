//import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Info from "./Info";
import Color from "./Color";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/color" element={<Color />} />
      </Routes>
    </Router>
  );
}

export default App;
