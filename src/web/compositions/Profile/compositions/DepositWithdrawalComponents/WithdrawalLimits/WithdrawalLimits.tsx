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
  showFee: boolean
}

const WithdrawalLimits = ({
  selectedCoin,
  getAssetDetailQuery,
  coinAmount,
  amountError,
  showFee,
}: IProps) => {
  const { getAssetDetail } = getAssetDetailQuery
  const { minWithdrawAmount = 0, withdrawFee = 0 } = getAssetDetail || {
    minWithdrawAmount: 0,
    withdrawFee: 0,
  }
  const minimalWithdrawalAmount = minWithdrawAmount || 0
  const transactionFee = withdrawFee || 0
  const amountGet = +coinAmount - transactionFee
  const actualAmountGet = +coinAmount > transactionFee ? amountGet : 0

  return (
    <>
      <StyledTypographyCaption
        style={{ paddingTop: '0.2rem', color: amountError ? '#DD6956' : '' }}
      >
        Minimum Withdrawal: {minimalWithdrawalAmount} {selectedCoin.label}
      </StyledTypographyCaption>
      <Grid item id="fee_block" style={{ padding: '3rem 0 1rem 0' }}>
        {showFee && (
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
            {actualAmountGet.toFixed(8)} {selectedCoin.label}
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
  showFee,
}: {
  selectedKey: string
  selectedCoin: {
    label: 'BTC' | string
    name: 'Bitcoin' | string
  }
  coinAmount: string
  amountError: boolean
  showFee: boolean
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
    })
  )(WithdrawalLimits)

  return (
    <WrappedComponent
      selectedCoin={selectedCoin}
      coinAmount={coinAmount}
      amountError={amountError}
      showFee={showFee}
    />
  )
}

export default WithdrawalLimitsDataWrapper
