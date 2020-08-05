import React from 'react'
import { Grid, Button } from '@material-ui/core'
import { useLocation } from 'react-router-dom'

import { SignInLink, SignUpLink } from '@sb/components'
import {
  GuestModeHeading,
  GuestModeSubHeading,
  GuestModeWrapper,
} from './GuestMode.styles'

export const GuestMode = () => {
  const location = useLocation()
  const { pathname } = location

  return (
    <GuestModeWrapper container justify="center" alignItems="center">
      <Grid style={{ maxWidth: '35%' }}>
        <Grid>
          <GuestModeHeading>
            Have you tried our smart trading yet?
          </GuestModeHeading>
        </Grid>
        <Grid>
          <GuestModeSubHeading>
            Smart trading is the ability to automate your manual trading, reduce
            risks, increase profits and focus on strategy.
          </GuestModeSubHeading>
        </Grid>
      </Grid>
      <Grid
        style={{
          padding: '0 5rem',
          width: '25%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid style={{ padding: '2rem 0', width: '100%' }}>
          <Button
            variant="contained"
            color="secondary"
            component={SignUpLink}
            pathname={pathname}
            style={{
              backgroundColor: 'transparent',
              color: '#fff',
              padding: '2rem 3rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              lineHeight: '109.6%',
              letterSpacing: '1.5px',
              borderRadius: '8px',
              boxShadow: '0px 8px 12px rgba(8, 22, 58, 0.3)',
              border: '2px solid #E0E5EC',
              width: '100%',
            }}
            onClick={async () => {}}
          >
            Trade Now
          </Button>
        </Grid>
        <Grid style={{ padding: '2rem 0', width: '100%' }}>
          <Button
            variant="contained"
            color="secondary"
            target="_blank"
            rel="noopener"
            href="https://cryptocurrencies.ai/smartTrading"
            style={{
              backgroundColor: 'transparent',
              color: '#fff',
              padding: '2rem 3rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              lineHeight: '109.6%',
              letterSpacing: '1.5px',
              borderRadius: '8px',
              boxShadow: '0px 8px 12px rgba(8, 22, 58, 0.3)',
              border: '2px solid #E0E5EC',
              width: '100%',
            }}
            onClick={async () => {}}
          >
            Learn more
          </Button>
        </Grid>
      </Grid>
    </GuestModeWrapper>
  )
}
