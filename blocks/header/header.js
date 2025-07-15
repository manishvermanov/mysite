import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 475px)');

const toggleAllNavSections = (sections, expanded = false) => {
  sections
    .querySelectorAll('.nav-sections .default-content-wrapper > ul > li')
    .forEach((section) => {
      section.setAttribute('aria-expanded', expanded);
    });
};

const toggleMenu = (nav, navSections, forceExpanded = null) => {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(
    navSections,
    expanded || isDesktop.matches ? 'false' : 'true',
  );

  if (button) {
    button.setAttribute(
      'aria-label',
      expanded ? 'Open navigation' : 'Close navigation',
    );
  }

  if (button && button.firstElementChild) {
    button.firstElementChild.classList.toggle('open', !expanded);
  }

  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
    });
  }
};

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand?.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  // Highlight active page in nav
  if (navSections) {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const navLinks = navSections.querySelectorAll('a');

    navLinks.forEach((link) => {
      const linkPath = new URL(
        link.href,
        window.location.origin,
      ).pathname.replace(/\/$/, '');
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  if (navSections) {
    navSections
      .querySelectorAll(':scope .default-content-wrapper > ul > li')
      .forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              'aria-expanded',
              expanded ? 'false' : 'true',
            );
          }
        });
      });
  }

  if (!isDesktop.matches) {
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
  }

  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, navSections, isDesktop.matches);

  isDesktop.addEventListener('change', () => {
    const existingHamburger = nav.querySelector('.nav-hamburger');
    if (isDesktop.matches && existingHamburger) {
      existingHamburger.remove();
    } else if (!isDesktop.matches && !nav.querySelector('.nav-hamburger')) {
      const hamburger = document.createElement('div');
      hamburger.classList.add('nav-hamburger');
      hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
      hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
      nav.prepend(hamburger);
    }
    toggleMenu(nav, navSections, isDesktop.matches);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const navTools = block.querySelector('.nav-tools');
  if (navTools) {
    const link = navTools.querySelector('p > a');
    if (link) {
      const button = document.createElement('button');
      button.className = link.className || 'btn2';
      button.textContent = link.textContent.trim();
      const href = link.getAttribute('href');
      if (href) {
        button.addEventListener('click', () => {
          window.location.href = href;
        });
      }
      link.parentElement.replaceChild(button, link);
    }
  }

  const logo = document.getElementById('furreverhome');
  if (logo) {
    logo.innerHTML = logo.textContent.replace(
      'Home',
      '<span style="color: #CF1717;">Home</span>',
    );
  }

  const appBtnWrapper = document.querySelector('.appbtn-wrapper');
  if (appBtnWrapper) {
    const paragraph = appBtnWrapper.querySelector('p');
    const pictures = paragraph.querySelectorAll('picture');
    if (pictures.length >= 2) {
      pictures[0].classList.add('beforepaw');
      pictures[1].classList.add('afterpaw');
    }
  }

  // ✅ ADDED: Inject "Adopt Now" into mobile nav
  if (!isDesktop.matches && navSections) {
    const navList = navSections.querySelector('ul');
    const adoptLi = document.createElement('li');
    adoptLi.setAttribute('aria-expanded', 'false');

    const adoptLink = document.createElement('a');
    adoptLink.href = 'http://localhost:3000/adopt'; // change this to your actual adopt form path
    adoptLink.textContent = 'Adopt Now 🐾';
    adoptLink.className = 'mobile-adopt-link';

    adoptLi.appendChild(adoptLink);
    navList.appendChild(adoptLi);
  }

  window.addEventListener('scroll', () => {
    const navElement = document.querySelector('nav');
    if (window.scrollY > 0) {
      navElement.classList.add('scrolled');
    } else {
      navElement.classList.remove('scrolled');
    }
  });
}
