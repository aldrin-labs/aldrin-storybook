import React from 'react'
import { IconCircle } from '@sb/styles/cssUtils'

export const getCircleSymbol = (coin: string, data) => (
  <>
    <IconCircle
      className="fa fa-circle"
      style={{
        justifySelf: 'flex-start',
        color: `${
          coin === data[0].symbol
            ? '#F29C38'
            : coin === data[1].symbol
            ? '#4152AF'
            : coin === data[2].symbol
            ? '#DEDB8E'
            : '#97C15C'
        }`,
        margin: 'auto 3px auto 0',
      }}
    />
    {coin}
  </>
)

export const getCircleSymbolSocial = (coin: string, data) => (
  <>
    <IconCircle
      className="fa fa-circle"
      style={{
        justifySelf: 'flex-start',
        color: `${
          coin === data[0].coin
            ? '#F29C38'
            : coin === data[1].coin
            ? '#4152AF'
            : coin === data[2].coin
            ? '#DEDB8E'
            : '#97C15C'
        }`,
        fontSize: '1rem',
        margin: 'auto 3px auto 0',
      }}
    />
    {coin}
  </>
)

export const getCircleSymbolPnl = (coin: string, data) => (
  <>
    <IconCircle
      className="fa fa-circle"
      style={{
        justifySelf: 'flex-start',
        color: `${
          coin === data[0].coin
            ? '#F29C38'
            : coin === data[1].coin
            ? '#4152AF'
            : coin === data[2].coin
            ? '#DEDB8E'
            : '#ABBAD1'
        }`,
        fontSize: '1rem',
        margin: 'auto 3px auto 0',

        '@media only screen and (min-width: 2560px)': {
          position: 'relative',
          top: '-3px'
        }
      }}
    />
    {coin}
  </>
)
