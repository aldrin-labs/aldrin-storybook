import React, { ReactElement } from 'react'
import { Container, Wrapper, ChartWrapper } from '../styles'
import { Grid } from '@material-ui/core'

const Template = ({
  Table,

  Chart,
}: {
  Table: ReactElement<any>
  Chart: ReactElement<any>
}) => {
  return (
    <Container container={true} spacing={16}>
      <Grid item={true} xs={12} md={8}>
        <Wrapper>{Table}</Wrapper>
      </Grid>
      <Grid item={true} xs={12} md={4}>
        <ChartWrapper>{Chart}</ChartWrapper>
      </Grid>
    </Container>
  )
}

export default Template
