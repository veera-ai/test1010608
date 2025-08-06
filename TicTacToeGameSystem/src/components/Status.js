import React from "react";

// PUBLIC_INTERFACE
function Status({ gameStatus, winner, currentPlayer, againstAI, aiDifficulty }) {
  /**
   * Status information for the user (whose turn, if game over).
   * Props:
   *   gameStatus: "playing" | "won" | "draw"
   *   winner: "X" | "O" | null
   *   currentPlayer: "X" | "O"
   *   againstAI: boolean
   *   aiDifficulty: "easy" | "medium" | "hard"
   */
  if (gameStatus === "won") {
    return (
      <div className="ttt-status">
        <span className="ttt-winner">Winner: {winner}</span>
      </div>
    );
  }
  if (gameStatus === "draw") {
    return (
      <div className="ttt-status">
        <span className="ttt-draw">It's a draw!</span>
      </div>
    );
  }
  return (
    <div className="ttt-status">
      <span>
        Turn:{" "}
        <span className="ttt-turn">{currentPlayer}</span>
        {againstAI ? (
          <span className="ttt-aidifficulty">
            {" "}({currentPlayer === "O" ? "AI" : "You"}{", " + aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)} AI)
          </span>
        ) : null}
      </span>
    </div>
  );
}

export default Status;
