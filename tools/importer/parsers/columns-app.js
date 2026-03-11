/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-app variant.
 * Base block: columns
 * Source: https://www.dishtv.in/
 * Source selector: .container--manageyouraccounthomepage
 *
 * Block library columns structure:
 *   Each row has multiple columns side by side
 *   - Column 1: Image (phone mockup)
 *   - Column 2: Text content (heading + feature descriptions)
 *
 * Source DOM: Phone mockup image + "Manage your account with ease" heading
 * + tabs (MOBILE APP/WEB) with carousel slides showing features
 */
export default function parse(element, { document }) {
  // Extract the main phone mockup image (first direct image)
  const mainImg = element.querySelector(':scope > img, .container--manageyouraccounthomepage > img, img');

  // Extract heading text
  const headingEl = element.querySelector('.text--manageyouraccounthomepage .cmp-text p, .cmp-text p');

  // Extract the orange accent text
  const accentText = element.querySelector('.orange-colour-text');

  // Extract carousel slide content (feature descriptions from mobile app tab)
  const slideTexts = element.querySelectorAll('.text--manageyouraccmobile .cmp-text p');
  const slideImages = element.querySelectorAll('.image--manageyouraccmobile img, .cmp-carousel__item img');

  // Column 1: Phone mockup image
  const imgCell = [];
  if (mainImg) {
    imgCell.push(mainImg);
  }
  // Also add first slide image if available and different from main
  const firstSlideImg = element.querySelector('.cmp-carousel__item img');
  if (firstSlideImg && firstSlideImg !== mainImg) {
    imgCell.push(firstSlideImg);
  }

  // Column 2: Text content
  const textCell = [];

  // Build heading
  const h2 = document.createElement('h2');
  if (headingEl) {
    h2.textContent = headingEl.textContent.trim();
  }
  if (accentText) {
    h2.textContent += ' ' + accentText.textContent.trim();
  }
  if (h2.textContent.trim()) {
    textCell.push(h2);
  }

  // Add feature descriptions from carousel slides
  const addedTexts = new Set();
  slideTexts.forEach((st) => {
    const text = st.textContent.trim();
    if (text && !addedTexts.has(text)) {
      addedTexts.add(text);
      const li = document.createElement('li');
      li.textContent = text;
      textCell.push(li);
    }
  });

  const cells = [];
  cells.push([imgCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-app', cells });
  element.replaceWith(block);
}
