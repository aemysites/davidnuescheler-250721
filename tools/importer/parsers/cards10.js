/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: always the block name exactly
  const headerRow = ['Cards (cards10)'];

  // The footer block consists of two main pieces: copyright (left) and powered by (right)
  // In the HTML, each is in its own GridCell
  const gridCells = element.querySelectorAll(':scope > div');

  // Compose one content cell that preserves the original layout
  // We'll wrap copyright and powered by in a div for a single cell, per guidelines
  const contentDiv = document.createElement('div');
  for (const gridCell of gridCells) {
    // Only append if the gridCell has non-empty content
    if (gridCell && gridCell.innerHTML.trim()) {
      contentDiv.appendChild(gridCell);
    }
  }

  const tableData = [
    headerRow,
    [contentDiv]
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
