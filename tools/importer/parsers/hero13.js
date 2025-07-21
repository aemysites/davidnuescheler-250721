/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero13) expects 1 column and 3 rows: header, image (optional), content
  // 1. Header row
  const headerRow = ['Hero (hero13)'];

  // 2. Background Image row (leave empty if there is no background image in this block)
  const bgImageRow = [''];

  // 3. Content row: all footer copyright and powered by content
  // We want to retain the actual existing nodes, not their HTML strings or clones
  const gridCells = element.querySelectorAll(':scope > div');
  const contentNodes = [];
  gridCells.forEach(cell => {
    for (const child of cell.children) {
      contentNodes.push(child);
    }
  });
  // contentRow is a single cell containing all those nodes (in a flat array)
  const contentRow = [contentNodes];

  // Compose the table rows
  const rows = [headerRow, bgImageRow, contentRow];
  
  // Create the table with the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the old element with the block table
  element.replaceWith(table);
}
