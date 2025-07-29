import crypto from 'crypto';

import { config } from '../config';

function signRequest(timestamp: number, path: string, body = '') {
  return crypto
    .createHmac('sha512', config.valrApiSecret)
    .update(timestamp.toString())
    .update('GET')
    .update(path)
    .update(body)
    .digest('hex');
}

function getAuthHeaders(path: string): Record<string, string | number> {
  const timestamp = new Date().getTime();
  const signature = signRequest(timestamp, path, '');
  return {
    'X-VALR-API-KEY': config.valrApiKey,
    'X-VALR-SIGNATURE': signature,
    'X-VALR-TIMESTAMP': timestamp,
  };
}

export function getAccountAuthHeaders() {
  return getAuthHeaders('/ws/account');
}
