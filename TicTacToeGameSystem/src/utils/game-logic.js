/**
 * Returns "X" if X won, "O" if O won, or null if no winner
 */
export function calculateWinner(squares) {
  // PUBLIC_INTERFACE
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
export function isBoardFull(squares) {
  return squares.every(val => val);
}

// PUBLIC_INTERFACE
export function getInitialGameState({ mode = "single", aiDifficulty = "easy" } = {}) {
  /**
   * Returns initial state for a new game.
   */
  return {
    mode, // "single" or "multi"
    aiDifficulty, // only used in single
    squares: Array(9).fill(null),
    xIsNext: true,
    winner: null,
    status: "playing", // playing, won, draw
    lastMoveIdx: null,
  };
}

// PUBLIC_INTERFACE
export function availableMoves(squares) {
  /**
   * Returns indices of available (empty) squares
   */
  return squares.map((val, idx) => (val ? null : idx)).filter(v => v !== null);
}

// PUBLIC_INTERFACE
function getRandomMove(squares) {
  const openSquares = availableMoves(squares);
  if (openSquares.length === 0) return null;
  return openSquares[Math.floor(Math.random() * openSquares.length)];
}

// PUBLIC_INTERFACE
export function computeAiMove(squares, aiMark, level) {
  /**
   * Chooses AI move based on difficulty:
   * - easy: random
   * - medium: random 60%, best 40%
   * - hard: always best/minimax
   */
  if (level === "easy") {
    return getRandomMove(squares);
  }
  if (level === "medium") {
    return Math.random() < 0.60
      ? getRandomMove(squares)
      : findBestMove(squares, aiMark);
  }
  // hard
  return findBestMove(squares, aiMark);
}

// PUBLIC_INTERFACE
export function findBestMove(squares, player) {
  /**
   * Implements minimax to pick best move for player.
   */
  const opponent = player === "X" ? "O" : "X";
  let bestScore = -Infinity;
  let move = null;

  availableMoves(squares).forEach(idx => {
    const newSquares = squares.slice();
    newSquares[idx] = player;
    const score = minimax(newSquares, false, player, opponent);
    if (score > bestScore) {
      bestScore = score;
      move = idx;
    }
  });
  return move;
}

function minimax(squares, isMaximizing, aiPlayer, opponent) {
  const winner = calculateWinner(squares);
  if (winner === aiPlayer) return 1;
  if (winner === opponent) return -1;
  if (isBoardFull(squares)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const idx of availableMoves(squares)) {
      const newSquares = squares.slice();
      newSquares[idx] = aiPlayer;
      const score = minimax(newSquares, false, aiPlayer, opponent);
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const idx of availableMoves(squares)) {
      const newSquares = squares.slice();
      newSquares[idx] = opponent;
      const score = minimax(newSquares, true, aiPlayer, opponent);
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
}
