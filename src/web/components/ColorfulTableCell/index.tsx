import React from 'react'

import { Tooltip } from '@material-ui/core'
import { FullWidthBlock } from '@sb/components/OldTable/Table'


const config = {
  industryTableEmptyCellTooltip: `The "-" represents fields for which we are not successfully
   able to calculate a value due to missing data.`,
}

export const colorful = (value: number, red: string, green: string) => ({
  contentToSort: value,
  render:
    value === 0 ? (
      <Tooltip enterDelay={250} title={config.industryTableEmptyCellTooltip}>
        <FullWidthBlock style={{ width: '100%' }}>-</FullWidthBlock>
      </Tooltip>
    ) : (
      `${value}%`
    ),
  isNumber: true,
  style: { color: value > 0 ? green : value < 0 ? red : null },
})

export default colorful
