import * as React from 'react'

import { Grid, Paper } from '@material-ui/core'

import {
  MainContainer,
  StepContainer,
} from './styles'


const Onboarding = () => (
  <MainContainer>
    <Grid container>
      <Grid item xs={6}>
        <StepContainer>xs=6</StepContainer>
      </Grid>
      <Grid item xs={2}>
        <Paper>xs=6</Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper>xs=6</Paper>
      </Grid>
    </Grid>
  </MainContainer>
)

export default Onboarding
