export default function decorate() {
  const container = document.querySelector('.loadingscreen-container');
  const wrapper = container?.querySelector('.loadingscreen-wrapper');
  const picture = container?.querySelector('picture');

  if (!container || !wrapper || !picture) return;

  // Add class to picture parent
  if (picture.parentElement) {
    picture.parentElement.classList.add('loadingimm');
  }

  // Force fixed height to prevent layout shift/shrink
  const containerHeight = container.offsetHeight;
  container.style.minHeight = `${containerHeight}px`;
  container.style.overflow = 'hidden';

  // Optional: force GIF not to shrink (if it's responsive)
  picture.style.maxWidth = '100%';
  picture.style.height = 'auto';

  // Start fade out after 3 seconds
  setTimeout(() => {
    container.classList.add('fade-out');
    container.style.transition = 'opacity 0.5s ease';

    // After fade completes, remove container
    setTimeout(() => {
      container.style.display = 'none';
      container.style.minHeight = '';
      container.style.overflow = '';
    }, 500); // This must match the fade-out duration
  }, 2000);
}
