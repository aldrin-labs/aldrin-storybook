import React from 'react'
const QRCode = require('qrcode.react')
import { compose } from 'recompose'
import { Grid, Theme } from '@material-ui/core'
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

const SetUpMfa = ({
  theme,
  changeStep,
  barcodeUri,
  recoveryCode,
}: {
  theme: Theme
  changeStep: (step: string) => void
  barcodeUri: string
  recoveryCode: string
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
        <MfaStep>step 2/2</MfaStep>
      </Grid>
      <Grid style={{ paddingBottom: '5rem' }}>
        <MfaSubHeading>
          Use your Authenticator app to scan the barcode below
        </MfaSubHeading>
      </Grid>
      <Grid
        container
        justify="space-around"
        alignItems="center"
        style={{ paddingBottom: '5rem' }}
      >
        <Grid>
          <QRCode value={barcodeUri} />
        </Grid>
        <Grid style={{ width: '56%' }} container direction="column">
          <Grid style={{ paddingBottom: '0.5rem' }}>
            <MfaText>
              Write down this backup key in a safe place in case you lose your
              device
            </MfaText>
            <MfaText>It only shows up once here</MfaText>
          </Grid>
          <Grid>
            <MfaBackupText>Backup key</MfaBackupText>
          </Grid>
          <Grid>
            <MfaBackupCode>{recoveryCode}</MfaBackupCode>
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <SubmitLoginButton
          variant="contained"
          color="secondary"
          onClick={() => changeStep('enterOtp')}
        >
          Save changes and enable 2FA
        </SubmitLoginButton>
      </Grid>
    </Grid>
  )
}

export default compose(withTheme())(SetUpMfa)
