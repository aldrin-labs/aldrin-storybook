import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import { TypographyHeading } from './SharePortfolioPanel.style'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { IProps } from './SharePortfolio.types'

export default class SharePortfolioPanel extends Component<IProps> {
  render() {
    const { handleOpenSharePortfolio, portfolioName } = this.props
    return (
      <Grid
        container
        justify="space-between"
        alignItems="center"
        style={{
          height: '85px',
          padding: '0 24px',
        }}
      >
        <Grid item>
          <Grid container justify="flex-start" alignItems="center">
            <Grid item style={{ marginRight: '1rem' }}>
              <TypographyHeading textColor={theme.palette.text.primary}>
                {portfolioName}
              </TypographyHeading>
            </Grid>
            <Grid item>
              <BtnCustom
                btnWidth={'auto'}
                height="auto"
                btnColor={'#165BE0'}
                margin="auto"
                padding=".2rem .8rem"
                onClick={handleOpenSharePortfolio}
              >
                Share portfolio
              </BtnCustom>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <BtnCustom
            // onClick={() => {
            //   this.props.onToggleUSDBTC()
            //   toggleBaseCoin()
            // }}
            borderRadius={'32px'}
            btnWidth={'100%'}
            height={'24px'}
            btnColor={'#165BE0'}
            margin="auto"
            padding="2px"
          >
            Btc
          </BtnCustom>
        </Grid>
      </Grid>
    )
  }
}
