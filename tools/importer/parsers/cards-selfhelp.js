/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-selfhelp variant.
 * Base block: cards (container block)
 * Source: https://www.dishtv.in/get-help/quick-help.html
 * Source selector: .container--selfhelp-teaser-container
 * UE Model: card (container item) with fields: image (reference), text (richtext)
 *
 * Block library structure (xwalk cards container):
 *   Each row = one card: [item-type-label] | [image] | [text content]
 *   - Column 1: "card" (item type label)
 *   - Column 2: Image/icon (field: image)
 *   - Column 3: Title + description + CTA (field: text)
 */
export default function parse(element, { document }) {
  // Find all self-help teaser cards in source DOM
  const teasers = element.querySelectorAll('.teaser--selfhelp-teaser');

  const cells = [];

  teasers.forEach((teaser) => {
    // Extract icon image
    const img = teaser.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

    // Extract title
    const title = teaser.querySelector('h1.cmp-teaser__title, h2.cmp-teaser__title, .cmp-teaser__title');

    // Extract pretitle (optional)
    const pretitle = teaser.querySelector('.cmp-teaser__pretitle');

    // Extract description
    const desc = teaser.querySelector('.cmp-teaser__description');

    // Extract CTA link (optional)
    const cta = teaser.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

    // Column 1: item type label
    const itemLabel = 'card';

    // Column 2: image with field hint
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (img) {
      imgFrag.appendChild(img.cloneNode(true));
    }

    // Column 3: text content with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    if (pretitle) {
      const pPre = document.createElement('p');
      pPre.textContent = pretitle.textContent.trim();
      textFrag.appendChild(pPre);
    }

    if (title) {
      textFrag.appendChild(title.cloneNode(true));
    }

    if (desc) {
      // Clone all children from description div
      const descClone = desc.cloneNode(true);
      while (descClone.firstChild) {
        textFrag.appendChild(descClone.firstChild);
      }
    }

    if (cta) {
      const p = document.createElement('p');
      const link = cta.cloneNode(true);
      p.appendChild(link);
      textFrag.appendChild(p);
    }

    cells.push([itemLabel, imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-selfhelp', cells });
  element.replaceWith(block);
}
