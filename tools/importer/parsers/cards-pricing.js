/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-pricing variant.
 * Base block: cards
 * Source: https://www.dishtv.in/
 * Source selector: .container--select-product-container
 *
 * Rich card structure capturing:
 *   Column 1: blurb label image + card-bg image + product image (visible addon) + antenna variant image
 *   Column 2: name + price + description + KEY FEATURES (icon+text) + badges (icon+text)
 *              + antenna data (prices, image URLs) + Select CTA
 */
export default function parse(element, { document }) {
  const productCards = element.querySelectorAll('.getconnection-select-product');
  const cells = [];

  productCards.forEach((card) => {
    // --- Column 1: Images ---
    const imgCell = [];

    // Blurb tab label image (diagonal orange label)
    const blurbImg = card.querySelector('.blurb-text, img.blurb-text, .blurb-text-image');
    if (blurbImg) {
      const img = document.createElement('img');
      img.src = blurbImg.src || blurbImg.getAttribute('src');
      img.alt = 'blurb';
      imgCell.push(img);
    }

    // Card background image (orange gradient)
    const cardBgImg = card.querySelector('.card-bg-image, img.card-bg-image');
    if (cardBgImg) {
      const img = document.createElement('img');
      img.src = cardBgImg.src || cardBgImg.getAttribute('src');
      img.alt = 'card-bg';
      imgCell.push(img);
    }

    // Product image - use the VISIBLE addon image (producthd-odu.png), not the hidden .product-image
    const addonImg = card.querySelector('.product-addon-image, img.product-addon-image');
    const fallbackImg = card.querySelector('.product-image, img.product-image');
    const visibleProductImg = addonImg || fallbackImg;
    if (visibleProductImg) {
      const img = document.createElement('img');
      img.src = visibleProductImg.src || visibleProductImg.getAttribute('src');
      img.alt = 'Product Image';
      imgCell.push(img);
    }

    // Antenna variant image (with-antenna product image)
    if (addonImg) {
      const withOduImage = addonImg.getAttribute('data-with-odu-image');
      if (withOduImage) {
        const img = document.createElement('img');
        // Resolve relative URLs
        const base = 'https://www.dishtv.in';
        img.src = withOduImage.startsWith('/') ? base + withOduImage : withOduImage;
        img.alt = 'Product Image With Antenna';
        imgCell.push(img);
      }
    }

    // --- Column 2: Content ---
    const textCell = [];

    // Product name
    const productName = card.querySelector('.product-name');
    if (productName) {
      const h3 = document.createElement('h3');
      h3.textContent = productName.textContent.trim();
      textCell.push(h3);
    }

    // Price (without antenna - default)
    const price = card.querySelector('.cmp-new-connection-product-price');
    if (price) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = price.textContent.trim();
      p.appendChild(strong);
      textCell.push(p);
    }

    // Description
    const desc = card.querySelector('.cmp-new-connection-product-desc');
    if (desc) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = desc.textContent.trim();
      p.appendChild(em);
      textCell.push(p);
    }

    // KEY FEATURES heading + icon list
    const features = card.querySelectorAll('.key-feature');
    if (features.length > 0) {
      const h4 = document.createElement('h4');
      h4.textContent = 'KEY FEATURES';
      textCell.push(h4);

      const ul = document.createElement('ul');
      features.forEach((feat) => {
        const text = feat.querySelector('p')?.textContent?.trim();
        if (text) {
          const li = document.createElement('li');
          const icon = feat.querySelector('img');
          if (icon) {
            const img = document.createElement('img');
            img.src = icon.src || icon.getAttribute('src');
            img.alt = icon.alt || 'feature-icon';
            li.appendChild(img);
            li.appendChild(document.createTextNode(' '));
          }
          li.appendChild(document.createTextNode(text));
          ul.appendChild(li);
        }
      });
      textCell.push(ul);
    }

    // Service badges (Prime Lite, 5X Picture quality, etc.) with icons
    const badges = card.querySelectorAll('.middle-line');
    if (badges.length > 0) {
      const badgeContainer = document.createElement('p');
      badgeContainer.setAttribute('data-type', 'badges');
      badges.forEach((badge, i) => {
        const icon = badge.querySelector('img');
        const text = badge.querySelector('.text')?.textContent?.trim();
        if (text) {
          if (i > 0) badgeContainer.appendChild(document.createElement('br'));
          if (icon) {
            const img = document.createElement('img');
            img.src = icon.src || icon.getAttribute('src');
            img.alt = text;
            badgeContainer.appendChild(img);
            badgeContainer.appendChild(document.createTextNode(' '));
          }
          badgeContainer.appendChild(document.createTextNode(text));
        }
      });
      textCell.push(badgeContainer);
    }

    // Antenna pricing data (encoded as text for block JS to parse)
    if (price) {
      const withoutPrice = price.getAttribute('data-without-odu-price') || '';
      const withPrice = price.getAttribute('data-with-odu-price') || '';
      if (withoutPrice && withPrice) {
        const dataP = document.createElement('p');
        dataP.textContent = `antenna-data: without=${withoutPrice}|with=${withPrice}`;
        textCell.push(dataP);
      }
    }

    // Select button
    const selectP = document.createElement('p');
    const selectA = document.createElement('a');
    selectA.href = '#';
    selectA.textContent = 'Select';
    selectP.appendChild(selectA);
    textCell.push(selectP);

    if (imgCell.length > 0 || textCell.length > 0) {
      cells.push([imgCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pricing', cells });
  element.replaceWith(block);
}
