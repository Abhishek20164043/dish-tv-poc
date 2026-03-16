// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const ITEMS_PER_RIGHT_PAGE = 4;

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

  // Split into left (first half) and right (second half)
  const half = Math.ceil(showParagraphs.length / 2);
  const leftItems = showParagraphs.slice(0, half);
  const rightItems = showParagraphs.slice(half);

  // Build slider container
  const slider = document.createElement('div');
  slider.className = 'tabs-channel-slider';

  // LEFT side: single large featured card
  const leftSide = document.createElement('div');
  leftSide.className = 'tabs-channel-left';
  const leftCards = leftItems.map((p) => {
    const card = buildShowCard(p);
    p.remove();
    return card;
  });
  leftCards.forEach((card, i) => {
    if (i > 0) card.setAttribute('hidden', '');
    leftSide.append(card);
  });

  // RIGHT side: 2×2 grid pages
  const rightSide = document.createElement('div');
  rightSide.className = 'tabs-channel-right';
  const totalRightPages = Math.ceil(rightItems.length / ITEMS_PER_RIGHT_PAGE);
  const rightPages = [];

  for (let page = 0; page < totalRightPages; page += 1) {
    const pageEl = document.createElement('div');
    pageEl.className = 'tabs-channel-right-page';
    const start = page * ITEMS_PER_RIGHT_PAGE;
    const end = Math.min(start + ITEMS_PER_RIGHT_PAGE, rightItems.length);
    for (let j = start; j < end; j += 1) {
      pageEl.append(buildShowCard(rightItems[j]));
      rightItems[j].remove();
    }
    if (page > 0) pageEl.setAttribute('hidden', '');
    rightPages.push(pageEl);
    rightSide.append(pageEl);
  }

  slider.append(leftSide);
  slider.append(rightSide);

  // Navigation arrows
  let currentLeft = 0;

  const nav = document.createElement('div');
  nav.className = 'tabs-channel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'tabs-channel-nav-btn tabs-channel-prev';
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>';
  prevBtn.setAttribute('aria-label', 'Previous slide');

  const nextBtn = document.createElement('button');
  nextBtn.className = 'tabs-channel-nav-btn tabs-channel-next';
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>';
  nextBtn.setAttribute('aria-label', 'Next slide');

  function updateSlider() {
    // Update left cards: show/hide
    leftCards.forEach((card, i) => {
      if (i === currentLeft) card.removeAttribute('hidden');
      else card.setAttribute('hidden', '');
    });

    // Calculate right page from left position (proportional sync)
    const leftProgress = leftCards.length > 1
      ? currentLeft / (leftCards.length - 1)
      : 0;
    const rightPageIndex = Math.min(
      Math.floor(leftProgress * totalRightPages),
      totalRightPages - 1,
    );

    rightPages.forEach((page, i) => {
      if (i === rightPageIndex) page.removeAttribute('hidden');
      else page.setAttribute('hidden', '');
    });

    prevBtn.disabled = currentLeft === 0;
    nextBtn.disabled = currentLeft === leftCards.length - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (currentLeft > 0) {
      currentLeft -= 1;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentLeft < leftCards.length - 1) {
      currentLeft += 1;
      updateSlider();
    }
  });

  nav.append(prevBtn);
  nav.append(nextBtn);

  // Collect CTA links (e.g. CHANNEL GUIDE)
  const linkParagraphs = [...contentDiv.querySelectorAll('p')].filter(
    (p) => p.querySelector('a') && !p.querySelector('picture'),
  );
  linkParagraphs.forEach((p) => p.classList.add('tabs-channel-cta'));

  contentDiv.append(slider);
  contentDiv.append(nav);
  linkParagraphs.forEach((p) => contentDiv.append(p));

  updateSlider();
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

    // Process panel content into left/right split slider
    processPanel(tabpanel);
  });

  block.prepend(tablist);
  if (headingWrapper.children.length) {
    block.prepend(headingWrapper);
  }
}
