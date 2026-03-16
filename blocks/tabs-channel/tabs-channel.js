// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const ITEMS_PER_RIGHT_PAGE = 4;
const SNAP_THRESHOLD = 0.15;
const TRANSITION_SPEED = 300;

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

  const half = Math.ceil(showParagraphs.length / 2);
  const leftItems = showParagraphs.slice(0, half);
  const rightItems = showParagraphs.slice(half);

  // Build slider container
  const slider = document.createElement('div');
  slider.className = 'tabs-channel-slider';

  // LEFT side: draggable track of large cards
  const leftSide = document.createElement('div');
  leftSide.className = 'tabs-channel-left';
  const leftTrack = document.createElement('div');
  leftTrack.className = 'tabs-channel-left-track';
  const leftCards = leftItems.map((p) => {
    const card = buildShowCard(p);
    p.remove();
    return card;
  });
  leftCards.forEach((card) => leftTrack.append(card));
  leftSide.append(leftTrack);

  // RIGHT side: draggable track of 2×2 grid pages
  const rightSide = document.createElement('div');
  rightSide.className = 'tabs-channel-right';
  const rightTrack = document.createElement('div');
  rightTrack.className = 'tabs-channel-right-track';
  const totalRightPages = Math.ceil(rightItems.length / ITEMS_PER_RIGHT_PAGE);

  for (let page = 0; page < totalRightPages; page += 1) {
    const pageEl = document.createElement('div');
    pageEl.className = 'tabs-channel-right-page';
    const start = page * ITEMS_PER_RIGHT_PAGE;
    const end = Math.min(start + ITEMS_PER_RIGHT_PAGE, rightItems.length);
    for (let j = start; j < end; j += 1) {
      pageEl.append(buildShowCard(rightItems[j]));
      rightItems[j].remove();
    }
    rightTrack.append(pageEl);
  }
  rightSide.append(rightTrack);

  slider.append(leftSide);
  slider.append(rightSide);

  // --- Slider state ---
  let currentLeft = 0;
  const dots = document.createElement('div');
  dots.className = 'tabs-channel-dots';
  const totalDots = Math.min(leftCards.length, 7);
  const dotEls = [];

  function setTrackPosition(track, pct, animate) {
    if (animate) {
      track.style.transition = `transform ${TRANSITION_SPEED}ms ease`;
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(${pct}%)`;
  }

  function updateDots() {
    const progress = leftCards.length > 1
      ? currentLeft / (leftCards.length - 1)
      : 0;
    const activeDot = Math.round(progress * (totalDots - 1));
    dotEls.forEach((d, i) => {
      d.classList.toggle('tabs-channel-dot-active', i === activeDot);
    });
  }

  function updateActiveCard() {
    leftCards.forEach((card, i) => {
      card.classList.toggle('tabs-channel-card-active', i === currentLeft);
    });
  }

  function getRightPageForLeft(leftIndex) {
    const leftProgress = leftCards.length > 1
      ? leftIndex / (leftCards.length - 1)
      : 0;
    return Math.min(
      Math.floor(leftProgress * totalRightPages),
      totalRightPages - 1,
    );
  }

  function snapTo(index, animate) {
    if (index < 0 || index >= leftCards.length) return;
    currentLeft = index;
    setTrackPosition(leftTrack, -currentLeft * 100, animate);
    const rightPage = getRightPageForLeft(currentLeft);
    setTrackPosition(rightTrack, -rightPage * 100, animate);
    updateActiveCard();
    updateDots();
  }

  // --- Drag / touch handling ---
  let isDragging = false;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let trackWidth = 0;

  function getPointer(e) {
    return e.touches ? e.touches[0] : e;
  }

  function onDragStart(e) {
    const pt = getPointer(e);
    isDragging = true;
    dragStartX = pt.clientX;
    dragDeltaX = 0;
    trackWidth = leftSide.offsetWidth;
    // Remove transition for real-time tracking
    leftTrack.style.transition = 'none';
    rightTrack.style.transition = 'none';
    slider.classList.add('tabs-channel-dragging');
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const pt = getPointer(e);
    dragDeltaX = pt.clientX - dragStartX;

    // Prevent vertical scroll when dragging horizontally
    if (Math.abs(dragDeltaX) > 10 && e.cancelable) {
      e.preventDefault();
    }

    // Real-time left track follows the drag
    const dragPct = trackWidth > 0 ? (dragDeltaX / trackWidth) * 100 : 0;
    const leftPct = -currentLeft * 100 + dragPct;
    leftTrack.style.transform = `translateX(${leftPct}%)`;

    // Proportionally move right track in real-time
    const draggedLeftIndex = currentLeft - (dragDeltaX / trackWidth);
    const rightPage = getRightPageForLeft(
      Math.max(0, Math.min(draggedLeftIndex, leftCards.length - 1)),
    );
    const rightFraction = rightPage - Math.floor(rightPage);
    const rightPct = -(Math.floor(rightPage) + rightFraction) * 100;
    rightTrack.style.transform = `translateX(${rightPct}%)`;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove('tabs-channel-dragging');

    // Determine which slide to snap to
    const dragFraction = trackWidth > 0 ? dragDeltaX / trackWidth : 0;
    let target = currentLeft;
    if (dragFraction < -SNAP_THRESHOLD && currentLeft < leftCards.length - 1) {
      target = currentLeft + 1;
    } else if (dragFraction > SNAP_THRESHOLD && currentLeft > 0) {
      target = currentLeft - 1;
    }
    snapTo(target, true);
  }

  // Touch events
  slider.addEventListener('touchstart', onDragStart, { passive: true });
  slider.addEventListener('touchmove', onDragMove, { passive: false });
  slider.addEventListener('touchend', onDragEnd);

  // Mouse events
  slider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    onDragStart(e);
  });
  slider.addEventListener('mousemove', onDragMove);
  slider.addEventListener('mouseup', onDragEnd);
  slider.addEventListener('mouseleave', () => {
    if (isDragging) onDragEnd();
  });

  // Build dot buttons
  for (let i = 0; i < totalDots; i += 1) {
    const dot = document.createElement('button');
    dot.className = 'tabs-channel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      const targetIndex = Math.round((i / (totalDots - 1)) * (leftCards.length - 1));
      snapTo(targetIndex, true);
    });
    dotEls.push(dot);
    dots.append(dot);
  }

  // Collect CTA links
  const linkParagraphs = [...contentDiv.querySelectorAll('p')].filter(
    (p) => p.querySelector('a') && !p.querySelector('picture'),
  );
  linkParagraphs.forEach((p) => p.classList.add('tabs-channel-cta'));

  contentDiv.append(slider);
  contentDiv.append(dots);
  linkParagraphs.forEach((p) => contentDiv.append(p));

  // Initialize
  snapTo(0, false);
}

export default async function decorate(block) {
  const firstPanel = block.children[0]?.children[1];
  const headings = firstPanel ? [...firstPanel.querySelectorAll('h2')] : [];
  const headingWrapper = document.createElement('div');
  headingWrapper.className = 'tabs-channel-heading';
  headings.forEach((h) => headingWrapper.append(h));

  const tablist = document.createElement('div');
  tablist.className = 'tabs-channel-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-channel-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

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
      block.querySelectorAll('[role=tabpanel]').forEach((p) => {
        p.setAttribute('aria-hidden', true);
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

    processPanel(tabpanel);
  });

  block.prepend(tablist);
  if (headingWrapper.children.length) {
    block.prepend(headingWrapper);
  }
}
