import React from 'react'
import { Grid, Typography } from '@material-ui/core'

import { AccountOption, AccountSingleValue } from '@sb/components/ReactSelectComponents/AccountOption'
import { CoinOption, CoinSingleValue } from '@sb/components/ReactSelectComponents/CoinOption'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import SelectKeyList from '@core/components/SelectKeyList/SelectKeyList'
import Balances from './Balances'
import { StyledTypography } from './AccountBlock.styles'
import { IProps } from './AccountBlock.types'

const AccountBlock = ({
  isDepositPage,
  selectedCoin,
  setSelectedCoin,
  selectedAccount,
  setSelectedAccount,
}: IProps) => (
  <Grid
    id="left_block"
    container
    direction="column"
    style={{ width: '35%', borderRight: '1px solid #E0E5EC' }}
    spacing={32}
  >
    <Grid item id="accounts_block">
      <StyledTypography>Account</StyledTypography>
      <SelectKeyList
        classNamePrefix="custom-select-box"
        components={{ Option: AccountOption, SingleValue: AccountSingleValue, DropdownIndicator: undefined }}
        isSearchable={false}
        setDefaultValue={true}
        menuPortalTarget={document.body}
        menuPortalStyles={{
          zIndex: 11111,
        }}
        onChange={(
          optionSelected: {
            label: string
            value: number
            keyId: string
          }
        ) => {
          setSelectedAccount(optionSelected)
        }}
        value={selectedAccount}
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
          }
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
    <Grid item id="coins_block">
      <StyledTypography>Coin</StyledTypography>
      <SelectCoinList
        classNamePrefix="custom-select-box"
        isSearchable={true}
        components={{ Option: CoinOption, SingleValue: CoinSingleValue, DropdownIndicator: undefined }}
        menuPortalTarget={document.body}
        menuPortalStyles={{
          zIndex: 11111,
        }}
        value={selectedCoin}
        onChange={(
          optionSelected: {
            label: string
            name: string
          }
        ) => {
          setSelectedCoin({ label: optionSelected.label, name: optionSelected.name })
        }}
        noOptionsMessage={() => `No such coin in our DB found`}
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
          }
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
    <Balances selectedCoin={selectedCoin.label} selectedAccount={selectedAccount.keyId} />
    <Grid item id="description_block">
      {isDepositPage && (
        <Typography>
          Coins will be deposited after <b>1</b> network confirmations.
        </Typography>
      )}
      {!isDepositPage && (
        <Typography>
          Do not withdraw directly to a crowdfund or ICO address, as your
          account will not be credited with tokens from such sales.
        </Typography>
      )}
    </Grid>
  </Grid>
)

export default AccountBlock
