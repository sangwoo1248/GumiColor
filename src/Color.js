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

  const handleDragStart = (e, cardId) => {
    draggedCardId.current = cardId;
    e.dataTransfer.setData("cardId", cardId);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, slotIdx) => {
    const cardId = parseInt(e.dataTransfer.getData("cardId"));
    insertCardToSlot(cardId, slotIdx);
  };

  const handleTouchStart = (cardId) => {
    draggedCardId.current = cardId;
  };

  const handleTouchEnd = (slotIdx) => {
    if (draggedCardId.current !== null) {
      insertCardToSlot(draggedCardId.current, slotIdx);
      draggedCardId.current = null;
    }
  };

  const insertCardToSlot = (cardId, slotIdx) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || slots[slotIdx]) return;

    const updatedSlots = [...slots];
    updatedSlots[slotIdx] = card;
    setSlots(updatedSlots);

    const updatedCards = cards.filter((c) => c.id !== cardId);
    setCards(updatedCards);
  };

  const removeCardFromSlot = (slotIdx) => {
    const card = slots[slotIdx];
    if (!card) return;

    const updatedSlots = [...slots];
    updatedSlots[slotIdx] = null;
    setSlots(updatedSlots);

    setCards((prev) => [...prev, card].sort((a, b) => a.id - b.id)); // 카드 순서 복구
  };

  const resetAll = () => {
    setCards(initialCards);
    setSlots(Array(12).fill(null));
  };

  const saveToSheet = async () => {
    const slotData = slots.map((slot) => (slot ? `card-${slot.id}` : ""));

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbwObKsCqfU4qstNTQAX9zIA4NpXjjPH5oIC8bypFQwukdNB5niYT0mQhmKjQ6RXSORw/exec",
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

        <div className="guide-text">카드를 선택해주세요</div>

        <div className="card-slot-container">
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
                  <div className="slot-card-wrapper">
                    <img
                      src={slot.img}
                      alt={`slot-card-${idx}`}
                      className="card-in-slot"
                    />
                    <button
                      className="x-button"
                      onClick={() => removeCardFromSlot(idx)}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <img src={slotImg} alt={`slot-${idx}`} className="slot-img" />
                )}
              </div>
            ))}
          </div>

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
