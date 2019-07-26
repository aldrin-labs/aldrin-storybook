import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import { TypographyHeading } from './SharePortfolioPanel.style'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SharePortfolioDialog from '@sb/components/SharePortfolioDialog/SharePortfolioDialog'

export default class SharePortfolioPanel extends Component {
  render() {
    return (
      <Grid>
        <TypographyHeading>Trading Portfolio #1</TypographyHeading>
        {/* <SharePortfolioDialog /> */}

      </Grid>
    )
  }
}
