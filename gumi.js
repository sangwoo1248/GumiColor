const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');
const cardContainer = document.querySelector('.card-container');

let draggedCard = null;
let selectedCard = null;

// PC 드래그 앤 드롭
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

// 터치용: 카드 선택
cards.forEach(card => {
  card.addEventListener('click', () => {
    if (selectedCard) selectedCard.classList.remove('selected');
    selectedCard = card;
    selectedCard.classList.add('selected');
  });
});

// 터치용: 슬롯 클릭 시 이동
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

// 드래그 시작
function handleDragStart() {
  draggedCard = this;
  setTimeout(() => (this.style.display = 'none'), 0);
}

// 드래그 종료
function handleDragEnd() {
  this.style.display = 'flex';
  draggedCard = null;
}

// 드래그 대상에 진입
function handleDragEnter() {
  this.style.backgroundColor = '#d0f0ff';
}

// 드래그 대상에서 나갈 때
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

// 삭제(X) 버튼 추가
function attachRemoveButton(slot, card) {
  removeRemoveButton(slot);

  const btn = document.createElement('button');
  btn.textContent = '×';
  btn.className = 'x-btn';
  btn.onclick = () => moveCardBack(card, btn);

  slot.appendChild(btn);
}

// 기존 X 버튼 제거
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

// 자동배치: 카드 번호 = 슬롯 번호인 경우 자동 넣기
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

// 저장: 구글 시트에 결과 전송
function saveResult() {
  const result = [];
  document.querySelectorAll('.slot').forEach(slot => {
    const card = slot.querySelector('.card');
    if (card) {
      result.push({
        slot: slot.dataset.slotNumber,
        card: card.dataset.cardNumber
      });
    }
  });

  fetch("https://script.google.com/macros/s/AKfycbzyAbZ6Fff01oWGUfItf929mSo7HKsI9I5XzH0zQzJdCWZE_-ag7yQLbHk9fmD4XcX3/exec", {
    method: "POST",
    body: JSON.stringify(result),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.text())
  .then(msg => {
    alert("저장 완료되었습니다!");
  })
  .catch(err => {
    console.error(err);
    alert("저장 중 오류가 발생했습니다.");
  });
}