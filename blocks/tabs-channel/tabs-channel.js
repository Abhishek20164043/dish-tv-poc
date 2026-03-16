// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildShowCard(p) {
  const card = document.createElement('div');
  card.className = 'tabs-channel-card';

  const pic = p.querySelector('picture');
  if (pic) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'tabs-channel-card-img';
    imgWrap.append(pic);
    card.append(imgWrap);
  }

  // Overlay with show name and meta
  const overlay = document.createElement('div');
  overlay.className = 'tabs-channel-card-overlay';

  const strong = p.querySelector('strong');
  if (strong) {
    const title = document.createElement('div');
    title.className = 'tabs-channel-card-title';
    title.textContent = strong.textContent;
    overlay.append(title);
  }

  const textContent = p.textContent.replace(strong?.textContent || '', '').trim();
  if (textContent) {
    const meta = document.createElement('div');
    meta.className = 'tabs-channel-card-meta';
    meta.textContent = textContent;
    overlay.append(meta);
  }

  card.append(overlay);
  return card;
}

function processPanel(panel) {
  const contentDiv = panel.querySelector(':scope > div');
  if (!contentDiv) return;

  const paragraphs = [...contentDiv.querySelectorAll('p')];
  const showParagraphs = paragraphs.filter((p) => p.querySelector('picture'));

  if (showParagraphs.length === 0) return;

  // Split into two rows (first half = top row, second half = bottom row)
  const half = Math.ceil(showParagraphs.length / 2);
  const topItems = showParagraphs.slice(0, half);
  const bottomItems = showParagraphs.slice(half);

  // Create grid container with two rows
  const grid = document.createElement('div');
  grid.className = 'tabs-channel-grid';

  // Top row
  const topRow = document.createElement('div');
  topRow.className = 'tabs-channel-row';
  topItems.forEach((p) => {
    topRow.append(buildShowCard(p));
    p.remove();
  });

  // Bottom row
  const bottomRow = document.createElement('div');
  bottomRow.className = 'tabs-channel-row';
  bottomItems.forEach((p) => {
    bottomRow.append(buildShowCard(p));
    p.remove();
  });

  grid.append(topRow);
  grid.append(bottomRow);

  // Move any remaining link paragraphs (e.g. CHANNEL GUIDE) after the grid
  const linkParagraphs = [...contentDiv.querySelectorAll('p')].filter((p) => p.querySelector('a') && !p.querySelector('picture'));
  linkParagraphs.forEach((p) => {
    p.classList.add('tabs-channel-cta');
  });

  contentDiv.append(grid);
  linkParagraphs.forEach((p) => contentDiv.append(p));
}

export default async function decorate(block) {
  // Extract headings from first panel and place above tablist
  const firstPanel = block.children[0]?.children[1];
  const headings = firstPanel ? [...firstPanel.querySelectorAll('h2')] : [];
  const headingWrapper = document.createElement('div');
  headingWrapper.className = 'tabs-channel-heading';
  headings.forEach((h) => headingWrapper.append(h));

  // Build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-channel-list';
  tablist.setAttribute('role', 'tablist');

  // Decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // Decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-channel-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // Build tab button
    const button = document.createElement('button');
    button.className = 'tabs-channel-tab';
    button.id = `tab-${id}`;

    moveInstrumentation(tab.parentElement, tabpanel.lastElementChild);
    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
    moveInstrumentation(button.querySelector('p'), null);

    // Process panel content into two-row grid of show cards
    processPanel(tabpanel);
  });

  block.prepend(tablist);
  if (headingWrapper.children.length) {
    block.prepend(headingWrapper);
  }
}
