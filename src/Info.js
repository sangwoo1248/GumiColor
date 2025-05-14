import background from "./background.png";
import nextImg from "./next.png";
import infoLabelImg from "./Image-1.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./info.css";

function Info() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleNext = () => {
    if (name.trim() && phone.trim()) {
      navigate("/color");
    } else {
      alert("이름과 전화번호를 입력해주세요.");
    }
  };

  return (
    <div className="App">
      <div className="background-container">
        <img src={background} alt="background" className="background-image" />
        <img
          src={infoLabelImg}
          alt="info label"
          className="overlay-image info-label"
        />

        <div className="form-container">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="전화번호 (숫자만 입력)"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
          />
        </div>

        <img
          src={nextImg}
          alt="next"
          className="overlay-image next-button"
          onClick={handleNext}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default Info;
