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
  height: 90vh;
  width: 40%;
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
]

const groupId = 'GROUP-ID1';

storiesOf('DonutChart', module)
  .addDecorator(backgrounds)
  .add(
    'DonutChart',
    withInfo()(() =>
      <ChartWrapper elevation={8}>
        <DonutChart
          labelPlaceholder={text("Label Placeholder" , "Industry %")}
          data={object("data", chartData, groupId)}
          isSizeFlexible={boolean("Is Size Flexible" , true)}
          colorLegend={boolean("Color Legend", true)}
          hightCoefficient={number("Hight Coefficient", 10)}
          widthCoefficient={number("Width Coefficient", 5)}
          thicknessCoefficient={number("Thickness Coefficient", 10)}
        />
      </ChartWrapper>
  )
)
