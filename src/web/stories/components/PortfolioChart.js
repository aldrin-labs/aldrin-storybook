import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { object  } from '@storybook/addon-knobs'

import PortfolioChart from '@components/PortfolioChart'
import { data } from '../mocks/PortfolioChartMoks'
import { customThemes } from '../../../../.storybook/customTheme'

const chartBtns = ['1D', '7D', '1M', '3M', '1Y']

const mapLabelToDays = {
  '1D': 1,
  '7D': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
}

const groupId = 'GROUP-ID1'
console.log(data)
storiesOf('Components/PortfolioChart', module)
  .add(
    'PortfolioChart',
    () =>
      <PortfolioChart
        theme={customThemes.dark}
        data={data}
        style={{marginLeft: 0, minHeight: "10vh"}}
        height="500px"
        lastDrawLocation={null}
        activeChart="1Y"
        chartBtns={chartBtns}
        mapLabelToDays={mapLabelToDays}
        setActiveChartAndUpdateDays={action('setActiveChartAndUpdateDays')}
      />
  )
