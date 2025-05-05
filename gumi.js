/*let draggedCard = null;
const cardContainer = document.getElementById('cardContainer');
const slotContainer = document.getElementById('slotContainer');

// 카드 드래그 이벤트
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('dragstart', e => {
    draggedCard = card;
    setTimeout(() => card.style.display = 'none', 0);
  });

  card.addEventListener('dragend', e => {
    draggedCard.style.display = 'block';
    draggedCard = null;
  });
});

// 슬롯
document.querySelectorAll('.slot').forEach(slot => {
  slot.addEventListener('dragover', e => {
    e.preventDefault();
  });

  slot.addEventListener('drop', e => {
    if (!draggedCard) return;
    if (slot.querySelector('.card')) return;

    slot.appendChild(draggedCard);
    draggedCard.style.position = 'absolute';
    draggedCard.style.top = '0';
    draggedCard.style.left = '0';
    draggedCard.style.width = '100%';
    draggedCard.style.height = '100%';

    const xBtn = document.createElement('button');
    xBtn.innerText = 'X';
    xBtn.className = 'x-btn';
    xBtn.onclick = () => {
      cardContainer.appendChild(draggedCard);
      xBtn.remove();
    };
    slot.appendChild(xBtn);
  });
});

// 리셋 기능
function resetAll() {
  document.querySelectorAll('.slot .card').forEach(card => {
    card.removeAttribute('style');
    card.className = 'card';
    cardContainer.appendChild(card);
  });
  document.querySelectorAll('.x-btn').forEach(btn => btn.remove());
}*/

const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');
const cardContainer = document.querySelector('.card-container');

let draggedCard = null;

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
  this.style.backgroundColor = '#f9f9f9';
}

function handleDrop() {
  if (!draggedCard) return;

  const cardNumber = draggedCard.dataset.cardNumber;
  const slotNumber = this.dataset.slotNumber;

  if (cardNumber !== slotNumber || this.querySelector('.card')) {
    this.style.backgroundColor = '#f9f9f9';
    return;
  }

  this.appendChild(draggedCard);
  this.style.backgroundColor = '#f9f9f9';
  attachRemoveButton(this, draggedCard);
}

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

function moveCardBack(card, btn) {
  card.removeAttribute('style');
  card.className = 'card';
  card.setAttribute('draggable', 'true');
  cardContainer.appendChild(card);
  btn.remove();
}

// 리셋 기능
function resetAll() {
  document.querySelectorAll('.slot .card').forEach(card => moveCardBack(card, card.parentElement.querySelector('.x-btn')));
}
