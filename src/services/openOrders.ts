import { type OpenOrdersUpdateData } from '../types';
import { formatNumber } from '../utils/formatNumber';

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
    console.log('Open Orders:');
    if (this.openOrders.length === 0) {
      console.log('No open orders');
      return;
    }

    // Group orders by currency pair
    const groupedOrders = this.openOrders.reduce((groups, order) => {
      const pair = order.currencyPair;
      if (!groups[pair]) {
        groups[pair] = [];
      }
      groups[pair].push(order);
      return groups;
    }, {} as Record<string, typeof this.openOrders>);

    // Sort and display each group
    Object.entries(groupedOrders).forEach(([currencyPair, orders]) => {
      console.log(`\n${currencyPair}:`);

      // Sort by price (ascending)
      const sortedOrders = orders.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      );

      // Find max lengths for padding
      const maxSideLength = Math.max(...sortedOrders.map((o) => o.side.length));
      const maxQuantityLength = Math.max(
        ...sortedOrders.map((o) => formatNumber(o.quantity).length)
      );
      const maxPriceLength = Math.max(
        ...sortedOrders.map((o) => formatNumber(o.price).length)
      );

      sortedOrders.forEach((order) => {
        const side = order.side.toUpperCase().padEnd(maxSideLength);
        const quantity = formatNumber(order.quantity).padStart(
          maxQuantityLength
        );
        const price = formatNumber(order.price).padStart(maxPriceLength);

        console.log(`  ${side}: ${quantity}, Price: ${price}`);
      });
    });
  }
}

export const openOrdersService = new OpenOrdersService();
