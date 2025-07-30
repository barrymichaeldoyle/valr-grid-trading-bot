import WebSocket from 'ws';

import { getAccountAuthHeaders } from './auth/getAuthHeaders';
import { setupHotkeys } from './hotkeys';
import { balancesService } from './services/balances';
import { LOG_TYPES, loggingService } from './services/logger';
import { openOrdersService } from './services/openOrders';
import { pingService } from './services/ping';
import {
  type BalanceUpdateData,
  MESSAGE_TYPES,
  type OpenOrdersUpdateData,
  type OrderStatusUpdateData,
} from './types';
import { handleOrderStatusUpdate } from './utils/handleOrderStatusUpdate';

const ws = new WebSocket('wss://api.valr.com/ws/account', {
  headers: getAccountAuthHeaders(),
});

const rl = setupHotkeys();

ws.on('open', () => {
  console.log('Connection opened');

  function pingCallback() {
    if (ws.readyState === WebSocket.OPEN) {
      const pingMessage = { type: 'PING' };
      loggingService.log(LOG_TYPES.PING, 'Ping sent');
      ws.send(JSON.stringify(pingMessage));
    }
  }

  pingService.start(pingCallback);
});

ws.on('message', (rawMessage: Buffer) => {
  const message = JSON.parse(rawMessage.toString());

  switch (message.type) {
    case MESSAGE_TYPES.AUTHENTICATED:
    case MESSAGE_TYPES.PONG:
    case MESSAGE_TYPES.NEW_ACCOUNT_HISTORY_RECORD:
    case MESSAGE_TYPES.NEW_ACCOUNT_TRADE:
    case MESSAGE_TYPES.ORDER_PROCESSED:
      break;
    case MESSAGE_TYPES.OPEN_ORDERS_UPDATE: {
      const data = message.data as OpenOrdersUpdateData;
      openOrdersService.updateOpenOrders(data);
      break;
    }
    case MESSAGE_TYPES.BALANCE_UPDATE: {
      const data = message.data as BalanceUpdateData;
      balancesService.updateBalance(data);
      break;
    }
    case MESSAGE_TYPES.ORDER_STATUS_UPDATE: {
      const data = message.data as OrderStatusUpdateData;
      handleOrderStatusUpdate(data);
      break;
    }

    default: {
      console.log('Unknown message type', message);
      loggingService.log(LOG_TYPES.UNKNOWN, 'Unknown message type', message);
    }
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
