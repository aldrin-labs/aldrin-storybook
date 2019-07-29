import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { object, number, boolean, text } from '@storybook/addon-knobs'

import styled from 'styled-components'
import { Card } from '@material-ui/core'

import ThemeWrapper from '@sb/compositions/App/ThemeWrapper/ThemeWrapper'

import CorrelationMatrix from '@sb/components/CorrelationMatrix'
import { CorrelationMatrixTableMocks } from '../mocks/CorrelationMatrixMocks'

const TableWrapper = styled(Card)`
  height: 100vh;
`

const groupId = 'GROUP-ID1'
//const groupId2 = 'GROUP-ID2'

storiesOf('Components/CorrelationMatrixTable', module).add(
  'CorrelationMatrixTable',
  withInfo()(() => (
    <TableWrapper>
      <ThemeWrapper themeMode={`dark`}>
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
      </ThemeWrapper>
    </TableWrapper>
  ))
)
