/**
 * Safe mobile haptic feedback utility
 */
export function triggerHaptic(duration = 12): void {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Ignore vibration errors on unsupported devices
    }
  }
}
