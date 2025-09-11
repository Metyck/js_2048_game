'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');

// Write your code here

function getTwoOrFour() {
  const randomChance = Math.random();

  if (randomChance <= 0.1) {
    return 4;
  }

  return 2;
}

function filledCellsCount(board) {
  let count = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell !== 0) {
        count++;
      }
    }
  }

  return count;
}

function setTwoOrFour(board) {
  const filledCells = filledCellsCount(board);
  const diapasone = (16 - filledCells) / 10;

  while (true) {
    for (let row = 0; row < board.length; row++) {
      for (let cell = 0; cell < board[row].length; cell++) {
        const randomChance = Math.random() * (16 - filledCells);

        if (randomChance <= diapasone && board[row][cell] === 0) {
          board[row][cell] = getTwoOrFour();

          return;
        }
      }
    }
  }
}

function displayCells(board) {
  const gameCells = Array.from(document.querySelectorAll('.field-cell'));

  let count = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell !== 0) {
        gameCells[count].classList = `field-cell field-cell--${cell}`;
        gameCells[count].textContent = cell;
      } else {
        gameCells[count].classList = 'field-cell';
        gameCells[count].textContent = '';
      }
      count++;
    }
  }
}

function compareFieldRows(newState, startState) {
  for (let c = 0; c < newState.length; c++) {
    if (newState[c] !== startState[c]) {
      return false;
    }
  }

  return true;
}

function compareFields(startField, newField) {
  let count = 0;

  for (let r = 0; r < newField.length; r++) {
    for (let c = 0; c < newField[r].length; c++) {
      if (startField[r][c] === 2048) {
        return 'win';
      }
    }
  }

  for (let r = 0; r < newField.length; r++) {
    for (let c = 0; c < newField[r].length; c++) {
      if (newField[r][c] === 0) {
        count++;
      }

      if (newField[r][c] === 2048) {
        return 'win';
      }

      if (startField[r][c] !== newField[r][c]) {
        return false;
      }
    }
  }

  if (count === 0) {
    return 'lose';
  }

  return true;
}

function addNewTwoOrCell(board, startState) {
  if (compareFields(startState, board) === false) {
    setTwoOrFour(board);
  }

  if (compareFields(board, startState) === 'lose') {
    const loseMessage = document.querySelector('.message-lose');

    loseMessage.classList.remove('hidden');
  }

  if (compareFields(board, startState) === 'win') {
    const winMessage = document.querySelector('.message-win');

    winMessage.classList.remove('hidden');
  }
}

class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    displayCells(this.board);

    this.score = 0;

    this.status = 'start';
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    const startMessage = document.querySelector('.message-start');
    const loseMessage = document.querySelector('.message-lose');
    const winMessage = document.querySelector('.message-win');

    if (!loseMessage.classList.contains('hidden')) {
      return 'lose';
    } else if (!winMessage.classList.contains('hidden')) {
      return 'win';
    } else if (startMessage.classList.contains('hidden')) {
      return 'playing';
    } else {
      return 'start';
    }
  }

  moveLeft() {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') {
        const result = [];
        const startBoardState = [...this.board];

        let count = 0;

        for (const row of this.board) {
          const startScore = this.score;
          const startState = this.board[count];
          let filtered = row.filter((x) => x !== 0);

          for (let i = 0; i < filtered.length; i++) {
            if (filtered[i + 1] === filtered[i]) {
              filtered[i] = filtered[i] * 2;
              filtered[i + 1] = 0;

              this.score += filtered[i];
            } else if (filtered[i + 1] === 0 && filtered[i] !== 0) {
              filtered[i + 1] = filtered[i];
            }
          }
          filtered = filtered.filter((x) => x !== 0);

          for (let i = 0; i <= 3; i++) {
            if (!filtered[i]) {
              filtered.push(0);
            }
          }

          result.push(filtered);

          if (compareFieldRows(result[count], startState) === true) {
            this.score = startScore;
          }

          this.board[count] = result[count];

          count++;
        }

        addNewTwoOrCell(this.board, startBoardState);

        displayCells(this.board);

        const score = document.querySelector('.game-score');

        score.textContent = this.score;
      }
    });
  }

  moveRight() {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight') {
        const result = [];
        const startBoardState = [...this.board];

        let count = 0;

        for (const row of this.board) {
          const startScore = this.score;
          const startState = this.board[count];
          let filtered = row.filter((x) => x !== 0);

          filtered = filtered.reverse();

          for (let i = 0; i < filtered.length; i++) {
            if (filtered[i + 1] === filtered[i]) {
              filtered[i] = filtered[i] * 2;
              filtered[i + 1] = 0;

              this.score += filtered[i];
            } else if (filtered[i + 1] === 0 && filtered[i] !== 0) {
              filtered[i + 1] = filtered[i];
            }
          }
          filtered = filtered.filter((x) => x !== 0);

          for (let i = 0; i <= 3; i++) {
            if (!filtered[i]) {
              filtered.push(0);
            }
          }

          filtered.reverse();

          result.push(filtered);

          if (compareFieldRows(result[count], startState) === true) {
            this.score = startScore;
          }

          this.board[count] = result[count];

          count++;
        }

        addNewTwoOrCell(this.board, startBoardState);

        displayCells(this.board);

        const score = document.querySelector('.game-score');

        score.textContent = this.score;
      }
    });
  }

  moveDown() {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowDown') {
        // const result = [];
        const startBoardState = this.board.map((row) => [...row]);

        for (let c = 0; c < this.board[0].length; c++) {
          const startRowState = [];

          for (let r = 0; r < this.board.length; r++) {
            startRowState.push(this.board[r][c]);
          }

          let filtered = startRowState.filter((x) => x !== 0);

          for (let cell = 0; cell < filtered.length; cell++) {
            if (filtered[cell + 1] === filtered[cell]) {
              filtered[cell] = filtered[cell] * 2;
              filtered[cell + 1] = 0;

              this.score += filtered[cell];
            } else if (filtered[cell + 1] === 0 && filtered[cell] !== 0) {
              filtered[cell + 1] = filtered[cell];
            }
          }

          filtered = filtered.filter((x) => x !== 0);

          for (let i = 0; i <= 3; i++) {
            if (filtered.length < 4) {
              filtered.unshift(0);
            } else {
              break;
            }
          }

          for (let row = 0; row < this.board.length; row++) {
            this.board[row][c] = filtered[row];
          }
        }

        addNewTwoOrCell(this.board, startBoardState);

        displayCells(this.board);

        const score = document.querySelector('.game-score');

        score.textContent = this.score;
      }
    });
  }

  moveUp() {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowUp') {
        const startBoardState = this.board.map((row) => [...row]);

        for (let c = 0; c < this.board[0].length; c++) {
          const startRowState = [];

          for (let r = 0; r < this.board.length; r++) {
            startRowState.push(this.board[r][c]);
          }

          let filtered = startRowState.filter((x) => x !== 0);

          filtered.reverse();

          for (let cell = 0; cell < filtered.length; cell++) {
            if (filtered[cell + 1] === filtered[cell]) {
              filtered[cell] = filtered[cell] * 2;
              filtered[cell + 1] = 0;

              this.score += filtered[cell];
            } else if (filtered[cell + 1] === 0 && filtered[cell] !== 0) {
              filtered[cell + 1] = filtered[cell];
            }
          }

          filtered = filtered.filter((x) => x !== 0);

          for (let i = 0; i <= 3; i++) {
            if (filtered.length < 4) {
              filtered.unshift(0);
            } else {
              break;
            }
          }

          filtered.reverse();

          for (let row = 0; row < this.board.length; row++) {
            this.board[row][c] = filtered[row];
          }
        }

        addNewTwoOrCell(this.board, startBoardState);
        // console.log(startBoardState);

        displayCells(this.board);

        const score = document.querySelector('.game-score');

        score.textContent = this.score;
      }
    });
  }

  start() {
    const startMessage = document.querySelector('.message-start');
    const startButton = document.querySelector('.start');

    startButton.addEventListener('click', (ev) => {
      if (ev.target === startButton) {
        this.score = 0;

        this.board = [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];

        displayCells(this.board);

        startMessage.classList.add('hidden');
        startButton.classList.remove('start');
        startButton.classList.add('restart');
        startButton.textContent = 'Restart';
      }

      const score = document.querySelector('.game-score');

      score.textContent = this.score;

      startButton.removeEventListener('click', ev);

      const messageLose = document.querySelector('.message-lose');

      if (messageLose) {
        messageLose.classList.add('hidden');
      }
    });
  }

  restart() {
    const restartButton = document.querySelector('.start');

    if (restartButton && !restartButton.classList.contains('modifyied')) {
      restartButton.addEventListener('click', (ev) => {
        if (ev.target.closest('button')) {
          this.score = 0;

          this.board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
          ];

          setTwoOrFour(this.board);
          setTwoOrFour(this.board);
        }
        displayCells(this.board);
        restartButton.classList.add('modifyied');
      });
    }
  }
}

const game = new Game();

game.getState();
game.getScore();
game.getStatus();
game.moveLeft();
game.moveRight();
game.moveDown();
game.moveUp();
game.start();
game.restart();
