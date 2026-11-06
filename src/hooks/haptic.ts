/** Vibrazione breve, se supportata. */
export function tap(ms = 10) {
  try { navigator.vibrate?.(ms) } catch { /* ignora */ }
}
