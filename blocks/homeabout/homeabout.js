export default function decorate() {
  const homeabout = document.querySelector('.homeabout.block > div');
  if (homeabout) {
    const children = homeabout.querySelectorAll(':scope > div');
    if (children.length === 2) {
      children[0].classList.add('homeabout-content');
      children[1].classList.add('homeabout-image');
    }
  }

  const ul = document.querySelector('.homeabout-content ul');
  if (ul && ul.children.length > 0) {
    const li = ul.children[0];
    const button = document.createElement('button');
    button.innerHTML = li.innerHTML;
    button.className = 'btn-about'; // optional if styling needed via existing CSS
    ul.replaceChild(button, li);
  }
}
