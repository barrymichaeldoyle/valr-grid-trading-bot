export const MESSAGE_TYPE = {
  AUTHENTICATED: 'AUTHENTICATED',
  OPEN_ORDERS_UPDATE: 'OPEN_ORDERS_UPDATE',
  BALANCE_UPDATE: 'BALANCE_UPDATE',
  PONG: 'PONG',
  ORDER_PROCESSED: 'ORDER_PROCESSED',
  ORDER_STATUS_UPDATE: 'ORDER_STATUS_UPDATE',
  NEW_ACCOUNT_HISTORY_RECORD: 'NEW_ACCOUNT_HISTORY_RECORD',
  NEW_ACCOUNT_TRADE: 'NEW_ACCOUNT_TRADE',
} as const;
export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

export const ORDER_SIDE = {
  BUY: 'buy',
  SELL: 'sell',
} as const;
export type OrderSide = (typeof ORDER_SIDE)[keyof typeof ORDER_SIDE];

export const ORDER_TYPE = {
  MARKET: 'market',
  LIMIT: 'limit',
} as const;
export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];

export const ORDER_STATUS = {
  PLACED: 'Placed',
  FILLED: 'Filled',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const TIME_IN_FORCE = {
  /**
   * Good Till Canceled
   */
  GTC: 'GTC',
  /**
   * Immediate or Cancel
   */
  IOC: 'IOC',
  /**
   * Fill or Kill
   */
  FOK: 'FOK',
} as const;
export type TimeInForce = (typeof TIME_IN_FORCE)[keyof typeof TIME_IN_FORCE];

export const TRANSACTION_TYPE = {
  LIMIT_BUY: 'LIMIT_BUY',
  LIMIT_SELL: 'LIMIT_SELL',
} as const;
export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export type OrderProcessedData = {
  orderId: string;
  success: boolean;
  failureReason: string;
};

export type Currency = {
  symbol: string;
  decimalPlaces: number;
  isActive: boolean;
  shortName: string;
  longName: string;
  supportedWithdrawDecimalPlaces: number;
  collateral: boolean;
  collateralWeigth: string;
};

export type OrderStatusUpdateData = {
  orderId: string;
  orderStatusType: OrderStatus;
  currencyPair: string;
  originalPrice: string;
  remainingQuantity: string;
  originalQuantity: string;
  orderSide: OrderSide;
  orderType: OrderType;
  failedReason: string;
  orderUpdatedAt: string;
  orderCreatedAt: string;
  executedPrice: string;
  executedQuantity: string;
  executedFee: string;
  timeInForce: string;
};

export type NewAccountTrade = {
  price: string;
  quantity: string;
  currencyPair: string;
  tradedAt: string;
  side: OrderSide;
  orderId: string;
  id: string;
  fee: string;
  feeCurrency: Currency;
};

export type NewAccountHistoryRecord = {
  transactionType: { type: TransactionType; description: string };
  debitCurrency: Currency;
  debitValue: string;
  creditCurrency: Currency;
  feeCurrency: Currency;
  feeValue: string;
  eventAt: string;
  additionalInfo: {
    costPerCoin: number;
    costPerCoinSymbol: string;
    currencyPair: string;
    orderId: string;
  };
  id: string;
};

export type OpenOrdersUpdateData = {
  orderId: string;
  side: OrderSide;
  quantity: string;
  price: string;
  currencyPair: string;
  createdAt: string;
  originalQuantity: string;
  filledPercentage: string;
  type: OrderType;
  status: OrderStatus;
  updatedAt: string;
  timeInForce: TimeInForce;
  allowMargin: boolean;
}[];

export type BalanceUpdateData = {
  currency: Currency;
  available: string;
  reserved: string;
  total: string;
  updatedAt: string;
  lendReserved: string;
  borrowCollateralReserved: string;
  borrowedAmount: string;
  totalInReference: string;
  totalInReferenceWeighted: string;
  referenceCurrency: string;
};

export type Balance = {
  symbol: string;
  available: string;
  reserved: string;
  total: string;
  updatedAt: string;
  currency: Currency;
  referenceCurrency: string;
  totalInReference: string;
  availableInReference: string;
};

export type Balances = Record<string, Balance>;
