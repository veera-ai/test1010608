import { saveGameState, loadGameState, clearGameState } from "./persistence";

const STORAGE_KEY = "ttt-game-state";

describe("persistence: localStorage", () => {
  let mockStorage = {};
  beforeEach(() => {
    mockStorage = {};
    jest.spyOn(window.localStorage.__proto__, "setItem").mockImplementation((key, val) => { mockStorage[key] = val; });
    jest.spyOn(window.localStorage.__proto__, "getItem").mockImplementation((key) => mockStorage[key] || null);
    jest.spyOn(window.localStorage.__proto__, "removeItem").mockImplementation((key) => { delete mockStorage[key]; });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("saveGameState stores as JSON", () => {
    expect(saveGameState({foo:"bar"})).toBe(true);
    expect(JSON.parse(mockStorage[STORAGE_KEY])).toEqual({foo:"bar"});
  });

  it("loadGameState restores from storage", () => {
    mockStorage[STORAGE_KEY] = JSON.stringify({check:123});
    expect(loadGameState()).toEqual({check:123});
  });

  it("clearGameState removes the key", () => {
    mockStorage[STORAGE_KEY] = "somedata";
    clearGameState();
    expect(mockStorage[STORAGE_KEY]).toBeUndefined();
  });

  it("returns false if saving throws", () => {
    jest.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => {throw new Error("fail")});
    expect(saveGameState({})).toBe(false);
  });

  it("returns null on bad JSON or missing key", () => {
    mockStorage[STORAGE_KEY] = "{bad json";
    expect(loadGameState()).toBeNull();
    delete mockStorage[STORAGE_KEY];
    expect(loadGameState()).toBeNull();
  });
});
