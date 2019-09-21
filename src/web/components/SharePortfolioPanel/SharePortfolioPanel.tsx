import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import { TypographyHeading, StyledButton } from './SharePortfolioPanel.style'
import SelectPortfolioPeriod from '@sb/components/SelectPortfolioPeriod'
import { IProps } from './SharePortfolio.types'

class SharePortfolioPanel extends Component<IProps> {
  render() {
    const {
      handleOpenSharePortfolio,
      portfolioName,
      onToggleUSDBTC,
      isUSDCurrently,
    } = this.props
    return (
      <Grid
        container
        justify="space-between"
        alignItems="center"
        style={{
          padding: '1.6rem 24px',
          height: '11%',
        }}
      >
        <Grid item>
          <Grid container justify="flex-start" alignItems="center">
            <Grid item style={{ marginRight: '1rem' }}>
              <TypographyHeading textColor={theme.palette.black.registration}>
                {portfolioName}
              </TypographyHeading>
            </Grid>
            {/* <Grid item>
              <StyledButton
                padding="0.4rem 1rem 0.35rem 1rem"
                borderRadius={'12px'}
                onClick={handleOpenSharePortfolio}
              >
                share portfolio
              </StyledButton>
            </Grid> */}
          </Grid>
        </Grid>

        <Grid item>
          <Grid container justify="flex-start" alignItems="center">
            {/* <Grid item>
              <SelectPortfolioPeriod />
            </Grid> */}
            <Grid item>
              <StyledButton
                onClick={onToggleUSDBTC}
                padding="0.25rem 1rem 0.25rem 1rem"
                borderRadius={'28px'}
              >
                {isUSDCurrently ? 'BTC' : 'USD'}
              </StyledButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default SharePortfolioPanel
