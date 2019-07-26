import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import { TypographyHeading } from './SharePortfolioPanel.style'

export default class SharePortfolioPanel extends Component {
  render() {
    return (
      <Grid container justify="flex-start">
        <TypographyHeading>Trading Portfolio #1</TypographyHeading>
      </Grid>
    )
  }
}
