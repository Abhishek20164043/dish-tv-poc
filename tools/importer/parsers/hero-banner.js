/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner variant.
 * Base block: hero
 * Source: https://www.dishtv.in/get-help/quick-help.html
 * Source selector: .cmp-teaser--contact-us-banner
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 *
 * Block library structure (xwalk hero):
 *   Row 1: Background image (field: image)
 *   Row 2: Text content - heading, subheading, CTA (field: text)
 */
export default function parse(element, { document }) {
  // Extract background image from source DOM
  const img = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

  // Extract heading from source DOM
  const heading = element.querySelector('h1.cmp-teaser__title, h1, h2');

  // Build cells matching hero block library structure:
  // Row 1: image cell with field hint
  // Row 2: text cell with field hint
  const cells = [];

  // Row 1: Background image
  if (img) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(img.cloneNode(true));
    cells.push([imgFrag]);
  } else {
    cells.push(['']);
  }

  // Row 2: Text content (heading + any description)
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (heading) {
    textFrag.appendChild(heading.cloneNode(true));
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
