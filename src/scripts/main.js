'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');

// Write your code here
// function countFilledCells() {
//   const gameCells = Array.from(document.querySelectorAll('.field-cell'));

//   let count = 0;

//   for (const cell of gameCells) {
//     if (cell.textContent !== '0') {
//       count++;
//     }
//   }

//   return count;
// }

function twoOrFour() {
  const randomChance = Math.random();

  if (randomChance <= 0.1) {
    return '4';
  }

  return '2';
}

function setCellsValues(cellsCount) {
  const gameCells = Array.from(document.querySelectorAll('.field-cell'));

  let count = 0;

  while (count < cellsCount) {
    const randomChance = Math.random() * (1.6 - 0) + 0;

    const markedCell = Math.floor(randomChance * 10);

    if (gameCells[markedCell].textContent === '0') {
      count++;
      gameCells[markedCell].textContent = twoOrFour();

      gameCells[markedCell].classList.add(
        `field-cell--${gameCells[markedCell].textContent}`,
      );
    }
  }
}

function currentState() {
  const rows = Array.from(document.querySelectorAll('.field-row'));

  const result = [];

  for (const row of rows) {
    const numRow = [];

    for (const cell of row.children) {
      numRow.push(cell.textContent);
    }

    result.push(numRow);
  }

  return result;
}

function deleteMerges(cells) {
  for (const cell of cells) {
    if (cell.textContent === '0') {
      cell.classList = 'field-cell';
    }
  }
}

class Game {
  constructor(initialState) {
    this.busyCells = initialState;
    this.score = document.querySelector('.game-score');

    const gameCells = Array.from(document.querySelectorAll('.field-cell'));

    for (const cell of gameCells) {
      cell.textContent = '0';
    }
    setCellsValues(initialState);
  }

  getState() {
    return currentState();
  }

  getScore() {
    const gameScore = document.querySelector('.game-score');

    return gameScore.textContent;
  }

  getStatus() {
    const container = document.querySelector('.message-container');

    for (const child of container.children) {
      if (!child.classList.contains('hidden')) {
        const currentStatus = child.classList[1];

        return currentStatus.split('-')[1];
      }
    }
  }

  moveLeft() {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') {
        const gameRows = Array.from(document.querySelectorAll('.field-row'));

        for (let row = 0; row < gameRows.length; row++) {
          const currRow = gameRows[row];

          for (let cell = 1; cell < currRow.children.length; cell++) {
            const currCell = currRow.children[cell];

            if (currCell.textContent !== '0') {
              for (let i = cell - 1; i >= 0; i--) {
                const nextCell = currRow.children[i];

                if (i === 0 && nextCell.textContent === '0') {
                  nextCell.textContent = currCell.textContent;
                  nextCell.classList.add(`field-cell--${nextCell.textContent}`);
                  currCell.textContent = '0';
                  currCell.classList = 'field-cell';
                } else if (
                  nextCell.textContent === currCell.textContent &&
                  !nextCell.classList.contains('merged')
                ) {
                  nextCell.textContent = currCell.textContent *= 2;

                  this.score.textContent =
                    +this.score.textContent + +nextCell.textContent;
                  nextCell.classList = 'field-cell';
                  nextCell.classList.add(`field-cell--${nextCell.textContent}`);
                  nextCell.classList.add('merged');
                  currCell.textContent = '0';
                  currCell.classList = 'field-cell';
                } else if (
                  nextCell.textContent !== '0' &&
                  nextCell.textContent !== currCell.textContent
                ) {
                  const beforeCell = currRow.children[i + 1];

                  if (beforeCell !== currCell) {
                    beforeCell.textContent = currCell.textContent;
                    beforeCell.classList = 'field-cell';
                    beforeCell.classList.add(`field-cell--${beforeCell.textContent}`);
                    currCell.classList = 'field-cell';
                    currCell.textContent = '0';
                  }
                }
              }
            } else {
              continue;
            }
          }
          deleteMerges(document.querySelectorAll('field-cell'));
        }
        setCellsValues(1);
      }
    });
  }

  moveRight() {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight') {
        const gameRows = Array.from(document.querySelectorAll('.field-row'));

        for (let row = 0; row < gameRows.length; row++) {
          const currRow = gameRows[row];

          for (let cell = currRow.children.length - 2; cell >= 0; cell--) {
            const currCell = currRow.children[cell];

            if (currCell.textContent !== 0) {
              const rowLength = currRow.children.length;

              for (let i = cell + 1; i < rowLength; i++) {
                const nextCell = currRow.children[i];

                if (i === rowLength - 1 && nextCell.textContent === '0') {
                  nextCell.textContent = currCell.textContent;
                  nextCell.classList.add(`field-cell--${nextCell.textContent}`);
                  currCell.textContent = '0';
                  currCell.classList = 'field-cell';
                } else if (
                  nextCell.textContent === currCell.textContent &&
                  !nextCell.classList.contains('merged')
                ) {
                  nextCell.textContent = currCell.textContent *= 2;

                  this.score.textContent =
                    +this.score.textContent + +nextCell.textContent;

                  nextCell.classList = 'field-cell';
                  nextCell.classList.add(`field-cell--${nextCell.textContent}`);
                  nextCell.classList.add('merged');
                  currCell.textContent = '0';
                  currCell.classList = 'field-cell';
                } else if (
                  nextCell.textContent !== '0' &&
                  nextCell.textContent !== currCell.textContent
                ) {
                  const beforeCell = currRow.children[i - 1];

                  if (beforeCell !== currCell) {
                    beforeCell.textContent = currCell.textContent;
                    beforeCell.classList = 'field-cell';
                    beforeCell.classList.add(`field-cell--${beforeCell.textContent}`);
                    currCell.classList = 'field-cell';
                    currCell.textContent = '0';
                  }
                }
              }
            }
          }
          deleteMerges(document.querySelectorAll('.field-cell'));
        }
        setCellsValues(1);
      }
    });
  }
}

const game = new Game(2);

game.moveLeft();
game.moveRight();
// console.log(game.getStatus());
