export default function decorate() {
  const homeabout = document.querySelector('.homeabout.block > div');
  if (homeabout) {
    const children = homeabout.querySelectorAll(':scope > div');
    if (children.length === 2) {
      children[0].classList.add('homeabout-content');
      children[1].classList.add('homeabout-image');
    }

    // Inject <h1> at the top of .homeabout.block > div
    const originalHeading = homeabout.querySelector('.homeabout-content h1#about-us');
    if (originalHeading) {
      const mobileHeading = originalHeading.cloneNode(true);
      mobileHeading.id = 'about-us-mobile';
      mobileHeading.classList.add('about-us-mobile');
      homeabout.insertBefore(mobileHeading, homeabout.firstChild);
    }
  }

  // Replace <li> with button
  const ul = document.querySelector('.homeabout-content ul');
  if (ul && ul.children.length > 0) {
    const li = ul.children[0];
    const button = document.createElement('button');
    button.innerHTML = li.innerHTML;
    button.className = 'btn-about';
    ul.replaceChild(button, li);
  }
}
