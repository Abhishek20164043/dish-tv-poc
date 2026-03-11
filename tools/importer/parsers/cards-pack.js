/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-pack variant.
 * Base block: cards
 * Source: https://www.dishtv.in/
 * Source selector: .container--yourguide-container
 *
 * Block library cards structure:
 *   Each row = one card: [image cell | text content cell]
 *   - Column 1: Image/icon
 *   - Column 2: Title + description + CTA
 *
 * Source DOM: Accordion items representing pack offerings with
 * title, description text, pack image, and CTA link
 */
export default function parse(element, { document }) {
  // Find accordion items that represent pack cards
  const items = element.querySelectorAll('.cmp-accordion__item');
  const cells = [];

  items.forEach((item) => {
    // Extract title from accordion header
    const title = item.querySelector('.cmp-accordion__title');

    // Extract panel content
    const panel = item.querySelector('.cmp-accordion__panel');
    if (!panel) return;

    // Extract image from panel
    const img = panel.querySelector('img');

    // Extract description text
    const descTexts = panel.querySelectorAll('.cmp-text p');

    // Extract CTA link
    const cta = panel.querySelector('a');

    // Column 1: Image
    const imgCell = [];
    if (img) {
      imgCell.push(img);
    }

    // Column 2: Text content
    const textCell = [];
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.push(h3);
    }

    descTexts.forEach((desc) => {
      const text = desc.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        textCell.push(p);
      }
    });

    if (cta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim() || 'Know More';
      p.appendChild(a);
      textCell.push(p);
    }

    if (imgCell.length > 0 || textCell.length > 0) {
      cells.push([imgCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pack', cells });
  element.replaceWith(block);
}
