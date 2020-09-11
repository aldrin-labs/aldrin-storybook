import React from 'react'
import { Grid, Typography } from '@material-ui/core'

import {
  AccountOption,
  AccountSingleValue,
} from '@sb/components/ReactSelectComponents/AccountOption'
import {
  CoinOption,
  CoinSingleValue,
} from '@sb/components/ReactSelectComponents/CoinOption'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import SelectKeyListDW from '@core/components/SelectKeyListDW/SelectKeyListDW'
import Balances from './Balances'
import { StyledTypography } from './AccountBlock.styles'
import { IProps } from './AccountBlock.types'

const AccountBlock = ({
  isDepositPage,
  selectedKey,
  selectedCoin,
  setSelectedCoin,
}: IProps) => (
  <Grid
    id="left_block"
    container
    direction="column"
    justify="center"
    style={{ width: '35%', borderRight: '1px solid #E0E5EC' }}
    spacing={32}
  >
    <Grid item id="accounts_block">
      <StyledTypography>Account</StyledTypography>
      <Grid
        style={{ height: '6rem', padding: '1rem 0 0 0', overflow: 'hidden' }}
      >
        <SelectKeyListDW
          dropdownIndicatorStyles={{
            position: 'absolute',
            right: '.5rem',
            display: 'flex',
            width: '3rem',
            height: '3rem',
            padding: '0',
            marginRight: '2rem',
            '& svg': {
              width: '3rem',
              height: '3rem',
            },
          }}
          isDeposit={isDepositPage}
          classNamePrefix="custom-select-box"
          components={{
            Option: AccountOption,
            SingleValue: AccountSingleValue,
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

            boxShadow: 'none',
            border: 'none',
          }}
          menuListStyles={{
            height: '16rem',
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
    <Grid item id="coins_block">
      <StyledTypography>Coin</StyledTypography>
      <Grid
        style={{ height: '6rem', padding: '1rem 0 0 0', overflow: 'hidden' }}
      >
        <SelectCoinList
          dropdownIndicatorStyles={{
            position: 'absolute',
            right: '.5rem',
            display: 'flex',
            width: '3rem',
            height: '3rem',
            padding: '0',
            marginRight: '2rem',
            '& svg': {
              width: '3rem',
              height: '3rem',
            },
          }}
          classNamePrefix="custom-select-box"
          isSearchable={true}
          components={{
            Option: CoinOption,
            SingleValue: CoinSingleValue,
          }}
          menuPortalTarget={document.body}
          menuPortalStyles={{
            zIndex: 11111,
          }}
          value={selectedCoin}
          needAdditionalFiltering={true}
          additionalFiltering={(a: { symbol: string }) =>
            !a.symbol.endsWith('UP') && !a.symbol.endsWith('DOWN')
          }
          onChange={(optionSelected: { label: string; name: string }) => {
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
            boxShadow: 'none',
            border: 'none',
          }}
          menuListStyles={{
            height: '16rem',
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
    <Grid style={{ height: '8rem', overflow: 'hidden' }}>
      <Balances
        selectedCoin={selectedCoin.label}
        selectedAccount={selectedKey}
      />
    </Grid>
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
