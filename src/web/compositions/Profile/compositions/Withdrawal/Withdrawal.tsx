import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { withSnackbar } from 'notistack'

import { Grid } from '@material-ui/core'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { getProfileSettings } from '@core/graphql/queries/user/getProfileSettings'
import { withdrawal } from '@core/graphql/mutations/withdrawal/withdrawal'
import { confirmWithdrawal } from '@core/graphql/mutations/withdrawal/confirmWithdrawal'
import { getAccountSettings } from '@core/graphql/queries/user/getAccountSettings'
import {
  validateEnablingMfa,
  getUserProfileFromAuthResult,
  getToken,
  getUserIdFromToken,
} from '@core/utils/loginUtils'
import { Loading } from '@sb/components/index'

import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import AccountBlock from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock'
import RecentHistoryTable from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/RecentHistoryTable'
import InputAmount from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InputAmount'
import WithdrawalEnableMfaPopup from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/WithdrawalEnableMfaPopup/WithdrawalEnableMfaPopup'
import WithdrawalAuthentificatePopup from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/WithdrawalAuthentificatePopup/WithdrawalAuthentificatePopup'
import WithdrawalRequestPopup from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/WithdrawalRequestPopup/WithdrawalRequestPopup'

import {
  StyledInput,
  StyledTypography,
  StyledTypographyCaption,
} from './Withdrawal.styles'
import { IProps } from './Withdrawal.types'
import { validateTransactionAmount } from './Withdrawal.utils'

const Withdrawal = ({ ...props }: IProps) => {
  const {
    withdrawalSettings,
  } = props.getProfileSettingsQuery.getProfileSettings
  const { selectedKey: tempSelectedKey = '' } = withdrawalSettings || {
    selectedKey: '',
  }
  const selectedKey = tempSelectedKey || ''

  const [selectedCoin, setSelectedCoin] = useState({
    label: 'BTC',
    name: 'Bitcoin',
  })
  const [coinAddress, setCoinAddress] = useState('')
  const [coinAmount, setCoinAmount] = useState('')
  const [amountError, setAmountError] = useState(false)
  const [addressError, setAddressError] = useState(false)
  const [openEnableMfaPopup, toggleEnableMfaPopup] = useState(false)
  const [
    withdrawalAuthentificatePopup,
    toggleWithdrawalAuthentificatePopup,
  ] = useState(false)
  const [withdrawalRequestPopup, toggleWithdrawalRequestPopup] = useState(false)
  const [withdrawalRequestLoading, toggleWithdrawalRequestLoading] = useState(
    false
  )
  const [withdrawalRequestId, setWithdrawalRequestId] = useState('')

  const [loading, setLoading] = useState(false)

  const minimalWithdrawalAmount = 0
  const transactionFee = 0
  const actualAmountGet = +coinAmount - transactionFee

  const networkChange = () => {}

  const showWithdrawalStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with your withdrawal',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    if (status === 'OK') {
      props.enqueueSnackbar(`Your withdrawal verification is completed `, {
        variant: 'success',
      })
    } else {
      props.enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  const goToProfileSettingsHandler = async (): Promise<void> => {
    const {
      history: { push },
    } = props
    push('/profile/settings')
  }

  const goToConfirmWithdrawalHandler = async ({
    withdrawalId,
  }: {
    withdrawalId: string
  }): Promise<void> => {
    const {
      history: { push },
    } = props
    push(`/profile/confirmWithdrawal/${withdrawalId}`)
  }

  const withdrawalMutationHandler = async (): Promise<{
    status: 'ERR' | 'OK'
    errorMessage: string
    withdrawalId?: string
  }> => {
    let result: {
      status: 'ERR' | 'OK'
      errorMessage: string
      withdrawalId?: string
    }
    try {
      const res = await props.withdrawalMutation({
        variables: {
          input: {
            address: coinAddress,
            amount: +coinAmount,
            symbol: selectedCoin.label,
            keyId: selectedKey,
          },
        },
      })

      if (res.data.withdrawal && res.data.withdrawal.data) {
        result = {
          status: 'OK',
          errorMessage: '',
          withdrawalId: res.data.withdrawal.data,
        }
      } else {
        result = {
          status: 'ERR',
          errorMessage: res.data.withdrawal.errorMessage,
        }
      }
    } catch (e) {
      result = {
        status: 'ERR',
        errorMessage: e.message,
      }
    }

    return result
  }

  const processWithdrawalRequestHandler = async () => {
    toggleWithdrawalAuthentificatePopup(false)
    toggleWithdrawalRequestPopup(true)
    toggleWithdrawalRequestLoading(true)
    const resultOfRequest = await withdrawalMutationHandler()

    if (resultOfRequest && resultOfRequest.withdrawalId) {
      showWithdrawalStatus({
        status: 'OK',
        errorMessage: '',
      })

      setWithdrawalRequestId(resultOfRequest.withdrawalId)
      toggleWithdrawalRequestLoading(false)
      toggleWithdrawalRequestPopup(false)
      goToConfirmWithdrawalHandler({
        withdrawalId: resultOfRequest.withdrawalId,
      })

      return
    }

    showWithdrawalStatus({
      status: 'ERR',
      errorMessage: resultOfRequest.errorMessage,
    })

    toggleWithdrawalRequestPopup(false)
    toggleWithdrawalRequestLoading(false)
  }

  const onLoginForWithdrawal = async (
    rawProfile: any,
    idToken: any,
    accessToken = ''
  ) => {
    const processedProfile = getUserProfileFromAuthResult(rawProfile)
    const mfaEnabled = processedProfile.mfaEnabled
    const userId = processedProfile.sub

    if (!mfaEnabled) {
      showWithdrawalStatus({
        status: 'ERR',
        errorMessage: 'MFA is not enabled for your account',
      })
      return
    }

    const oldToken = await getToken()
    const oldUserId = getUserIdFromToken(oldToken)

    if (oldUserId !== userId) {
      showWithdrawalStatus({
        status: 'ERR',
        errorMessage: 'Different accounts used for confirming withdrawal',
      })
      return
    }

    // TODO: maybe we should update accessToken & idToken in localstorage also here to prevent hacks

    processWithdrawalRequestHandler()
  }

  return (
    <>
      <WithdrawalEnableMfaPopup
        open={openEnableMfaPopup}
        handleClose={() => toggleEnableMfaPopup(false)}
        goToProfileSettingsHandler={goToProfileSettingsHandler}
      />
      <WithdrawalAuthentificatePopup
        open={withdrawalAuthentificatePopup}
        handleClose={() => toggleWithdrawalAuthentificatePopup(false)}
        onLoginForWithdrawal={onLoginForWithdrawal}
      />
      <WithdrawalRequestPopup
        withdrawalRequestLoading={withdrawalRequestLoading}
        open={withdrawalRequestPopup}
        handleClose={() => toggleWithdrawalRequestPopup(false)}
      />
      <Grid
        container
        justify="center"
        style={{
          height: '67%',
          padding: '1.5rem 1rem',
          border: '2px solid #E0E5EC',
          boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
          borderRadius: '32px',
          marginBottom: '2%',
        }}
      >
        <AccountBlock
          isDepositPage={false}
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          selectedKey={selectedKey}
        />

        <Grid
          id="right_block"
          container
          direction="column"
          alignItems="center"
          justify="center"
          style={{ width: '65%', paddingLeft: '20%' }}
        >
          <Grid
            container
            direction="column"
            spacing={32}
            // style={{ width: 'auto' }}
          >
            {/* <Grid item>
              <StyledTypography style={{ paddingBottom: '1rem' }}>
                Select network
              </StyledTypography>
              <PillowButton
                firstHalfText={'BTC'}
                secondHalfText={'BEP2'}
                activeHalf={true ? 'first' : 'second'}
                changeHalf={networkChange}
                buttonAdditionalStyle={{
                  width: '40%',
                  borderWidth: '2px',
                }}
                containerStyle={{
                  margin: 0,
                }}
              />
            </Grid> */}
            <Grid item>
              <StyledTypography style={{ paddingBottom: '1rem' }}>
                BTC address
              </StyledTypography>
              <StyledInput
                error={addressError}
                value={coinAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setCoinAddress(e.target.value)
                  setAddressError(false)
                }}
              />
              <StyledTypography
                style={{ paddingBottom: '1rem', paddingTop: '1rem' }}
              >
                Amount
              </StyledTypography>
              <Grid
                style={{
                  height: '6rem',
                  overflow: 'hidden',
                  paddingTop: '1px',
                }}
              >
                <InputAmount
                  error={amountError}
                  selectedCoin={selectedCoin.label}
                  selectedAccount={selectedKey}
                  value={coinAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCoinAmount(e.target.value)
                    setAmountError(false)
                  }}
                />
              </Grid>
              <StyledTypographyCaption style={{ paddingTop: '0.2rem' }}>
                Minimum Withdrawal: {minimalWithdrawalAmount}{' '}
                {selectedCoin.label}
              </StyledTypographyCaption>
              <Grid item id="fee_block" style={{ padding: '3rem 0 1rem 0' }}>
                <Grid container>
                  <StyledTypography>Transaction fee:</StyledTypography>
                  <StyledTypography
                    style={{ color: '#16253D', marginLeft: '1rem' }}
                  >
                    {transactionFee}
                  </StyledTypography>
                </Grid>
                <Grid container>
                  <StyledTypography>You will get:</StyledTypography>
                  <StyledTypography
                    style={{ color: '#16253D', marginLeft: '1rem' }}
                  >
                    {actualAmountGet}
                  </StyledTypography>
                </Grid>
              </Grid>
              <Grid style={{ paddingTop: '16px' }}>
                <BtnCustom
                  disabled={loading}
                  btnWidth={'80%'}
                  borderRadius={'8px'}
                  btnColor={'#165BE0'}
                  borderWidth={'2px'}
                  fontWeight={'bold'}
                  margin={'0 2rem 0 0'}
                  height={'4rem'}
                  fontSize={'1.2rem'}
                  onClick={async () => {
                    setLoading(true)
                    const isAddressIsNotEmpty = !!coinAddress.length
                    if (!isAddressIsNotEmpty) {
                      setAddressError(true)
                      setLoading(false)
                      return
                    }

                    const isCoinAmountIsEnoughToProcessTransaction = validateTransactionAmount(
                      {
                        amount: +coinAmount,
                        transactionFee,
                        minimalWithdrawalAmount,
                      }
                    )

                    if (!isCoinAmountIsEnoughToProcessTransaction) {
                      setLoading(false)
                      setAmountError(true)
                      return
                    }

                    const IsMfaEnabled = await validateEnablingMfa()

                    if (!IsMfaEnabled) {
                      showWithdrawalStatus({
                        status: 'ERR',
                        errorMessage:
                          'MFA is disabled. Please enable mfa first to process withdrawal',
                      })
                      setLoading(false)
                      toggleEnableMfaPopup(true)
                      return
                    }

                    setLoading(false)
                    toggleWithdrawalAuthentificatePopup(true)
                  }}
                >
                  {loading ? (
                    <Loading size={16} style={{ height: '16px' }} />
                  ) : (
                    `Submit`
                  )}
                </BtnCustom>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <RecentHistoryTable isDepositPage={false} specificKey={selectedKey} />
    </>
  )
}

export default compose(
  withSnackbar,
  withRouter,
  graphql(withdrawal, { name: 'withdrawalMutation' }),
  graphql(confirmWithdrawal, { name: 'confirmWithdrawalMutation' }),
  queryRendererHoc({
    query: getProfileSettings,
    name: 'getProfileSettingsQuery',
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    query: getAccountSettings,
    name: 'getAccountSettingsQuery',
    fetchPolicy: 'cache-and-network',
  })
)(Withdrawal)
