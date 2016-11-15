const toObj = arr => arr.reduce((o, v, i) => {
  o[i] = v;
  return o;
}, {});

const getShadowCells = cells => {
  const leftBound = -1;
  const rightBound = cells[0].length;
  const topBound = -1;
  const bottomBound = cells.length;

  const emptyRow = toObj(cells[0].map(() => 0))
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
}

const rules = [
  // for dead
  [ 0, 0, 0, 1, 0, 0, 0, 0, 0,
  ],
  // for alive
  [ 0, 0, 1, 1, 0, 0, 0, 0, 0,
  ]
];

const getRow = shadowCells => (rowIdx, coll) =>
        coll.map(
          cellIdx => shadowCells[rowIdx][cellIdx]
        )

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
)

const _life = (cells, shadowCells) => cells.map(
  (row, rowIdx) => row.map(
    (cell, cellIdx) => rules[cell][countAlive(rowIdx, cellIdx, shadowCells)]
  )
)
const life = cells => _life(cells, getShadowCells(cells));

const drawers = [
  () => null,
  (fn) => fn()
];

const drawGrid = cells => { //draw the contents of the grid onto a canvas
  ctx.clearRect(0, 0, gridHeight, gridWidth); //this should clear the canvas ahead of each redraw

  cells.forEach((row, rowIdx) => row.forEach(
    (cell, cellIdx) => drawers[cell](() => {
      ctx.fillRect(rowIdx, cellIdx, 1, 1);
    })
  ))
}

const tick = cells => {
  const updatedCells = life(cells);
  drawGrid(updatedCells);
  window.requestAnimationFrame(() => tick(updatedCells))
}

const gridHeight = 600;
const gridWidth = 600;
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
ctx.scale(4, 4);
ctx.fillStyle = "#FF0000";

const getRandomArray = size => Array(size).fill(0).map(
  () => Array(size).fill(0).map(() => Math.round(Math.random()))
)

const start = getRandomArray(150)

tick(start); //call main loop
