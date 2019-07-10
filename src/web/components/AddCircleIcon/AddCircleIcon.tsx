import React from 'react'
import { IconCircle } from './AddCircleIcon.styles'


export const getCircleSymbol = (
  coin: string,
  data
) => (
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
        fontSize: '10px',
        margin: 'auto 3px auto 12px',
      }}
    />
    {coin}
  </>
)
