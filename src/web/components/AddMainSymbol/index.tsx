import React from 'react'
import { Icon } from '../cssUtils'


export const getMainSymbol = (isUSDCurrently: boolean) =>
  isUSDCurrently ? (
    <Icon className="fa fa-usd" />
  ) : (
    <Icon className="fa fa-btc" />
  )

export const addMainSymbol = (
  value: string | number,
  isUSDCurrently: boolean
) => (
  <span style={{ whiteSpace: 'nowrap' }}>
    {getMainSymbol(isUSDCurrently)} {value}
  </span>
)
