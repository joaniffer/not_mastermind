// CELL HEIGHT/WIDTH CALCULATION

// x = (H - cvm*2*13 + pvm*2 + b*2*15)*(2/19)

const viewportHeight = window.innerHeight;
const cellVMargin = 5;
const pegVMargin = 5;
const headerHeight = 103;

const cellWidth = (
  viewportHeight 
  - headerHeight 
  - cellVMargin * 2 * 13
  - pegVMargin * 2
  - 30) * (2/19);

let boardDiv = document.createElement('div');
boardDiv.className = 'board';

let hintsDiv = document.createElement('div');
hintsDiv.className = 'hints';

let submitsDiv = document.createElement('div');
submitsDiv.className = 'submits';

let allRowsDiv = document.createElement('div');
allRowsDiv.className = 'rows';

// SOLUTION ROW | always expanded

let solutionDiv = document.createElement('div');
solutionDiv.className = 'row';
for (let i = 0; i < 4; i++) {
  let cell = document.createElement('div');
  cell.className = 'cell solution';
  cell.id = `sol${i}`;
  cell.style = `height: ${cellWidth}px; width: ${cellWidth}px`;
  cell.textContent = '?';
  solutionDiv.appendChild(cell);
}
allRowsDiv.appendChild(solutionDiv);

// TRIAL ROWS

for (let i = 0; i < 12; i++) {
  // CELLS
  let rowDiv = document.createElement('div');
  rowDiv.id = `row${11 - i}`;
  rowDiv.className = 'row';

  for (let j = 0; j < 4; j++) {
    let cell = document.createElement('button');
    cell.id = `row${11 - i}cell${j}`;
    cell.className = 'cell';
    cell.style = `height: ${cellWidth/2}px; width: ${cellWidth}px;`;

    rowDiv.appendChild(cell);
  }

  allRowsDiv.appendChild(rowDiv);

  // HINTS (hidden)
  let hint = document.createElement('div');
  hint.style = `height: ${cellWidth/2}px; width: ${cellWidth*1.2};`;
  hintsDiv.appendChild(hint);

  // SUBMITS (hidden)
  let sub = document.createElement('div');
  submitsDiv.appendChild(sub);
}

boardDiv.appendChild(hintsDiv);
boardDiv.appendChild(allRowsDiv);
boardDiv.appendChild(submitsDiv);

document.body.appendChild(boardDiv);

// PEGS TRAY

let pegsDiv = document.createElement('div');
pegsDiv.className = 'pegsTray';
const colors = ['red', 'yellow', 'green', 'blue', 'purple', 'white'];
let pegsRowDiv;
for (let i = 0; i < 6; i++) {
  if (i % 6 === 0) {
    pegsRowDiv = document.createElement('div');
    pegsRowDiv.className = 'pegsRow';
  }

  let peg = document.createElement('button');
  peg.className = `peg ${colors[i]}`;
  peg.style = `
    width: ${cellWidth}px;
    height: ${cellWidth}px;
    border: 1px solid lightgray;
    border-radius: ${cellWidth/2}px;
    margin: 10px 10px 10px 0;
    margin-left: ${i === 0 ? '10px' : '0'};
    font-size: 20px;
    font-family: 'Audiowide', sans-serif;`;
  peg.textContent = colors[i].charAt(0).toUpperCase();
  pegsRowDiv.appendChild(peg);

  if (i % 3 === 2) {
    pegsDiv.appendChild(pegsRowDiv);
  }
}

document.body.appendChild(pegsDiv);
