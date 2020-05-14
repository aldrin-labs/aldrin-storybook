import React from 'react'
import { Link } from 'react-router-dom'
import { Typography, Grid } from '@material-ui/core'

import { OrangeButton, SvgIcon } from '@sb/components'
import { addGAEvent } from '@core/utils/ga.utils'

import depositFunds from '@icons/onboarding/depositFunds.svg'

const DepositNowLink = (props: any) => <Link to="/profile/deposit" {...props} />

export const OnboardingPromoPlaceholder = () => (
  <Grid
    style={{
      width: '100%',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
    }}
  >
    <Grid container direction="column">
      <Grid container justify="center" style={{ padding: '3rem' }}>
        <Typography
          style={{
            fontSize: '2.4rem',
            fontWeight: 'bold',
            letterSpacing: '0.01em',
            color: '#16253d',
            textAlign: 'center',
          }}
        >
          Welcome to Cryptocurrencies.Ai
        </Typography>
      </Grid>
      <Grid container direction="column">
        <Grid container justify="center" style={{ padding: '3rem' }}>
          <Typography
            style={{
              fontSize: '1.8rem',
              letterSpacing: '0.01em',
              color: '#16253d',
              textAlign: 'center',
            }}
          >
            Deposit $1000 in any equivalent to get your 50 USDT and start your
            smart trading.
          </Typography>
        </Grid>
        <Grid container justify="center" style={{ padding: '3rem' }}>
          <OrangeButton
            component={DepositNowLink}
            color="secondary"
            variant="contained"
            className="depositNowButton"
            style={{
              padding: '1px 16px',
              margin: '0 1rem',
              whiteSpace: 'nowrap',
              height: '3.5rem',
              width: '18rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              letterSpacing: '1.5px',
            }}
            onClick={() => {
              addGAEvent({
                action: 'Deposit button click promo',
                category: 'App - Portfolio deposit now promo',
                label: `portfolio_page_deposit_now_button_promo`,
              })
            }}
          >
            Deposit now
          </OrangeButton>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
)
