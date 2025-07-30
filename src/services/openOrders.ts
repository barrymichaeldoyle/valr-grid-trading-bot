import { type OpenOrdersUpdateData } from '../types';

import { LOG_TYPES, loggingService } from './logger';

class OpenOrdersService {
  private openOrders: OpenOrdersUpdateData = [];

  updateOpenOrders(openOrders: OpenOrdersUpdateData) {
    this.openOrders = openOrders;
    loggingService.log(
      LOG_TYPES.OPEN_ORDERS_UPDATE,
      `Open Orders Update - ${openOrders.length} orders`,
      openOrders
    );
  }

  showOpenOrders() {
    console.log('Open Orders');
    console.log(this.openOrders);
  }
}

export const openOrdersService = new OpenOrdersService();
