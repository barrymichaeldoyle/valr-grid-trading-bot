import { type Balance, type BalanceUpdateData, type Balances } from '../types';

class BalancesService {
  private balances: Balances = {};
  private lastUpdateTime: Date | null = null;

  /**
   * Update a balance from a balance update message
   */
  updateBalance(balanceData: BalanceUpdateData): void {
    // Calculate availableInReference based on the ratio of available to total
    const total = parseFloat(balanceData.total);
    const available = parseFloat(balanceData.available);
    const totalInReference = parseFloat(balanceData.totalInReference);

    let availableInReference = '0';
    if (total > 0) {
      const ratio = available / total;
      availableInReference = (totalInReference * ratio).toString();
    }

    const balance: Balance = {
      symbol: balanceData.currency.symbol,
      available: balanceData.available,
      reserved: balanceData.reserved,
      total: balanceData.total,
      updatedAt: balanceData.updatedAt,
      currency: balanceData.currency,
      referenceCurrency: balanceData.referenceCurrency,
      totalInReference: balanceData.totalInReference,
      availableInReference,
    };

    this.balances[balanceData.currency.symbol] = balance;
    this.lastUpdateTime = new Date();
  }

  /**
   * Get balances with non-zero available amounts
   */
  getNonZeroBalances(): Balances {
    return Object.fromEntries(
      Object.entries(this.balances).filter(([_, balance]) => {
        const available = parseFloat(balance.available);
        return available > 0;
      })
    );
  }

  /**
   * Get the number of balances stored
   */
  getBalanceCount(): number {
    return Object.keys(this.balances).length;
  }

  /**
   * Show a formatted balance summary in the console
   */
  showBalanceSummary(): void {
    const totalValue = this.getTotalPortfolioValueInUSDC();
    const availableValue = this.getAvailablePortfolioValueInUSDC();
    const nonZeroBalances = this.getNonZeroBalances();

    console.log('\n=== Portfolio Summary ===');
    console.log(
      `Total Portfolio Value:    ${totalValue.toFixed(2).padStart(8)} USDC`
    );
    console.log(
      `Available Portfolio Value:${availableValue.toFixed(2).padStart(8)} USDC`
    );
    console.log(
      `Reserved Value:           ${(totalValue - availableValue)
        .toFixed(2)
        .padStart(8)} USDC`
    );
    console.log('');

    if (Object.keys(nonZeroBalances).length > 0) {
      console.log('=== Individual Balances ===');

      // Convert to array and sort by USDC value (descending)
      const balancesArray = Object.entries(nonZeroBalances)
        .map(([symbol, balance]) => ({
          symbol,
          balance,
          usdcValue: parseFloat(balance.availableInReference || '0'),
        }))
        .filter((item) => item.usdcValue > 0)
        .sort((a, b) => b.usdcValue - a.usdcValue);

      balancesArray.forEach(({ symbol, balance, usdcValue }) => {
        console.log(
          `${symbol.padEnd(8)} ${balance.available.padStart(25)} | ${usdcValue
            .toFixed(2)
            .padStart(8)} USDC`
        );
      });
    } else {
      console.log('No balances with available funds');
    }

    console.log('========================\n');
  }

  /**
   * Get total portfolio value in USDC reference currency
   */
  getTotalPortfolioValueInUSDC(): number {
    let totalUSDC = 0;

    Object.values(this.balances).forEach((balance) => {
      if (balance.referenceCurrency === 'USDC') {
        const totalInReference = parseFloat(balance.totalInReference || '0');
        totalUSDC += totalInReference;
      }
    });

    return totalUSDC;
  }

  /**
   * Get total available portfolio value in USDC reference currency
   */
  getAvailablePortfolioValueInUSDC(): number {
    let totalUSDC = 0;

    Object.values(this.balances).forEach((balance) => {
      if (balance.referenceCurrency === 'USDC') {
        const availableInReference = parseFloat(
          balance.availableInReference || '0'
        );
        totalUSDC += availableInReference;
      }
    });

    return totalUSDC;
  }
}

// Export a singleton instance
export const balancesService = new BalancesService();
