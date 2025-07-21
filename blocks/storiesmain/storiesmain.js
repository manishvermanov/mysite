export default function decorate(block) {
  const sm = document.querySelector('.storiesmain');
  if (sm) {
    const innerWrapper = sm.querySelector('div');
    if (innerWrapper) {
      innerWrapper.classList.add('stories-cont');

      const children = innerWrapper.querySelectorAll(':scope > div');
      children.forEach((child) => {
        child.classList.add('stories-items');
      });
    }
  }

  const items = block.querySelectorAll('.stories-items');

  items.forEach((item, index) => {
    const paragraphs = item.querySelectorAll('p');
    const lastParagraph = paragraphs[paragraphs.length - 1];

    if (!lastParagraph) return;

    // Get original text (remove opening quote if present)
    const originalText = lastParagraph.textContent.trim().replace(/^["“”']+/, '');
    lastParagraph.remove(); // Remove it so we can retype

    // Create review container
    const reviewBox = document.createElement('div');
    reviewBox.classList.add('review-box');
    reviewBox.id = `text${index + 1}`;

    const textEl = document.createElement('p');

    // Create quote span
    const quoteSpan = document.createElement('span');
    quoteSpan.textContent = '“';
    quoteSpan.classList.add('big-quote');
    textEl.appendChild(quoteSpan);

    textEl.classList.add('typed-text');
    reviewBox.appendChild(textEl);
    item.appendChild(reviewBox);

    // Typewriter effect
    let charIndex = 0;

    function type() {
      if (charIndex < originalText.length) {
        textEl.textContent += originalText.charAt(charIndex);
        charIndex += 1;
        setTimeout(type, 50);
      }
    }

    type();
  });
}
