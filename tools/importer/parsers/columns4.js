/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid for the columns
  const grid = element.querySelector('div[data-ux="Grid"]');
  if (!grid) return;
  const gridCells = Array.from(grid.querySelectorAll(':scope > div[data-ux="GridCell"]'));

  // Defensive: Ensure we have at least 4 columns for columns4
  if (gridCells.length < 4) return;

  // --- COLUMN 1: Text block (title), list, and button ---
  let col1Content = [];
  {
    // Look for the column block title, list and button inside the first grid cell
    const colDivs = Array.from(gridCells[0].children);
    // Title block
    const titleBlock = colDivs.find(child => child.innerText && child.innerText.trim().toLowerCase().startsWith('columns block'));
    if (titleBlock) col1Content.push(titleBlock);
    // List
    const ul = gridCells[0].querySelector('ul');
    if (ul) col1Content.push(ul);
    // Button (assume only one in the cell)
    const btn = gridCells[0].querySelector('a, button');
    if (btn) col1Content.push(btn);
  }

  // --- COLUMN 2: First image ---
  let col2Content = [];
  const img2 = gridCells[1].querySelector('img');
  if (img2) {
    col2Content = [img2];
  }

  // --- COLUMN 3: Second image ---
  let col3Content = [];
  const img3 = gridCells[2].querySelector('img');
  if (img3) {
    col3Content = [img3];
  }

  // --- COLUMN 4: Text and button ---
  let col4Content = [];
  {
    // Look for paragraph with 'view the preview', and a preview button
    const txt = Array.from(gridCells[3].querySelectorAll('p,div')).find(
      el => el.innerText && el.innerText.toLowerCase().includes('just view the preview')
    );
    if (txt) col4Content.push(txt);
    const previewBtn = gridCells[3].querySelector('a, button');
    if (previewBtn) col4Content.push(previewBtn);
  }

  // Compose the block table with 4 columns in the content row
  const cells = [
    ['Columns (columns4)'],
    [col1Content, col2Content, col3Content, col4Content],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
