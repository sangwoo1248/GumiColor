let draggedCard = null;

document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('dragstart', () => {
    draggedCard = card;
  });
});

document.querySelectorAll('.slot').forEach((slot, index) => {
  slot.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  slot.addEventListener('drop', () => {
    if (!slot.classList.contains('filled') && draggedCard.dataset.cardIndex == index + 1) {
      slot.innerHTML = '';
      const clone = draggedCard.cloneNode(true);
      clone.draggable = false;
      clone.style.width = '100%';
      clone.style.height = '100%';

      const xBtn = document.createElement('button');
      xBtn.className = 'x-btn';
      xBtn.innerText = 'X';
      xBtn.addEventListener('click', () => {
        slot.innerHTML = `<div class="slot-number">${index + 1}</div>`;
        slot.classList.remove('filled');
        document.querySelector('.card-container').appendChild(draggedCard);
      });

      slot.appendChild(clone);
      slot.appendChild(xBtn);
      slot.classList.add('filled');
      draggedCard.remove();
    }
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  const cardContainer = document.querySelector('.card-container');
  cardContainer.innerHTML = '';
  for (let i = 1; i <= 12; i++) {
    const card = document.createElement('img');
    card.src = `img/card${i}.png`;
    card.className = 'card';
    card.setAttribute('draggable', true);
    card.setAttribute('data-card-index', i);

    card.addEventListener('dragstart', () => {
      draggedCard = card;
    });

    cardContainer.appendChild(card);
  }

  document.querySelectorAll('.slot').forEach((slot, i) => {
    slot.innerHTML = `<div class="slot-number">${i + 1}</div>`;
    slot.classList.remove('filled');
  });
});

document.getElementById('autoBtn').addEventListener('click', () => {
  document.getElementById('resetBtn').click();
  const cards = document.querySelectorAll('.card');
  const slots = document.querySelectorAll('.slot');

  cards.forEach((card, i) => {
    if (i < slots.length) {
      const slot = slots[i];
      slot.innerHTML = '';
      const clone = card.cloneNode(true);
      clone.draggable = false;
      clone.style.width = '100%';
      clone.style.height = '100%';

      const xBtn = document.createElement('button');
      xBtn.className = 'x-btn';
      xBtn.innerText = 'X';
      xBtn.addEventListener('click', () => {
        slot.innerHTML = `<div class="slot-number">${i + 1}</div>`;
        slot.classList.remove('filled');
        document.querySelector('.card-container').appendChild(card);
      });

      slot.appendChild(clone);
      slot.appendChild(xBtn);
      slot.classList.add('filled');
      card.remove();
    }
  });
});