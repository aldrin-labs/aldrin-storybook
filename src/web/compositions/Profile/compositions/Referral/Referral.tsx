import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withSnackbar } from 'notistack'
import copy from 'clipboard-copy'
import { Grid, Button, Typography } from '@material-ui/core'

import { CALLBACK_URL_FOR_AUTH0 } from '@core/utils/config'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getReferralCode } from '@core/graphql/queries/user/getReferralCode'
import { getReferrals } from '@core/graphql/queries/user/getReferrals'
import { registerSharedReferralLink } from '@core/graphql/mutations/user/registerSharedReferralLink'

import { StyledInputReferral } from './Referral.styles'
import { IProps } from './Referral.types'
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
} from '../ProfileSettings/ProfileSettings.styles'

const Referral = ({
  enqueueSnackbar,
  getReferralCodeQuery,
  getReferralsQuery,
  registerSharedReferralLinkMutation,
}: IProps) => {
  const {
    getReferralCode: { referralCode } = { referralCode: '' },
  } = getReferralCodeQuery || { getReferralCode: { referralCode: '' } }

  const { getReferrals: { count } = { count: 0 } } = getReferralsQuery || {
    getReferrals: { count: 0 },
  }

  const refferralLink = `${CALLBACK_URL_FOR_AUTH0}/signup?ref=${referralCode.toUpperCase()}`

  const copyReferralLink = () => {
    copy(refferralLink)
  }

  const showRegisterSharedReferralLinkStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with the result of referral registering',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    if (status === 'OK') {
      enqueueSnackbar(`Your link sended successfully`, { variant: 'success' })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  const sendRegisteringReferralLinkHandler = async () => {
    try {
      const result = await registerSharedReferralLinkMutation({
        variables: {
          link: '',
        },
      })

      if (
        result &&
        result.data &&
        result.data.registerSharedReferralLink &&
        result.data.registerSharedReferralLink.status === 'OK'
      ) {
        showRegisterSharedReferralLinkStatus({ status: 'OK', errorMessage: '' })
      } else {
        showRegisterSharedReferralLinkStatus({
          status: 'ERR',
          errorMessage: result.data.registerSharedReferralLink.errorMessage,
        })
      }
    } catch (e) {
      showRegisterSharedReferralLinkStatus({
        status: 'ERR',
        errorMessage: e.message,
      })
    }
  }

  return (
    <>
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{
          height: '100%',
          padding: '5% 1%',
          border: '2px solid #E0E5EC',
          boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
          borderRadius: '32px',
          marginBottom: '2%',
        }}
      >
        <Grid
          container
          wrap="nowrap"
          justify="center"
          alignItems="center"
          direction="column"
          style={{
            height: '100%',
          }}
        >
          <Grid
            container
            justify="center"
            direction="column"
            style={{
              width: '60%',
              paddingBottom: '2rem',
            }}
          >
            <Grid>
              <Typography
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.4rem',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#16253D',
                }}
              >
                Your referral link
              </Typography>
            </Grid>
            <Grid>
              <Typography
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#7284A0',
                }}
              >
                copy it and send to anyone who may be intrerested in
                cryptocurrencies.ai
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{ width: '60%', paddingBottom: '2rem' }}
          >
            <StyledInputReferral value={refferralLink} />
            <Grid style={{ padding: '0 1rem' }}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  backgroundColor: '#0B1FD1',
                  padding: '2rem 3rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  lineHeight: '109.6%',
                  letterSpacing: '1.5px',
                  borderRadius: '4px',
                  boxShadow: '0px 8px 12px rgba(8, 22, 58, 0.3)',
                }}
                onClick={copyReferralLink}
              >
                Copy
              </Button>
            </Grid>
          </Grid>
          <ProfileSettingsGrid
            title="Referrals"
            width="60%"
            height="auto"
            style={{ overflow: 'scroll' }}
          >
            <ProfileSettingsCentredBlock>
              <Grid style={{ paddingTop: '2rem' }}>
                <Typography
                  style={{
                    fontWeight: 'bold',
                    fontSize: '5rem',
                    letterSpacing: '0.01em',
                    color: '#235DCF',
                  }}
                >
                  {count}
                </Typography>
              </Grid>
              <Grid style={{ paddingBottom: '2rem' }}>
                <Typography
                  style={{
                    fontWeight: 'bold',
                    fontSize: '2.2rem',
                    letterSpacing: '0.01em',
                    color: '#16253D',
                  }}
                >
                  Referrals
                </Typography>
              </Grid>
            </ProfileSettingsCentredBlock>
          </ProfileSettingsGrid>
        </Grid>
      </Grid>
    </>
  )
}

export default compose(
  withSnackbar,
  queryRendererHoc({
    query: getReferrals,
    name: 'getReferralsQuery',
    fetchPolicy: 'cache-and-network',
    withOutSpinner: false,
    withTableLoader: false,
  }),
  queryRendererHoc({
    query: getReferralCode,
    name: 'getReferralCodeQuery',
    fetchPolicy: 'cache-and-network',
    withOutSpinner: false,
    withTableLoader: false,
  }),
  graphql(registerSharedReferralLink, {
    name: 'registerSharedReferralLinkMutation',
  })
)(Referral)
