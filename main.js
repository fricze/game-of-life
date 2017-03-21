const toObj = arr => arr.reduce((resultObject, value, idx) => {
  resultObject[idx] = value;
  return resultObject;
}, {});

const getShadowCells = cells => {
  const leftBound = -1;
  const rightBound = cells[0].length;
  const topBound = -1;
  const bottomBound = cells.length;

  const emptyRow = toObj(cells[0].map(() => 0));
  emptyRow[leftBound] = 0;
  emptyRow[rightBound] = 0;

  const shadowCells = toObj(cells.map(
    row => {
      row = toObj(row);
      row[leftBound] = 0; row[rightBound] = 0;
      return row;
    }
  ));

  shadowCells[topBound] = emptyRow;
  shadowCells[bottomBound] = emptyRow;

  return shadowCells;
};

const rules = [
  // for dead
  [ 0, 0, 0, 1, 0, 0, 0, 0, 0,
  ],
  // for alive
  [ 0, 0, 1, 1, 0, 0, 0, 0, 0,
  ]
];

const getRow = shadowCells => (rowIdx, coll) => coll.map(
  cellIdx => shadowCells[rowIdx][cellIdx]
);

const countAlive = (rowIdx, cellIdx, shadowCells) => [
  [rowIdx - 1, [cellIdx + 1, cellIdx, cellIdx - 1]],
  [rowIdx + 1, [cellIdx + 1, cellIdx, cellIdx - 1]],
  [rowIdx, [cellIdx + 1, cellIdx - 1]]
].map(
  args => getRow(shadowCells)(...args)
).reduce(
  // flatten
  (acc, el) => acc.concat(el)
).reduce(
  // calculate
  (acc, el) => acc + el, 0
);

const _life = (cells, shadowCells) => cells.map(
  (row, rowIdx) => row.map(
    (cell, cellIdx) => rules[cell][countAlive(rowIdx, cellIdx, shadowCells)]
  )
);

const life = cells => _life(cells, getShadowCells(cells));

const drawers = [
  () => null,
  (fn) => fn()
];

const gridHeight = 600;
const gridWidth = 600;
const c = document.getElementById('myCanvas');
const ctx = c.getContext('2d');
ctx.scale(4, 4);
ctx.fillStyle = '#6DB239';

// Draw the contents of the grid onto a canvas
const drawGrid = cells => {
  // This should clear the canvas ahead of each redraw
  ctx.clearRect(0, 0, gridHeight, gridWidth);

  cells.forEach((row, rowIdx) => row.forEach(
    (cell, cellIdx) => drawers[cell](() => {
      ctx.fillRect(rowIdx, cellIdx, 1, 1);
    })
  ));
};

const tick = cells => {
  const updatedCells = life(cells);
  drawGrid(updatedCells);

  window.requestAnimationFrame(() => tick(updatedCells));
};

const getRandomArray = size => Array(size).fill(0).map(
  () => Array(size).fill(0).map(() => Math.round(Math.random()))
);

const getExploderArray = size => {
  const data = Array(size).fill(0).map(
    () => Array(size).fill(0)
  );

  const center = Math.round(size / 2);
  const left = center - 2;
  const top = center - 20;

  data[left][top] = 1;
  data[left + 2][top] = 1;
  data[left + 4][top] = 1;

  data[left][top + 1] = 1;
  data[left + 4][top + 1] = 1;

  data[left][top + 2] = 1;
  data[left + 4][top + 2] = 1;

  data[left][top + 3] = 1;
  data[left + 4][top + 3] = 1;

  data[left][top + 4] = 1;
  data[left + 2][top + 4] = 1;
  data[left + 4][top + 4] = 1;

  return data;
};

const getSpaceshipArray = size => {
  const data = Array(size).fill(0).map(
    () => Array(size).fill(0)
  );

  const center = Math.round(size / 2);
  const left = center - 50;
  const top = center - 20;

  data[left + 1][top] = 1;
  data[left + 2][top] = 1;
  data[left + 3][top] = 1;
  data[left + 4][top] = 1;

  data[left][top + 1] = 1;
  data[left + 4][top + 1] = 1;

  data[left + 4][top + 2] = 1;

  data[left][top + 3] = 1;
  data[left + 3][top + 3] = 1;

  return data;
};

const start = getRandomArray(150);
// const start = getExploderArray(150);
// const start = getSpaceshipArray(150);

// Call main loop
tick(start);
