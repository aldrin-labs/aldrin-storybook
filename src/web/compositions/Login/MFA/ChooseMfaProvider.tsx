import React, { useState } from 'react'
import { compose } from 'recompose'
import { Grid, Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import {
  MfaHeading,
  MfaStep,
  MfaSubHeading,
  SubmitLoginButton,
} from '@sb/compositions/Login/Login.styles'
import { Loading } from '@sb/components/index'
import SvgIcon from '@sb/components/SvgIcon'
import AppleLogo from '@icons/apple.svg'
import AndroidLogo from '@icons/android.svg'
import AppleQrCodeAppLink from '@icons/appleLink.png'
import AndroidQrCodeAppLink from '@icons/androidLink.png'

const ChooseMfaProvider = ({
  theme,
  associateMfaMethodHandler,
}: {
  theme: Theme
  associateMfaMethodHandler: () => Promise<void>
}) => {
  const [loading, setLoading] = useState(false)

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
        justify="center"
        alignItems="center"
        style={{ paddingBottom: '5rem', flexWrap: 'nowrap' }}
      >
        <Grid
          style={{ width: '33%' }}
          container
          justify="center"
          alignItems="center"
          direction="column"
        >
          <SvgIcon src={AppleLogo} width="3.5rem" height="auto" />
          <SvgIcon src={AppleQrCodeAppLink} width="160px" height="auto" />
        </Grid>
        <Grid
          style={{ width: '33%' }}
          container
          justify="center"
          alignItems="center"
          direction="column"
        >
          <SvgIcon
            src={AndroidLogo}
            width="4.5rem"
            height="auto"
            style={{ paddingBottom: '1.5rem' }}
          />
          <SvgIcon src={AndroidQrCodeAppLink} width="144px" height="auto" />
        </Grid>
      </Grid>
      <Grid>
        <SubmitLoginButton
          disabled={loading}
          variant="contained"
          color="secondary"
          onClick={async () => {
            setLoading(true)
            await associateMfaMethodHandler()
            setLoading(false)
          }}
        >
          {loading ? (
            <Loading size={16} style={{ height: '16px' }} />
          ) : (
            `I already have the app`
          )}
        </SubmitLoginButton>
      </Grid>
    </Grid>
  )
}

export default compose(withTheme)(ChooseMfaProvider)
