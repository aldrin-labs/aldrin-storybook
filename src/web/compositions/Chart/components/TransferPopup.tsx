import React, { useState } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'

import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import { StyledTypography } from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock.styles'
import InputAmount from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InputAmount'

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

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

interface IProps {
    selectedAccount: string
    transferFromSpot: boolean
    transferMutation: (any:any) => Promise<any>
    open: boolean
    handleClose: () => void
}

export const TransferPopup = ({ selectedAccount, transferFromSpot, open, handleClose }: IProps) => {
  const [selectedCoin, setSelectedCoin] = useState('BTC')
  const [coinAmount, setCoinAmount] = useState('')

  const transferHandler = () => {
    // TODO add mutation for this popup
    // transferMutation()
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
            {transferFromSpot
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
            <Grid>
              <StyledTypography>Coin:</StyledTypography>
              <SelectCoinList
                classNamePrefix="custom-select-box"
                isSearchable={true}
                menuPortalTarget={document.body}
                menuPortalStyles={{
                  zIndex: 11111,
                }}
                placeholder={'BTC'}
                onChange={(optionSelected: {
                  label: string
                  value: string
                  priceUSD: string | number
                }) => {
                  setSelectedCoin(optionSelected.value)
                }}
                noOptionsMessage={() => `No such coin in our DB found`}
                menuStyles={{
                  minWidth: '100px',
                  fontSize: '1.4rem',
                  padding: '0 1.5rem 0 1.5rem',
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
                  background: 'transparent',
                  fontSize: '1.4rem',
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
                }}
                noOptionsMessageStyles={{
                  textAlign: 'left',
                }}
                singleValueStyles={{
                  color: '#16253D',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
                placeholderStyles={{
                  color: '#16253D',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
              />
            </Grid>
            <Grid>
              <Typography>Amount:</Typography>
              <InputAmount
                selectedCoin={selectedCoin}
                selectedAccount={selectedAccount}
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
              />
            </Grid>
            <Grid style={{ paddingTop: '16px' }}>
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
