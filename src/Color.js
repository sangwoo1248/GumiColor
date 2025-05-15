import background from "./background.png";
import card1 from "./001.png";
import card2 from "./002.png";
import card3 from "./003.png";
import card4 from "./004.png";
import card5 from "./005.png";
import card6 from "./006.png";
import card7 from "./007.png";
import card8 from "./008.png";
import card9 from "./009.png";
import card10 from "./010.png";
import card11 from "./011.png";
import card12 from "./012.png";
import slotImg from "./select.png";
import resetImg from "./reset.png";
import saveImg from "./save.png";
import { useState, useRef } from "react";
import "./color.css";

/*<img src={card1} alt="001" className="overlay-image card1" />
        <img src={card2} alt="002" className="overlay-image card2" />
        <img src={card3} alt="003" className="overlay-image card3" />
        <img src={card4} alt="004" className="overlay-image card4" />
        <img src={card5} alt="005" className="overlay-image card5" />
        <img src={card6} alt="006" className="overlay-image card6" />
        <img src={card7} alt="007" className="overlay-image card7" />
        <img src={card8} alt="008" className="overlay-image card8" />
        <img src={card9} alt="009" className="overlay-image card9" />
        <img src={card10} alt="010" className="overlay-image card10" />
        <img src={card11} alt="011" className="overlay-image card11" />
        <img src={card12} alt="012" className="overlay-image card12" />*/

function Color() {
  const cardImages = [
    card1,
    card2,
    card3,
    card4,
    card5,
    card6,
    card7,
    card8,
    card9,
    card10,
    card11,
    card12,
  ];

  const initialCards = cardImages.map((img, i) => ({ id: i, img }));
  const [cards, setCards] = useState(initialCards);
  const [slots, setSlots] = useState(Array(12).fill(null));
  const draggedCardId = useRef(null);

  // 🔹 드래그 시작
  const handleDragStart = (e, cardId) => {
    draggedCardId.current = cardId;
    e.dataTransfer.setData("cardId", cardId);
  };

  // 🔹 드롭 허용
  const allowDrop = (e) => {
    e.preventDefault();
  };

  // 🔹 드롭 처리
  const handleDrop = (e, slotIdx) => {
    const cardId = parseInt(e.dataTransfer.getData("cardId"));
    insertCardToSlot(cardId, slotIdx);
  };

  // 🔹 터치 시작
  const handleTouchStart = (cardId) => {
    draggedCardId.current = cardId;
  };

  // 🔹 터치 종료 시 슬롯에 삽입
  const handleTouchEnd = (slotIdx) => {
    if (draggedCardId.current !== null) {
      insertCardToSlot(draggedCardId.current, slotIdx);
      draggedCardId.current = null;
    }
  };

  // 🔹 카드 삽입 공통 함수
  const insertCardToSlot = (cardId, slotIdx) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || slots[slotIdx]) return;

    const updatedSlots = [...slots];
    updatedSlots[slotIdx] = card;
    setSlots(updatedSlots);

    const updatedCards = cards.filter((c) => c.id !== cardId);
    setCards(updatedCards);
  };

  // 🔹 카드 리셋
  const resetAll = () => {
    setCards(initialCards);
    setSlots(Array(6).fill(null));
  };

  // 저장
  const saveToSheet = async () => {
    const slotData = slots.map((slot) => (slot ? `card-${slot.id}` : ""));

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbwc3UKqVsDpCnLmhKp0RVP8BdBhPsWt3IvlK2cOSFpyiwlKeCtsNcOAkkavo56iBvBn/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slots: slotData }),
        }
      );

      const text = await res.text();
      if (res.ok) {
        alert("저장되었습니다: " + text);
      } else {
        alert("저장 실패: " + text);
      }
    } catch (err) {
      alert("오류 발생: " + err.message);
    }
  };

  return (
    <div className="App">
      <div className="background-container">
        <img src={background} alt="background" className="background-image" />

        <div className="card-slot-container">
          <div className="guide-text">카드를 선택해주세요</div>

          {/* 카드 영역 */}
          <div className="card-grid">
            {cards.map((card) => (
              <img
                key={card.id}
                src={card.img}
                alt={`card-${card.id}`}
                className="card"
                draggable
                onDragStart={(e) => handleDragStart(e, card.id)}
                onTouchStart={() => handleTouchStart(card.id)}
              />
            ))}
          </div>

          {/* 슬롯 영역 */}
          <div className="slot-grid">
            {slots.map((slot, idx) => (
              <div
                key={idx}
                className="slot"
                onDragOver={allowDrop}
                onDrop={(e) => handleDrop(e, idx)}
                onTouchEnd={() => handleTouchEnd(idx)}
              >
                {slot ? (
                  <img
                    src={slot.img}
                    alt={`slot-card-${idx}`}
                    className="card-in-slot"
                  />
                ) : (
                  <img src={slotImg} alt={`slot-${idx}`} className="slot-img" />
                )}
              </div>
            ))}
          </div>

          {/* 버튼 영역 */}
          <div className="button-group">
            <img
              src={resetImg}
              alt="reset"
              className="control-button"
              onClick={resetAll}
            />
            <img
              src={saveImg}
              alt="save"
              className="control-button"
              onClick={saveToSheet}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Color;
