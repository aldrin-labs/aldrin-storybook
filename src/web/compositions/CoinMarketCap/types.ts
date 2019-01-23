/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface CoinMarketCapQueryQueryVariables {
  page?: number | null,
  perPage?: number | null,
}

export interface CoinMarketCapQueryQuery {
  assetPagination:  {
    // Information to aid in pagination.
    pageInfo:  {
      // Total number of pages
      pageCount: number | null,
      // When paginating forwards, are there more items?
      hasNextPage: boolean | null,
      // Current page number
      currentPage: number,
      // When paginating backwards, are there more items?
      hasPreviousPage: boolean | null,
      // Number of items per page
      perPage: number,
    },
    // Total object count.
    count: number | null,
    // Array of objects.
    items:  Array< {
      _id: string,
      name: string | null,
      symbol: string | null,
      priceUSD: string | null,
      maxSupply: number | null,
      totalSupply: number | null,
      availableSupply: number | null,
      percentChangeDay: string | null,
    } | null > | null,
  } | null,
}


export type CoinLink = {
  name: string
}
