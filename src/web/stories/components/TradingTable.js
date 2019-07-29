import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { backgrounds } from '../backgrounds'
import { withInfo } from '@storybook/addon-info'
import Paper from '@material-ui/core/Paper'
import { Grid } from '@material-ui/core'
import { GlobalStyle } from '@sb/styles/cssUtils'
import TradingTable from '@sb/components/TradingTable/TradingTable'
storiesOf('Components/TradingTable', module)
  .addDecorator(backgrounds)
  .add('Table', () => (
    <Grid container style={{ height: '40rem' }}>
      <Grid item xs={12}>
        <Paper
          style={{
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
            <TradingTable />
            <GlobalStyle />
        </Paper>
      </Grid>
    </Grid>
  ))
