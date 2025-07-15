export default function decorate() {
  const wrapper = document.querySelector(
    '.homereq-container > .default-content-wrapper',
  );
  if (wrapper) {
    wrapper.classList.add('req-background-wrapper');
  }

  const container = document.querySelector('.homereq.block > div');
  if (container) {
    const children = container.querySelectorAll(':scope > div');
    if (children.length >= 2) {
      children[0].classList.add('homereq-text');
      children[1].classList.add('homereq-image');
    }
  }
  const homereqText = document.querySelector('.homereq-text');

  if (homereqText) {
    const stepsWrapper = document.createElement('div');
    stepsWrapper.className = 'homereq-steps';

    const nodes = Array.from(homereqText.childNodes);
    const nodesToMove = [];

    let startCollecting = false;

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];

      if (
        node.nodeType === Node.ELEMENT_NODE
        && node.matches('h2#submitting-an-application')
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
  const stepsContainer = document.querySelector('.homereq-steps');
  const children = Array.from(stepsContainer.children);

  for (let i = 0; i < children.length - 1; i += 1) {
    const current = children[i];
    const next = children[i + 1];

    if (current.tagName === 'P' && next.tagName === 'H2') {
      const wrapper1 = document.createElement('div');
      wrapper1.className = 'each-step';

      // Move both p and h5 into the new wrapper
      stepsContainer.insertBefore(wrapper1, current);
      wrapper1.appendChild(current);
      wrapper1.appendChild(next);
    }
  }
}
