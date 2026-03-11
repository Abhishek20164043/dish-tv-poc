/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-pricing variant.
 * Base block: cards
 * Source: https://www.dishtv.in/
 * Source selector: .container--select-product-container
 *
 * Block library cards structure:
 *   Each row = one card: [image cell | text content cell]
 *   - Column 1: Product image
 *   - Column 2: Product name + price + description + features + CTA
 *
 * Source DOM: .getconnection-select-product swiper slides with
 * product name (.product-name), price (.cmp-new-connection-product-price),
 * description (.cmp-new-connection-product-desc), key features (.key-feature),
 * and Select button
 */
export default function parse(element, { document }) {
  // Find all product card slides
  const productCards = element.querySelectorAll('.getconnection-select-product');

  const cells = [];

  productCards.forEach((card) => {
    // Extract product image
    const productImg = card.querySelector('.product-image, .cmp-new-connection-box-image');

    // Extract product name
    const productName = card.querySelector('.product-name');

    // Extract price
    const price = card.querySelector('.cmp-new-connection-product-price');

    // Extract description
    const desc = card.querySelector('.cmp-new-connection-product-desc');

    // Extract key features
    const features = card.querySelectorAll('.key-feature p');

    // Extract additional features from middleportion
    const middleFeatures = card.querySelectorAll('.middle-line .text');

    // Column 1: Product image
    const imgCell = [];
    if (productImg) {
      imgCell.push(productImg);
    }

    // Column 2: Text content
    const textCell = [];

    if (productName) {
      const h3 = document.createElement('h3');
      h3.textContent = productName.textContent.trim();
      textCell.push(h3);
    }

    if (price) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = price.textContent.trim();
      p.appendChild(strong);
      textCell.push(p);
    }

    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.push(p);
    }

    // Add key features as list
    if (features.length > 0) {
      const ul = document.createElement('ul');
      features.forEach((feat) => {
        const text = feat.textContent.trim();
        if (text) {
          const li = document.createElement('li');
          li.textContent = text;
          ul.appendChild(li);
        }
      });
      textCell.push(ul);
    }

    // Add middle features (Prime Lite, Picture quality, etc.)
    if (middleFeatures.length > 0) {
      middleFeatures.forEach((feat) => {
        const text = feat.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          textCell.push(p);
        }
      });
    }

    if (imgCell.length > 0 || textCell.length > 0) {
      cells.push([imgCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pricing', cells });
  element.replaceWith(block);
}
