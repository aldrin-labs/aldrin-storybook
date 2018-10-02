import {
  removeEditableModeInCoins,
  calculateTableTotal,
  calculateTotalPercents,
  calculateTotal,
  calculateMoneyPart,
} from './PortfolioRebalanceUtils'

// Function that remove edit prop in our rows of Coins on Rebalance tab.
// This function used to define, should I delete row or just sell all values in the row

describe('Function removeEditableModeInCoins', () => {
  const rowExample = {
    exchange: 'Exchange',
    symbol: 'Coin',
    portfolioPerc: 0.0,
    deltaPrice: 0,
    price: 0,
  }

  const rows = Array(3).fill(rowExample)
  const rowsEditable = Array(3).fill({ ...rowExample, editable: true })

  it('is array passed as a result', () => {
    expect(removeEditableModeInCoins(rows)).toBeInstanceOf(Array)
  })
  it('is object in array has right IRow type properties', () => {
    expect(removeEditableModeInCoins(rows)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exchange: expect.any(String),
          symbol: expect.any(String),
          portfolioPerc: expect.any(Number),
          deltaPrice: expect.any(Number),
          price: expect.any(Number),
        }),
      ])
    )
  })
  it('is object in array has right IRow type properties in editable', () => {
    expect(removeEditableModeInCoins(rowsEditable)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exchange: expect.any(String),
          symbol: expect.any(String),
          portfolioPerc: expect.any(Number),
          deltaPrice: expect.any(Number),
          price: expect.any(Number),
          editable: expect.any(Boolean),
        }),
      ])
    )
  })
  it('when we have row without editable prop', () => {
    expect(removeEditableModeInCoins(rows)).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          editable: false,
        }),
      ])
    )
  })
  it('when we have editable row', () => {
    expect(removeEditableModeInCoins(rowsEditable)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          editable: false,
        }),
      ])
    )
  })
})

describe('Function calculateTableTotal ', () => {
  const rowExample = {
    exchange: 'Exchange',
    symbol: 'Coin',
    portfolioPerc: 0.0,
    deltaPrice: 0,
    price: 10,
  }
  const rows = Array(3).fill(rowExample)

  it('the result should be String-type', () => {
    expect(typeof calculateTableTotal(rows)).toBe('string')
  })
  it('should summarize', () => {
    expect(+calculateTableTotal(rows)).toBe(30)
  })
  it('should summarize and round for 2 digits after point', () => {
    expect(calculateTableTotal(rows)).toBe('30.00')
  })
})

describe('Function calculateTotalPercents', () => {
  const rowExample = {
    exchange: 'Exchange',
    symbol: 'Coin',
    portfolioPerc: 23.332,
    deltaPrice: 0,
    price: 0,
  }
  const rows = Array(3).fill(rowExample)

  it('the result should be String-type', () => {
    expect(typeof calculateTotalPercents(rows)).toBe('string')
  })
  it('should summarize', () => {
    expect(+calculateTotalPercents(rows)).toBe(69.996)
  })
  it('should summarize and round for 3 digits after point', () => {
    expect(calculateTotalPercents(rows)).toBe('69.996')
  })
})

describe('Function calculateTotal', () => {
  const rowExample = {
    exchange: 'Exchange',
    symbol: 'Coin',
    portfolioPerc: 0.0,
    deltaPrice: 0,
    price: 180,
  }
  const rows = Array(3).fill(rowExample)
  const undistributedMoney = '-12999'

  it('the result should be String-type', () => {
    expect(typeof calculateTotal(rows, undistributedMoney)).toBe('string')
  })
  it('should summarize', () => {
    expect(+calculateTotal(rows, undistributedMoney)).toBe(-12459.00)
  })
  it('should summarize and round for 2 digits after point', () => {
    expect(calculateTotal(rows, undistributedMoney)).toBe('-12459.00')
  })

})

describe('Function calculateMoneyPart', () => {
  it('should return an array', () => {
    expect(Array.isArray(calculateMoneyPart(111, 2))).toBe(true)
  })
  it('shoul return array length two when we pass 2 as numberOfCoins argument', () => {
    expect(calculateMoneyPart(100, 2)).toHaveLength(2)
  })
  it('should return an array of numbers', () => {
    expect(calculateMoneyPart(111, 2))
      .toEqual(expect.arrayContaining([expect.any(Number), expect.any(Number) ]))
  })
  it('should return array of two numbers: [55.5, 55.5] when we pass 111 and 2', () => {
    expect(calculateMoneyPart(111, 2))
      .toEqual(expect.arrayContaining([55.5, 55.5]))
  })
  it('should return array of two numbers: [0.33, 0.34] when we pass 0.67 and 2', () => {
    expect(calculateMoneyPart(0.67, 2))
      .toEqual(expect.arrayContaining([0.33, 0.34]))
  })
  it('should return array of two numbers: [0.05, 0.05] when we pass 0.1 and 2', () => {
    expect(calculateMoneyPart(0.1, 2))
      .toEqual(expect.arrayContaining([0.05, 0.05]))
  })
  it('should return array of three numbers: [0.33, 0.33, 0.34] when we pass 1 and 3', () => {
    expect(calculateMoneyPart(1, 3))
      .toEqual(expect.arrayContaining([0.33, 0.33, 0.34]))
  })
  it('should return array of four numbers: [0.25, 0.25, 0.25, 0.25] when we pass 1 and 4', () => {
    expect(calculateMoneyPart(1, 4))
      .toEqual(expect.arrayContaining([0.25, 0.25, 0.25, 0.25]))
  })
  it('should return array of four numbers: [0.88, 0.88, 0.88, 0.9] when we pass 3.54 and 4', () => {
    expect(calculateMoneyPart(3.54, 4))
      .toEqual(expect.arrayContaining([0.88, 0.88, 0.88, 0.9]))
  })
  it('should return array of four numbers: [0.22, 0.22, 0.22, 0.24] when we pass 0.9 and 4', () => {
    expect(calculateMoneyPart(0.9, 4))
      .toEqual(expect.arrayContaining([0.22, 0.22, 0.22, 0.24]))
  })
  it('should return array of ten numbers: [1,1,1,1,1,1,1,1,1,1] when we pass 10 and 10', () => {
    expect(calculateMoneyPart(10, 10))
      .toEqual(expect.arrayContaining([1,1,1,1,1,1,1,1,1,1]))
  })
})

// console.log(DistributeToMany(111, 2), 'right: [55.5, 55.5]');
// console.log(DistributeToMany(0.67, 2), 'right: [0.33, 0.34]');
// console.log(DistributeToMany(0.1, 2), 'right: [0.05, 0.05]');
// console.log(DistributeToMany(1, 2), 'right: [0.5, 0.5]');
// console.log(DistributeToMany(1, 3), 'right: [0.33, 0.33, 0.34]');
// console.log(DistributeToMany(1, 4), 'right: [0.25, 0.25, 0.25, 0.25]');
// console.log(DistributeToMany(3.54, 4), 'right: [0.25, 0.25, 0.25, 0.25]');
// console.log(DistributeToMany(0.9, 4), 'right: [0.25, 0.25, 0.25, 0.25]');
// console.log(DistributeToMany(10, 10), 'right: [1,1,1,1,1,1,1,1,1,1]');
