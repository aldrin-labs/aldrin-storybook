import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import { TypographyHeading, StyledButton } from './SharePortfolioPanel.style'
import SelectPortfolioPeriod from '@sb/components/SelectPortfolioPeriod'
import { IProps } from './SharePortfolio.types'
import { MASTER_BUILD } from '@core/utils/config'

import PillowButton from '@sb/components/SwitchOnOff/PillowButton'

class SharePortfolioPanel extends Component<IProps> {
  render() {
    const {
      // handleOpenSharePortfolio,
      portfolioName,
      onToggleUSDBTC,
      isUSDCurrently,
      isSPOTCurrently,
      setPageType,
      choosePeriod,
    } = this.props

    return (
      <Grid
        container
        justify="space-between"
        alignItems="center"
        style={{
          padding: '1.6rem 24px',
          height: '11%',
          background: '#F9FBFD',
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
          <Grid
            container
            justify="flex-start"
            alignItems="center"
            id="sharePortfolioSwitcher"
          >
            <Grid item>
              <SelectPortfolioPeriod
                isSPOTCurrently={isSPOTCurrently}
                chooseHistoryPeriod={choosePeriod}
              />
            </Grid>
            <Grid item style={{ display: 'flex' }}>
              {/* <StyledButton
                onClick={onToggleUSDBTC}
                padding="0.25rem 1rem 0.25rem 1rem"
                borderRadius={'28px'}
              >
                {isUSDCurrently ? 'BTC' : 'USD'}
              </StyledButton> */}

              <PillowButton
                firstHalfText={'spot'}
                secondHalfText={'futures'}
                activeHalf={isSPOTCurrently ? 'first' : 'second'}
                changeHalf={() =>
                  setPageType({
                    variables: {
                      pageType: isSPOTCurrently ? 'FUTURES' : 'SPOT',
                    },
                  })
                }
              />
              <PillowButton
                firstHalfText={'USD'}
                secondHalfText={'BTC'}
                activeHalf={isUSDCurrently ? 'first' : 'second'}
                changeHalf={onToggleUSDBTC}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default SharePortfolioPanel
