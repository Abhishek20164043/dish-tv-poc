/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-nav variant.
 * Base block: accordion
 * Source: https://www.dishtv.in/
 * Source selector: .container--yourguide-container .accordion
 *
 * Block library accordion structure:
 *   Each row = one accordion item: [title cell | content cell]
 *   - Column 1: Item title/question
 *   - Column 2: Expandable content (text, images, links)
 *
 * Source DOM: .cmp-accordion__item elements with title and panel
 * containing pack description, image, and CTA link
 */
export default function parse(element, { document }) {
  // Find all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');
  const cells = [];

  items.forEach((item) => {
    // Extract title from accordion header
    const titleEl = item.querySelector('.cmp-accordion__title');
    const title = titleEl ? titleEl.textContent.trim() : '';

    // Extract panel content
    const panel = item.querySelector('.cmp-accordion__panel');
    if (!panel) return;

    // Build content cell from panel
    const contentFrag = document.createDocumentFragment();

    // Extract description text
    const texts = panel.querySelectorAll('.cmp-text p');
    texts.forEach((t) => {
      const text = t.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        contentFrag.appendChild(p);
      }
    });

    // Extract image if present
    const img = panel.querySelector('img');
    if (img) {
      const p = document.createElement('p');
      p.appendChild(img);
      contentFrag.appendChild(p);
    }

    // Extract CTA link
    const cta = panel.querySelector('a');
    if (cta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      contentFrag.appendChild(p);
    }

    if (title || contentFrag.childNodes.length > 0) {
      cells.push([title, contentFrag]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-nav', cells });
  element.replaceWith(block);
}
