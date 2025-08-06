import React from "react";
import { render } from "@testing-library/react";
import Status from "../Status";

describe("Status component", () => {
  it("shows winner message", () => {
    const { getByText } = render(<Status gameStatus="won" winner="X" />);
    expect(getByText(/winner:\s*X/i)).toBeInTheDocument();
  });
  it("shows draw message", () => {
    const { getByText } = render(<Status gameStatus="draw" />);
    expect(getByText(/draw/i)).toBeInTheDocument();
  });
  it("shows correct turn and details", () => {
    const { getByText } = render(<Status gameStatus="playing" winner={null} currentPlayer="O" againstAI={true} aiDifficulty="hard" />);
    expect(getByText(/turn/i)).toBeInTheDocument();
    expect(getByText(/AI/i)).toBeInTheDocument();
    expect(getByText(/Hard AI/)).toBeInTheDocument();
  });
});
