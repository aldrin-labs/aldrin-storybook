function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export const getFakeDepthChartData = () => {
  /* tslint:disable */
  const orderBookFakeData = []
  for (let index = 1; index < 101; index++) {
    orderBookFakeData.push({
      price: getRandomArbitrary(index * 100 - 2, index * 100),
      size: getRandomArbitrary(100 - index - 1, 100 - index),
      percentageOfChange: 23,
    })
  }

  const usdSpreadFakeData = []
  for (let index = 100; index < 201; index++) {
    usdSpreadFakeData.push({
      price: getRandomArbitrary((300 - index) * 100 - 1, (300 - index) * 100),
      size: getRandomArbitrary(200 - index - 1, 200 - index),
      percentageOfChange: 23,
    })
  }
  /* tslint:enable */

  return { usdSpreadFakeData, orderBookFakeData }
}

export const orders = []

export const orderBook = []
