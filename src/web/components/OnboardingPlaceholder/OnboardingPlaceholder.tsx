import React from 'react'
import { Link } from 'react-router-dom'
import { Typography, Grid } from '@material-ui/core'

import { LightGreenButton, SvgIcon } from '@sb/components'

import depositFunds from '@icons/onboarding/depositFunds.svg'
import rebalancePortfolio from '@icons/onboarding/rebalancePortfolio.svg'
import tradeSpotFutures from '@icons/onboarding/tradeSpotFutures.svg'
import analyzeAndGrow from '@icons/onboarding/analyzeAndGrow.svg'

const DepositNowLink = (props: any) => <Link to="/profile/deposit" {...props} />

export const OnboardingPlaceholder = () => (
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
          How to Get Started
        </Typography>
      </Grid>
      <Grid container justify="space-between" wrap="nowrap">
        <Grid
          container
          justify="flex-end"
          alignItems="center"
          direction="column"
          style={{ padding: '0 4rem 4rem 4rem' }}
        >
          <Grid>
            <Grid container justify="center" style={{ paddingBottom: '3rem' }}>
              <SvgIcon src={depositFunds} width="80%" height="auto" />
            </Grid>
            <Typography
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                letterSpacing: '0.01em',
                color: '#16253d',
                textAlign: 'center',
              }}
            >
              Deposit funds
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justify="flex-end"
          alignItems="center"
          direction="column"
          style={{ padding: '0 4rem 4rem 4rem' }}
        >
          <Grid container justify="center" style={{ paddingBottom: '3rem' }}>
            <SvgIcon src={rebalancePortfolio} width="80%" height="auto" />
          </Grid>
          <Grid>
            <Typography
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                letterSpacing: '0.01em',
                color: '#16253d',
                textAlign: 'center',
              }}
            >
              Rebalance your portfolio
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justify="flex-end"
          alignItems="center"
          direction="column"
          style={{ padding: '0 4rem 4rem 4rem' }}
        >
          <Grid container justify="center" style={{ paddingBottom: '3rem' }}>
            <SvgIcon src={tradeSpotFutures} width="80%" height="auto" />
          </Grid>
          <Grid>
            <Typography
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                letterSpacing: '0.01em',
                color: '#16253d',
                textAlign: 'center',
              }}
            >
              Trade Spot & Futures
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justify="flex-end"
          alignItems="center"
          direction="column"
          style={{ padding: '0 4rem 4rem 4rem' }}
        >
          <Grid container justify="center" style={{ paddingBottom: '3rem' }}>
            <SvgIcon src={analyzeAndGrow} width="80%" height="auto" />
          </Grid>
          <Grid>
            <Typography
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                letterSpacing: '0.01em',
                color: '#16253d',
                textAlign: 'center',
              }}
            >
              Analyze and grow
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justify="center" style={{ padding: '3rem' }}>
        <LightGreenButton
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
        >
          Deposit now
        </LightGreenButton>
      </Grid>
    </Grid>
  </Grid>
)
