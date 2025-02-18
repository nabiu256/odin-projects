/**
 * Sets the state representation of the game. The main object is a 2d array called
 * `board`, which can hold three possible values in each position (or cell): "X", "O", `null`.
 */
function GameBoard() {
  const rows = 3;
  const columns = 3;

  /** @type [("X"|"O"|null)[][]] 2d array holding the state of the gameboard */
  const board = [];

  // Board initialization
  const getBoard = () => board;

  const initializeBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = null;
      }
    }
  }

  initializeBoard();

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j] = null;
      }
    }
  }

  /**
   * Tries to place a token (either X or O) on a given cell. Returns `false` if
   * given cell has already been played or invalid row and column given.
   * 
   * @param {"X"|"O"} token The token (symbol) representing a player. Either an 'X' or an 'O'.
   * @param {number} row Row of the cell to be played.
   * @param {number} column Column of the cell to be played.
   *
   * @returns {"X"|"O"|boolean|null} If a valid play, returns `true`, `false` for an invalid play (already
   *                occupied cell). If end condition is met, returns either "X" or "O" for
   *                win condition or `null` for stalemate.
   */
  const playCell = (token, row, column) => {
    // Either cell doesn't exist, or cell is not empty and cannot be played again.
    if ((row >= rows || column >= columns) || board[row][column] !== null) {
      return false;
    }

    // Mark the cell with the player token.
    board[row][column] = token;

    // Check if win condition has been fulfilled.
    for (const token of ["X", "O"]) {
      // 1. Check for win on rows
      for (let i = 0; i < rows; i++) {
        if (board[i][0] === token && board[i][1] === token && board[i][2] === token) {
          return token;
        }
      }
      // 2. Check for win on columns
      for (let j = 0; j < columns; j++) {
        if (board[0][j] === token && board[1][j] === token && board[2][j] === token) {
          return token;
        }
      }
      // 3. Check diagonal wins
      if (board[0][0] === token && board[1][1] === token && board[2][2] === token) {
        return token;
      }

      if (board[0][2] === token && board[1][1] === token && board[2][0] === token) {
        return token;
      }
    }

    // None of the win conditions were satisfied. Either there are more valid
    // moves or it is a stalemate.
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (board[i][j] === null) {
          // There's at least an empty cell, return `true`.
          return true;
        }
      }
    }

    // None of the cells are left for more moves, and none of the players have won.
    // It's a stalemate.
    return null;
  }

  const printBoard = () => {
    const printableBoard = board.map((row) => row.map((cell) => cell == null ? " " : cell));
    console.log(printableBoard);
  }

  return { getBoard, printBoard, playCell, resetBoard };
}

const displayController = (function() {
  /**
   * We grab the gameboard state and the actual rendered cells and compare
   * them, updating any cells as necessary.
   *
   * @param {any} board 2d array holding the state of the game board.
   */
  const renderBoard = (board) => {
    const boardState = board.getBoard();
    const renderedBoard = [];

    const oSymbol = `
<img class="o-symbol" src="./o-symbol.svg" alt="" />
`
    const xSymbol = `
<img class="x-symbol" src="./x-symbol.svg" alt="" />
`

    for (let i = 0; i < 3; i++) {
      renderedBoard[i] = [];
      for (let j = 0; j < 3; j++) {
        const nth = (i * 3) + (j + 1);
        renderedBoard[i][j] = document.querySelector(`.game-board div:nth-child(${nth})`);
      }
    }

    for (let i = 0; i < boardState.length; i++) {
      for (let j = 0; j < boardState[0].length; j++) {
        const renderedCell = renderedBoard[i][j];
        const stateCell = boardState[i][j];

        if (stateCell === "X") {
          renderedCell.innerHTML = xSymbol;
        } else if (stateCell === "O") {
          renderedCell.innerHTML = oSymbol;
        } else if (stateCell === null) {
          renderedCell.innerHTML = "";
        } else {
          console.log("Invalid value in game state array.");
          console.dir(boardState);
        }
      }
    }
  }

  return { renderBoard };
})();

const game = (function() {
  const board = GameBoard();

  // There's player "X" and "O".
  let activePlayer = "X";

  // Whenever a game is finished, it should not accept any more moves.
  // We track this state with this variable.
  let isFinished = false;

  // Node that holds the win text
  const winText = document.querySelector(".win-text");

  const setupHandlers = () => {
    // Set controls for the players. Basically, they can click on a cell to make a play.
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const nth = (i * 3) + (j + 1);
        let cell = document.querySelector(`.game-board div:nth-child(${nth})`);
        cell.addEventListener("click", () => playRound(i, j));
      }
    }

    // Clicking the win text resets the game.
    winText.addEventListener("click", () => resetHandler());
  }

  const switchActivePlayer = () => {
    activePlayer = activePlayer === "X" ? "O" : "X";
  }

  const printRound = () => {
    board.printBoard();
    console.log(`${activePlayer}'s player turn.`);
  }

  const toggleFinished = () => isFinished = !isFinished;

  const playRound = (row, column) => {
    // If game is finished, no moves are possible
    if (isFinished) {
      console.log("Game is paused, cannot accept any moves right now.")
      return;
    }

    const result = board.playCell(activePlayer, row, column);
    displayController.renderBoard(board);

    if (result === false) {
      console.log("Invalid play, choose an available cell.");
      printRound();
      return;
    }

    // If any of the following, game has met an end condition
    switch (result) {
      case "X":
        console.log("Player 1 has won.");
        winText.innerText = "Player 1 won! Click here to play again."
        winText.classList.remove("hidden");
        toggleFinished();
        return;
      case "O":
        console.log("Player 2 has won.");
        winText.innerText = "Player 2 won! Click here to play again."
        winText.classList.remove("hidden");
        toggleFinished();
        return;
      case null:
        console.log("Stalemate.");
        winText.innerText = "Stalemate. Click here to play again."
        winText.classList.remove("hidden");
        toggleFinished();
        return;
    }

    switchActivePlayer();
    printRound();
  }

  const resetHandler = () => {
    // We should only be able to reset the game whenever it has paused
    if (isFinished) {
      resetGame();
      toggleFinished();
    }
  }

  const resetGame = async () => {
    console.log("Resetting game...");
    winText.innerHTML = "Waiting for round...";
    winText.classList.add("hidden");
    board.resetBoard();
    displayController.renderBoard(board);
    printRound();
  }

  setupHandlers();
  printRound();
  displayController.renderBoard(board);

  return { playRound, resetHandler }
})();
