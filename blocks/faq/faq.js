export default function decorate() {
  document.querySelectorAll('.faq-wrapper h2').forEach((q) => {
    q.addEventListener('click', () => {
      q.classList.toggle('active');

      // Collapse others if needed (optional)
      document.querySelectorAll('.faq-wrapper h2').forEach((other) => {
        if (other !== q) {
          other.classList.remove('active');
          if (other.nextElementSibling?.tagName === 'H3') {
            other.nextElementSibling.style.maxHeight = null;
            other.nextElementSibling.style.opacity = 0;
          }
        }
      });

      const ans = q.nextElementSibling;
      if (ans.tagName === 'H3') {
        if (q.classList.contains('active')) {
          ans.style.maxHeight = `${ans.scrollHeight}px`;
          ans.style.opacity = 1;
        } else {
          ans.style.maxHeight = null;
          ans.style.opacity = 0;
        }
      }
    });
  });
}
