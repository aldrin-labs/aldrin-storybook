import React from 'react'
import { compose } from 'recompose'
import { Grid, Typography, Button, Theme, Link } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import SvgIcon from '@sb/components/SvgIcon'
import AppleLogo from '@icons/apple.svg'
import AndroidLogo from '@icons/android.svg'
import AppleQrCodeAppLink from '@icons/appleLink.png'
import AndroidQrCodeAppLink from '@icons/androidLink.png'



const ChooseMfaProvider = ({
  theme,
  changeStep,
}: {
  theme: Theme,
  changeStep: (step: string) => void
}) => {
  return (
    <Grid>
      <Grid>
        <Typography>Set 2 factor authentication</Typography>
      </Grid>
      <Grid>
        <Typography>step 1/2</Typography>
      </Grid>
      <Grid>
        <Typography>
          Download the Google Authenticator or any other 2fa App on your phone
        </Typography>
      </Grid>
      <Grid>
        <Grid>
          <Grid>
            <Grid>
              <SvgIcon src={AppleLogo} width="3.5rem" height="auto" />
            </Grid>
            <Grid>
              <SvgIcon src={AppleQrCodeAppLink} width="20%" height="auto" />
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <Grid>
            <SvgIcon src={AndroidLogo} width="3.5rem" height="auto" />
          </Grid>
          <Grid>
            <SvgIcon src={AndroidQrCodeAppLink} width="20%" height="auto" />
          </Grid>
        </Grid>
        <Grid>
            <Button onClick={() => changeStep('chooseProvider')}>
                I already have the app
            </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default compose(withTheme)(ChooseMfaProvider)
