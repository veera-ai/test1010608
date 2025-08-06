import React from "react";

// PUBLIC_INTERFACE
function GameControls({
  mode,
  onModeChange,
  aiDifficulty,
  onDifficultyChange,
  onRestart,
  onSave,
  onLoad,
  isGameActive,
  isSavable,
  isLoadable,
}) {
  /**
   * Game action controls, including mode and difficulty selectors.
   * Props:
   *   mode: "single" | "multi"
   *   onModeChange: function(newMode)
   *   aiDifficulty: "easy" | "medium" | "hard"
   *   onDifficultyChange: function(newLevel)
   *   onRestart: function()
   *   onSave: function()
   *   onLoad: function()
   *   isGameActive: boolean
   *   isSavable: boolean
   *   isLoadable: boolean
   */
  return (
    <div className="ttt-controls">
      <div className="ttt-mode">
        Mode:&nbsp;
        <select
          data-testid="mode"
          value={mode}
          disabled={!isGameActive}
          onChange={e => onModeChange(e.target.value)}
        >
          <option value="single">Single Player (vs AI)</option>
          <option value="multi">Two Players (local)</option>
        </select>
      </div>
      {mode === "single" && (
        <div className="ttt-ai-difficulty">
          AI Difficulty:&nbsp;
          <select
            data-testid="difficulty"
            value={aiDifficulty}
            disabled={!isGameActive}
            onChange={e => onDifficultyChange(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}
      <div className="ttt-action-buttons">
        <button onClick={onRestart} data-testid="restart">
          {isGameActive ? "Restart Game" : "New Game"}
        </button>
        <button
          onClick={onSave}
          disabled={!isSavable}
          data-testid="save"
        >
          Save
        </button>
        <button onClick={onLoad} disabled={!isLoadable} data-testid="load">
          Load
        </button>
      </div>
    </div>
  );
}

export default GameControls;
