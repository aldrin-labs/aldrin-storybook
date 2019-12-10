import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'

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

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

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
}

const TransferPopup = ({
  selectedAccount,
  transferFromSpotToFutures,
  open,
  handleClose,
  futuresTransferMutation,
}: IProps) => {
  const [selectedCoin, setSelectedCoin] = useState('BTC')
  const [coinAmount, setCoinAmount] = useState('')

  console.log('selectedCoin', selectedCoin)

  const transferHandler = async () => {
    const response = await futuresTransferMutation({
      variables: {
        input: {
          keyId: selectedAccount,
          asset: selectedCoin,
          amount: +coinAmount,
          type: transferFromSpotToFutures ? 1 : 2,
        },
      },
    })

    console.log('transferHandler response', response)
    // closing popup
    handleClose()
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
            {transferFromSpotToFutures
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
            <Grid style={{ paddingBottom: '2rem' }}>
              <StyledTypography>Coin:</StyledTypography>
              <SelectCoinList
                classNamePrefix="custom-select-box"
                components={{
                  Option: CoinOption,
                  SingleValue: CoinSingleValue,
                  DropdownIndicator: undefined,
                }}
                isSearchable={true}
                placeholder={selectedCoin}
                menuPortalTarget={document.body}
                menuPortalStyles={{
                  zIndex: 11111,
                }}
                onChange={(optionSelected: {
                  label: string
                  value: string
                  priceUSD: string | number
                }) => {
                  setSelectedCoin(optionSelected.value)
                }}
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
                selectedCoin={selectedCoin}
                selectedAccount={selectedAccount}
                value={coinAmount}
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
                btnWidth={'38%'}
                borderRadius={'8px'}
                btnColor={'#165BE0'}
                borderWidth={'2px'}
                fontWeight={'bold'}
                fontSize={'1.2rem'}
                height={'4rem'}
                onClick={transferHandler}
              >
                Confirm
              </BtnCustom>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default graphql(futuresTransfer, {
  name: 'futuresTransferMutation',
})(TransferPopup)
