import crypto from 'crypto';

import { config } from '../config';

function signRequest(
  timestamp: number,
  method: string,
  path: string,
  body = ''
) {
  return crypto
    .createHmac('sha512', config.valrApiSecret)
    .update(timestamp.toString())
    .update(method)
    .update(path)
    .update(body)
    .digest('hex');
}

export function getAuthHeaders(
  path: string,
  body = '',
  method = 'GET'
): Record<string, string | number> {
  const timestamp = new Date().getTime();
  const signature = signRequest(timestamp, method, path, body);
  return {
    'X-VALR-API-KEY': config.valrApiKey,
    'X-VALR-SIGNATURE': signature,
    'X-VALR-TIMESTAMP': timestamp,
  };
}

export function getAccountAuthHeaders() {
  return getAuthHeaders('/ws/account');
}
