import * as readline from 'readline';

import { balancesService } from './services/balances';

const AVAILABLE_HOTKEYS_COMMANDS = 'Press "b" to see balance summary';

export function setupHotkeys(): readline.Interface {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(AVAILABLE_HOTKEYS_COMMANDS);

  rl.on('line', (input) => {
    const key = input.trim().toLowerCase();

    switch (key) {
      case 'b':
        balancesService.showBalanceSummary();
        break;

      default:
        console.log(AVAILABLE_HOTKEYS_COMMANDS);
        break;
    }
  });

  return rl;
}
