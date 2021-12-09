export const calculateUtilizationRate = (totalBorrowedLiq: number, totalDepositedLiq: number) => {
    return totalBorrowedLiq/totalDepositedLiq;
}

export const calculateBorrowApy = (
    utilizationRate: number,
    optimalUtilizationRate: number,
    optimalBorrowRate: number,
    minBorrowRate: number,
    maxBorrowRate: number
) => {
    console.log({utilizationRate, optimalUtilizationRate, optimalBorrowRate, minBorrowRate, maxBorrowRate});
    let depositApy = 0;
    if(utilizationRate < optimalUtilizationRate) {
        depositApy = (utilizationRate/optimalUtilizationRate) * (optimalBorrowRate - minBorrowRate) + minBorrowRate;
    } else {
        depositApy = ((utilizationRate - optimalUtilizationRate)/(1 - optimalUtilizationRate)) * (maxBorrowRate - optimalBorrowRate) + optimalBorrowRate
    }

    return depositApy;
}
