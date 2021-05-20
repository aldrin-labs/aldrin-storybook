export type PoolInfo = {
  name: string,
  tokenA: string,
  tokenB: string,
  tvl: {
      tokenA: number,
      tokenB: number,
      USD: number,
  },
  totalFeesPaid: {
      tokenA: number,
      tokenB: number,
      USD: number,
  },
  apy24h: number, // %
};

export type FeesEarned = {
  pool: string, // an address of pool or 'all'
  earnedUSD: number,
};
