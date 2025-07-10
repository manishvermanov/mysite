export default function decorate() {
  // ✅ Assign class 'logo' to h1 after content is added

  const nav = document.getElementById('nav');
  const logoElement = nav.querySelector('.default-content-wrapper h1');
  if (logoElement) {
    logoElement.classList.add('logo');
  }
}
