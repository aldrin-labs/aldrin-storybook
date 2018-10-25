import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import {
  object,
  number,
  boolean,
  text,
  select,
  array,
} from '@storybook/addon-knobs/react'

import styled from 'styled-components'
import { Card, Paper } from '@material-ui/core'

import { CorrelationMatrix } from '@components/CorrelationMatrix'
import { CorrelationMatrixTableMocks } from './mocks'

const TableWrapper = styled(Paper)`
  height: 100vh;
`

const colors = [
  ['red', 'white', 'green'],
  ['#FFCDD2', 'white', '#4caf50'],
  ['#ff2600', '#ffaa00', '#ffffff', '#90de2a', '#008000'],
]

const groupId = 'GROUP-ID1'
const groupId2 = 'GROUP-ID2'

storiesOf('CorrelationMatrixTable', module)
  .add(
    'CorrelationMatrixTable',
    withInfo()(() =>
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
            endDate: number('endDate', 1540414800)
          }}
          colors={object('colors', colors[2], groupId2)}
        />
      </TableWrapper>
  )
)
