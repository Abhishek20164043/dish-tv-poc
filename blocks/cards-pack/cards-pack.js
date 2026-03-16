import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children];
  const accordion = document.createElement('div');
  accordion.className = 'cards-pack-accordion';

  items.forEach((row, i) => {
    const num = String(i + 1).padStart(2, '0');
    const imageDiv = row.children[0];
    const bodyDiv = row.children[1];
    const title = bodyDiv.querySelector('h3')?.textContent || '';

    // Create accordion item
    const item = document.createElement('div');
    item.className = 'cards-pack-item';
    moveInstrumentation(row, item);
    if (i === 0) item.classList.add('active');

    // Create header
    const header = document.createElement('button');
    header.className = 'cards-pack-item-header';
    header.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');

    const numSpan = document.createElement('span');
    numSpan.className = 'cards-pack-item-num';
    numSpan.textContent = num;

    const titleSpan = document.createElement('span');
    titleSpan.className = 'cards-pack-item-title';
    titleSpan.textContent = title;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'cards-pack-item-icon';
    iconSpan.textContent = '+';

    header.append(numSpan, titleSpan, iconSpan);

    // Create body panel
    const body = document.createElement('div');
    body.className = 'cards-pack-item-body';

    // Build body content: description on left, image on right
    const bodyContent = document.createElement('div');
    bodyContent.className = 'cards-pack-item-content';

    const descCol = document.createElement('div');
    descCol.className = 'cards-pack-item-desc';

    // Move description paragraphs (skip the h3 title and duplicate plain text)
    const paragraphs = bodyDiv.querySelectorAll('p');
    paragraphs.forEach((p) => {
      // Skip plain text paragraphs that duplicate link text
      if (!p.querySelector('a') && p.nextElementSibling?.querySelector('a')) return;
      descCol.append(p);
    });

    const imgCol = document.createElement('div');
    imgCol.className = 'cards-pack-item-image';
    if (imageDiv.querySelector('picture')) {
      imgCol.append(imageDiv.querySelector('picture'));
    }

    bodyContent.append(descCol, imgCol);

    // Extract the CTA link
    const ctaLink = bodyDiv.querySelector('a');
    if (ctaLink) {
      const ctaWrapper = document.createElement('div');
      ctaWrapper.className = 'cards-pack-item-cta';
      const ctaClone = ctaLink.cloneNode(true);
      ctaClone.className = 'cards-pack-cta-link';
      ctaWrapper.append(ctaClone);
      body.append(bodyContent, ctaWrapper);
    } else {
      body.append(bodyContent);
    }

    // Click handler - only one open at a time
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all items
      accordion.querySelectorAll('.cards-pack-item.active').forEach((el) => {
        el.classList.remove('active');
        el.querySelector('.cards-pack-item-header')?.setAttribute('aria-expanded', 'false');
      });
      // Open clicked item (unless it was already open)
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });

    item.append(header, body);
    accordion.append(item);
  });

  block.textContent = '';
  block.append(accordion);
}
