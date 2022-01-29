var currentRow, unfilledCells;

let sumbmitButton = document.createElement('button');
sumbmitButton.style = `
  width: ${cellWidth*.7}px;
  height: ${cellWidth*.7}px;
  border-radius: ${cellWidth/2}px;
  margin: ${cellWidth*.15}px;
  font-family: 'Audiowide', sans-serif;
  font-size: ${cellWidth/2}px`;
sumbmitButton.className = 'submit';
sumbmitButton.textContent = '>';
sumbmitButton.onclick = onGuess;

function randInt(max) {
  return Math.floor(Math.random() * max);
}

const theSolution = [
  colors[randInt(6)],
  colors[randInt(6)],
  colors[randInt(6)],
  colors[randInt(6)]
];

////////////////////////////
//////// GAME LOGIC ////////
////////////////////////////

function evaluateGuess() {
  let solLeft = [];
  let hints = [];

  let guessLeft = [];
  for (let i = 0; i < 4; i++) {
    let cell = document.getElementById(`row${currentRow}cell${i}`);
    let color = getCellColor(cell);
    if (color === theSolution[i]) {
      hints.push('f'); // f for fill
    } else {
      guessLeft.push(color);
      solLeft.push(theSolution[i]);
    }
  }

  for (let i = 0; i < guessLeft.length; i++) {
    let color = guessLeft[i];
    if (solLeft.includes(color)) {
      hints.push('o'); // o for outline
      solLeft.splice(solLeft.indexOf(color), 1);
    }
  }

  return hints;
}

function onGuess() {
  if (unfilledCells.length > 0) {
    return;
  }

  let hints = evaluateGuess();
  populateHints(hints);
  if (hints.length === 4 && !hints.includes('o')) {
    for (let i = 0; i < 4; i++) {
      let solCell = document.getElementById(`sol${i}`);
      solCell.textContent = '';
      solCell.className = `solution cell ${theSolution[i]} win`;

      let guessCell = document.getElementById(`row${currentRow}cell${i}`);
      guessCell.className = `${guessCell.className} win`;
    }
  } else if (currentRow === 11) {
    console.log('lose');
  } else {
    setupNextRow(currentRow + 1);
  }
}

function populateHints(hints) {
  let pipsDiv = hintsDiv.children[11 - currentRow];
  for (let i = 0; i < hints.length; i++) {
    let pip = document.createElement('div');
    pip.style = `
      width: ${cellWidth/5}px;
      height: ${cellWidth/5}px;
      border-radius: ${cellWidth/5}px;
      border: 1px solid lightgray;
      background: ${hints[i] === 'f' ? 'lightgray' : 'transparent'};
      margin: 0 2px;`;
    pipsDiv.appendChild(pip);
  }

  pipsDiv.className = 'active';
}

////////////////////////////
//////// CELL STUFF ////////
////////////////////////////

function getCellColor(cell) {
  const classes = cell.className;
  for (let i = 0; i < 6; i++) {
    if (classes.includes(colors[i])) {
      return colors[i];
    }
  }

  return undefined;
}

function getCellIndex(cell) {
  const id = cell.id;
  const len = isNaN(id.charAt(id.length - 2)) ? 1 : 2;
  return parseInt(id.substring(id.length - len), 10);
}

function deactivateRow(row) {
  for (let i = 0; i < 4; i++) {
    let cell = document.getElementById(`row${row}cell${i}`);
    const color = getCellColor(cell);
    cell.className = `cell ${color}`;
    cell.style = `height: ${cellWidth/2}px; width: ${cellWidth}px;`;
    cell.onclick = undefined;
  }

  let sub = submitsDiv.children[11 - row];
  sub.className = '';
  sub.style = `
    width: 1px;
    height: ${cellWidth/2}px;
    margin: 5px 0;
    border: 1px solid transparent;`;
  sub.removeChild(sumbmitButton);
}

function cellOnClick(cell) {
  return () => {
    if (cell.className === 'cell') {
      return;
    }

    cell.className = 'cell';
    unfilledCells.push(cell);
    unfilledCells.sort((a, b) => getCellIndex(a) < getCellIndex(b) ? -1 : 1);
  };
}

function setupNextRow(row) {
  if (row > 0) {
    deactivateRow(row - 1);
  }

  currentRow = row;
  unfilledCells = [];

  for (let i = 0; i < 4; i++) {
    let cell = document.getElementById(`row${row}cell${i}`);
    cell.style = `height: ${cellWidth}px; width: ${cellWidth}px;`;
    cell.onclick = cellOnClick(cell);

    let p = document.createElement('p');
    p.textContent = 'X';
    p.style = `font-size: ${cellWidth * .6}px`;
    cell.appendChild(p);

    unfilledCells.push(cell);
  }

  let sub = submitsDiv.children[11 - row];
  sub.className = 'hasButton';
  sub.appendChild(sumbmitButton);
}

///////////////////////////////
////// SETUP FILL ACTIONS /////
///////////////////////////////

function pegOnClick(c) {
  return () => {
    if (unfilledCells.length < 1) {
      return;
    }

    let cell = unfilledCells[0];
    cell.className = `cell ${c} filled`;
    unfilledCells.shift();
  };
}

for (let i = 0; i < 6; i++) {
  let peg = document.getElementsByClassName(`peg ${colors[i]}`)[0];
  peg.onclick = pegOnClick(colors[i]);
}

////////////////////////////
//////////// GO ////////////
////////////////////////////

setupNextRow(0);
