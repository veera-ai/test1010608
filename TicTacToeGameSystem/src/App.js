import React, { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Status from "./components/Status";
import GameControls from "./components/GameControls";
import {
  getInitialGameState,
  calculateWinner,
  isBoardFull,
  computeAiMove,
} from "./utils/game-logic";
import {
  saveGameState,
  loadGameState,
  clearGameState,
} from "./utils/persistence";
import { fetchBackendHello } from "./utils/api";

// PUBLIC_INTERFACE
function App() {
  // Theming
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  // Game state
  const [gameState, setGameState] = useState(() =>
    getInitialGameState({ mode: "single", aiDifficulty: "easy" })
  );

  // app-level state for backend API
  const [backendHello, setBackendHello] = useState(null);
  // Load persisted game if any
  const [hasSaved, setHasSaved] = useState(!!loadGameState());

  // Upon mount, check for backend
  useEffect(() => {
    fetchBackendHello().then(setBackendHello);
  }, []);

  const againstAI = gameState.mode === "single";
  const aiMark = "O";
  const userMark = "X";

  // Save possible only if game is ongoing
  const isSavable = gameState.status === "playing";
  // Load allowed only if there is a saved state and the game is not active (or always allowed for demonstration)
  const isLoadable = !!loadGameState();

  // Handle user selecting a square
  function handleSquareClick(idx) {
    if (gameState.status !== "playing") return;
    // Only act if it's the right player's turn (prevent clicking for AI)
    if (againstAI && !gameState.xIsNext) return;
    if (gameState.squares[idx]) return;

    makeMove(idx, userMark);
  }

  // Wrapper for making a move, updates state and checks win/draw
  function makeMove(idx, mark) {
    setGameState((prev) => {
      if (prev.squares[idx] || prev.status !== "playing") return prev;
      const nextSquares = prev.squares.slice();
      nextSquares[idx] = mark;
      const winner = calculateWinner(nextSquares);
      const isDraw = !winner && isBoardFull(nextSquares);

      return {
        ...prev,
        squares: nextSquares,
        xIsNext: !prev.xIsNext,
        winner: winner,
        status: winner ? "won" : isDraw ? "draw" : "playing",
        lastMoveIdx: idx,
      };
    });
  }

  // Trigger AI move after user plays (single player mode)
  useEffect(() => {
    if (
      againstAI &&
      !gameState.xIsNext &&
      gameState.status === "playing"
    ) {
      // Delay AI move slightly for UX
      const aiTimeout = setTimeout(() => {
        const aiMove = computeAiMove(
          gameState.squares,
          aiMark,
          gameState.aiDifficulty
        );
        if (aiMove !== null) {
          makeMove(aiMove, aiMark);
        }
      }, 380);
      return () => clearTimeout(aiTimeout);
    }
    // eslint-disable-next-line
  }, [gameState.xIsNext, gameState.status, gameState.aiDifficulty]);

  // Mode change handler (resets game)
  function handleModeChange(newMode) {
    setGameState(getInitialGameState({ mode: newMode, aiDifficulty: gameState.aiDifficulty }));
    setHasSaved(!!loadGameState());
  }

  // Difficulty handler (resets if in single-player, else just updates AI)
  function handleDifficultyChange(newLevel) {
    if (gameState.mode === "single") {
      setGameState(getInitialGameState({ mode: "single", aiDifficulty: newLevel }));
    } else {
      setGameState((prev) => ({ ...prev, aiDifficulty: newLevel }));
    }
    setHasSaved(!!loadGameState());
  }

  // Restart resets state
  function handleRestart() {
    setGameState(getInitialGameState({ mode: gameState.mode, aiDifficulty: gameState.aiDifficulty }));
    clearGameState();
    setHasSaved(!!loadGameState());
  }

  function handleSave() {
    saveGameState(gameState);
    setHasSaved(true);
  }

  function handleLoad() {
    const saved = loadGameState();
    if (saved) {
      setGameState(saved);
      setHasSaved(true);
    }
  }

  // Save persistent state when game state changes, but only if savable
  useEffect(() => {
    if (isSavable) {
      saveGameState(gameState);
      setHasSaved(true);
    }
    // eslint-disable-next-line
  }, [gameState.squares, gameState.status]);

  // Begin new game on variant/difficulty switch

  // UI
  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: 0, paddingTop: 18, paddingBottom: 0 }}>
        <button
          className="theme-toggle"
          onClick={() =>
            setTheme((prevTheme) =>
              prevTheme === "light" ? "dark" : "light"
            )
          }
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <h1 style={{ marginTop: 8 }}>Tic Tac Toe</h1>
        <Status
          gameStatus={gameState.status}
          winner={gameState.winner}
          currentPlayer={gameState.xIsNext ? "X" : "O"}
          againstAI={againstAI}
          aiDifficulty={gameState.aiDifficulty}
        />
        <Board
          squares={gameState.squares}
          onSquareClick={handleSquareClick}
          isDisabled={
            gameState.status !== "playing" ||
            (againstAI && !gameState.xIsNext)
          }
        />
        <GameControls
          mode={gameState.mode}
          onModeChange={handleModeChange}
          aiDifficulty={gameState.aiDifficulty}
          onDifficultyChange={handleDifficultyChange}
          onRestart={handleRestart}
          onSave={handleSave}
          onLoad={handleLoad}
          isGameActive={gameState.status === "playing"}
          isSavable={isSavable}
          isLoadable={isLoadable}
        />
        <div style={{ marginTop: 18, fontSize: 12, opacity: 0.8 }}>
          <span>
            {backendHello
              ? "Backend connected."
              : "Connecting to backend..."}
          </span>
        </div>
      </header>
    </div>
  );
}

export default App;
