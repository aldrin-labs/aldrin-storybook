import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import { TypographyHeading } from './SharePortfolioPanel.style'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
// import SharePortfolioDialog from '@sb/components/SharePortfolioDialog/SharePortfolioDialog'

export default class SharePortfolioPanel extends Component {
  render() {
    const { handleOpenSharePortfolio } = this.props
    return (
      <Grid
        container
        justify="flex-start"
        alignItems="center"
        style={{ height: '85px', marginLeft: '24px' }}
      >
        <Grid item style={{ marginRight: '15px' }}>
          <TypographyHeading>Trading Portfolio #1</TypographyHeading>
          {/* <SharePortfolioDialog /> */}
        </Grid>
        <Grid item>
          <BtnCustom
            btnWidth={'150px'}
            height={'24px'}
            btnColor={'blue'}
            margin="auto"
            padding="2px"
            onClick={handleOpenSharePortfolio}
          >
            share portfolio
          </BtnCustom>
        </Grid>
      </Grid>
    )
  }
}
