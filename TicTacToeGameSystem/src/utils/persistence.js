const STORAGE_KEY = "ttt-game-state";

// PUBLIC_INTERFACE
export function saveGameState(state) {
  /**
   * Saves the game state object into localStorage.
   */
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

// PUBLIC_INTERFACE
export function loadGameState() {
  /**
   * Loads the game state object or returns null.
   */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// PUBLIC_INTERFACE
export function clearGameState() {
  /**
   * Removes any stored game state.
   */
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch { }
}
