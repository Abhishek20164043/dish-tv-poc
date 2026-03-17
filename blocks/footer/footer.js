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
        <button type="submit" aria-label="Search dealer">&#8594;</button>
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

  // Accordion toggle for footer category sections (mobile)
  const linkSection = footer.querySelector('.section:nth-child(2)');
  if (linkSection) {
    const headings = linkSection.querySelectorAll('h4');
    headings.forEach((h4) => {
      const ul = h4.nextElementSibling;
      if (ul && ul.tagName === 'UL') {
        h4.classList.add('footer-accordion');
        ul.classList.add('footer-accordion-content');
        h4.addEventListener('click', () => {
          const isOpen = h4.classList.contains('active');
          // Close all
          linkSection.querySelectorAll('.footer-accordion.active').forEach((a) => {
            a.classList.remove('active');
            a.nextElementSibling.classList.remove('active');
          });
          // Toggle current
          if (!isOpen) {
            h4.classList.add('active');
            ul.classList.add('active');
          }
        });
      }
    });
  }

  // Replace external social media icons with local SVGs
  const socialIconMap = {
    facebook: { icon: '/icons/facebook.svg', alt: 'Facebook' },
    youtube: { icon: '/icons/youtube.svg', alt: 'YouTube' },
    twitter: { icon: '/icons/x.svg', alt: 'X' },
    instagram: { icon: '/icons/instagram.svg', alt: 'Instagram' },
  };
  const socialSection = footer.querySelector('.section:nth-child(3)');
  if (socialSection) {
    socialSection.querySelectorAll('a[href]').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      Object.entries(socialIconMap).forEach(([key, { icon, alt }]) => {
        if (href.includes(key)) {
          // Remove any picture element or existing img, replace with clean local img
          const picture = a.querySelector('picture');
          if (picture) picture.remove();
          const oldImg = a.querySelector('img');
          if (oldImg) oldImg.remove();
          const img = document.createElement('img');
          img.src = icon;
          img.alt = alt;
          img.width = 37;
          img.height = 37;
          a.appendChild(img);
        }
      });
    });
  }

  // Clean up pipe separators in legal links (section 4)
  const legalSection = footer.querySelector('.section:nth-child(4)');
  if (legalSection) {
    const legalP = legalSection.querySelector('p');
    if (legalP) {
      [...legalP.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('|')) {
          node.remove();
        }
      });
    }
  }

  block.append(footer);
}
