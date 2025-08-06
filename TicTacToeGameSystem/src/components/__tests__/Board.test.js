import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Board from "../Board";

describe("Board component", () => {
  it("renders a grid of squares", () => {
    const { getAllByRole } = render(<Board squares={Array(9).fill(null)} onSquareClick={()=>{}} isDisabled={false} />);
    const buttons = getAllByRole("button", { name: /square/i });
    expect(buttons).toHaveLength(9);
  });
  it("calls onSquareClick for valid move", () => {
    const onSquareClick = jest.fn();
    const { getAllByRole } = render(<Board squares={Array(9).fill(null)} onSquareClick={onSquareClick} isDisabled={false} />);
    const squares = getAllByRole("button", { name: /square/i });
    fireEvent.click(squares[4]);
    expect(onSquareClick).toHaveBeenCalledWith(4);
  });
  it("does not call onSquareClick if disabled", () => {
    const onSquareClick = jest.fn();
    const { getAllByRole } = render(<Board squares={Array(9).fill(null)} onSquareClick={onSquareClick} isDisabled={true} />);
    const squares = getAllByRole("button", { name: /square/i });
    fireEvent.click(squares[2]);
    expect(onSquareClick).not.toHaveBeenCalled();
  });
});
