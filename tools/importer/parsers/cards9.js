/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if we actually have relevant children
  const gridCells = Array.from(element.querySelectorAll(':scope > div[data-ux="GridCell"]'));
  if (!gridCells.length) return;

  // The first cell contains copyright, the second contains 'powered by' (usually both in footers)
  const copyrightCell = gridCells[0];
  const poweredCell = gridCells[1];

  // Compose header row
  const headerRow = ['Cards (cards9)'];

  // For copyright: reference the data-ux="FooterDetails" block (for full text and formatting)
  let copyrightBlock = copyrightCell.querySelector('[data-ux="FooterDetails"]');
  if (!copyrightBlock) {
    // Fallback to the entire cell
    copyrightBlock = copyrightCell;
  }
  const copyrightRow = [copyrightBlock];

  // For powered by: get the entire block (contains p, a, svg)
  let poweredBlock = poweredCell;
  const poweredRow = [poweredBlock];

  // Compose table cells
  const cells = [
    headerRow,
    copyrightRow,
    poweredRow
  ];
  
  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
