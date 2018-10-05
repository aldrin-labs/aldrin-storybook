import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { createMuiTheme, withTheme  } from '@material-ui/core/styles'
import { muiTheme } from 'storybook-addon-material-ui';

import { customThemes } from './customTheme'
import PieChart from '@components/PieChart'

const data = [
  {
    angle: 30.400000000000002,
    color: "#EFC151",
    label: "Smart contracts",
    realValue: "30.40%",
    title: "Smart contracts"
  },
  {
    angle: 31.580000000000002,
    color: "#E85454",
    label: "Payments",
    realValue: "31.58%",
    title: "Payments"
  },
  {
    angle: 16.38,
    color: "#BB118D",
    label: "Entertainment",
    realValue: "16.38%",
    title: "Entertainment"
  },
  {
    angle: 21.65,
    color: "#C79B42",
    label: "Blockchain platform",
    realValue: "21.65%",
    title: "Blockchain platform"
  },
  {
    angle: 0,
    color: "#6DC56F",
    label: "Privacy coin",
    realValue: "0.00%",
    title: "Privacy coin"
  }
]

storiesOf('PieChart', module)
  .addDecorator(
    muiTheme([customThemes.light, customThemes.dark]),
  )
  .add(
    'PieChart',
    withInfo({ inline: true })(() =>
    
      <PieChart
        //theme={this.props.theme}
        data={data}
        flexible={true}
        colorLegend={true}
      />
    )
  )
