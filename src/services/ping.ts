export class PingService {
  private interval: ReturnType<typeof setInterval> | null = null;
  private pingCallback: (() => void) | null = null;

  start(pingCallback: () => void, intervalMs: number = 30_000): void {
    this.pingCallback = pingCallback;
    this.interval = setInterval(() => {
      this.pingCallback?.();
    }, intervalMs);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.pingCallback = null;
  }

  isRunning(): boolean {
    return this.interval !== null;
  }
}

// Export a singleton instance
export const pingService = new PingService();
