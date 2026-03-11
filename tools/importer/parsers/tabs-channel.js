/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-channel variant.
 * Base block: tabs
 * Source: https://www.dishtv.in/
 * Source selector: #grid-carousel-homepage-container
 *
 * Block library tabs structure:
 *   Each row = one tab: [tab label | tab content]
 *   - Column 1: Tab label text
 *   - Column 2: Tab panel content
 *
 * Source DOM: Heading + tab navigation (LIVE TV, ACTIVE SERVICES)
 * + grid of program cards with show image, channel logo, name, timing
 * + CHANNEL GUIDE link
 */
export default function parse(element, { document }) {
  // Extract heading text
  const headings = element.querySelectorAll('.cmp-text h1');

  // Find tab navigation links
  const tabLinks = element.querySelectorAll('.grid-carousel-homepage__links li a, .cmp-channnelguide__filter-link a');

  // Find tab panels
  const tabPanels = element.querySelectorAll('.ui-tabs-panel, [id*="timeline-slider"], [id*="popular-slider"]');

  // Extract the channel guide link
  const channelGuideLink = element.querySelector('.grid-carousel-homepage__channelguidelink, a[href*="channel-guide"]');

  const cells = [];

  // If we have tab links, create rows for each tab
  if (tabLinks.length > 0) {
    tabLinks.forEach((tabLink, index) => {
      const tabLabel = tabLink.textContent.trim();

      // Build tab content from corresponding panel
      const contentFrag = document.createDocumentFragment();

      // Add heading to first tab
      if (index === 0 && headings.length > 0) {
        headings.forEach((h) => {
          const heading = document.createElement('h2');
          heading.textContent = h.textContent.trim();
          contentFrag.appendChild(heading);
        });
      }

      // Find program cards in the corresponding panel
      const panel = tabPanels[index];
      if (panel) {
        const programCards = panel.querySelectorAll('.grid-carousel-program-container');
        programCards.forEach((card) => {
          const showImg = card.querySelector('.slider-left-image, img:first-of-type');
          const logoImg = card.querySelector('.grid-carousel__program-logo');
          const programName = card.querySelector('.grid-carousel__program-name');
          const programTiming = card.querySelector('.grid-carousel__program-timing');

          const cardP = document.createElement('p');
          if (showImg) {
            cardP.appendChild(showImg);
          }
          if (programName) {
            const strong = document.createElement('strong');
            strong.textContent = programName.textContent.trim();
            cardP.appendChild(strong);
          }
          if (programTiming) {
            const span = document.createElement('span');
            span.textContent = ' ' + programTiming.textContent.trim();
            cardP.appendChild(span);
          }
          contentFrag.appendChild(cardP);
        });
      }

      // Add channel guide link to last tab
      if (channelGuideLink && index === tabLinks.length - 1) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = channelGuideLink.href;
        a.textContent = channelGuideLink.textContent.trim() || 'CHANNEL GUIDE';
        p.appendChild(a);
        contentFrag.appendChild(p);
      }

      cells.push([tabLabel, contentFrag]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-channel', cells });
  element.replaceWith(block);
}
