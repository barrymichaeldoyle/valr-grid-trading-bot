export const MESSAGE_TYPES = {
  AUTHENTICATED: 'AUTHENTICATED',
  OPEN_ORDERS_UPDATE: 'OPEN_ORDERS_UPDATE',
  BALANCE_UPDATE: 'BALANCE_UPDATE',
  PONG: 'PONG',
} as const;

export type OpenOrdersUpdateData = unknown[];

export type BalanceUpdateData = {
  currency: {
    symbol: string;
    decimalPlaces: number;
    isActive: boolean;
    shortName: string;
    longName: string;
    supportedWithdrawDecimalPlaces: number;
    collateral: boolean;
    collateralWeigth: string;
  };
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
