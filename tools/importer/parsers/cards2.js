/* global WebImporter */
export default function parse(element, { document }) {
  // Set up the block header as required
  const cells = [['Cards (cards2)']];
  // Find all immediate card containers within the incoming block
  const gridCells = element.querySelectorAll(':scope > div');
  gridCells.forEach((cell) => {
    // Try to find an image or svg as the card visual (first one only)
    let visual = cell.querySelector('img, svg');
    // Remove the visual from the cell so it's not included twice
    let visualParent = null;
    let visualSibling = null;
    if (visual && visual.parentNode) {
      visualParent = visual.parentNode;
      visualSibling = visual.nextSibling;
      visualParent.removeChild(visual);
    }
    // Collect the rest of the content that is not the image/svg
    // Use only direct children of the cell, not nested grid
    const textContentEls = [];
    cell.childNodes.forEach((node) => {
      // Only element nodes
      if (node.nodeType === 1) {
        // Don't include script/style/etc
        if (node.tagName !== 'IMG' && node.tagName !== 'SVG') {
          textContentEls.push(node);
        }
      }
    });
    // Edge: if no text element found, use textContent as fallback
    let textCell;
    if (textContentEls.length > 0) {
      textCell = textContentEls.length === 1 ? textContentEls[0] : textContentEls;
    } else if (cell.textContent.trim()) {
      // As an emergency fallback, create a <span>
      const span = document.createElement('span');
      span.textContent = cell.textContent.trim();
      textCell = span;
    } else {
      textCell = '';
    }
    // Put the visual back in the DOM for future use (non-destructive)
    if (visual && visualParent) {
      if (visualSibling) {
        visualParent.insertBefore(visual, visualSibling);
      } else {
        visualParent.appendChild(visual);
      }
    }
    cells.push([visual || '', textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
