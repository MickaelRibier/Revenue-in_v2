/**
 * navMobile.js — handles the burger menu checkbox toggle.
 * When a nav link inside the mobile menu is clicked, the checkbox is unchecked
 * (which closes the menu overlay via CSS).
 */
export function initNavMobile() {
  const toggle = document.getElementById('menuToggle');
  const mobileLinks = document.querySelectorAll('label.navMobile ul a');

  if (!toggle || !mobileLinks.length) return;

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggle.checked = false;
    });
  });
}
