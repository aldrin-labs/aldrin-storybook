import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { Grid } from '@material-ui/core'
import { withSnackbar } from 'notistack'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { getProfileSettings } from '@core/graphql/queries/user/getProfileSettings'
import { getAssetDetail } from '@core/graphql/queries/keys/getAssetDetail'
import { transferInternal } from '@core/graphql/mutations/keys/transferInternal'
import { validateTransactionAmount } from '../Withdrawal/Withdrawal.utils'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import InternalTransferAccountBlock from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InternalTransferAccountBlock'
import InputAmount from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InputAmount'
import WithdrawalLimits from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/WithdrawalLimits/WithdrawalLimits'
import { Loading } from '@sb/components/index'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import {
  CoinOption,
  CoinSingleValue,
} from '@sb/components/ReactSelectComponents/CoinOption'
import { addGAEvent } from '@core/utils/ga.utils'

import { StyledTypography } from '../Withdrawal/Withdrawal.styles'
import { IProps, ReactSelectOptionType } from './InternalTransfer.types'

const InternalTransfer = ({ ...props }: IProps) => {
  // we need it here also to update data when it's updated in cache
  const {
    getAssetDetailQuery: { getAssetDetail } = {
      getAssetDetail: {
        minWithdrawAmount: 0,
        withdrawFee: 0,
      },
    },
  } = props
  const { minWithdrawAmount = 0, withdrawFee = 0 } = getAssetDetail || {
    minWithdrawAmount: 0,
    withdrawFee: 0,
  }
  const minimalWithdrawalAmount = minWithdrawAmount || 0
  const transactionFee = withdrawFee || 0

  // const {
  //   internalTransferSettings,
  // } = props.getProfileSettingsQuery.getProfileSettings
  // const {
  //   selectedKeyFrom: tempSelectedKeyFrom = '',
  //   selectedKeyTo: tempSelectedKeyTo = '',
  // } = internalTransferSettings || {
  //   selectedKeyTo: '',
  // }
  // const selectedKeyFrom = tempSelectedKeyFrom || ''
  // const selectedKeyTo = tempSelectedKeyTo || ''

  const {
    selectedCoin,
    setSelectedCoin,
    selectedKeyFrom,
    selectedKeyTo,
    selectKeyFrom,
    selectKeyTo,
    selectedPortfolioFrom,
    selectPortfolioFrom,
    selectedPortfolioTo,
    selectPortfolioTo,
  } = props
  //   const [popupOpened, togglePopup] = useState(false)

  const [coinAmount, setCoinAmount] = useState('')
  const [amountError, setAmountError] = useState(false)
  const [loading, setLoading] = useState(false)

  const showInternalTransferStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with your internal transfer',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    if (status === 'OK') {
      props.enqueueSnackbar(`Your internal transfer is completed `, {
        variant: 'success',
      })
    } else {
      props.enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  const internalTransferMutationHandler = async (): Promise<{
    status: 'ERR' | 'OK'
    errorMessage: string
  }> => {
    addGAEvent({
      action: 'Internal transfer',
      category: 'App - Internal transfer',
      label: `internal_transfer_between_portfolios`,
    })

    let result: {
      status: 'ERR' | 'OK'
      errorMessage: string
    }
    try {
      const res = await props.transferInternalMutation({
        variables: {
          input: {
            amount: +coinAmount,
            symbol: selectedCoin.label,
            keyIdFrom: selectedKeyFrom.value,
            keyIdTo: selectedKeyTo.value,
          },
        },
      })

      if (
        res.data.transferInternal &&
        res.data.transferInternal.status === 'OK'
      ) {
        result = {
          status: 'OK',
          errorMessage: '',
        }
      } else {
        result = {
          status: 'ERR',
          errorMessage: res.data.transferInternal.errorMessage,
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

  const processInternalTransferRequestHandler = async () => {
    const resultOfRequest = await internalTransferMutationHandler()

    if (resultOfRequest && resultOfRequest.status === 'OK') {
      showInternalTransferStatus({
        status: 'OK',
        errorMessage: '',
      })

      return
    }

    showInternalTransferStatus({
      status: 'ERR',
      errorMessage: resultOfRequest.errorMessage,
    })
  }

  return (
    <>
      {/* <QRCodePopup
        open={popupOpened}
        coinAddress={coinAddress}
        handleClose={() => togglePopup(false)}
      /> */}
      <Grid
        container
        justify="center"
        style={{
          height: '100%',
          padding: '5% 1%',
          border: '2px solid #E0E5EC',
          boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
          borderRadius: '32px',
          marginBottom: '2%',
        }}
      >
        <InternalTransferAccountBlock
          selectedKeyFrom={selectedKeyFrom}
          selectedKeyTo={selectedKeyTo}
          selectKeyFrom={selectKeyFrom}
          selectKeyTo={selectKeyTo}
          selectedPortfolioFrom={selectedPortfolioFrom}
          selectedPortfolioTo={selectedPortfolioTo}
          selectPortfolioFrom={selectPortfolioFrom}
          selectPortfolioTo={selectPortfolioTo}
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
            <Grid item id="coins_block">
              <StyledTypography>Coin</StyledTypography>
              <Grid
                style={{
                  height: '6rem',
                  padding: '1rem 0 0 0',
                  overflow: 'hidden',
                  width: '80%',
                }}
              >
                <SelectCoinList
                  classNamePrefix="custom-select-box"
                  isSearchable={true}
                  components={{
                    Option: CoinOption,
                    SingleValue: CoinSingleValue,
                    DropdownIndicator: undefined,
                  }}
                  menuPortalTarget={document.body}
                  menuPortalStyles={{
                    zIndex: 11111,
                  }}
                  value={selectedCoin}
                  onChange={(optionSelected: {
                    label: string
                    name: string
                  }) => {
                    setSelectedCoin({
                      label: optionSelected.label,
                      name: optionSelected.name,
                    })
                  }}
                  noOptionsMessage={() => `Start typing to search the coin`}
                  menuStyles={{
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    padding: '0',
                    borderRadius: '1.5rem',
                    textAlign: 'center',
                    background: 'white',
                    position: 'relative',
                    // overflowY: 'auto',
                    boxShadow: 'none',
                    border: 'none',
                  }}
                  menuListStyles={{
                    height: '16rem',
                    // overflowY: '', 
                  }}
                  optionStyles={{
                    height: '4rem',
                    background: 'transparent',
                    fontSize: '1.4rem',
                    textTransform: 'uppercase',
                    padding: '0',

                    '&:hover': {
                      borderRadius: '0.8rem',
                      color: '#16253D',
                      background: '#E7ECF3',
                    },
                  }}
                  clearIndicatorStyles={{
                    padding: '2px',
                  }}
                  inputStyles={{
                    fontSize: '1.4rem',
                    marginLeft: '0',
                  }}
                  valueContainerStyles={{
                    border: '2px solid #E0E5EC',
                    borderRadius: '8px',
                    background: '#fff',
                    paddingLeft: '15px',
                    height: '5rem',
                    '&:hover': {
                      borderColor: '#165BE0',
                    },
                  }}
                  noOptionsMessageStyles={{
                    textAlign: 'left',
                  }}
                  singleValueStyles={{
                    color: '#16253D',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    height: '100%',
                    padding: '0.5rem 0',
                  }}
                  placeholderStyles={{
                    color: '#16253D',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                />
              </Grid>
            </Grid>
            <Grid item>
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
                  selectedAccount={selectedKeyFrom.value}
                  value={coinAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCoinAmount(e.target.value)
                    setAmountError(false)
                  }}
                />
              </Grid>
              <Grid style={{ height: '8.5rem', overflow: 'hidden' }}>
                <WithdrawalLimits
                  isInternalTransfer={true}
                  amountError={amountError}
                  selectedKey={selectedKeyFrom.value}
                  selectedCoin={selectedCoin}
                  coinAmount={coinAmount}
                />
              </Grid>
              <Grid style={{ paddingTop: '16px' }}>
                <BtnCustom
                  disabled={
                    loading ||
                    selectedKeyFrom.value === '' ||
                    selectedKeyTo.value === ''
                  }
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

                    // const isCoinAmountIsEnoughToProcessTransaction = validateTransactionAmount(
                    //   {
                    //     amount: +coinAmount,
                    //     transactionFee,
                    //     minimalWithdrawalAmount,
                    //   }
                    // )

                    // if (!isCoinAmountIsEnoughToProcessTransaction) {
                    //   setLoading(false)
                    //   setAmountError(true)
                    //   return
                    // }

                    await processInternalTransferRequestHandler()
                    setLoading(false)
                    // toggleInternalTransferPopup(true)
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
    </>
  )
}

const InternalTransferDataWrapper = ({ ...props }) => {
  const [selectedCoin, setSelectedCoin] = useState({
    label: 'BTC',
    name: 'Bitcoin',
  })

  const [selectedKeyFrom, selectKeyFrom] = useState({ label: '', value: '' })
  const [selectedKeyTo, selectKeyTo] = useState({ label: '', value: '' })
  const [selectedPortfolioFrom, selectPortfolioFrom] = useState({
    label: '',
    value: '',
  })
  const [selectedPortfolioTo, selectPortfolioTo] = useState({
    label: '',
    value: '',
  })

  const handleSelectPortfolioFrom = (arg: ReactSelectOptionType) => {
    selectPortfolioFrom(arg)
    selectKeyFrom({ label: '', value: '' })
  }

  const handleSelectPortfolioTo = (arg: ReactSelectOptionType) => {
    selectPortfolioTo(arg)
    selectKeyTo({ label: '', value: '' })
  }

  const WrappedComponent = compose(
    queryRendererHoc({
      query: getAssetDetail,
      name: 'getAssetDetailQuery',
      variables: {
        input: {
          keyId: selectedKeyFrom.value,
          symbol: selectedCoin.label,
        },
      },
      fetchPolicy: 'cache-only',
    })
  )(InternalTransfer)

  return (
    <WrappedComponent
      selectedCoin={selectedCoin}
      setSelectedCoin={setSelectedCoin}
      selectedKeyFrom={selectedKeyFrom}
      selectedKeyTo={selectedKeyTo}
      selectKeyFrom={selectKeyFrom}
      selectKeyTo={selectKeyTo}
      selectedPortfolioFrom={selectedPortfolioFrom}
      selectPortfolioFrom={handleSelectPortfolioFrom}
      selectedPortfolioTo={selectedPortfolioTo}
      selectPortfolioTo={handleSelectPortfolioTo}
      {...props}
    />
  )
}

export default compose(
  withSnackbar,
  graphql(transferInternal, { name: 'transferInternalMutation' }),
  queryRendererHoc({
    query: getProfileSettings,
    name: 'getProfileSettingsQuery',
    fetchPolicy: 'cache-and-network',
  })
)(InternalTransferDataWrapper)
