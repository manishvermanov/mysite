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

  if (button?.firstElementChild) {
    button.firstElementChild.classList.toggle('open', !expanded);
  }

  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => drop.setAttribute('tabindex', 0));
  } else {
    navDrops.forEach((drop) => drop.removeAttribute('tabindex'));
  }
};

export default async function decorate(block) {
  const rawPath = window.location.pathname;

  // ✅ Redirect only if neither /en/ nor /hi/ exist
  if (!rawPath.startsWith('/en/') && !rawPath.startsWith('/hi/')) {
    const newPath = rawPath === '/' ? '/en/' : `/en${rawPath}`;
    window.location.replace(newPath);
    return;
  }

  // ✅ Determine language and nav path
  const lang = rawPath.startsWith('/hi/') ? 'hi' : 'en';
  const navMeta = getMetadata('nav');
  const navPath = navMeta
    ? new URL(navMeta, window.location).pathname
    : `/${lang}/nav`;
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

  if (navSections) {
    let currentPath = rawPath.replace(/\/$/, '') || '/';
    currentPath = currentPath.replace(/^\/(en|hi)/, '') || '/';

    const navLinks = navSections.querySelectorAll('a');
    navLinks.forEach((link) => {
      let linkPath = new URL(link.href, window.location.origin).pathname.replace(
        /\/$/,
        '',
      ) || '/';
      linkPath = linkPath.replace(/^\/(en|hi)/, '') || '/';

      if (linkPath === currentPath) {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });

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
      '<a href="/" style="color: #CF1717; text-decoration: none;"><span>Home</span></a>',
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

  // ✅ Mobile-only: Inject "Adopt Now" link
  if (!isDesktop.matches && navSections) {
    const navList = navSections.querySelector('ul');
    const adoptLi = document.createElement('li');
    adoptLi.setAttribute('aria-expanded', 'false');

    const adoptLink = document.createElement('a');
    adoptLink.href = '/adopt';
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

  // ✅ Language toggle switch
  if (navTools) {
    const langWrapper = document.createElement('div');
    langWrapper.className = 'lang-toggle-wrapper';
    langWrapper.innerHTML = `
  <div class="language-toggle" id="langToggleSwitch">
    <span class="label hi">हिंदी</span>
    <div class="switch"><span></span></div>
    <span class="label en">ENG</span>
  </div>
`;

    navTools.appendChild(langWrapper);

    const toggleContainer = langWrapper.querySelector('#langToggleSwitch');
    if (lang === 'hi') {
      toggleContainer.classList.add('active');
    }

    toggleContainer.addEventListener('click', () => {
      toggleContainer.classList.toggle('active');
      const isHindi = toggleContainer.classList.contains('active');
      let newPath;

      if (isHindi && rawPath.startsWith('/en/')) {
        newPath = rawPath.replace('/en/', '/hi/');
      } else if (!isHindi && rawPath.startsWith('/hi/')) {
        newPath = rawPath.replace('/hi/', '/en/');
      }

      if (newPath && newPath !== rawPath) {
        window.location.pathname = newPath;
      }
    });
  }
}
