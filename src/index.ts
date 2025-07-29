import WebSocket from 'ws';

import { getAccountAuthHeaders } from './auth/getAuthHeaders';
import {
  type BalanceUpdateData,
  MESSAGE_TYPES,
  type OpenOrdersUpdateData,
} from './types';

console.log('VALR Grid Trading Bot starting up...');

const ws = new WebSocket('wss://api.valr.com/ws/account', {
  headers: getAccountAuthHeaders(),
});

let pingInterval: ReturnType<typeof setInterval> | null = null;

ws.on('open', () => {
  console.log('Connection opened');

  pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const pingMessage = {
        type: 'PING',
      };
      ws.send(JSON.stringify(pingMessage));
      console.log('Ping sent');
    }
  }, 30_000);
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
  // Clean up ping interval
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  // reconnect if needed
});
