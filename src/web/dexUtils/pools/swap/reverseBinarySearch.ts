interface ReverseBinarySearchParams {
  userAmountTokenA: number;
  userAmountTokenB: number;
  poolAmountTokenA: number;
  poolAmountTokenB: number;
}

const reverseBinarySearch = (params: ReverseBinarySearchParams) => {
  const {
    userAmountTokenA,
    userAmountTokenB,
    poolAmountTokenA,
    poolAmountTokenB
  } = params

  const poolRatioForTokenA = poolAmountTokenA / poolAmountTokenB

  // determine which user amount is bigger using pool ratio
  const userAmountTokenAInTokenB = poolRatioForTokenA * userAmountTokenA
  const userAmountsDiffInTokenB = userAmountTokenAInTokenB - userAmountTokenB
  const tokenToSwap = userAmountsDiffInTokenB > 0 ? 'tokenA' : 'tokenB'

  // determine amount part which will be added every time we need to find side
  // const 

  // determine min and max amount to swap
  // determine half of amount to swap
  // determine pool ration with swapped amounts

  // check is new ratio close enough to ratio of user tokenA/B after swap, return if true

  // determine side we need to move to continue searching
  // change max to half value
}