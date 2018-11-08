import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { 
  object,
  number,
  boolean,
  text
} from '@storybook/addon-knobs'

import styled from 'styled-components'
import { Paper } from '@material-ui/core'

import { backgrounds } from './backgrounds'
import DonutChart from '@components/DonutChart'
import { DonutChartTableMocks } from './mocks'


const ChartWrapper = styled(Paper)`
  max-height: 100%;
  height: 90vh;
  width: 60%;
`



const groupId = 'GROUP-ID1';

storiesOf('DonutChart', module)
  .addDecorator(backgrounds)
  .add(
    'DonutChart',
    withInfo()(() =>
      <ChartWrapper elevation={8}>
        <DonutChart
          labelPlaceholder={text("Label Placeholder" , "Industry %")}
          data={object("data", DonutChartTableMocks.chartData, groupId)}
          colorLegend={boolean("Color Legend", true)}
          thicknessCoefficient={number("Thickness Coefficient", 10)}
        />
      </ChartWrapper>
    )
  )
  .add(
    'DonutChart check some zero values',
    withInfo()(() =>
      <ChartWrapper elevation={8}>
        <DonutChart
          labelPlaceholder={text("Label Placeholder" , "Industry %")}
          data={object("data", DonutChartTableMocks.someZeroTestData, groupId)}
          colorLegend={boolean("Color Legend", true)}
          thicknessCoefficient={number("Thickness Coefficient", 10)}
        />
      </ChartWrapper>
    )
  )
  .add(
    'DonutChart all zero values',
    withInfo()(() =>
      <ChartWrapper elevation={8}>
        <DonutChart
          labelPlaceholder={text("Label Placeholder" , "Industry %")}
          data={object("data", DonutChartTableMocks.allZeroTestData, groupId)}
          colorLegend={boolean("Color Legend", true)}
          thicknessCoefficient={number("Thickness Coefficient", 10)}
        />
      </ChartWrapper>
    )
  )