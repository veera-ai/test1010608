import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import App from "./App";

// Utility for async updates (AI/Effects)
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("TicTacToe App Integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders all main UI elements", () => {
    render(<App />);
    expect(screen.getByText("Tic Tac Toe")).toBeInTheDocument();
    expect(screen.getByTestId("mode")).toBeInTheDocument();
    expect(screen.getByTestId("restart")).toBeInTheDocument();
  });

  it("renders a 3x3 board", () => {
    render(<App />);
    const squares = screen.getAllByRole("button", { name: /square/i });
    expect(squares.length).toBe(9);
  });

  it("allows player move and updates status", () => {
    render(<App />);
    const squares = screen.getAllByRole("button", { name: /square/i });
    fireEvent.click(squares[0]);
    expect(squares[0]).toHaveTextContent("X");
    // Wait for AI move
    return wait(400).then(() => {
      const filled = squares.filter(
        (sq, i) => i !== 0 && (sq.textContent === "O" || sq.textContent === "X")
      );
      expect(filled.length).toBe(1); // AI played
    });
  });

  it("switches modes and disables AI", () => {
    render(<App />);
    const modeSelect = screen.getByTestId("mode");
    fireEvent.change(modeSelect, { target: { value: "multi" } });
    expect(modeSelect.value).toBe("multi");
    // Make two moves, X then O, alternating
    const squares = screen.getAllByRole("button", { name: /square/i });
    fireEvent.click(squares[0]);
    expect(squares[0].textContent).toBe("X");
    fireEvent.click(squares[1]);
    expect(squares[1].textContent).toBe("O");
  });

  it("detects win for X", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("mode"), { target: { value: "multi" } });
    const squares = screen.getAllByRole("button", { name: /square/i });
    // X 0 1 2
    // O X 4 5
    // O 7 X
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[3]); // O
    fireEvent.click(squares[4]); // X
    fireEvent.click(squares[6]); // O
    fireEvent.click(squares[8]); // X wins (diag)
    expect(screen.getByText(/winner:\s*X/i)).toBeInTheDocument();
  });

  it("detects draw state", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("mode"), { target: { value: "multi" } });
    const squares = screen.getAllByRole("button", { name: /square/i });
    // Board: X O X
    // X O O
    // O X X (no winners)
    const drawSeq = [0,1,2,3,4,6,5,8,7];
    drawSeq.forEach((idx, i) => {
      fireEvent.click(squares[idx]);
    });
    expect(screen.getByText(/draw/i)).toBeInTheDocument();
  });

  it("can change AI difficulty", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("difficulty"), { target: { value: "hard" } });
    expect(screen.getByTestId("difficulty").value).toBe("hard");
  });

  it("can restart, save, and load a game", async () => {
    render(<App />);
    const squares = screen.getAllByRole("button", { name: /square/i });
    fireEvent.click(squares[0]);
    fireEvent.click(screen.getByTestId("save"));
    expect(JSON.parse(window.localStorage.getItem("ttt-game-state")).squares[0]).toBe("X");

    fireEvent.click(screen.getByTestId("restart"));
    expect(squares[0]).toHaveTextContent("");
    fireEvent.click(screen.getByTestId("load"));
    expect(squares[0]).toHaveTextContent("X");
  });

  it("toggles theme mode", () => {
    render(<App />);
    const btn = screen.getByRole("button", { name: /switch to dark mode/i });
    fireEvent.click(btn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: /switch to light mode/i }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("shows backend connection message", async () => {
    render(<App />);
    expect(
      screen.getByText(/backend connected/i) || screen.getByText(/connecting to backend/i)
    ).toBeInTheDocument();
  });
});
