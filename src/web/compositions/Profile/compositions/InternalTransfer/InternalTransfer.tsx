import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { Grid, Typography } from '@material-ui/core'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { getProfileSettings } from '@core/graphql/queries/user/getProfileSettings'
import { transferInternal } from '@core/graphql/mutations/keys/transferInternal'
import { validateTransactionAmount } from '../Withdrawal/Withdrawal.utils'

// import SvgIcon from '@sb/components/SvgIcon'
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

import { StyledTypography } from '../Withdrawal/Withdrawal.styles'
import { IProps } from './InternalTransfer.types'

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

  const {
    internalTransferSettings,
  } = props.getProfileSettingsQuery.getProfileSettings
  const {
    selectedKeyFrom: tempSelectedKeyFrom = '',
    selectedKeyTo: tempSelectedKeyTo = '',
  } = internalTransferSettings || {
    selectedKeyTo: '',
  }
  const selectedKeyFrom = tempSelectedKeyFrom || ''
  const selectedKeyTo = tempSelectedKeyTo || ''
  const selectedPortfolioFrom = ''
  const selectedPortfolioTo = ''

  //   const [popupOpened, togglePopup] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState({
    label: 'BTC',
    name: 'Bitcoin',
  })
  const [coinAmount, setCoinAmount] = useState('')
  const [amountError, setAmountError] = useState(false)
  const [internalTransferPopup, toggleInternalTransferPopup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [internalLoading, setInternalLoading] = useState(false)

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
            keyIdFrom: selectedKeyFrom,
            keyIdTo: selectedKeyTo,
          },
        },
      })

      if (res.data.transferInternal && res.data.transferInternal.data) {
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
    setInternalLoading(true)
    const resultOfRequest = await internalTransferMutationHandler()

    if (resultOfRequest && resultOfRequest.status === 'OK') {
      showInternalTransferStatus({
        status: 'OK',
        errorMessage: '',
      })

      toggleInternalTransferPopup(false)
      setInternalLoading(false)
      return
    }

    showInternalTransferStatus({
      status: 'ERR',
      errorMessage: resultOfRequest.errorMessage,
    })

    toggleInternalTransferPopup(false)
    setInternalLoading(false)
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
          height: '67%',
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
          selectedPortfolioFrom={selectedPortfolioFrom}
          selectedPortfolioTo={selectedPortfolioTo}
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
                    overflowY: 'auto',
                    boxShadow: 'none',
                    border: 'none',
                  }}
                  menuListStyles={{
                    height: '16rem',
                    overflowY: '',
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
                  selectedAccount={selectedKeyFrom}
                  value={coinAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCoinAmount(e.target.value)
                    setAmountError(false)
                  }}
                />
              </Grid>
              <Grid style={{ height: '8.5rem', overflow: 'hidden' }}>
                <WithdrawalLimits
                  amountError={amountError}
                  selectedKey={selectedKeyFrom}
                  selectedCoin={selectedCoin}
                  coinAmount={coinAmount}
                />
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

                    setLoading(false)
                    toggleInternalTransferPopup(true)
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

export default compose(
  graphql(transferInternal, { name: 'transferInternalMutation' }),
  queryRendererHoc({
    query: getProfileSettings,
    name: 'getProfileSettingsQuery',
    fetchPolicy: 'cache-and-network',
  })
)(InternalTransfer)
