export default function decorate() {
  const hometest = document.querySelector('.hometest');
  if (hometest) {
    const innerWrapper = hometest.querySelector('div'); // parent of test-items
    if (innerWrapper) {
      innerWrapper.classList.add('test-cont');

      // Optionally, add class to each test item too (if not already done)
      const children = innerWrapper.querySelectorAll(':scope > div');
      children.forEach((child) => {
        child.classList.add('test-items');
      });
    }
  }
}
