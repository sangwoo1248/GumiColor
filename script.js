const cards = document.querySelectorAll('.card-container');
const slots = document.querySelectorAll('.slot');
const cardGrid = document.getElementById('cardGrid');
const nextButton = document.getElementById('nextButton');
const orderDisplay = document.getElementById('orderDisplay');

// 드래그 중인 요소 추적
let dragged = null;

// 드래그 시작
cards.forEach(card => {
  card.addEventListener('dragstart', e => {
    dragged = card;
    setTimeout(() => card.style.display = 'none', 0);
  });

  card.addEventListener('dragend', e => {
    card.style.display = 'flex';
  });

  // 모바일 터치 지원
  card.addEventListener('touchstart', e => {
    dragged = card;
  });
});

// 슬롯에 드롭 이벤트
slots.forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());

  slot.addEventListener('drop', e => {
    if (!dragged) return;

    // 이미 카드가 있는 슬롯이면 리턴
    if (slot.children.length > 0) return;

    slot.appendChild(dragged);
    dragged.classList.add('in-slot');
    dragged.style.display = 'flex';
  });

  // 모바일 대응: 터치로 슬롯에 넣기
  slot.addEventListener('touchend', e => {
    if (!dragged) return;
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('slot') && target.children.length === 0) {
      target.appendChild(dragged);
      dragged.classList.add('in-slot');
    }
  });
});

// X 버튼으로 카드 복귀
document.querySelectorAll('.remove-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.card-container');
    card.classList.remove('in-slot');
    cardGrid.appendChild(card);
  });
});

// 순서 저장 및 UI 표시 + 스프레드시트 전송
nextButton.addEventListener('click', () => {
  const order = [];
  slots.forEach(slot => {
    const card = slot.querySelector('.card-container');
    if (card) {
      order.push(card.dataset.id);
    } else {
      order.push(null); // 빈 슬롯은 null 처리
    }
  });

  // UI에 표시
  orderDisplay.textContent = '선택된 카드 순서: ' + order.join(', ');

  // 구글 앱스 스크립트에 POST 요청 (구글 스프레드시트 연동)
fetch('https://script.google.com/macros/s/AKfycbw8q7HWrliU1q7sUjg7RVrsSN_TpwQGB2yN1wipMADyXjEohOqivU4VwWVIDzBAcVFT/exec', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: ['001.png', '002.png', '003.png', '004.png', '005.png', 
                  '006.png', '007.png', '008.png', '009.png', '010.png', 
                  '011.png', '012.png']
        })
      })
      .then(res => res.text())
      .then(res => console.log('서버 응답:', res))
      .catch(err => console.error('전송 오류:', err));
});
