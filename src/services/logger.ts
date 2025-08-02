export const LOG_TYPES = {
  PING: 'PING',
  BALANCE_UPDATE: 'BALANCE_UPDATE',
  OPEN_ORDERS_UPDATE: 'OPEN_ORDERS_UPDATE',
  ORDER_STATUS_UPDATE: 'ORDER_STATUS_UPDATE',
  COUNTER_ORDER_PLACED: 'COUNTER_ORDER_PLACED',
  ERROR: 'ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export type LogType = (typeof LOG_TYPES)[keyof typeof LOG_TYPES];

export interface LogEntry {
  timestamp: Date;
  type: LogType;
  message: string;
  data?: object;
}

export class Logger {
  private logs: LogEntry[] = [];
  readonly MAX_LOGS = 1000;

  log({
    type,
    message,
    data,
    logToConsole = false,
  }: {
    type: LogType;
    message: string;
    data?: object;
    logToConsole?: boolean;
  }): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      type,
      message,
      data,
    };

    this.logs.push(entry);

    // Remove oldest logs if we exceed the limit
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    if (logToConsole) {
      this.showLog(entry);
    }
  }

  /**
   * Get recent logs (last N entries)
   */
  getRecentLogs({
    count = 50,
    logType,
  }: {
    count?: number;
    logType?: LogType;
  }): LogEntry[] {
    return this.logs
      .filter((log) => !logType || log.type === logType)
      .slice(-count);
  }

  /**
   * Display recent logs in the console
   */
  showRecentLogs({
    count = 20,
    showData = false,
    logType,
  }: {
    count?: number;
    showData?: boolean;
    logType?: LogType;
  }): void {
    const recentLogs = this.getRecentLogs({ count, logType });

    console.log('\n=== Recent Logs ===');
    if (recentLogs.length === 0) {
      console.log('No logs available');
    } else {
      recentLogs.forEach((log) => {
        this.showLog(log, showData);
      });
    }
    console.log('==================\n');
    if (!logType) {
      console.log(
        `Available Log Types: ${Object.values(LOG_TYPES).join(' | ')}`
      );
    }
  }

  showLog(log: LogEntry, showData = false) {
    const time = log.timestamp.toLocaleTimeString();
    console.log(`[${time}] ${log.type}: ${log.message}`);
    if (showData && log.data) {
      console.log(log.data);
    }
  }
}

// Export a singleton instance
export const loggingService = new Logger();
