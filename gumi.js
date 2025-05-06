const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');
const cardContainer = document.querySelector('.card-container');

let draggedCard = null;
let selectedCard = null;

cards.forEach(card => {
  card.setAttribute('draggable', 'true');
  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);
});

slots.forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());
  slot.addEventListener('dragenter', handleDragEnter);
  slot.addEventListener('dragleave', handleDragLeave);
  slot.addEventListener('drop', handleDrop);
});

cards.forEach(card => {
  card.addEventListener('click', () => {
    if (selectedCard) selectedCard.classList.remove('selected');
    selectedCard = card;
    selectedCard.classList.add('selected');
  });
});

slots.forEach(slot => {
  slot.addEventListener('click', () => {
    if (!selectedCard) return;
    if (slot.querySelector('.card')) return;
    if (slot.dataset.slotNumber !== selectedCard.dataset.cardNumber) return;

    slot.appendChild(selectedCard);
    selectedCard.style.position = 'absolute';
    selectedCard.style.top = '0';
    selectedCard.style.left = '0';
    selectedCard.style.width = '100%';
    selectedCard.style.height = '100%';

    attachRemoveButton(slot, selectedCard);
    selectedCard.classList.remove('selected');
    selectedCard = null;
  });
});

function handleDragStart() {
  draggedCard = this;
  setTimeout(() => (this.style.display = 'none'), 0);
}

function handleDragEnd() {
  this.style.display = 'flex';
  draggedCard = null;
}

function handleDragEnter() {
  this.style.backgroundColor = '#d0f0ff';
}

function handleDragLeave() {
  this.style.backgroundColor = '';
}

// 드롭
function handleDrop() {
  if (!draggedCard) return;

  const cardNumber = draggedCard.dataset.cardNumber;
  const slotNumber = this.dataset.slotNumber;

  if (cardNumber !== slotNumber || this.querySelector('.card')) {
    this.style.backgroundColor = '';
    return;
  }

  this.appendChild(draggedCard);
  this.style.backgroundColor = '';
  draggedCard.style.position = 'absolute';
  draggedCard.style.top = '0';
  draggedCard.style.left = '0';
  draggedCard.style.width = '100%';
  draggedCard.style.height = '100%';

  attachRemoveButton(this, draggedCard);
}

// 삭제 버튼
function attachRemoveButton(slot, card) {
  removeRemoveButton(slot);

  const btn = document.createElement('button');
  btn.textContent = '×';
  btn.className = 'x-btn';
  btn.onclick = () => moveCardBack(card, btn);

  slot.appendChild(btn);
}

function removeRemoveButton(slot) {
  const existingBtn = slot.querySelector('.x-btn');
  if (existingBtn) existingBtn.remove();
}

// 카드 원래 자리로 이동
function moveCardBack(card, btn) {
  card.removeAttribute('style');
  card.className = 'card';
  card.setAttribute('draggable', 'true');
  cardContainer.appendChild(card);
  if (btn) btn.remove();
}

// 전체 초기화
function resetAll() {
  document.querySelectorAll('.slot .card').forEach(card => {
    const btn = card.parentElement.querySelector('.x-btn');
    moveCardBack(card, btn);
  });
}

function autoPlace() {
  const allCards = Array.from(document.querySelectorAll('.card-container .card'));
  const allSlots = Array.from(document.querySelectorAll('.slot'));

  allCards.forEach(card => {
    const cardNumber = card.dataset.cardNumber;
    const slot = allSlots.find(slot => slot.dataset.slotNumber === cardNumber && !slot.querySelector('.card'));
    if (slot) {
      slot.appendChild(card);
      card.style.position = 'absolute';
      card.style.top = '0';
      card.style.left = '0';
      card.style.width = '100%';
      card.style.height = '100%';
      attachRemoveButton(slot, card);
    }
  });
}

// 구글 시트에 결과 전송
function saveToSheet(cardOrder) {
  fetch("https://script.google.com/macros/s//exec", { 
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cardOrder: cardOrder
    })
  })
  .then(() => {
    alert("저장되었습니다!");
  })
  .catch((error) => {
    console.error("저장 오류:", error);
    alert("저장 중 오류가 발생했습니다.");
  });
}

function handleSave() {
  const slotImages = document.querySelectorAll('.slot img');
  const cardOrder = [];

  slotImages.forEach(img => {
    const alt = img.getAttribute('alt') || '';
    if (alt.startsWith("Card")) {
      cardOrder.push(alt.replace("Card", ""));
    } else {
      cardOrder.push("");
    }
  });

  saveToSheet(cardOrder);
}

document.querySelector('.save-btn').addEventListener('click', handleSave);