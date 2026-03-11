/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-promo variant.
 * Base block: carousel
 * Source: https://www.dishtv.in/
 * Source selectors: .container--bannercontainer, .carousel--homepagealexacarousel
 *
 * Block library carousel structure:
 *   Each row = one slide: [image cell | text content cell]
 *   - Column 1: Slide image
 *   - Column 2: Heading + description + CTA link
 */
export default function parse(element, { document }) {
  // Find all carousel slides
  const slides = element.querySelectorAll('.cmp-carousel__item');
  const cells = [];

  slides.forEach((slide) => {
    // Extract slide image from teaser
    const img = slide.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

    // Extract link wrapping the teaser content
    const link = slide.querySelector('.cmp-teaser__link, a');

    // Extract title from teaser content
    const title = slide.querySelector('.cmp-teaser__title, h2, h3');

    // Extract description
    const desc = slide.querySelector('.cmp-teaser__description, .cmp-teaser__content p');

    // Column 1: Image
    const imgCell = [];
    if (img) {
      imgCell.push(img);
    }

    // Column 2: Text content with heading, description, CTA
    const textCell = [];
    if (title) {
      textCell.push(title);
    }
    if (desc) {
      textCell.push(desc);
    }
    if (link) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim() || 'Learn More';
      p.appendChild(a);
      textCell.push(p);
    }

    if (imgCell.length > 0 || textCell.length > 0) {
      cells.push([imgCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-promo', cells });
  element.replaceWith(block);
}
