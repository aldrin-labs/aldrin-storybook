import gql from 'graphql-tag'

export const HomeQuery = gql`
  query HomeQuery($page: Int, $perPage: Int) {
    assetPagination(page: $page, perPage: $perPage) {
      pageInfo {
        pageCount
        hasNextPage
        currentPage
        hasPreviousPage
        perPage
      }
      count
      items {
        _id
        name
        symbol
        priceUSD
        maxSupply
        totalSupply
        availableSupply
        priceBTC
        percentChangeDay
      }
    }
  }
`
