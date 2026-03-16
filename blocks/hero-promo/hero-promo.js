export default function decorate(block) {
  const picture = block.querySelector(':scope > div:first-child picture');
  if (!picture) {
    block.classList.add('no-image');
    return;
  }

  // Find the link from the content row
  const link = block.querySelector('a');
  if (link) {
    // Wrap the entire hero in a clickable link
    const wrapper = document.createElement('a');
    wrapper.href = link.href;
    wrapper.className = 'hero-promo-link';
    wrapper.setAttribute('aria-label', link.textContent || 'Learn More');

    // Move the picture into the link wrapper
    wrapper.append(picture);

    // Clear block and add the linked image
    block.textContent = '';
    block.append(wrapper);
  }
}
