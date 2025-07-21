/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section containing the columns
  const section = element.querySelector('section[data-ux="Section"]');
  if (!section) return;

  // Find the ContentCards container (contains the columns)
  const cardsWrapper = section.querySelector('[data-ux="ContentCards"]');
  if (!cardsWrapper) return;

  // Get all top-level grid cells (cards) - each will be a column in the block
  const gridCells = cardsWrapper.querySelectorAll(':scope > div');
  // For each grid cell, find the content card and content overlay
  const columns = Array.from(gridCells).map(cell => {
    const card = cell.querySelector('[data-ux="ContentCard"]');
    if (!card) return document.createTextNode('');
    const content = card.querySelector('[data-ux="ContentOverlayCardText"]');
    return content ? content : document.createTextNode('');
  });

  // Header row must contain a single cell (the block name)
  const cells = [
    ['Columns (columns5)'],
    columns // Second row: one cell for each column of content
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
