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
import SelectKeyListDW from '@core/components/SelectKeyListDW/SelectKeyListDW'
import { StyledTypography } from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock.styles'
import InputAmount from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InputAmount'

import {
  CoinOption,
  CoinSingleValue,
} from '@sb/components/ReactSelectComponents/CoinOption'

import {
  AccountOption,
  AccountSingleValue,
} from '@sb/components/ReactSelectComponents/AccountOption'

import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'
import { addGAEvent } from '@core/utils/ga.utils'
import { stubFalse } from 'lodash'

interface IProps {
  selectedAccount: string
  transferFromSpotToFutures: boolean
  futuresTransferMutation: (mutationObj: {
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
  theme: Theme
}

const TransferPopup = ({
  haveSelectedAccount = true,
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
  theme,
}: IProps) => {
  const [selectedCoin, setSelectedCoin] = useState({
    label: 'USDT',
    name: 'Tether',
  })
  const [coinAmount, setCoinAmount] = useState('')
  const [selectedAccountOption, setSelectedAccount] = useState({
    label: 'Select account',
    value: '',
    keyId: '',
  })

  const transferHandler = async () => {
    handleClose()

    try {
      const response = await futuresTransferMutation({
        variables: {
          input: {
            keyId: haveSelectedAccount
              ? selectedAccount
              : selectedAccountOption.keyId,
            asset: selectedCoin.label,
            amount: +coinAmount,
            type: transferFromSpotToFutures ? 1 : 2,
          },
        },
      })

      addGAEvent({
        action: 'Transfer balance',
        category: 'App - Transfer balance',
        label: `transfer_balance_from_${
          transferFromSpotToFutures ? `spot` : `futures`
        }`,
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
        theme={theme}
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={open}
        style={{
          borderRadius: '50%',
          paddingTop: 0,
        }}
      >
        <DialogTitleCustom id="customized-dialog-title" theme={theme}>
          <TypographyCustomHeading
            fontWeight={'700'}
            theme={theme}
            style={{
              textAlign: 'center',
              fontSize: '1.4rem',
              letterSpacing: '1.5px',
              color: theme.palette.dark.main,
            }}
          >
            {isFuturesWarsKey
              ? `Join futures wars`
              : transferFromSpotToFutures
              ? `Transfer from spot to futures account`
              : `Transfer from futures to spot account`}
          </TypographyCustomHeading>
        </DialogTitleCustom>
        <DialogContent
          theme={theme}
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
                    style={{
                      paddingBottom: '1.4rem',
                      color: theme.palette.dark.main,
                    }}
                  >
                    You replenish your futureswars account with{' '}
                    {futuresWarsRoundBet} USDT.
                  </Typography>
                  <Typography
                    style={{
                      paddingBottom: '1.4rem',
                      color: theme.palette.dark.main,
                    }}
                  >
                    {futuresWarsRoundBet / 2} USDT is your bet, it will go to
                    the bank. The remaining {futuresWarsRoundBet / 2} USDT is
                    your capital for trading in this round.
                  </Typography>
                  <Typography
                    style={{
                      paddingBottom: '1.4rem',
                      color: theme.palette.dark.main,
                    }}
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
                          color: theme.palette.dark.main,
                        }}
                      >
                        Round started in:
                      </Typography>
                      <Typography
                        style={{
                          paddingBottom: '1.4rem',
                          color: theme.palette.dark.main,
                          width: '20%',
                        }}
                      >
                        <Timer
                          initialTime={
                            (timerForFuturesWars.startedAt -
                              Math.floor(+new Date() / 1000)) *
                            1000
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
            {!haveSelectedAccount && (
              <Grid style={{ paddingBottom: '2rem' }}>
                <StyledTypography>Account:</StyledTypography>
                <SelectKeyListDW
                  isDeposit={false}
                  isAnother={true}
                  value={selectedAccountOption}
                  onChange={(obj) => setSelectedAccount(obj)}
                  classNamePrefix="custom-select-box"
                  components={{
                    Option: AccountOption,
                    SingleValue: AccountSingleValue,
                    DropdownIndicator: undefined,
                  }}
                  isSearchable={false}
                  menuPortalTarget={document.body}
                  menuPortalStyles={{
                    zIndex: 11111,
                  }}
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
                  controlStyles={{
                    padding: '.5rem 0 0 0',
                  }}
                />
              </Grid>
            )}
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
                isSearchable={false}
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
                  background: theme.palette.white.background,
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
                    color: theme.palette.dark.main,
                    background: '#E7ECF3',
                  },
                }}
                controlStyles={{
                  padding: '.5rem 0 0 0',
                }}
                clearIndicatorStyles={{
                  padding: '2px',
                }}
                inputStyles={{
                  fontSize: '1.4rem',
                  marginLeft: '0',
                }}
                valueContainerStyles={{
                  border: theme.palette.border.main,
                  borderRadius: '8px',
                  background: theme.palette.white.background,
                  paddingLeft: '15px',
                  height: '5rem',
                  '&:hover': {
                    borderColor: theme.palette.blue.main,
                  },
                }}
                noOptionsMessageStyles={{
                  textAlign: 'left',
                }}
                singleValueStyles={{
                  color: theme.palette.dark.main,
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  height: '100%',
                  padding: '0.5rem 0',
                }}
                placeholderStyles={{
                  color: theme.palette.dark.main,
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              />
            </Grid>
            <Grid style={{ paddingBottom: '4rem' }}>
              <StyledTypography>Amount:</StyledTypography>
              <InputAmount
                theme={theme}
                selectedCoin={selectedCoin.label}
                selectedAccount={
                  haveSelectedAccount
                    ? selectedAccount
                    : selectedAccountOption.keyId
                }
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
                style={{ width: '100%', paddingTop: '.5rem' }}
              />
            </Grid>
            <Grid container justify="space-between">
              <BtnCustom
                btnWidth={'38%'}
                borderRadius={'.4rem'}
                btnColor={theme.palette.blue.main}
                hoverColor={theme.palette.white.main}
                hoverBackground={theme.palette.blue.main}
                borderWidth={'.1rem'}
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
                borderRadius={'.4rem'}
                btnColor={theme.palette.blue.main}
                hoverColor={theme.palette.white.main}
                hoverBackground={theme.palette.blue.main}
                borderWidth={'.1rem'}
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
