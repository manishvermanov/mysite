export default function decorate() {
  const wrapper = document.querySelector(
    '.reqpro-container > .default-content-wrapper',
  );
  if (wrapper) {
    wrapper.classList.add('reqpro-background-wrapper');
  }

  const container = document.querySelector('.reqpro.block > div');
  if (container) {
    const children = container.querySelectorAll(':scope > div');
    if (children.length >= 2) {
      children[0].classList.add('reqpro-text');
      children[1].classList.add('reqpro-image');
    }
  }
  const homereqText = document.querySelector('.reqpro-text');

  if (homereqText) {
    const stepsWrapper = document.createElement('div');
    stepsWrapper.className = 'reqpro-steps';

    const nodes = Array.from(homereqText.childNodes);
    const nodesToMove = [];

    let startCollecting = false;

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];

      if (
        node.nodeType === Node.ELEMENT_NODE
        && (node.matches('h3#minimum-age-requirement-eg-21-years')
          || node.matches('h3#न्यूनतम-उम्र-21-वर्ष-या-उससे-अधिक'))
      ) {
        // Start collecting from the element BEFORE this h5
        // So go back to find the previous <p> and include that too
        let j = i - 1;
        while (j >= 0) {
          const prev = nodes[j];
          if (prev.nodeType === Node.ELEMENT_NODE) {
            nodesToMove.push(prev);
            break;
          }
          j -= 1;
        }
        startCollecting = true;
      }

      if (startCollecting) {
        nodesToMove.push(node);
      }
    }

    nodesToMove.forEach((node) => stepsWrapper.appendChild(node));

    homereqText.appendChild(stepsWrapper);
  }
  const stepsContainer = document.querySelector('.reqpro-steps');
  const children = Array.from(stepsContainer.children);

  for (let i = 0; i < children.length - 1; i += 1) {
    const current = children[i];
    const next = children[i + 1];

    if (current.tagName === 'P' && next.tagName === 'H3') {
      const wrapper1 = document.createElement('div');
      wrapper1.className = 'each-step';

      // Move both p and h5 into the new wrapper
      stepsContainer.insertBefore(wrapper1, current);
      wrapper1.appendChild(current);
      wrapper1.appendChild(next);
    }
  }
}
