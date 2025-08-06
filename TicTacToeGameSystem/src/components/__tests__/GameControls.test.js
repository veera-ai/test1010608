import React from "react";
import { render, fireEvent } from "@testing-library/react";
import GameControls from "../GameControls";

describe("GameControls component", () => {
  it("renders mode select and action buttons", () => {
    const props = {
      mode: "single",
      onModeChange: jest.fn(),
      aiDifficulty: "easy",
      onDifficultyChange: jest.fn(),
      onRestart: jest.fn(),
      onSave: jest.fn(),
      onLoad: jest.fn(),
      isGameActive: true,
      isSavable: true,
      isLoadable: true,
    };
    const { getByTestId, getByText } = render(<GameControls {...props} />);
    expect(getByTestId("mode")).toBeInTheDocument();
    expect(getByTestId("difficulty")).toBeInTheDocument();
    expect(getByTestId("restart")).toBeInTheDocument();
    expect(getByTestId("save")).toBeInTheDocument();
    expect(getByTestId("load")).toBeInTheDocument();
  });

  it("calls handler functions", () => {
    const handlers = {
      mode: jest.fn(), diff: jest.fn(), restart: jest.fn(), save: jest.fn(), load: jest.fn()
    };
    const props = {
      mode: "single",
      onModeChange: handlers.mode,
      aiDifficulty: "easy",
      onDifficultyChange: handlers.diff,
      onRestart: handlers.restart,
      onSave: handlers.save,
      onLoad: handlers.load,
      isGameActive: true, isSavable: true, isLoadable: true
    };
    const { getByTestId } = render(<GameControls {...props} />);
    fireEvent.change(getByTestId("mode"), { target: { value: "multi" } });
    fireEvent.change(getByTestId("difficulty"), { target: { value: "medium" } });
    fireEvent.click(getByTestId("restart"));
    fireEvent.click(getByTestId("save"));
    fireEvent.click(getByTestId("load"));
    expect(handlers.mode).toHaveBeenCalled();
    expect(handlers.diff).toHaveBeenCalled();
    expect(handlers.restart).toHaveBeenCalled();
    expect(handlers.save).toHaveBeenCalled();
    expect(handlers.load).toHaveBeenCalled();
  });
});
