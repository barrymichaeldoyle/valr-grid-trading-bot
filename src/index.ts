import WebSocket from 'ws';

import { getAccountAuthHeaders } from './auth/getAuthHeaders';
import { setupHotkeys } from './hotkeys';
import { balancesService } from './services/balances';
import { LOG_TYPES, loggingService } from './services/logger';
import { openOrdersService } from './services/openOrders';
import { pingService } from './services/ping';
import {
  type BalanceUpdateData,
  MESSAGE_TYPE,
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
      loggingService.log({
        type: LOG_TYPES.PING,
        message: 'Ping sent',
      });
      ws.send(JSON.stringify(pingMessage));
    }
  }

  pingService.start(pingCallback);
});

ws.on('message', (rawMessage: Buffer) => {
  const message = JSON.parse(rawMessage.toString());

  switch (message.type) {
    case MESSAGE_TYPE.AUTHENTICATED:
    case MESSAGE_TYPE.PONG:
    case MESSAGE_TYPE.NEW_ACCOUNT_HISTORY_RECORD:
    case MESSAGE_TYPE.NEW_ACCOUNT_TRADE:
    case MESSAGE_TYPE.ORDER_PROCESSED:
      break;
    case MESSAGE_TYPE.OPEN_ORDERS_UPDATE: {
      const data = message.data as OpenOrdersUpdateData;
      openOrdersService.updateOpenOrders(data);
      break;
    }
    case MESSAGE_TYPE.BALANCE_UPDATE: {
      const data = message.data as BalanceUpdateData;
      balancesService.updateBalance(data);
      break;
    }
    case MESSAGE_TYPE.ORDER_STATUS_UPDATE: {
      const data = message.data as OrderStatusUpdateData;
      handleOrderStatusUpdate(data);
      break;
    }

    default: {
      console.log('Unknown message type', message);
      loggingService.log({
        type: LOG_TYPES.UNKNOWN,
        message: 'Unknown message type',
        data: message,
      });
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
