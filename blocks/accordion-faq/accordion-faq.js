/*
 * Accordion FAQ Block
 * Recreate an accordion for FAQ sections
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

const INITIAL_VISIBLE = 4;

export default function decorate(block) {
  /* Prepend "Frequently Asked Questions" heading */
  const heading = document.createElement('h2');
  heading.className = 'accordion-faq-heading';
  heading.textContent = 'Frequently Asked Questions';
  block.prepend(heading);

  [...block.children].forEach((row) => {
    if (row === heading) return;
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-faq-item-body';
    // decorate accordion item
    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    row.replaceWith(details);
  });

  /* Load More: hide items beyond INITIAL_VISIBLE */
  const items = block.querySelectorAll('details');
  if (items.length > INITIAL_VISIBLE) {
    items.forEach((item, i) => {
      if (i >= INITIAL_VISIBLE) item.classList.add('accordion-faq-hidden');
    });

    const loadMore = document.createElement('button');
    loadMore.className = 'accordion-faq-load-more';
    loadMore.textContent = "SHOW FAQ's";
    loadMore.addEventListener('click', () => {
      block.querySelectorAll('.accordion-faq-hidden').forEach((item) => {
        item.classList.remove('accordion-faq-hidden');
      });
      loadMore.remove();
    });
    block.append(loadMore);
  }
}
