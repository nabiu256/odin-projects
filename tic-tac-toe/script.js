function GameBoard() {
  const rows = 3;
  const columns = 3;

  /** @type [("X"|"O"|null)[][]] 2d array holding the state of the gameboard */
  const board = [];

  // Board initialization
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = null;
    }
  }

  const getBoard = () => board;
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
   *                occupied cell. If end condition is met, returns either "X" or "O" for
   *                win condition or `null` for stalemate.
   */
  const playCell = (token, row, column) => {
    // Cell is not empty, cannot be played again.
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
  const renderBoard = (board) => {

  }

  return { renderBoard };
})();

const game = (function() {
  const board = GameBoard();

  // There's player "X" and "O".
  let activePlayer = "X";

  const switchActivePlayer = () => {
    activePlayer = activePlayer === "X" ? "O" : "X";
  }

  const printRound = () => {
    board.printBoard();
    console.log(`${activePlayer}'s player turn.`);
  }

  const playRound = (row, column) => {
    const result = board.playCell(activePlayer, row, column);

    if (result === false) {
      console.log("Invalid play, choose an available cell.");
      printRound();
      return;
    }

    if (result === "X") {
      console.log("Player 1 has won. Resetting board...");
      board.resetBoard();
      printRound();
      return;
    } else if (result === "O") {
      console.log("Player 2 has won. Resetting board...");
      board.resetBoard();
      printRound();
      return;
    }

    if (result === null) {
      console.log("Stalemate, resetting board...");
      board.resetBoard();
      printRound();
      return;
    }

    switchActivePlayer();
    printRound();
  }

  // Print first round
  printRound();

  return { playRound }
})();
