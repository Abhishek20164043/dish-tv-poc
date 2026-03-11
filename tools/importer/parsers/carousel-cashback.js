/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-cashback variant.
 * Base block: carousel
 * Source: https://www.dishtv.in/instant-recharge/payment.html
 * Source selectors: .instant-recharge-cashbackoffers-carousel
 *
 * Block library carousel structure:
 *   Each row = one slide: [image cell | text content cell]
 *   - Column 1: Payment partner logo image
 *   - Column 2: Offer description + T&C link
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.cmp-carousel__item');
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.cmp-teaser__image img, .cmp-image__image, img');
    const desc = slide.querySelector('.cmp-teaser__description');
    const tncLink = slide.querySelector('.cmp-teaser__action-link');

    // Column 1: Payment partner logo
    const imgCell = [];
    if (img) {
      imgCell.push(img);
    }

    // Column 2: Offer description + T&C link
    const textCell = [];
    if (desc) {
      const descClone = desc.cloneNode(true);
      textCell.push(descClone);
    }
    if (tncLink && tncLink.href && tncLink.href !== '#') {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = tncLink.href;
      a.textContent = tncLink.textContent.trim() || '*T&C Apply';
      p.appendChild(a);
      textCell.push(p);
    } else if (tncLink) {
      const p = document.createElement('p');
      p.textContent = tncLink.textContent.trim() || '*T&C Apply';
      textCell.push(p);
    }

    if (imgCell.length > 0 || textCell.length > 0) {
      cells.push([imgCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-cashback', cells });
  element.replaceWith(block);
}
