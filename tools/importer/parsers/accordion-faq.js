/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq variant.
 * Base block: accordion
 * Source: https://www.dishtv.in/
 * Source selector: .container--investorFAQ
 *
 * Block library accordion structure:
 *   Each row = one accordion item: [title cell | content cell]
 *   - Column 1: Question text
 *   - Column 2: Answer content
 *
 * Source DOM: .container--investorFAQ containing #smartplus-faq
 * with .cmp-accordion__item elements having
 * .cmp-accordion__title (question) and .cmp-accordion__panel (answer)
 */
export default function parse(element, { document }) {
  // Find all accordion FAQ items
  const items = element.querySelectorAll('.cmp-accordion__item');
  const cells = [];

  items.forEach((item) => {
    // Extract question from accordion title
    const titleEl = item.querySelector('.cmp-accordion__title');
    const question = titleEl ? titleEl.textContent.trim() : '';

    // Extract answer from accordion panel
    const panel = item.querySelector('.cmp-accordion__panel');
    if (!panel) return;

    // Build answer content
    const answerFrag = document.createDocumentFragment();

    // Get all text content elements from the panel
    const paragraphs = panel.querySelectorAll('.cmp-text p');
    const lists = panel.querySelectorAll('.cmp-text ul, .cmp-text ol');

    if (paragraphs.length > 0) {
      paragraphs.forEach((p) => {
        answerFrag.appendChild(p.cloneNode(true));
      });
    }

    if (lists.length > 0) {
      lists.forEach((list) => {
        answerFrag.appendChild(list.cloneNode(true));
      });
    }

    // Fallback: if no structured content found, extract plain text
    if (answerFrag.childNodes.length === 0) {
      const text = panel.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        answerFrag.appendChild(p);
      }
    }

    if (question || answerFrag.childNodes.length > 0) {
      cells.push([question, answerFrag]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
