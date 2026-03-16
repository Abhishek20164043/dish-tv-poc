import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const LANGUAGES = [
  { label: 'HINDI', value: '11' },
  { label: 'TAMIL', value: '18' },
  { label: 'MARATHI', value: '14' },
  { label: 'GUJARATI', value: '15' },
  { label: 'BANGLA', value: '12' },
  { label: 'ODIYA', value: '13' },
  { label: 'MALAYALAM', value: '19' },
  { label: 'TELUGU', value: '17' },
  { label: 'KANNADA', value: '16' },
];

function createLanguageModal(block) {
  const overlay = document.createElement('div');
  overlay.className = 'cards-pricing-modal-overlay';
  overlay.hidden = true;

  const modal = document.createElement('div');
  modal.className = 'cards-pricing-modal';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'cards-pricing-modal-close';
  closeBtn.textContent = '\u00d7';
  closeBtn.addEventListener('click', () => { overlay.hidden = true; });
  modal.appendChild(closeBtn);

  const heading = document.createElement('h2');
  heading.textContent = 'Select language in which you watch your shows';
  modal.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'cards-pricing-lang-grid';
  LANGUAGES.forEach((lang) => {
    const btn = document.createElement('button');
    btn.className = 'cards-pricing-lang-btn';
    btn.textContent = lang.label;
    btn.dataset.value = lang.value;
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.cards-pricing-lang-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    grid.appendChild(btn);
  });
  modal.appendChild(grid);

  const continueBtn = document.createElement('button');
  continueBtn.className = 'cards-pricing-lang-continue';
  continueBtn.textContent = 'CONTINUE';
  continueBtn.addEventListener('click', () => { overlay.hidden = true; });
  modal.appendChild(continueBtn);

  overlay.appendChild(modal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.hidden = true;
  });

  block.appendChild(overlay);
  return overlay;
}

function parseAntennaData(textCol) {
  const allP = textCol.querySelectorAll('p');
  let data = null;
  allP.forEach((p) => {
    const text = p.textContent.trim();
    if (text.startsWith('antenna-data:')) {
      const parts = text.replace('antenna-data:', '').trim().split('|');
      data = {};
      parts.forEach((part) => {
        const [key, val] = part.split('=');
        if (key && val) data[key.trim()] = val.trim();
      });
      p.remove();
    }
  });
  return data;
}

function createAntennaToggle(li, antennaData, productPic, priceEl) {
  const section = document.createElement('div');
  section.className = 'cards-pricing-antenna';

  const label = document.createElement('span');
  label.className = 'cards-pricing-antenna-label';
  label.textContent = 'Antenna';
  section.appendChild(label);

  const toggleWrap = document.createElement('div');
  toggleWrap.className = 'cards-pricing-antenna-options';

  const yesLabel = document.createElement('label');
  yesLabel.className = 'cards-pricing-antenna-option';
  const yesInput = document.createElement('input');
  yesInput.type = 'radio';
  yesInput.name = `antenna-${li.dataset.cardIndex}`;
  yesInput.value = 'yes';
  const yesText = document.createElement('span');
  yesText.textContent = 'Yes';
  yesLabel.appendChild(yesInput);
  yesLabel.appendChild(yesText);

  const noLabel = document.createElement('label');
  noLabel.className = 'cards-pricing-antenna-option';
  const noInput = document.createElement('input');
  noInput.type = 'radio';
  noInput.name = `antenna-${li.dataset.cardIndex}`;
  noInput.value = 'no';
  noInput.checked = true;
  const noText = document.createElement('span');
  noText.textContent = 'No';
  noLabel.appendChild(noInput);
  noLabel.appendChild(noText);

  toggleWrap.appendChild(yesLabel);
  toggleWrap.appendChild(noLabel);
  section.appendChild(toggleWrap);

  // Get antenna image URLs from the header
  const withAntennaImg = li.querySelector('.cards-pricing-antenna-img');
  const withoutAntennaImg = li.querySelector('.cards-pricing-product');

  const updateCard = (withAntenna) => {
    if (priceEl && antennaData) {
      const priceText = withAntenna ? antennaData.with : antennaData.without;
      priceEl.textContent = `\u20b9 ${priceText}`;
    }
    if (withAntennaImg && withoutAntennaImg) {
      withAntennaImg.style.display = withAntenna ? '' : 'none';
      withoutAntennaImg.style.display = withAntenna ? 'none' : '';
    }
  };

  yesInput.addEventListener('change', () => updateCard(true));
  noInput.addEventListener('change', () => updateCard(false));

  return section;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  const rows = [...block.children];
  const modalOverlay = createLanguageModal(block);

  rows.forEach((row, rowIdx) => {
    const li = document.createElement('li');
    li.dataset.cardIndex = rowIdx;
    moveInstrumentation(row, li);

    const cols = [...row.children];
    const imgCol = cols[0];
    const textCol = cols[1];

    // Parse antenna data from text content (removes the data paragraph)
    const antennaData = textCol ? parseAntennaData(textCol) : null;

    // --- Image header area ---
    const header = document.createElement('div');
    header.className = 'cards-pricing-header';

    const images = imgCol ? imgCol.querySelectorAll('img') : [];
    let productPicWithout = null;

    images.forEach((img) => {
      const alt = (img.alt || '').toLowerCase();
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);

      if (alt === 'blurb') {
        optimized.className = 'cards-pricing-blurb';
        header.appendChild(optimized);
      } else if (alt === 'card-bg') {
        optimized.className = 'cards-pricing-bg';
        header.appendChild(optimized);
      } else if (alt.includes('with antenna')) {
        optimized.className = 'cards-pricing-antenna-img';
        optimized.style.display = 'none';
        header.appendChild(optimized);
      } else if (alt.includes('product')) {
        optimized.className = 'cards-pricing-product';
        header.appendChild(optimized);
        productPicWithout = optimized;
      }
    });

    // Extract product info from text column
    let priceEl = null;
    if (textCol) {
      const infoDiv = document.createElement('div');
      infoDiv.className = 'cards-pricing-info';

      const h3 = textCol.querySelector('h3');
      if (h3) {
        const name = document.createElement('div');
        name.className = 'cards-pricing-name';
        name.textContent = h3.textContent;
        infoDiv.appendChild(name);
      }

      const strong = textCol.querySelector('p > strong');
      if (strong) {
        const price = document.createElement('div');
        price.className = 'cards-pricing-price';
        price.textContent = strong.textContent;
        priceEl = price;
        infoDiv.appendChild(price);
      }

      // Description: check for <em> first, then fallback to next <p> after price
      const em = textCol.querySelector('p > em');
      if (em) {
        const desc = document.createElement('div');
        desc.className = 'cards-pricing-desc';
        desc.textContent = em.textContent;
        infoDiv.appendChild(desc);
      } else if (strong) {
        const priceP = strong.closest('p');
        const nextP = priceP?.nextElementSibling;
        if (nextP && nextP.tagName === 'P' && !nextP.querySelector('strong') && !nextP.querySelector('img') && !nextP.querySelector('a') && nextP.textContent.trim()) {
          const desc = document.createElement('div');
          desc.className = 'cards-pricing-desc';
          desc.textContent = nextP.textContent.trim();
          infoDiv.appendChild(desc);
          nextP.dataset.used = 'true';
        }
      }

      header.appendChild(infoDiv);
    }

    li.appendChild(header);

    // --- Key Features section ---
    if (textCol) {
      const featureUl = textCol.querySelector('ul');
      if (featureUl) {
        const featSection = document.createElement('div');
        featSection.className = 'cards-pricing-features';

        const featTitle = document.createElement('h3');
        featTitle.className = 'cards-pricing-features-title';
        featTitle.textContent = 'KEY FEATURES';
        featSection.appendChild(featTitle);

        const featList = document.createElement('div');
        featList.className = 'cards-pricing-features-list';

        featureUl.querySelectorAll('li').forEach((featureLi) => {
          const featItem = document.createElement('div');
          featItem.className = 'cards-pricing-feature-item';

          const icon = featureLi.querySelector('img');
          if (icon) {
            const iconPic = createOptimizedPicture(icon.src, icon.alt, false, [{ width: '100' }]);
            iconPic.className = 'cards-pricing-feature-icon';
            featItem.appendChild(iconPic);
          }

          const text = document.createElement('p');
          text.textContent = featureLi.textContent.trim();
          featItem.appendChild(text);

          featList.appendChild(featItem);
        });

        featSection.appendChild(featList);
        li.appendChild(featSection);
      }

      // --- Badges section ---
      // Use :scope > p to only match direct <p> children of textCol,
      // not <p> elements nested inside <ul><li> (DA wraps images in <p><picture>)
      const allP = textCol.querySelectorAll(':scope > p');
      let badgeSectionCreated = false;

      allP.forEach((p) => {
        // Skip already-used paragraphs (e.g. description)
        if (p.dataset.used) return;

        if (p.querySelector('img') && !p.querySelector('a')) {
          const badgeSection = document.createElement('div');
          badgeSection.className = 'cards-pricing-badges';

          const badgeImgs = p.querySelectorAll('img');
          badgeImgs.forEach((badgeImg) => {
            const badge = document.createElement('div');
            badge.className = 'cards-pricing-badge';

            const iconPic = createOptimizedPicture(badgeImg.src, badgeImg.alt, false, [{ width: '100' }]);
            iconPic.className = 'cards-pricing-badge-icon';
            badge.appendChild(iconPic);

            const badgeLabel = document.createElement('span');
            badgeLabel.textContent = badgeImg.alt || '';
            badge.appendChild(badgeLabel);

            badgeSection.appendChild(badge);
          });

          li.appendChild(badgeSection);
          badgeSectionCreated = true;
        }
      });

      // Fallback: plain text badges (e.g. "Prime Lite", "5X Picture quality")
      if (!badgeSectionCreated) {
        const featureList = textCol.querySelector('ul');
        if (featureList) {
          const badgeTexts = [];
          let sibling = featureList.nextElementSibling;
          while (sibling) {
            if (sibling.tagName === 'P' && !sibling.querySelector('strong') && !sibling.querySelector('a')
              && !sibling.querySelector('img') && !sibling.dataset.used && sibling.textContent.trim()) {
              badgeTexts.push(sibling.textContent.trim());
            }
            sibling = sibling.nextElementSibling;
          }

          if (badgeTexts.length > 0) {
            const badgeSection = document.createElement('div');
            badgeSection.className = 'cards-pricing-badges';
            badgeTexts.forEach((text) => {
              const badge = document.createElement('div');
              badge.className = 'cards-pricing-badge';
              const badgeLabel = document.createElement('span');
              badgeLabel.textContent = text;
              badge.appendChild(badgeLabel);
              badgeSection.appendChild(badge);
            });
            li.appendChild(badgeSection);
          }
        }
      }

      // --- Antenna toggle + Select button ---
      const bottomSection = document.createElement('div');
      bottomSection.className = 'cards-pricing-bottom';

      if (antennaData) {
        const antennaToggle = createAntennaToggle(li, antennaData, productPicWithout, priceEl);
        bottomSection.appendChild(antennaToggle);
      }

      const selectLink = textCol.querySelector('p > a');
      if (selectLink) {
        const btn = document.createElement('button');
        btn.className = 'cards-pricing-select';
        btn.textContent = selectLink.textContent;
        btn.addEventListener('click', () => { modalOverlay.hidden = false; });
        bottomSection.appendChild(btn);
      }

      li.appendChild(bottomSection);
    }

    if (rowIdx === 0) li.classList.add('cards-pricing-featured');
    ul.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(ul);
  block.appendChild(modalOverlay);

  /* Carousel behavior */
  const items = [...ul.children];
  if (items.length > 1) {
    ul.classList.add('cards-pricing-carousel');

    const dots = document.createElement('div');
    dots.className = 'cards-pricing-dots';
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'cards-pricing-dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      dots.append(dot);
    });
    block.append(dots);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = items.indexOf(entry.target);
          dots.querySelectorAll('.cards-pricing-dot').forEach((d, di) => {
            d.classList.toggle('active', di === idx);
          });
        }
      });
    }, { root: ul, threshold: 0.6 });
    items.forEach((item) => observer.observe(item));
  }
}
