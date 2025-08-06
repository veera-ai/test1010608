import React from "react";
import Square from "./Square";
import "./Board.css";

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, isDisabled }) {
  /** 
   * This component renders the 3x3 Tic Tac Toe grid and calls onSquareClick with the index on user interaction.
   * Props:
   *   squares: Array of "X", "O", or null (length: 9)
   *   onSquareClick: function(idx) => void (called with clicked index)
   *   isDisabled: if true, disables further play
   */
  return (
    <div className="ttt-board">
      {squares.map((val, idx) => (
        <Square
          key={idx}
          value={val}
          onClick={() => (!isDisabled && !val) ? onSquareClick(idx) : undefined}
          isDisabled={isDisabled || !!val}
        />
      ))}
    </div>
  );
}

export default Board;
