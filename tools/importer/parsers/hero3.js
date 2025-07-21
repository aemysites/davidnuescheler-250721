/* global WebImporter */
export default function parse(element, { document }) {
  // --- Extract background image (if any) ---
  // Look for a background div or section, and try to find an image in it, else check for a CSS background image
  let bgImageEl = null;
  const bgDiv = element.querySelector('[data-ux="Background"], [data-aid="SECTION_BACKGROUND"]');
  if (bgDiv) {
    // Look for direct image
    const img = bgDiv.querySelector('img');
    if (img) {
      bgImageEl = img;
    } else {
      // Try to determine a CSS background-image
      const section = bgDiv.querySelector('section, div') || bgDiv;
      let bgImageUrl;
      // Try inline style first
      if (section.style && section.style.backgroundImage) {
        const match = section.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (match) bgImageUrl = match[1];
      }
      // Try computed style as fallback
      if (!bgImageUrl) {
        const cs = window.getComputedStyle(section);
        if (cs.backgroundImage && cs.backgroundImage.startsWith('url(')) {
          const match = cs.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
          if (match) bgImageUrl = match[1];
        }
      }
      if (bgImageUrl) {
        // Only create an img if we couldn't find an existing one
        const imgEl = document.createElement('img');
        imgEl.src = bgImageUrl;
        bgImageEl = imgEl;
      }
    }
  }

  // --- Extract the content: heading, subheading, description, call to action ---
  // The content is inside the deepest [data-ux="SectionBanner"]'s [data-ux="Container"]
  const sectionBanner = element.querySelector('section[data-ux="SectionBanner"]') || element;
  const container = sectionBanner.querySelector('[data-ux="Container"]') || sectionBanner;
  // The block containing the content (usually [data-ux="Block"]), else use container
  let block = container.querySelector('[data-ux="Block"]') || container;

  // Place the actual block element (which contains all content: headings, desc, form, button, etc)
  // Reference directly (do NOT clone)
  // This will preserve all text, headings, form, etc as-is

  // --- Table Construction ---
  const tableRows = [
    ['Hero (hero3)'],
    [bgImageEl ? bgImageEl : ''],
    [block]
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
