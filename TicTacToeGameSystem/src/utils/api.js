// PUBLIC_INTERFACE
export async function fetchBackendHello() {
  /**
   * Example function to test backend integration. Replace with real Tic Tac Toe API call as needed.
   */
  try {
    const resp = await fetch("/api/hello"); // Replace with real endpoint
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}
