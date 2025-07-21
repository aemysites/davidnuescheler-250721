/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero11) table: 1 column, 3 rows (header, background image, content)
  // This HTML is a footer, but per instructions, we must structure into Hero (hero11) block.

  // --- HEADER ROW ---
  const headerRow = ['Hero (hero11)'];

  // --- BACKGROUND IMAGE ROW ---
  // There is no background image in this block, so cell is empty string
  const backgroundRow = [''];

  // --- CONTENT ROW ---
  // Collect all visible content from both columns in order
  const gridCells = element.querySelectorAll(':scope > div');
  const content = [];
  gridCells.forEach(cell => {
    // look for main content div, otherwise use cell
    const mainBlock = cell.querySelector(':scope > div');
    if (mainBlock) {
      content.push(mainBlock);
    } else {
      content.push(cell);
    }
  });
  const contentRow = [content];

  // --- ASSEMBLE TABLE ---
  const rows = [headerRow, backgroundRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
