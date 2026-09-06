export interface TimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isExpired: boolean;
  isWarning: boolean; // e.g. under 5 minutes or 10%
}

export function initializeTimer(timeLimitMinutes: number): TimerState {
  const totalSeconds = Math.max(0, timeLimitMinutes * 60);
  return {
    totalSeconds,
    remainingSeconds: totalSeconds,
    isExpired: totalSeconds === 0,
    isWarning: false,
  };
}

export function tickTimer(current: TimerState, elapsedSeconds = 1): TimerState {
  if (current.isExpired) {
    return current;
  }
  const nextRemaining = Math.max(0, current.remainingSeconds - elapsedSeconds);
  const isExpired = nextRemaining <= 0;
  // Warning triggers when 5 minutes (300 seconds) or less remain, or under 10% of total
  const isWarning = !isExpired && (nextRemaining <= 300 || nextRemaining <= current.totalSeconds * 0.1);

  return {
    ...current,
    remainingSeconds: nextRemaining,
    isExpired,
    isWarning,
  };
}

export function formatTimeRemaining(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSecs = safeSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(remainingSecs)}`;
  }
  return `${pad(minutes)}:${pad(remainingSecs)}`;
}
