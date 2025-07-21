/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact block name
  const headerRow = ['Embed'];

  // We want to capture ALL visible content in this block, including text and links
  // The most robust approach is to take all immediate children (GridCells),
  // and for each, include all their children (which may be <div>, <p>, <a>, etc)
  const content = [];
  // Select all direct children (GridCells)
  const gridCells = element.querySelectorAll(':scope > div');
  gridCells.forEach(cell => {
    // If the cell only has one child, include it directly; if more, include all as array
    const parts = Array.from(cell.childNodes).filter(node => {
      // Only include element nodes or non-empty text nodes
      return (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT') || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    });
    if (parts.length === 1) {
      content.push(parts[0]);
    } else if (parts.length > 1) {
      content.push(parts);
    }
  });

  // Fallback: if no content found, just use the element
  if (content.length === 0) {
    content.push(element);
  }

  // Single cell in the second row, containing all content, preserving elements
  const rows = [
    headerRow,
    [content.length === 1 ? content[0] : content]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
