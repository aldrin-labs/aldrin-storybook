import React from 'react'
import { compose } from 'recompose'
import { Grid } from '@material-ui/core'

import { getAssetDetail } from '@core/graphql/queries/keys/getAssetDetail'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'

import {
  StyledTypography,
  StyledTypographyCaption,
} from '@sb/compositions/Profile/compositions/Withdrawal/Withdrawal.styles'

export interface IProps {
  selectedCoin: {
    label: 'BTC' | string
    name: 'Bitcoin' | string
  }
  coinAmount: string
  getAssetDetailQuery: {
    getAssetDetail: {
      minWithdrawAmount: number
      depositStatus: boolean
      withdrawFee: number
      withdrawStatus: boolean
      depositTip: string
    }
  }
  amountError: boolean
  isInternalTransfer: boolean
}

const WithdrawalLimits = ({
  selectedCoin,
  getAssetDetailQuery,
  coinAmount = '0',
  amountError,
  isInternalTransfer,
}: IProps) => {
  const { getAssetDetail } = getAssetDetailQuery || {
    getAssetDetail: null,
  }
  const { minWithdrawAmount = 0, withdrawFee = 0 } = getAssetDetail || {
    minWithdrawAmount: 0,
    withdrawFee: 0,
  }
  const minimalWithdrawalAmount = minWithdrawAmount || 0
  const transactionFee = withdrawFee || 0
  const amountGet = +coinAmount - transactionFee
  const actualAmountGet = +coinAmount > transactionFee ? amountGet : 0
  const finalAmount = isInternalTransfer ? +coinAmount : actualAmountGet

  return (
    <>
      {!isInternalTransfer && (
        <StyledTypographyCaption
          style={{ paddingTop: '0.2rem', color: amountError ? '#DD6956' : '' }}
        >
          Minimum Withdrawal: {minimalWithdrawalAmount} {selectedCoin.label}
        </StyledTypographyCaption>
      )}
      <Grid
        item
        id="fee_block"
        style={{ padding: isInternalTransfer ? '' : '3rem 0 1rem 0' }}
      >
        {!isInternalTransfer && (
          <Grid container>
            <StyledTypography>Transaction fee:</StyledTypography>
            <StyledTypography style={{ color: '#16253D', marginLeft: '1rem' }}>
              {transactionFee} {selectedCoin.label}
            </StyledTypography>
          </Grid>
        )}
        <Grid container>
          <StyledTypography>You will get:</StyledTypography>
          <StyledTypography style={{ color: '#16253D', marginLeft: '1rem' }}>
            {finalAmount.toFixed(8)} {selectedCoin.label}
          </StyledTypography>
        </Grid>
      </Grid>
    </>
  )
}

const WithdrawalLimitsDataWrapper = ({
  selectedKey,
  selectedCoin,
  coinAmount,
  amountError,
  isInternalTransfer,
}: {
  selectedKey: string
  selectedCoin: {
    label: 'BTC' | string
    name: 'Bitcoin' | string
  }
  coinAmount: string
  amountError: boolean
  isInternalTransfer: boolean
}) => {
  const WrappedComponent = compose(
    queryRendererHoc({
      query: getAssetDetail,
      name: 'getAssetDetailQuery',
      fetchPolicy: 'cache-and-network',
      variables: {
        input: {
          keyId: selectedKey,
          symbol: selectedCoin.label,
        },
      },
      withOutSpinner: true,
      withTableLoader: true,
      withoutLoading: true,
    })
  )(WithdrawalLimits)

  return (
    <WrappedComponent
      selectedCoin={selectedCoin}
      coinAmount={coinAmount}
      amountError={amountError}
      isInternalTransfer={isInternalTransfer}
    />
  )
}

export default WithdrawalLimitsDataWrapper
