export default function decorate(block) {
  const heroli = document.querySelector('.heroblock.headings.block');
  if (block) {
    const listItems = heroli.querySelectorAll('li');
    listItems.forEach((li, index) => {
      const button = document.createElement('button');
      button.textContent = li.textContent;
      button.classList.add('hero-btn');
      if (index === 1) {
        button.classList.add('btn-transparent');
      }
      li.replaceWith(button);
    });
  }

  const heroBlock = document.querySelector('.heroblock.headings.block');
  const wrapperDivs = heroBlock?.querySelectorAll(':scope > div');

  if (wrapperDivs && wrapperDivs.length > 1) {
    const imageWrapper = wrapperDivs[1].querySelector('div');
    if (imageWrapper) {
      imageWrapper.classList.add('hero-images');

      // ✅ Remove lazy loading from all hero images
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

    // ✅ Fix lazy-loading on background LCP image
    const bgImg = wrapper.querySelector('img[loading="lazy"]');
    if (bgImg) {
      bgImg.removeAttribute('loading');
      bgImg.setAttribute('fetchpriority', 'high');
    }
  }
}
