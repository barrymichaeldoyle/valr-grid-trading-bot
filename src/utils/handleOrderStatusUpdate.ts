import Big from 'big.js';

import { getAuthHeaders } from '../auth/getAuthHeaders';
import { LOG_TYPES, loggingService } from '../services/logger';
import { type OrderStatusUpdateData } from '../types';

import { formatNumber } from './formatNumber';

const COUNTER_ORDER_PRICE_PERCENTAGE = new Big(0.0025); // 0.25%

const BASE_PATH = 'https://api.valr.com';
const LIMIT_ORDER_PATH = '/v1/orders/limit';

/**
 * Handles a processed order.
 * If the order was successful:
 * - Fetch Order Details,
 * - Create Counter Trade. i.e. if buy, sell higher, if sell, buy lower.
 *
 * @param processedOrderData
 */
export async function handleOrderStatusUpdate(
  orderStatusUpdateData: OrderStatusUpdateData
) {
  if (orderStatusUpdateData.orderStatusType === 'Filled') {
    loggingService.log({
      type: LOG_TYPES.ORDER_STATUS_UPDATE,
      message: 'Order Filled',
      data: orderStatusUpdateData,
    });

    const wasBuyOrder = orderStatusUpdateData.orderSide === 'buy';
    const counterOrderSide = wasBuyOrder ? 'SELL' : 'BUY';
    const counterOrderPrice = new Big(orderStatusUpdateData.executedPrice)
      .times(
        new Big(1)[wasBuyOrder ? 'plus' : 'minus'](
          COUNTER_ORDER_PRICE_PERCENTAGE
        )
      )
      .round(0)
      .toString();

    const counterOrderQuantity = new Big(
      orderStatusUpdateData.executedQuantity
    ).toString();

    const body = JSON.stringify({
      side: counterOrderSide,
      quantity: counterOrderQuantity,
      price: counterOrderPrice,
      pair: orderStatusUpdateData.currencyPair,
      postOnly: false,
      timeInForce: 'GTC',
      allowMargin: false,
    });

    const requestOptions = {
      method: 'POST',
      headers: getCounterOrderHeaders(body),
      body,
      redirect: 'follow' as const,
    };

    fetch(BASE_PATH + LIMIT_ORDER_PATH, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsedResult = JSON.parse(result);
        const usdtValue = new Big(counterOrderQuantity)
          .times(counterOrderPrice)
          .toString();

        loggingService.log({
          type: LOG_TYPES.COUNTER_ORDER_PLACED,
          message: `Counter ${counterOrderSide} ${counterOrderQuantity} ${
            orderStatusUpdateData.currencyPair
          } (${formatNumber(usdtValue)} USDT) at ${formatNumber(
            counterOrderPrice
          )}`,
          data: {
            ...parsedResult,
            orderDetails: {
              side: counterOrderSide,
              quantity: counterOrderQuantity,
              price: counterOrderPrice,
              usdtValue: usdtValue,
              currencyPair: orderStatusUpdateData.currencyPair,
              originalOrderSide: orderStatusUpdateData.orderSide,
              originalOrderPrice: orderStatusUpdateData.executedPrice,
              originalOrderQuantity: orderStatusUpdateData.executedQuantity,
            },
          },
          logToConsole: true,
        });
      })
      .catch((error) => {
        loggingService.log({
          type: LOG_TYPES.ERROR,
          message: 'Counter order placement failed',
          data: error,
        });
      });
  }
}

function getCounterOrderHeaders(body: string) {
  return {
    'Content-Type': 'application/json',
    ...getAuthHeaders(LIMIT_ORDER_PATH, body, 'POST'),
  };
}

/** Example order
 * data: {
    orderId: '01985b3b-448d-7f66-8150-ed1a43f30b22',
    success: true,
    failureReason: ''
  }
 */

/**
   * var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("X-VALR-API-KEY", "b9fb68df5485639d03c3171cf6e49b89e52fd78d5c313819b9c592b59c689f33");
myHeaders.append("X-VALR-SIGNATURE", "{{requestSignature}}");
myHeaders.append("X-VALR-TIMESTAMP", "{{requestTimestamp}}");

var raw = JSON.stringify({
  "side": "BUY",
  "quantity": "0.0001",
  "price": "93129",
  "pair": "BTCUSDT",
  "postOnly": false,
  "customerOrderId": "123",
  "timeInForce": "GTC",
  "allowMargin": "false"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.valr.com/v1/orders/limit", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
   */
