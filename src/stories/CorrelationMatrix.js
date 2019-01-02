import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { object, number, boolean, text } from '@storybook/addon-knobs'

import styled from 'styled-components'
import { Card } from '@material-ui/core'

import { customThemes } from '../../.storybook/customTheme'

import { CorrelationMatrix } from '@components/CorrelationMatrix'
import { CorrelationMatrixTableMocks } from './mocks'

const TableWrapper = styled(Card)`
  height: 100vh;
`

const palette = customThemes.dark.palette

const colors = [
  ['red', 'white', 'green'],
  [
    palette.red.main,
    palette.background.default,
    palette.green.main,
    palette.background.default,
  ],
  ['#ff2600', '#ffaa00', '#ffffff', '#90de2a', '#008000'],
  ['#ef5350', '#1f1f1f', '#19cf1f'],
]

const groupId = 'GROUP-ID1'
//const groupId2 = 'GROUP-ID2'

storiesOf('CorrelationMatrixTable', module).add(
  'CorrelationMatrixTable',
  withInfo()(() => (
    <TableWrapper>
      <CorrelationMatrix
        data={object(
          'data',
          CorrelationMatrixTableMocks.dataWithNegatives,
          groupId
        )}
        isFullscreenEnabled={boolean('Fullscreen', false)}
        fullScreenChangeHandler={action('fullScreenChangeHandler')}
        setCorrelationPeriod={action('setCorrelationPeriod')}
        period={text('period', 'lastWeek')}
        dates={{
          startDate: number('startDate', 1539810000),
          endDate: number('endDate', 1540414800),
        }}
      />
    </TableWrapper>
  ))
)
