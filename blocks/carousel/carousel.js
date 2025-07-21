import { fetchPlaceholders } from '../../scripts/placeholders.js';

function updateSlideState(block, slideIndex) {
  const slides = block.querySelectorAll('.carousel-slide');

  slides.forEach((slide, idx) => {
    slide.setAttribute('aria-hidden', idx !== slideIndex);
    slide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  block.dataset.activeSlide = slideIndex;
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;

  let index = slideIndex;

  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;

  const slideToShow = slides[index];
  const scrollContainer = block.querySelector('.carousel-slides');

  scrollContainer.scrollTo({
    top: 0,
    left: slideToShow.offsetLeft,
    behavior: 'smooth',
  });

  updateSlideState(block, index);
}

function bindEvents(block) {
  const prevBtn = block.querySelector('.slide-prev');
  const nextBtn = block.querySelector('.slide-next');

  prevBtn.addEventListener('click', () => {
    const current = parseInt(block.dataset.activeSlide, 10) || 0;
    showSlide(block, current - 1);
  });

  nextBtn.addEventListener('click', () => {
    const current = parseInt(block.dataset.activeSlide, 10) || 0;
    showSlide(block, current + 1);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(
      `carousel-slide-${colIdx === 0 ? 'image' : 'content'}`,
    );
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute(
    'aria-roledescription',
    placeholders.carousel || 'Carousel',
  );

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;
    container.append(slideNavButtons);

    block.dataset.activeSlide = '0';
    bindEvents(block);
    showSlide(block, 0); // Force initial scroll & state
  }

  const section = block.closest('.carousel-container');
  if (!section) return;

  const defaultWrapper = section.querySelector('.default-content-wrapper');
  if (defaultWrapper && !defaultWrapper.classList.contains('carousel-head')) {
    defaultWrapper.classList.add('carousel-head');
  }
}
