import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children];

  // Two-column layout: left = accordion list, right = image display
  const layout = document.createElement('div');
  layout.className = 'cards-pack-layout';

  const left = document.createElement('div');
  left.className = 'cards-pack-left';

  const right = document.createElement('div');
  right.className = 'cards-pack-right';

  const accordion = document.createElement('div');
  accordion.className = 'cards-pack-accordion';

  // Collect images for the right-side display
  const images = [];

  items.forEach((row, i) => {
    const num = String(i + 1).padStart(2, '0');
    const imageDiv = row.children[0];
    const bodyDiv = row.children[1];
    const title = bodyDiv.querySelector('h3')?.textContent || '';

    // Create accordion item
    const item = document.createElement('div');
    item.className = 'cards-pack-item';
    item.dataset.num = num;
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

    // Create body panel (description + CTA only, image goes to right column)
    const body = document.createElement('div');
    body.className = 'cards-pack-item-body';

    const descCol = document.createElement('div');
    descCol.className = 'cards-pack-item-desc';

    // Move description paragraphs (skip the h3 title and duplicate plain text)
    const paragraphs = bodyDiv.querySelectorAll('p');
    paragraphs.forEach((p) => {
      if (!p.querySelector('a') && p.nextElementSibling?.querySelector('a')) return;
      descCol.append(p);
    });

    body.append(descCol);

    // Extract the CTA link
    const ctaLink = bodyDiv.querySelector('a');
    if (ctaLink) {
      const ctaWrapper = document.createElement('div');
      ctaWrapper.className = 'cards-pack-item-cta';
      const ctaClone = ctaLink.cloneNode(true);
      ctaClone.className = 'cards-pack-cta-link';
      ctaWrapper.append(ctaClone);
      body.append(ctaWrapper);
    }

    // Collect image for right column
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'cards-pack-image-panel';
    imgWrapper.dataset.index = i;
    if (i === 0) imgWrapper.classList.add('active');
    const picture = imageDiv.querySelector('picture');
    if (picture) imgWrapper.append(picture);
    images.push(imgWrapper);

    // Click handler - toggle accordion and switch image
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all items
      accordion.querySelectorAll('.cards-pack-item.active').forEach((el) => {
        el.classList.remove('active');
        el.querySelector('.cards-pack-item-header')?.setAttribute('aria-expanded', 'false');
      });
      // Hide all images
      right.querySelectorAll('.cards-pack-image-panel.active').forEach((el) => {
        el.classList.remove('active');
      });
      // Open clicked item (unless it was already open)
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        // Show corresponding image
        const panel = right.querySelector(`.cards-pack-image-panel[data-index="${i}"]`);
        if (panel) panel.classList.add('active');
      }
    });

    item.append(header, body);
    accordion.append(item);
  });

  // Add "Choose from Curated Offerings" subheading above accordion
  const subheading = document.createElement('div');
  subheading.className = 'cards-pack-subheading';
  subheading.innerHTML = 'Choose from <span class="cards-pack-subheading-accent">Curated Offerings</span>';

  // Assemble layout
  left.append(subheading, accordion);
  images.forEach((img) => right.append(img));
  layout.append(left, right);

  block.textContent = '';
  block.append(layout);
}
