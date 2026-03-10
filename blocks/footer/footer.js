import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Transform dealer pincode link into input field
  const dealerLink = footer.querySelector('a[href*="dealer-locator"]');
  if (dealerLink) {
    const p = dealerLink.closest('p');
    if (p) {
      const form = document.createElement('form');
      form.className = 'dealer-pincode-form';
      form.innerHTML = `
        <input type="text" placeholder="Enter Pincode" maxlength="6" pattern="[0-9]*" inputmode="numeric">
        <button type="submit" aria-label="Search dealer">&#10148;</button>
      `;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pincode = form.querySelector('input').value.trim();
        if (pincode) {
          window.location.href = `/dealer-locator.html?pincode=${pincode}`;
        }
      });
      p.replaceWith(form);
    }
  }

  block.append(footer);
}
