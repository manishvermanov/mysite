export default function decorate(block) {
  const cards = [...block.children];

  cards.forEach((card) => {
    const parts = [...card.children];
    if (parts.length !== 2) return;

    const imgDiv = parts[0];
    const textDiv = parts[1];

    // Create card structure
    const wrapper = document.createElement('div');
    wrapper.className = 'animalcard flip-card';

    const inner = document.createElement('div');
    inner.className = 'card-inner flip-card-inner';

    const front = document.createElement('div');
    front.className = 'card-front flip-card-front';
    front.appendChild(imgDiv);

    const back = document.createElement('div');
    back.className = 'card-back flip-card-back';
    back.appendChild(textDiv); // ✅ fix: use the text, not a second image

    inner.appendChild(front);
    inner.appendChild(back);
    wrapper.appendChild(inner);

    block.appendChild(wrapper);
    block.removeChild(card);
  });
}
