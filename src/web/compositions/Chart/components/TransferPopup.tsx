import React, { useState } from 'react'
import { withSnackbar } from 'notistack'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { Grid, Typography } from '@material-ui/core'
import Timer from 'react-compound-timer'
import { Loading } from '@sb/components/index'

import { joinFuturesWarsRound } from '@core/graphql/mutations/futuresWars/joinFuturesWarsRound'
import { futuresTransfer } from '@core/graphql/mutations/keys/futuresTransfer'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import { StyledTypography } from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock.styles'
import InputAmount from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InputAmount'
import {
  CoinOption,
  CoinSingleValue,
} from '@sb/components/ReactSelectComponents/CoinOption'

import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'

interface IProps {
  selectedAccount: string
  transferFromSpotToFutures: boolean
  futuresTransferMutation?: (mutationObj: {
    variables: {
      input: {
        keyId: string
        asset: string
        amount: number
        type: number
      }
    }
  }) => Promise<any>
  open: boolean
  handleClose: () => void
  showFuturesTransfer: (result: any) => void
}

const TransferPopup = ({
  selectedAccount,
  transferFromSpotToFutures,
  open,
  handleClose,
  futuresTransferMutation,
  showFuturesTransfer,
  isFuturesWarsKey,
  futuresWarsRoundBet,
  joinFuturesWarsRoundMutation,
  enqueueSnackbar,
  timerForFuturesWars,
  loading,
  setLoading,
}: IProps) => {
  const [selectedCoin, setSelectedCoin] = useState({
    label: 'USDT',
    name: 'Tether',
  })
  const [coinAmount, setCoinAmount] = useState('')

  const transferHandler = async () => {
    handleClose()

    try {
      const response = await futuresTransferMutation({
        variables: {
          input: {
            keyId: selectedAccount,
            asset: selectedCoin.label,
            amount: +coinAmount,
            type: transferFromSpotToFutures ? 1 : 2,
          },
        },
      })

      showFuturesTransfer(response.data.futuresTransfer)
    } catch (e) {
      showFuturesTransfer({ status: 'ERR' })
    }
  }

  const showJoinFuturesWarsRoundStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with the result of join FuturesWars round',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    if (status === 'OK') {
      enqueueSnackbar(`Your successful join futures round`, {
        variant: 'success',
      })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  const joinFuturesWarsHandler = async () => {
    setLoading(true)
    handleClose()

    try {
      const response = await joinFuturesWarsRoundMutation({
        variables: {
          input: {
            keyId: selectedAccount,
            amount: +coinAmount,
          },
        },
      })

      showJoinFuturesWarsRoundStatus({
        status: response.data.joinFuturesWarsRound.status,
        errorMessage: response.data.joinFuturesWarsRound.errorMessage,
      })
    } catch (e) {
      showJoinFuturesWarsRoundStatus({ status: 'ERR', errorMessage: e.message })
    }
    setLoading(false)
  }

  return (
    <>
      <DialogWrapper
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={open}
        style={{
          borderRadius: '50%',
          paddingTop: 0,
        }}
      >
        <DialogTitleCustom
          id="customized-dialog-title"
          style={{
            backgroundColor: '#fff',
          }}
        >
          <TypographyCustomHeading
            fontWeight={'700'}
            style={{
              textAlign: 'center',
              fontSize: '1.4rem',
              letterSpacing: '1.5px',
              color: '#16253D',
            }}
          >
            {isFuturesWarsKey
              ? `Join futures wars`
              : transferFromSpotToFutures
              ? `Trasfer from spot to futures account`
              : `Trasfer from futures to spot account`}
          </TypographyCustomHeading>
        </DialogTitleCustom>
        <DialogContent
          justify="center"
          style={{
            padding: '0 3rem 3rem',
          }}
        >
          <Grid>
            <Grid style={{ paddingBottom: '1rem', textAlign: 'center' }}>
              {isFuturesWarsKey && futuresWarsRoundBet !== 0 && (
                <>
                  <Typography
                    style={{ paddingBottom: '1.4rem', color: '#16253D' }}
                  >
                    You replenish your futureswars account with{' '}
                    {futuresWarsRoundBet} USDT.
                  </Typography>
                  <Typography
                    style={{ paddingBottom: '1.4rem', color: '#16253D' }}
                  >
                    {futuresWarsRoundBet / 2} USDT is your bet, it will go to
                    the bank. The remaining {futuresWarsRoundBet / 2} USDT is
                    your capital for trading in this round.
                  </Typography>
                  <Typography
                    style={{ paddingBottom: '1.4rem', color: '#16253D' }}
                  >
                    Good luck!
                  </Typography>
                  {timerForFuturesWars && timerForFuturesWars.isEnabled && (
                    <Grid
                      container
                      alignItems="center"
                      justify="center"
                      wrap="nowrap"
                    >
                      <Typography
                        style={{
                          paddingBottom: '1.4rem',
                          paddingRight: '1.4rem',
                          color: '#16253D',
                        }}
                      >
                        Round started in:
                      </Typography>
                      <Typography
                        style={{
                          paddingBottom: '1.4rem',
                          color: '#16253D',
                          width: '20%',
                        }}
                      >
                        <Timer
                          initialTime={
                            (timerForFuturesWars.startedAt -
                            Math.floor(+new Date() / 1000)) * 1000
                          }
                          direction="backward"
                          startImmediately={true}
                        >
                          {() => (
                            <React.Fragment>
                              <Timer.Days />
                              {'D '}
                              <Timer.Hours />
                              {'H '}
                              <Timer.Minutes />
                              {'M '}
                              <Timer.Seconds />
                              {'S '}
                            </React.Fragment>
                          )}
                        </Timer>
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
              {isFuturesWarsKey && futuresWarsRoundBet === 0 && (
                <Typography>
                  The round is not started yet or the round bet is 0. You cannot
                  join the round before it's started or join round with 0 bet.
                </Typography>
              )}
            </Grid>
            <Grid style={{ paddingBottom: '2rem' }}>
              <StyledTypography>Coin:</StyledTypography>
              <SelectCoinList
                isDisabled={true}
                classNamePrefix="custom-select-box"
                components={{
                  Option: CoinOption,
                  SingleValue: CoinSingleValue,
                  DropdownIndicator: undefined,
                }}
                isSearchable={true}
                value={selectedCoin}
                // placeholder={selectedCoin}
                menuPortalTarget={document.body}
                menuPortalStyles={{
                  zIndex: 11111,
                }}
                // onChange={(optionSelected: {
                //   label: string
                //   value: string
                //   priceUSD: string | number
                // }) => {
                //   setSelectedCoin(optionSelected.value)
                // }}
                noOptionsMessage={() => `No such coin in our DB found`}
                dropdownIndicatorStyles={{
                  display: 'none',
                }}
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
                controlStyles={{
                  padding: '1rem 0 0 0',
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
            <Grid style={{ paddingBottom: '4rem' }}>
              <StyledTypography>Amount:</StyledTypography>
              <InputAmount
                selectedCoin={selectedCoin.label}
                selectedAccount={selectedAccount}
                marketType={
                  transferFromSpotToFutures && !isFuturesWarsKey
                    ? 0
                    : isFuturesWarsKey
                    ? 0
                    : 1
                }
                value={isFuturesWarsKey ? futuresWarsRoundBet : coinAmount}
                onClickAbornment={true}
                onChange={(e) => setCoinAmount(e.target.value)}
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid container justify="space-between">
              <BtnCustom
                btnWidth={'38%'}
                borderRadius={'8px'}
                btnColor={'#165BE0'}
                borderWidth={'2px'}
                fontWeight={'bold'}
                margin={'0 2rem 0 0'}
                height={'4rem'}
                fontSize={'1.2rem'}
                onClick={handleClose}
              >
                Cancel
              </BtnCustom>
              <BtnCustom
                disabled={
                  (isFuturesWarsKey && futuresWarsRoundBet === 0) ||
                  loading === true
                }
                btnWidth={'38%'}
                borderRadius={'8px'}
                btnColor={'#165BE0'}
                borderWidth={'2px'}
                fontWeight={'bold'}
                fontSize={'1.2rem'}
                height={'4rem'}
                onClick={
                  isFuturesWarsKey ? joinFuturesWarsHandler : transferHandler
                }
              >
                {isFuturesWarsKey && loading ? (
                  <Loading size={16} style={{ height: '16px' }} />
                ) : isFuturesWarsKey && !loading ? (
                  `Transfer USDT`
                ) : (
                  `Confirm`
                )}
              </BtnCustom>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default compose(
  withSnackbar,
  graphql(futuresTransfer, {
    name: 'futuresTransferMutation',
  }),
  graphql(joinFuturesWarsRound, {
    name: 'joinFuturesWarsRoundMutation',
  })
)(TransferPopup)
