import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { 
  object,
  number,
  boolean,
  text
} from '@storybook/addon-knobs/react'

import { Paper } from '@material-ui/core'

import { backgrounds } from './backgrounds'
import { BarChart } from '@components/BarChart'
import { basic, longMocksGenirator } from './mocks/BarChartMocks'


const groupId = 'GROUP-ID1';

storiesOf('BarChart', module)
  .addDecorator(backgrounds)
  .add(
    'BarChart',
    withInfo()(() =>
    <Paper>
      <BarChart
        height={350}
        hideDashForToolTip={true}
        xAxisVertical={true}
        alwaysShowLegend={true}
        charts={object(
          'data',
          [
            {
              data: basic.staticRows,
              color: '#fff',
              title: 'Current',
            },
            {
              data: basic.rows,
              color: '#4ed8da',
              title: 'Rebalanced',
            },
          ]
        )}
      />
    </Paper>
    )
  )
  .add(
    'BarChart long data',
    withInfo()(() =>
    <Paper>
      <BarChart
        height={350}
        hideDashForToolTip={true}
        xAxisVertical={true}
        alwaysShowLegend={true}
        charts={object(
          'data',
          [
            {
              data: longMocksGenirator(100),
              color: '#fff',
              title: 'Current',
            },
            {
              data: longMocksGenirator(100),
              color: '#4ed8da',
              title: 'Rebalanced',
            },
          ]
        )}
      />
    </Paper>
    )
  )
