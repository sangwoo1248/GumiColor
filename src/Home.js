//import logo from "./logo.svg";
import background from "./background.png";
import startImg from "./start.png";
import mycolorImg from "./mycolor.png";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <div className="background-container">
        <title>
          <p>구미공방</p>
        </title>
        <img src={background} alt="background" className="App-background" />
        <img
          src={startImg}
          alt="start"
          className="overlay-image App-start"
          onClick={() => navigate("/info")}
          style={{ cursor: "pointer" }}
        />
        <img
          src={mycolorImg}
          alt="my color"
          className="overlay-image App-mycolor"
        />
      </div>
    </div>
  );
}

export default Home;
