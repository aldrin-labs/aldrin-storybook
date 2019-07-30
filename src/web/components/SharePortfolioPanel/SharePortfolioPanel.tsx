import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import { TypographyHeading, StyledButton } from './SharePortfolioPanel.style'
import SelectPortfolioPeriod from '@sb/components/SelectPortfolioPeriod';
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
          <Grid container justify="flex-start">
            <Grid item style={{ marginRight: '15px' }}>
              <TypographyHeading>{portfolioName}</TypographyHeading>
            </Grid>
            <Grid item>
              <StyledButton
                padding="7px 25px 6px 25px"
                borderRadius={'12px'}
                onClick={handleOpenSharePortfolio}
              >
                share portfolio
              </StyledButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container justify="flex-start">
            <Grid item>
              <SelectPortfolioPeriod />
            </Grid>
            <Grid item>
              <StyledButton
                // onClick={() => {
                //   this.props.onToggleUSDBTC()
                //   toggleBaseCoin()
                // }}
                padding="6px 25px 5px 25px"
                borderRadius={'28px'}
              >
                Btc
              </StyledButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
