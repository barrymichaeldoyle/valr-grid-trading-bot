import WebSocket from 'ws';

import { getAccountAuthHeaders } from './auth/getAuthHeaders';
import { setupHotkeys } from './hotkeys';
import { balancesService } from './services/balances';
import { pingService } from './services/ping';
import {
  type BalanceUpdateData,
  MESSAGE_TYPES,
  type OpenOrdersUpdateData,
} from './types';

const ws = new WebSocket('wss://api.valr.com/ws/account', {
  headers: getAccountAuthHeaders(),
});

const rl = setupHotkeys();

ws.on('open', () => {
  console.log('Connection opened');

  function pingCallback() {
    if (ws.readyState === WebSocket.OPEN) {
      const pingMessage = { type: 'PING' };
      ws.send(JSON.stringify(pingMessage));
      console.log('Ping sent');
    }
  }

  pingService.start(pingCallback);
});

ws.on('message', (rawMessage: Buffer) => {
  const message = JSON.parse(rawMessage.toString());

  switch (message.type) {
    case MESSAGE_TYPES.AUTHENTICATED:
    case MESSAGE_TYPES.PONG:
      break;
    case MESSAGE_TYPES.OPEN_ORDERS_UPDATE: {
      const data = message.data as OpenOrdersUpdateData;
      console.log('Open Orders Update', data);
      break;
    }
    case MESSAGE_TYPES.BALANCE_UPDATE: {
      const data = message.data as BalanceUpdateData;
      console.log(
        `Balance Update: ${data.currency.symbol} - ${data.available}`
      );

      // Update the balances service
      balancesService.updateBalance(data);

      // Log some useful information about our balances
      const nonZeroBalances = balancesService.getNonZeroBalances();
      console.log(
        `Total balances tracked: ${balancesService.getBalanceCount()}`
      );
      console.log(`Non-zero balances: ${Object.keys(nonZeroBalances).length}`);
      break;
    }
    default:
      console.log('Unknown message type', message);
  }
});

ws.on('error', (err: any) => {
  console.error('error', err);
  // handle error
});

ws.on('close', () => {
  console.log('Connection closed');
  pingService.stop();
  rl.close();
});
