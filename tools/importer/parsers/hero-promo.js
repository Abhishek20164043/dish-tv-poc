/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo variant.
 * Base block: hero
 * Source: https://www.dishtv.in/
 * Source selector: #spectacular-banner
 *
 * Block library hero structure:
 *   Row 1: Background image
 *   Row 2: Text content - heading, description, CTA
 *
 * Source DOM: .cmp-teaser with background image, CTA link,
 * and optional teaser content (may be empty)
 */
export default function parse(element, { document }) {
  // Extract background image from teaser
  const bgImg = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

  // Extract CTA link wrapping the teaser
  const ctaLink = element.querySelector('.cmp-teaser__link, a');

  // Extract title if present
  const title = element.querySelector('.cmp-teaser__title, h1, h2, h3');

  // Extract description if present
  const desc = element.querySelector('.cmp-teaser__description');

  const cells = [];

  // Row 1: Background image
  if (bgImg) {
    cells.push([bgImg]);
  }

  // Row 2: Text content
  const contentCell = [];

  if (title) {
    contentCell.push(title);
  }

  if (desc) {
    contentCell.push(desc);
  }

  // Add CTA link
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim() || 'Learn More';
    p.appendChild(a);
    contentCell.push(p);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
