import {
  calculateWinner,
  isBoardFull,
  getInitialGameState,
  availableMoves,
  computeAiMove,
  findBestMove,
} from "./game-logic";

describe("game-logic: calculateWinner", () => {
  it("returns X for horizontal 1st row", () => {
    expect(calculateWinner(["X", "X", "X", null, null, null, null, null, null])).toBe("X");
  });
  it("returns O for vertical col", () => {
    expect(calculateWinner(["O", null, null, "O", null, null, "O", null, null])).toBe("O");
  });
  it("returns winner for diagonal", () => {
    expect(calculateWinner(["O", null, "X", null, "X", null, "X", null, "X"])).toBe("X");
  });
  it("returns null if no winners", () => {
    expect(calculateWinner([
      "X", "O", "X",
      "O", "X", "O",
      "O", "X", "O"
    ])).toBe(null);
  });
});

describe("game-logic: isBoardFull", () => {
  it("true if full", () => {
    expect(isBoardFull(Array(9).fill("X"))).toBe(true);
  });
  it("false if not full", () => {
    expect(isBoardFull(["X", "O", null, "O", "X", "O", "X", "O", "X"])).toBe(false);
  });
});

describe("game-logic: getInitialGameState", () => {
  it("gives defaults (single, easy)", () => {
    const state = getInitialGameState();
    expect(state.mode).toBe("single");
    expect(state.aiDifficulty).toBe("easy");
    expect(state.squares).toHaveLength(9);
    expect(state.status).toBe("playing");
    expect(state.xIsNext).toBe(true);
  });
  it("supports multi and custom ai", () => {
    const state = getInitialGameState({mode: "multi", aiDifficulty: "hard"});
    expect(state.mode).toBe("multi");
    expect(state.aiDifficulty).toBe("hard");
  });
});

describe("game-logic: availableMoves", () => {
  it("returns correct unfilled indices", () => {
    const squares = ["X", null, "O", null, null, null, "O", null, "X"];
    expect(availableMoves(squares)).toEqual([1, 3, 4, 5, 7]);
  });
});

describe("game-logic: computeAiMove and findBestMove", () => {
  it("computeAiMove (easy) returns valid open index", () => {
    const board = ["X", "O", "X", "O", "X", "O", null, null, null];
    const move = computeAiMove(board, "O", "easy");
    expect([6,7,8]).toContain(move);
  });
  it("computeAiMove (hard) blocks win or wins when possible", () => {
    // Board: X | X | null
    //        O | O | null
    //       null null null
    // O should block at idx 2
    const blockingMove = computeAiMove(["X", "X", null, "O", "O", null, null, null, null], "O", "hard");
    expect(blockingMove).toBe(2);
    // O can win
    const winMove = computeAiMove(["O", "O", null, "X", "X", null, null, null, null], "O", "hard");
    expect(winMove).toBe(2);
  });
  it("findBestMove chooses the only open square", () => {
    const board = ["O","X","O","O","X","X","X",null,"O"];
    const move = findBestMove(board, "X");
    expect(move).toBe(7);
  });
});
