import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  const footerContact = document.querySelector('.footer-contact > div');
  const footerInDiv = footerContact.querySelectorAll('div');

  footerInDiv.forEach((div) => {
    div.classList.add('footer-contact-items');
  });

  // Find the div that contains the icons by traversing the DOM
  const footerBrandsWrapper = document.querySelector('.footer-brands-wrapper');

  // Get all <img> tags inside it and find the common parent <div>
  const socialIconsDiv = footerBrandsWrapper
    .querySelector('img')
    ?.closest('div');

  if (socialIconsDiv) {
    socialIconsDiv.classList.add('socials');
  }

  // Step 1: First, add 'links' class to divs with 3 <a> tags
  const allDivs = document.querySelectorAll('.footer-links-wrapper div');

  const linksDivs = [];

  allDivs.forEach((div) => {
    const links = div.querySelectorAll('a');
    if (links.length === 3) {
      div.classList.add('links');
      linksDivs.push(div);
    }
  });

  // Step 2: Find the common parent of those two 'links' divs and add 'link-container'
  if (linksDivs.length === 2) {
    const parentDiv = linksDivs[0].parentElement;
    if (parentDiv === linksDivs[1].parentElement) {
      parentDiv.classList.add('link-container');
    }
  }

  const logo = block.querySelector('#furreverhome');
  if (logo) {
    logo.innerHTML = logo.textContent.replace(
      'Home',
      '<span style="color: #CF1717;">Home</span>',
    );
  }
}
