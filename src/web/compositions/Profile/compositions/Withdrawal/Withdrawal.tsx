import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { Grid } from '@material-ui/core'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { getProfileSettings } from '@core/graphql/queries/user/getProfileSettings'
import { withdrawal } from '@core/graphql/mutations/withdrawal/withdrawal'
import { confirmWithdrawal } from '@core/graphql/mutations/withdrawal/confirmWithdrawal'


import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import AccountBlock from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock'
import RecentHistoryTable from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/RecentHistoryTable'
import InputAmount from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InputAmount'
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

  const minimalWithdrawalAmount = 0.000001
  const transactionFee = 0.000003241
  const actualAmountGet = +coinAmount - transactionFee

  const networkChange = () => {}

  return (
    <>
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
                  btnWidth={'80%'}
                  borderRadius={'8px'}
                  btnColor={'#165BE0'}
                  borderWidth={'2px'}
                  fontWeight={'bold'}
                  margin={'0 2rem 0 0'}
                  height={'4rem'}
                  fontSize={'1.2rem'}
                  onClick={() => {
                    const isAddressIsNotEmpty = !!coinAddress.length
                    if (!isAddressIsNotEmpty) {
                      setAddressError(true)
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
                      setAmountError(true)
                      return
                    }
                  }}
                >
                  Submit
                </BtnCustom>
              </Grid>
            </Grid>
            {/* <Grid item>
              <Grid container justify="space-between" style={{ width: '80%' }}>
                <Grid>
                  <SvgIcon src={exclamationMark} width="9.5px" height="auto" />
                </Grid>
                <Grid style={{ width: '89%' }}>
                  <Typography
                    style={{ color: '#16253D', paddingBottom: '1rem' }}
                  >
                    Send only BTC to this deposit address.
                  </Typography>
                  <Typography>
                    Sending coin or token other than BTC to this address may
                    result in the loss of your deposit.
                  </Typography>
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
      <RecentHistoryTable isDepositPage={false} specificKey={selectedKey} />
    </>
  )
}

export default compose(
  graphql(withdrawal, { name: 'withdrawalMutation' }),
  graphql(confirmWithdrawal, { name: 'confirmWithdrawalMutation' }),
  queryRendererHoc({
    query: getProfileSettings,
    name: 'getProfileSettingsQuery',
    fetchPolicy: 'cache-and-network',
  })
)(Withdrawal)
