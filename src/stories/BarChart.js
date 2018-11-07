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
import { basic, longMocksGenirator, doubled } from './mocks/BarChartMocks'


const groupId = 'GROUP-ID1';

storiesOf('BarChart', module)
  .addDecorator(backgrounds)
  .add(
    'BarChart',
    withInfo()(() =>
    <Paper>
      <BarChart
        height={number('height', 350)}
        hideDashForToolTip={boolean('Hide dash for tool tip', true)}
        xAxisVertical={boolean('xAxisVertical', true)}
        alwaysShowLegend={boolean('alwaysShowLegend', true)}
        animated={boolean('animated', false)}
        minColumnWidth={number('Minimum column width', 50)}
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
          ],
          groupId
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
        height={number('height', 350)}
        hideDashForToolTip={boolean('Hide dash for tool tip', true)}
        xAxisVertical={boolean('xAxisVertical', true)}
        alwaysShowLegend={boolean('alwaysShowLegend', true)}
        animated={boolean('animated', false)}
        minColumnWidth={number('Minimum column width', 50)}
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
          ],
          groupId
        )}
      />
    </Paper>
    )
  )
  .add(
    'BarChart long data with doubles',
    withInfo()(() =>
    <Paper>
      <BarChart
        height={number('height', 350)}
        hideDashForToolTip={boolean('Hide dash for tool tip', true)}
        xAxisVertical={boolean('xAxisVertical', true)}
        alwaysShowLegend={boolean('alwaysShowLegend', true)}
        animated={boolean('animated', false)}
        minColumnWidth={number('Minimum column width', 50)}
        charts={object(
          'data',
          [
            {
              data: longMocksGenirator(50).concat(longMocksGenirator(50)),
              color: '#fff',
              title: 'Current',
            },
            {
              data: longMocksGenirator(50).concat(longMocksGenirator(50)),
              color: '#4ed8da',
              title: 'Rebalanced',
            },
          ],
          groupId
        )}
      />
    </Paper>
    )
  )
  .add(
    'BarChart doubles',
    withInfo()(() =>
    <Paper>
      <BarChart
        height={number('height', 350)}
        hideDashForToolTip={boolean('Hide dash for tool tip', true)}
        xAxisVertical={boolean('xAxisVertical', true)}
        alwaysShowLegend={boolean('alwaysShowLegend', true)}
        animated={boolean('animated', false)}
        minColumnWidth={number('Minimum column width', 50)}
        charts={object(
          'data',
          [
            {
              data: doubled.staticRows,
              color: '#fff',
              title: 'Current',
            },
            {
              data: doubled.rows,
              color: '#4ed8da',
              title: 'Rebalanced',
            },
          ],
          groupId
        )}
      />
    </Paper>
    )
  )
