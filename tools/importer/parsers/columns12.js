/* global WebImporter */
export default function parse(element, { document }) {
  // Find the SplitLayout, which contains the column structure
  const splitLayout = element.querySelector('[data-ux="SplitLayout"]');
  if (!splitLayout) return;

  // Get the direct children GridCells (the columns)
  const gridCells = splitLayout.querySelectorAll('[data-ux="GridCell"]');
  if (gridCells.length < 2) return;

  // Each GridCell represents one column, each has a Block with the column content
  const leftCol = gridCells[0].querySelector('[data-ux="Block"]');
  const rightCol = gridCells[1].querySelector('[data-ux="Block"]');

  // Defensive: if either is missing, gracefully degrade to whatever exists
  const cols = [];
  if (leftCol) cols.push(leftCol);
  else cols.push(document.createTextNode(''));
  if (rightCol) cols.push(rightCol);
  else cols.push(document.createTextNode(''));

 
  // Table header as in example: Columns (columns12)
  const header = ['Columns (columns12)'];

  const table = WebImporter.DOMUtils.createTable([
    header,
    cols
  ], document);

  element.replaceWith(table);
}
