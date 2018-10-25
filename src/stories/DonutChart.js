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

import styled from 'styled-components'
import { Paper } from '@material-ui/core'

import { backgrounds } from './backgrounds'
import DonutChart from '@components/DonutChart'


const ChartWrapper = styled(Paper)`
  max-height: 100%;
  height: 100vh;
  width: 50%;
`

const chartData = [
  {
    label: "Payments",
    realValue: 25.1,
  },
  {
    label: "Entertainment",
    realValue: 10,
  },
  {
    label: "Blockchain platform",
    realValue: 14,
  },
  {
    label: "Privacy coin",
    realValue: 17,
  },
  {
    label: "Some other things",
    realValue: 30,
  },
  {
    label: "Some other things2",
    realValue: 30,
  },
  {
    label: "Some other things3",
    realValue: 30,
  },
  {
    label: "Some other things4",
    realValue: 30,
  },
  {
    label: "Some other things5",
    realValue: 30,
  },
  {
    label: "Some other things6",
    realValue: 30,
  },
  {
    label: "Some other things7",
    realValue: 30,
  },
  {
    label: "Some other things8",
    realValue: 30,
  },
  {
    label: "Some other things9",
    realValue: 30,
  },
  {
    label: "Some other things10",
    realValue: 30,
  },
  {
    label: "Some other things11",
    realValue: 30,
  },
  {
    label: "Some other things12",
    realValue: 30,
  }
]

const groupId = 'GROUP-ID1';

storiesOf('DonutChart', module)
  .addDecorator(backgrounds)
  .add(
    'DonutChart',
    withInfo()(() =>
      <ChartWrapper elevation={8}>
        <DonutChart
          labelPlaceholder={text("Label Placeholder" , "Industries %")}
          data={object("data", chartData, groupId)}
          isSizeFlexible={boolean("Is Size Flexible" , true)}
          colorLegend={boolean("Color Legend", true)}
          hightCoefficient={number("Hight Coefficient", 16)}
          widthCoefficient={number("Width Coefficient", 6)}
          thicknessCoefficient={number("Thickness Coefficient", 10)}
        />
      </ChartWrapper>
  )
)
