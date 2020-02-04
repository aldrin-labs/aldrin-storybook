import React from 'react'
import { compose } from 'recompose'
import { Grid, Typography, Button, Theme, Link } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import CubeLogo from '@icons/auth0Logo.png'
import { Logo } from './ConfirmEmail.styles'

const ConfirmEmail = ({ theme, userEmailHosting }: { theme: Theme, userEmailHosting: string }) => {
  return (
    <Grid>
      <Grid>
        <Logo src={CubeLogo} />
      </Grid>
      <Grid>
        <Typography>Confirm your e-mail</Typography>
      </Grid>
      <Grid>
        <Typography>Thank you for joining cryptocurrencies.ai</Typography>
      </Grid>
      <Grid>
        <Typography>
          We have sent a confirmation email to the address indicated during your
          registration.
        </Typography>
      </Grid>
      <Grid>
        <Link target="_blank" rel="noopener noreferrer" underline="none" variant="body2" href={`https://${userEmailHosting}`}>
          Go to e-mail and confirm
        </Link>
      </Grid>
    </Grid>
  )
}

export default compose(withTheme)(ConfirmEmail)
