import _ from 'lodash'

export const basic = {
  staticRows: [
    {
      "x": "LTC",
      "y": 0.11
    },
    {
      "x": "ETH",
      "y": 0.11
    },
    {
      "x": "EOS",
      "y": 0.1
    },
    {
      "x": "BCH",
      "y": 0
    },
    {
      "x": "TRX",
      "y": 0.08
    },
    {
      "x": "DASH",
      "y": 0.06
    },
    {
      "x": "ADA",
      "y": 0.02
    },
    {
      "x": "XLM",
      "y": 0.04
    },
    {
      "x": "BTC",
      "y": 0
    },
    {
      "x": "ETH",
      "y": 99.49
    },
    {
      "x": "GSE",
      "y": 0
    },
    {
      "x": "DEC",
      "y": 0
    },
    {
      "x": "PMOD",
      "y": 0
    }
  ],
  rows: [
    {
      "x": "LTC",
      "y": 0.1
    },
    {
      "x": "ETH",
      "y": 0.11
    },
    {
      "x": "EOS",
      "y": 0.1
    },
    {
      "x": "BCH",
      "y": 1.26
    },
    {
      "x": "TRX",
      "y": 0.08
    },
    {
      "x": "DASH",
      "y": 0.05
    },
    {
      "x": "ADA",
      "y": 0.02
    },
    {
      "x": "XLM",
      "y": 0.04
    },
    {
      "x": "BTC",
      "y": 0
    },
    {
      "x": "ETH",
      "y": 98.23
    },
    {
      "x": "GSE",
      "y": 0
    },
    {
      "x": "DEC",
      "y": 0
    },
    {
      "x": "PMOD",
      "y": 0
    }
  ]
}


export const longMocksGenirator = (len) => 
  _.range(len).map(value => (
      {
        'x': value,
        'y': Math.random()
      }
    )
  )
