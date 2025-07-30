export const MESSAGE_TYPES = {
  AUTHENTICATED: 'AUTHENTICATED',
  OPEN_ORDERS_UPDATE: 'OPEN_ORDERS_UPDATE',
  BALANCE_UPDATE: 'BALANCE_UPDATE',
  PONG: 'PONG',
  ORDER_PROCESSED: 'ORDER_PROCESSED',
  ORDER_STATUS_UPDATE: 'ORDER_STATUS_UPDATE',
  NEW_ACCOUNT_HISTORY_RECORD: 'NEW_ACCOUNT_HISTORY_RECORD',
  NEW_ACCOUNT_TRADE: 'NEW_ACCOUNT_TRADE',
} as const;

export type OrderSide = 'buy' | 'sell';

export type OrderType = 'market' | 'limit';

export type OrderStatusType = 'Placed' | 'Filled' | string;

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
  orderStatusType: OrderStatusType;
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
  transactionType: { type: 'LIMIT_BUY' | string; description: string };
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
  status: 'Placed' | string;
  updatedAt: string;
  timeInForce: 'GTC' | string;
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
  currency: BalanceUpdateData['currency'];
  referenceCurrency: string;
  totalInReference: string;
  availableInReference: string;
};

export type Balances = Record<string, Balance>;
