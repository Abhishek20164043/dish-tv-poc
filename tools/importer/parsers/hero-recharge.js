/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-recharge variant.
 * Base block: hero
 * Source: https://www.dishtv.in/
 * Source selector: .container--bannerrechargecontainer
 *
 * Block library hero structure:
 *   Row 1: Background image (optional)
 *   Row 2: Text content - heading, description, CTA
 *
 * Source DOM: "Instant Recharge" heading + input field + PROCEED button
 */
export default function parse(element, { document }) {
  // Extract background image if present
  const bgImg = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

  // Extract heading
  const heading = element.querySelector('.cmp-text h1, .cmp-text h2, h1, h2, .cmp-text p');

  // Extract description text
  const descriptions = element.querySelectorAll('.cmp-text p');

  // Extract CTA button/link
  const cta = element.querySelector('.cmp-button, a.cmp-button, button.cmp-button');

  const cells = [];

  // Row 1: Background image (if available)
  if (bgImg) {
    cells.push([bgImg]);
  }

  // Row 2: Text content
  const contentCell = [];

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.push(h2);
  }

  // Add description paragraphs (skip the heading if already added)
  descriptions.forEach((desc) => {
    const text = desc.textContent.trim();
    if (text && (!heading || text !== heading.textContent.trim())) {
      const p = document.createElement('p');
      p.textContent = text;
      contentCell.push(p);
    }
  });

  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href || '#';
    a.textContent = cta.textContent.trim() || 'PROCEED';
    p.appendChild(a);
    contentCell.push(p);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-recharge', cells });
  element.replaceWith(block);
}
