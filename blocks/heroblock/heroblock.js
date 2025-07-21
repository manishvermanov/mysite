export default function decorate(block) {
  const heroli = document.querySelector('.heroblock.headings.block');
  if (block) {
    const listItems = heroli.querySelectorAll('li');
    listItems.forEach((li, index) => {
      li.classList.add('hero-btn');
      if (index === 1) {
        li.classList.add('btn-transparent');
      }
    });
  }

  const heroBlock = document.querySelector('.heroblock.headings.block');
  const wrapperDivs = heroBlock?.querySelectorAll(':scope > div');

  if (wrapperDivs && wrapperDivs.length > 1) {
    const imageWrapper = wrapperDivs[1].querySelector('div');
    if (imageWrapper) {
      imageWrapper.classList.add('hero-images');

      const heroImgs = imageWrapper.querySelectorAll('img[loading="lazy"]');
      heroImgs.forEach((img) => {
        img.removeAttribute('loading');
        img.setAttribute('fetchpriority', 'low');
      });
    }
  }

  const wrapper = document.querySelector(
    '.heroblock-container > .default-content-wrapper',
  );
  if (wrapper) {
    wrapper.classList.add('hero-background-wrapper');

    const bgImg = wrapper.querySelector('img[loading="lazy"]');
    if (bgImg) {
      bgImg.removeAttribute('loading');
      bgImg.setAttribute('fetchpriority', 'high');
    }
  }

  // ✅ Insert Toast inside Heroblock (bottom of it)
  if (!document.getElementById('quiz-toast') && heroBlock) {
    const toast = document.createElement('div');
    toast.id = 'quiz-toast';
    toast.innerHTML = `
      <span>Discover the Animal Aligned with Your Energy</span>
      <a href="/quiz" class="quiz-toast-btn">Take the Quiz</a>
      <span class="quiz-toast-close">&times;</span>
    `;
    toast.classList.add('hero-toast');

    heroBlock.appendChild(toast);

    toast.querySelector('.quiz-toast-close')?.addEventListener('click', () => {
      toast.remove();
    });
  }
}
