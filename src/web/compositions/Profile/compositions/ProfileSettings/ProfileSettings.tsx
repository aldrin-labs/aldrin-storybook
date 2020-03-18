import React, { useState, PureComponent } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { withSnackbar } from 'notistack'
import { withRouter } from 'react-router-dom'

import SvgIcon from '@sb/components/SvgIcon'
import {
  ProfileSettingsGrid,
  // LogsGrid,
  // SettingsLeftBlock,
  // SettingsRightBlock,
  SettingsBlock,
  ProfileSettingsCentredBlock,
  WhatIsText,
  WhatIsBlock,
  MFATypography,
  MFASettingsBlock,
  ButtonContainer,
} from './ProfileSettings.styles'
// import {
//   Line,
//   StyledInput,
// } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { MainContainer } from '@sb/compositions/Profile/compositions/ProfileAccounts/ProfileAccounts.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading, TooltipCustom } from '@sb/components/index'
import ShieldGreen from '@icons/shieldGreen.svg'
import ShieldRed from '@icons/shieldRed.svg'

import ProfileSettingsPopup from '@sb/compositions/Profile/compositions/ProfileSettings/ProfileSettingsPopup/ProfileSettingsPopup'

import {
  IPropsDataWrapper,
  IPropsProfileSettings,
  ProcessEnablingMfaType,
} from './ProfileSettings.types'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import Auth from '@sb/compositions/Onboarding/Auth'
import { withApolloPersist } from '@sb/compositions/App/ApolloPersistWrapper/withApolloPersist'
import { getAccountSettings } from '@core/graphql/queries/user/getAccountSettings'
import { LOGOUT } from '@core/graphql/mutations/login'

import {
  getToken,
  validateToken,
  getUserIdFromToken,
  handleLogout,
} from '@core/utils/loginUtils'

const mfaText = `Two Factor Authentication, or 2FA, is an extra layer of security to ensure an individual trying to access their online account is who they say they are. After a user enters their username and password, they are required to provide additional information only they would have (i.e. an authenticator code that is stored in the Google Authenticator app on your phone) to gain access.`

const ProfileSettings = ({
  enqueueSnackbar,
  isMfaAlreadyEnabled,
  processEnablingMfa,
  logout,
}: IPropsProfileSettings) => {
  // const theme: Theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [open, setOpenPopup] = useState(false)

  const showEnableMfaStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with your token',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    if (status === 'OK') {
      enqueueSnackbar(`You have successfully enable mfa. Logout to set up mfa`, { variant: 'success' })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  const enableMfaHandler = async () => {
    const res = await processEnablingMfa()
    showEnableMfaStatus(res)

    if (res.status === 'OK') {
      setOpenPopup(true)
    }

  }

  return (
    <>
      <ProfileSettingsPopup
        open={open}
        handleClose={() => setOpenPopup(false)}
        logout={logout}
      />
      <MainContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ProfileSettingsGrid
          title="2-factor authentication"
          width="50%"
          height="auto"
          style={{ overflow: 'scroll' }}
        >
          <ProfileSettingsCentredBlock>
            <SettingsBlock>
              <SvgIcon
                src={isMfaAlreadyEnabled ? ShieldGreen : ShieldRed}
                width="5.5rem"
                height="auto"
              />
            </SettingsBlock>
            <MFASettingsBlock>
              {!isMfaAlreadyEnabled && (
                <MFATypography textColor={`#DD6956`}>
                  2-factor authentication is disabled
                </MFATypography>
              )}
              {isMfaAlreadyEnabled && (
                <MFATypography textColor={`#29AC80`}>
                  2-factor authentication is enabled
                </MFATypography>
              )}
            </MFASettingsBlock>
            {!isMfaAlreadyEnabled && (
            <WhatIsBlock>
              <TooltipCustom
                title={mfaText}
                enterDelay={250}
                component={
                  <WhatIsText textColor="#5C8CEA">what is it?</WhatIsText>
                }
              />
            </WhatIsBlock>
            )}
            <ButtonContainer container alignItems="center" justify="center">
              <BtnCustom
                disabled={loading || isMfaAlreadyEnabled}
                btnWidth={'38%'}
                borderRadius={'8px'}
                btnColor={'#165BE0'}
                borderWidth={'2px'}
                fontWeight={'bold'}
                height={'4rem'}
                fontSize={'1.2rem'}
                onClick={async () => {
                  setLoading(true)
                  await enableMfaHandler()
                  setLoading(false)
                }}
              >
                {loading ? (
                  <Loading size={16} style={{ height: '16px' }} />
                ) : isMfaAlreadyEnabled ? (
                  `Disable`
                ) : (
                  `Enable 2FA`
                )}
              </BtnCustom>
            </ButtonContainer>
          </ProfileSettingsCentredBlock>
        </ProfileSettingsGrid>

        {/* <SettingsLeftBlock> */}
        {/* <ProfileSettingsGrid title={'settings'} height={'35%'}> */}
        {/* <SettingsBlock>
            <div>
              <p>prikol</p>
              <StyledInput
                type="text"
                width="100"
                // value={marketName}
                // onChange={(e) => this.changeMarketName(e)}
                placeholder="Type name..."
                style={{ marginLeft: '0rem' }}
              />
            </div>
            <div>button</div>
          </SettingsBlock> */}
        {/* </ProfileSettingsGrid> */}

        {/* <LogsGrid> */}
        {/* <ProfileSettingsGrid title={'last login'} width={'33.3%'} /> */}

        {/* <ProfileSettingsGrid */}
        {/* title={'activity logs'} */}
        {/* width={'66.6%'} */}
        {/* needMarginLeft={true} */}
        {/* /> */}
        {/* </LogsGrid> */}
        {/* </SettingsLeftBlock> */}
        {/*  */}
        {/* <SettingsRightBlock> */}
        {/* <ProfileSettingsGrid title={'2-factor authentication'} height={'41%'} /> */}
        {/* <ProfileSettingsGrid */}
        {/* title={'password'} */}
        {/* height={'45%'} */}
        {/* needMarginTop={true} */}
        {/* /> */}
        {/* </SettingsRightBlock> */}
      </MainContainer>
    </>
  )
}

class ProfileSettingsDataWrapper extends PureComponent<IPropsDataWrapper> {
  auth = new Auth('')

  processEnablingMfa = async (): ProcessEnablingMfaType => {
    const accessToken = await getToken('accessToken')
    const isValidToken = validateToken(accessToken)

    if (!isValidToken) {
      return { status: 'ERR', errorMessage: 'The token is invalid' }
    }

    const userId = getUserIdFromToken(accessToken)

    if (!userId) {
      return { status: 'ERR', errorMessage: 'The userId from token is empty' }
    }

    const resultOfEnablingMfa = await this.auth.enableMfa({
      userId,
      accessToken,
    })

    const checkThatMfaIsEnabledForTheUser =
      resultOfEnablingMfa.user_metadata &&
      resultOfEnablingMfa.user_metadata.mfaEnabled === true

    if (checkThatMfaIsEnabledForTheUser) {
      return {
        status: 'OK',
        errorMessage: '',
      }
    }

    return { status: 'ERR', errorMessage: `${resultOfEnablingMfa.message}` }
  }

  logout = async () => {
    const { logoutMutation, persistorInstance, history: { push } } = this.props
    await handleLogout(logoutMutation, persistorInstance)
    push('/login')
  }

  render() {
    const { getAccountSettingsQuery, enqueueSnackbar } = this.props

    const isMfaAlreadyEnabled =
      getAccountSettingsQuery.getAccountSettings &&
      getAccountSettingsQuery.getAccountSettings.authorizationSettings &&
      getAccountSettingsQuery.getAccountSettings.authorizationSettings
        .mfaEnabled

    return (
      <ProfileSettings
        enqueueSnackbar={enqueueSnackbar}
        isMfaAlreadyEnabled={isMfaAlreadyEnabled}
        processEnablingMfa={this.processEnablingMfa}
        logout={this.logout}
      />
    )
  }
}

export default compose(
  withRouter,
  withSnackbar,
  withApolloPersist,
  graphql(LOGOUT, { name: 'logoutMutation' }),
  queryRendererHoc({
    query: getAccountSettings,
    name: 'getAccountSettingsQuery',
  })
)(ProfileSettingsDataWrapper)
