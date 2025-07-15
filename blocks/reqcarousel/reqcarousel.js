export default function decorate(block) {
  block.classList.add('carousel-scroll');

  const container = block.parentElement;
  container.classList.add('carousel-container');

  const leftBtn = document.createElement('button');
  leftBtn.className = 'carousel-btn left';
  leftBtn.innerHTML = '&#10094;';

  const rightBtn = document.createElement('button');
  rightBtn.className = 'carousel-btn right';
  rightBtn.innerHTML = '&#10095;';

  container.appendChild(leftBtn);
  container.appendChild(rightBtn);

  const cards = Array.from(block.children);
  let activeIndex = 0;

  // Helper: update card highlighting
  function updateHighlight() {
    cards.forEach((card, i) => {
      const isActive = i === activeIndex;
      card.style.backgroundColor = isActive ? 'var(--accent)' : '#ebe4e4';
      card.style.color = isActive ? '#ffffff' : '#000000'; // ✅ text color change
    });

    const cardWidth = cards[0]?.offsetWidth || 260;
    const gap = 32; // 2rem
    block.scrollTo({
      left: (cardWidth + gap) * activeIndex,
      behavior: 'smooth',
    });
  }

  // Initial highlight
  updateHighlight();

  rightBtn.addEventListener('click', () => {
    if (activeIndex < cards.length - 1) {
      activeIndex += 1;
      updateHighlight();
    }
  });

  leftBtn.addEventListener('click', () => {
    if (activeIndex > 0) {
      activeIndex -= 1;
      updateHighlight();
    }
  });
}
