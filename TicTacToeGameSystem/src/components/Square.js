import React from "react";
import "./Square.css";

// PUBLIC_INTERFACE
function Square({ value, onClick, isDisabled }) {
  /**
   * One cell of the Board. Handles user click and passed display.
   * Props:
   *   value: "X" | "O" | null
   *   onClick: () => void
   *   isDisabled: boolean
   */
  return (
    <button className="ttt-square" onClick={onClick} disabled={isDisabled} aria-label={`Square: ${value || "empty"}`}>
      {value}
    </button>
  );
}

export default Square;
