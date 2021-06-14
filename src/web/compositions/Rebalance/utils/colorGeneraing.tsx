import React from 'react'
import {
  fixedColors,
  fixedColorsForLegend,
  getRandomBlueColor,
} from '@sb/components/AllocationBlock/DonutChart/utils'

export const generateChartColors = ({ data }: { data: any }) => {
  return Object.values(data).reduce((acc, el, i) => {
    acc[el.symbol] =
      i < fixedColors.length ? fixedColors[i] : getRandomBlueColor()

    return acc
  }, {})
}

export const generateLegendColors = ({ data }: { data: any }) => {
  return Object.values(data).reduce((acc, el, i) => {
    acc[el.symbol] =
      i < fixedColorsForLegend.length
        ? fixedColorsForLegend[i]
        : getRandomBlueColor()
    return acc
  }, {})
}
