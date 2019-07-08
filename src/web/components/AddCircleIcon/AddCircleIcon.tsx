import React from 'react'
import { IconCircle } from './AddCircleIcon.styles'

const sortedData = (data) => {
  return data.slice().sort((a, b) => +b.portfolioPerc - +a.portfolioPerc)
}

export const getCircleSymbol = (
  index,
  coin: string,
  //  coinColor: string,
  data
) => (
  <>
    {/* {console.log('88888: ', sortedData(data)[index].symbol)} */}
    {console.log('INDEX: ', index)}
    <IconCircle
      className="fa fa-circle"
      style={{
        justifySelf: 'flex-start',
        color: `${
          coin === sortedData(data)[0].symbol
            ? '#F29C38'
            : coin === sortedData(data)[1].symbol
            ? '#4152AF'
            : coin === sortedData(data)[2].symbol
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
