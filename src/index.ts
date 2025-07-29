import WebSocket from 'ws';

import { getAccountAuthHeaders } from './auth/getAuthHeaders';

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

ws.on('message', (data: any) => {
  console.log('message', data);
  // work with data
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
