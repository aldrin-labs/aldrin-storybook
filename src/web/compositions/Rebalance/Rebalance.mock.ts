import { PoolInfo,  } from './Rebalance.types'

export const getPoolsInfoMockData: PoolInfo[] = [
    {
      // name: "SOL_SRM",
      name: 'SRM_SOL',
      swapToken: "57XV3PZWT75ftJy1jXW3uu8jgwYzgCjdhtSXLxP6rXbt",
      poolTokenMint: "6Vy3NcrwCsHG3fLHA7qhRhxmhVx3t3oou4ebK46gixQD",
      tokenA: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
      tokenB: "So11111111111111111111111111111111111111112",
      tvl: {
        tokenA: 100.0,
        tokenB: 15.0,
        USD: 1000.0,
      },
      totalFeesPaid: {
        tokenA: 1.0,
        tokenB: 2.0,
        USD: 10.0,
      },
      apy24h: 7.0,
    },
    {
      name: "FTT_USDT",
      // name: "USDT_FTT",
      swapToken: "57XV3PZWT75ftJy1jXW3uu8jgwYzgCjdhtSXLxP6rXbt",
      poolTokenMint: "6Vy3NcrwCsHG3fLHA7qhRhxmhVx3t3oou4ebK46gixQD",
      tokenA: "AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3",
      tokenB: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      tvl: {
        tokenA: 1000,
        tokenB: 32081,
        USD: 50000,
      },
      totalFeesPaid: {
        tokenA: 1.0,
        tokenB: 2.0,
        USD: 10.0,
      },
      apy24h: 17.0,
    },
    {
      name: "SRM_USDT",
      swapToken: "57XV3PZWT75ftJy1jXW3uu8jgwYzgCjdhtSXLxP6rXbt",
      poolTokenMint: "6Vy3NcrwCsHG3fLHA7qhRhxmhVx3t3oou4ebK46gixQD",
      tokenA: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
      tokenB: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      tvl: {
        tokenA: 10,
        tokenB: 43.53,
        USD: 5000,
      },
      totalFeesPaid: {
        tokenA: 1.0,
        tokenB: 2.0,
        USD: 10.0,
      },
      apy24h: 19.0,
    },
    {
        name: "8jZ...DaL_5FD...Fxq",
        swapToken: "57XV3PZWT75ftJy1jXW3uu8jgwYzgCjdhtSXLxP6rXbt",
        poolTokenMint: "6Vy3NcrwCsHG3fLHA7qhRhxmhVx3t3oou4ebK46gixQD",
        tokenA: "8jZjXuaNA3uBcAax77hnjyhaZwkssV2VNoMNW5JYcDaL",
        tokenB: "5FDj4Hk6iHbv5hxzqRs9zT6L7Hbu347HLpYyf1zZkFxq",
        tvl: {
          tokenA: 10,
          tokenB: 50,
          USD: 5000,
        },
        totalFeesPaid: {
          tokenA: 1.0,
          tokenB: 2.0,
          USD: 10.0,
        },
        apy24h: 19.0,
      },
      {
        name: "3a4...WNC_A9a...QK3",
        swapToken: "8XZsPr6CtBvxma58NMajgf4Qb3XAXmC1MW1A6afUcCwn",
        poolTokenMint: "GVsiAdsvgTnUi9yLHSsbexndnouoix34RRyBp2BFihrT",
        tokenA: "3a4a1SAFzKMHUFSRUggYoDa6g5FHUtgbPRwGTwHpqWNC",
        tokenB: "A9amk2EMh8UtGVfp9p5ft5WQCJWuWVK6dJatmvkoXQK3",
        tvl: {
          tokenA: 0.1,
          tokenB: 0.2,
          USD: 3,
        },
        totalFeesPaid: {
          tokenA: 1.0,
          tokenB: 2.0,
          USD: 10.0,
        },
        apy24h: 1.0,
      },
  ];

export const MOKED_MINTS_MAP = {
  '7YQoDmpwab7VcSzrzeM52aHg17NvyrbMQyQYw4ixzgvB': 'USDT',
  'GTq626sYQzZbkxQjsrsdiFn7Ef84R35cZ5iC2CaWQuTZ': 'SRM',
  '5EGUtk1uxJY9UXS7uFmD1vvFytG6UDG5CRPv5Y82X3Kj': 'FTT'
}
  