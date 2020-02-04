import React from 'react'
const QRCode = require('qrcode.react')
import { compose } from 'recompose'
import { Grid, Typography, Button, Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

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
    <Grid>
      <Grid>
        <Typography>Set 2 factor authentication</Typography>
      </Grid>
      <Grid>
        <Typography>step 2/2</Typography>
      </Grid>
      <Grid>
        <Typography>
          Use your Authenticator app to scan the barcode below
        </Typography>
      </Grid>
      <Grid>
        <Grid>
          <QRCode value={barcodeUri} />
        </Grid>
        <Grid>
          <Grid>
            <Typography>
              Write down this backup key in a safe place in case you lose your
              device It only shows up once here
            </Typography>
          </Grid>
          <Grid>
            <Typography>Backup key</Typography>
          </Grid>
          <Grid>
            <Typography>{recoveryCode}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <Button onClick={() => changeStep('enterOtp')}>
          Save changes and enable 2FA
        </Button>
      </Grid>
    </Grid>
  )
}

export default compose(withTheme)(SetUpMfa)
