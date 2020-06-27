import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { withSnackbar } from 'notistack'
import { Button } from '@material-ui/core'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { GET_MY_PROFILE } from '@core/graphql/queries/profile/getMyProfile'
import { disableAccount } from '@core/graphql/mutations/user/disableAccount'

import { Loading, SvgIcon, TooltipCustom } from '@sb/components'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import exclamationMarkYellow from '@icons/exclamationMarkYellow.svg'

import {
  StyledInput,
  StyledTypography,
  StyledTypographyCaption,
} from '../Withdrawal/Withdrawal.styles'

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
} from '@sb/compositions/Profile/compositions/ProfileSettings/ProfileSettings.styles'
import { MainContainer } from '@sb/compositions/Profile/compositions/ProfileAccounts/ProfileAccounts.styles'

const DisableAccount = ({ ...props }: IProps) => {
  const [loading, setLoading] = useState(false)

  console.log('props', props)

  const {
    myProfile: {
      getMyProfile: { blocked },
    },
    disableAccountMutation,
    enqueueSnackbar,
  } = props

  const isUserAccountAlreadyBlocked = !!blocked

  const showDisablingAccountStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with the result of disabling your account',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    if (status === 'OK') {
      enqueueSnackbar(`Your account successfully disabled`, {
        variant: 'success',
      })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  const disableAccountHandler = async () => {
    try {
      const result = await disableAccountMutation()
      const {
        data: {
          disableAccount: { status, errorMessage, data },
        },
      } = result

      // check that mutation result is ok
      if (status === 'OK') {
        showDisablingAccountStatus({ status: 'OK', errorMessage: '' })
      } else {
        showDisablingAccountStatus({
          status: 'ERR',
          errorMessage: errorMessage,
        })
      }
    } catch (e) {
      showDisablingAccountStatus({ status: 'ERR', errorMessage: e.message })
    }
  }

  return (
    <>
      <MainContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ProfileSettingsGrid
          title="Disable your account"
          width="50%"
          height="auto"
          style={{ overflow: 'scroll' }}
        >
          <ProfileSettingsCentredBlock>
            <SettingsBlock>
              <SvgIcon
                src={exclamationMarkYellow}
                width="5.5rem"
                height="auto"
              />
            </SettingsBlock>
            <MFASettingsBlock>
              <StyledTypography
                style={{
                  color: '#16253D',
                  textTransform: 'none',
                  fontSize: '1.2rem',
                  letterSpacing: '0.5px',
                }}
              >
                Disabling of your account will:
              </StyledTypography>
            </MFASettingsBlock>
            <MFASettingsBlock style={{ alignSelf: 'end', paddingLeft: '4rem' }}>
              <StyledTypographyCaption
                style={{
                  color: '#3A475C',
                  lineHeight: '31px',
                  letterSpacing: '0.5px',
                  fontSize: '1.2rem',
                  fontWeight: 'normal',
                }}
              >
                • Disable all trading capacities
              </StyledTypographyCaption>
              <StyledTypographyCaption
                style={{
                  color: '#3A475C',
                  lineHeight: '31px',
                  letterSpacing: '0.5px',
                  fontSize: '1.2rem',
                  fontWeight: 'normal',
                }}
              >
                • Cancel all pending withdrawals
              </StyledTypographyCaption>
            </MFASettingsBlock>
            <ButtonContainer container alignItems="center" justify="center">
              <Button
                disabled={loading || isUserAccountAlreadyBlocked}
                variant="contained"
                color="secondary"
                style={{
                  backgroundColor: isUserAccountAlreadyBlocked
                    ? '#7284A0'
                    : '#DD6956',
                  color: '#fff',
                  padding: '2rem 3rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  lineHeight: '109.6%',
                  letterSpacing: '1.5px',
                  borderRadius: '4px',
                  boxShadow: '0px 8px 12px rgba(8, 22, 58, 0.3)',
                }}
                onClick={async () => {
                  setLoading(true)
                  await disableAccountHandler()
                  setLoading(false)
                }}
              >
                {loading ? (
                  <Loading size={16} style={{ height: '16px' }} />
                ) : isUserAccountAlreadyBlocked ? (
                  `Your account already disabled`
                ) : (
                  `Disable account`
                )}
              </Button>
            </ButtonContainer>
          </ProfileSettingsCentredBlock>
        </ProfileSettingsGrid>
      </MainContainer>
    </>
  )
}

export default compose(
  withSnackbar,
  withRouter,
  graphql(disableAccount, { name: 'disableAccountMutation' }),
  queryRendererHoc({
    query: GET_MY_PROFILE,
    fetchPolicy: 'cache-and-network',
    name: 'myProfile',
    withOutSpinner: true,
    withoutLoading: true,
  })
)(DisableAccount)
