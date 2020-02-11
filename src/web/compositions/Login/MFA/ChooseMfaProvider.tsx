import React from 'react'
import { compose } from 'recompose'
import { Grid, Typography, Button, Theme, Link } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import {
  MfaBackupCode,
  MfaBackupText,
  MfaHeading,
  MfaStep,
  MfaText,
  MfaSubHeading,
  SubmitLoginButton,
} from '@sb/compositions/Login/Login.styles'

import SvgIcon from '@sb/components/SvgIcon'
import AppleLogo from '@icons/apple.svg'
import AndroidLogo from '@icons/android.svg'
import AppleQrCodeAppLink from '@icons/appleLink.png'
import AndroidQrCodeAppLink from '@icons/androidLink.png'

const ChooseMfaProvider = ({
  theme,
  changeStep,
}: {
  theme: Theme
  changeStep: (step: string) => void
}) => {
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      style={{ width: '56%' }}
    >
      <Grid style={{ paddingBottom: '3rem' }}>
        <MfaHeading>Set 2 factor authentication</MfaHeading>
      </Grid>
      <Grid style={{ paddingBottom: '0.5rem' }}>
        <MfaStep>step 1/2</MfaStep>
      </Grid>
      <Grid style={{ paddingBottom: '8rem' }}>
        <MfaSubHeading>
          Download the Google Authenticator or any other 2fa App on your phone
        </MfaSubHeading>
      </Grid>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        style={{ paddingBottom: '5rem', flexWrap: 'nowrap' }}
      >
        <Grid container justify="center" alignItems="center" direction="column">
          <SvgIcon src={AppleLogo} width="3.5rem" height="auto" />
          <SvgIcon src={AppleQrCodeAppLink} width="160px" height="auto" />
        </Grid>
        <Grid container justify="center" alignItems="center" direction="column">
          <SvgIcon src={AndroidLogo} width="4.5rem" height="auto" style={{ paddingBottom: '1.5rem' }} />
          <SvgIcon src={AndroidQrCodeAppLink} width="144px" height="auto" />
        </Grid>
      </Grid>
      <Grid>
        <SubmitLoginButton
          variant="contained"
          color="secondary"
          onClick={() => changeStep('setupMfa')}
        >
          I already have the app
        </SubmitLoginButton>
      </Grid>
    </Grid>
  )
}

export default compose(withTheme)(ChooseMfaProvider)
