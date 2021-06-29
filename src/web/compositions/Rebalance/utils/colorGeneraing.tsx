import React from 'react'
import {
  fixedColors,
  fixedColorsForLegend,
  getRandomBlueColor,
} from '@sb/components/AllocationBlock/DonutChart/utils'
import { Colors, TokensDataType, TokensMapType } from '../Rebalance.types'

export const generateChartColors = ({
  data,
}: {
  data: TokensMapType
}): Colors => {
  return Object.values(data).reduce((acc, el, i) => {
    acc[el.symbol] =
      i < fixedColors.length ? fixedColors[i] : getRandomBlueColor()

    return acc
  }, {})
}

export const generateLegendColors = ({
  data,
}: {
  data: TokensMapType
}): Colors => {
  return Object.values(data).reduce((acc, el, i) => {
    acc[el.symbol] =
      i < fixedColorsForLegend.length
        ? fixedColorsForLegend[i]
        : getRandomBlueColor()
    return acc
  }, {})
}
