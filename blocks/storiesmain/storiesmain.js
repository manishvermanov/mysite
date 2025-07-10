export default function decorate(block) {
  const sm = document.querySelector('.storiesmain');
  if (sm) {
    const innerWrapper = sm.querySelector('div'); // parent of stories-main
    if (innerWrapper) {
      innerWrapper.classList.add('stories-cont');

      // Optionally, add class to each test item too (if not already done)
      const children = innerWrapper.querySelectorAll(':scope > div');
      children.forEach((child) => {
        child.classList.add('stories-items');
      });
    }
  }

  const reviewData = [
    {
      id: 'text1',
      texts: [
        'Max has brought so much joy and love into my life. The adoption process was easy and supportive. I’m so grateful to have him as part of my family!',
      ],
    },
    {
      id: 'text2',
      texts: [
        'Buddy is the best companion I could ask for. The adoption was smooth, and he’s brought endless happiness to my days.',
      ],
    },
    {
      id: 'text3',
      texts: [
        'Luna has brought so much warmth and joy into my home. Adopting her was one of the best decisions I’ve made.',
      ],
    },
    {
      id: 'text4',
      texts: [
        'Nibbles is such a sweet little companion. Caring for her has been a delightful experience every day.',
      ],
    },
    {
      id: 'text5',
      texts: [
        'Kiwi brought so much joy and color to my life. Watching her chirp and play is pure happiness!',
      ],
    },
    {
      id: 'text6',
      texts: [
        'Thumper is such a gentle and loving companion. Caring for her has made my days brighter and full of smiles.',
      ],
    },
  ];

  const items = block.querySelectorAll('.stories-items');

  items.forEach((item, index) => {
    const review = reviewData[index];
    if (!review) return;

    // Create review container
    const reviewBox = document.createElement('div');
    reviewBox.classList.add('review-box');
    reviewBox.id = review.id;

    const textEl = document.createElement('p');

    // Create quote span
    const quoteSpan = document.createElement('span');
    quoteSpan.textContent = '“'; // fancy opening quote
    quoteSpan.classList.add('big-quote');

    // Append quote to text
    textEl.appendChild(quoteSpan);

    textEl.classList.add('typed-text');

    reviewBox.appendChild(textEl);
    item.appendChild(reviewBox); // Inject into each .stories-items

    // Typewriter logic
    let charIndex = 0;
    const text = review.texts[0];

    function type() {
      if (charIndex < text.length) {
        textEl.textContent += text.charAt(charIndex);
        charIndex += 1;
        setTimeout(type, 50);
      }
    }

    type();
  });
}
