/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from style (even in child elements)
  function extractBackgroundImageUrl(root) {
    // Search for any element with a background-image style (not 'none')
    const bgEls = root.querySelectorAll('*');
    for (const el of bgEls) {
      const bgImg = el.style && el.style.backgroundImage;
      if (bgImg && bgImg !== 'none') {
        const match = bgImg.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) return match[1];
      }
      // Also check computed style
      const computedStyle = window.getComputedStyle(el);
      const compBgImg = computedStyle && computedStyle.backgroundImage;
      if (compBgImg && compBgImg !== 'none') {
        const match = compBgImg.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) return match[1];
      }
    }
    return null;
  }

  // Find the main SectionBanner section
  const section = element.querySelector('[data-ux="SectionBanner"]') || element;

  // 2nd row: extract background image if possible
  let backgroundImageEl = '';
  // First, look for an <img>
  const img = section.querySelector('img');
  if (img && img.src) {
    backgroundImageEl = img;
  } else {
    // Try to extract background image from inline or computed style
    const bgUrl = extractBackgroundImageUrl(section);
    if (bgUrl) {
      const image = document.createElement('img');
      image.src = bgUrl;
      image.alt = '';
      backgroundImageEl = image;
    }
  }

  // 3rd row: content
  let mainContent = section.querySelector('[data-ux="Container"]') || section;
  const blockContent = mainContent.querySelector('[data-ux="Block"]') || mainContent;
  const contentEls = Array.from(blockContent.childNodes).filter(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return !['SCRIPT','STYLE','NOSCRIPT'].includes(node.tagName);
    }
    return node.nodeType === Node.TEXT_NODE ? node.textContent.trim() !== '' : false;
  });
  let contentCell = contentEls.length > 0 ? contentEls : [blockContent.cloneNode(true)];

  // Compose the block table
  const cells = [
    ['Hero (hero6)'],
    [backgroundImageEl],
    [contentCell]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
