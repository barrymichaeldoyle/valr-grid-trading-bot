import * as readline from 'readline';

import { balancesService } from './services/balances';
import { LOG_TYPES, loggingService, type LogType } from './services/logger';

const AVAILABLE_HOTKEYS_COMMANDS =
  'Press "b" to see balance summary, "l [type] [count] [verbose]" for most recent logs';

export function setupHotkeys(): readline.Interface {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(AVAILABLE_HOTKEYS_COMMANDS);

  rl.on('line', (input) => {
    const trimmedInput = input.trim();
    const parts = trimmedInput.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).map((arg) => arg.toLowerCase());

    switch (command) {
      case 'b':
        balancesService.showBalanceSummary();
        break;
      case 'l':
      case 'log':
      case 'logs': {
        const verbose = !!args.find((arg) => ['v', 'verbose'].includes(arg));
        const logType = args
          .find((arg) =>
            Object.values(LOG_TYPES).includes(arg.toUpperCase() as LogType)
          )
          ?.toUpperCase() as LogType | undefined;

        const count = args.find((arg) => !isNaN(Number(arg)))
          ? Number(args.find((arg) => !isNaN(Number(arg))))
          : 50;

        loggingService.showRecentLogs({
          count,
          logType,
          showData: verbose,
        });
        break;
      }
      default:
        console.log(AVAILABLE_HOTKEYS_COMMANDS);
        break;
    }
  });

  return rl;
}
