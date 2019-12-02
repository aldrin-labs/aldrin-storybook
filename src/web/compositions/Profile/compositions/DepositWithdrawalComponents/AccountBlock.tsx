import React from 'react'
import { Grid, Typography } from '@material-ui/core'

import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import SelectKeyList from '@core/components/SelectKeyList/SelectKeyList'

import { StyledTypography } from './AccountBlock.styles'
import { IProps } from './AccountBlock.types'

const AccountBlock = ({
  isDepositPage,
  totalBalance,
  inOrder,
  availableBalance,
  selectedCoin,
  setSelectedCoin,
}: IProps) => (
  <Grid
    id="left_block"
    container
    direction="column"
    style={{ width: '35%' }}
    spacing={32}
  >
    <Grid item id="accounts_block">
      <StyledTypography>Account</StyledTypography>
      <SelectKeyList
        classNamePrefix="custom-select-box"
        isSearchable={false}
        menuPortalTarget={document.body}
        menuPortalStyles={{
          zIndex: 11111,
        }}
        // additionalMapping={this.addExistCoinsLighting}
        // changeRowToShow={this.changeRowToShow}
        // inputValue={this.state.inputValue}
        // onInputChange={this.onInputChange}
        // onChange={(
        //   optionSelected: {
        //     label: string
        //     value: string
        //     priceUSD: string | number
        //   } | null
        // ) => {
        // this.handleSelectChange(
        //   optionSelected.value || '',
        //   optionSelected.priceUSD,
        //   optionSelected.priceBTC
        // )
        // this.setState({ selectedValue: optionSelected.value })
        // }}
        menuStyles={{
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
        }}
        noOptionsMessageStyles={{
          textAlign: 'left',
        }}
        singleValueStyles={{
          color: '#16253D',
          fontSize: '1.4rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
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
        menuPortalTarget={document.body}
        menuPortalStyles={{
          zIndex: 11111,
        }}
        placeholder={'BTC'}
        onChange={(
          optionSelected: {
            label: string
            value: string
            priceUSD: string | number
          } | null
        ) => {
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
    <Grid item id="balances_block" style={{ padding: '3rem 7rem' }}>
      <Grid container justify="space-between">
        <StyledTypography>Total balance:</StyledTypography>
        <StyledTypography style={{ color: '#16253D' }}>
          {`${totalBalance} ${selectedCoin}`}
        </StyledTypography>
      </Grid>
      <Grid container justify="space-between">
        <StyledTypography>In order:</StyledTypography>
        <StyledTypography style={{ color: '#16253D' }}>
          {`${inOrder} ${selectedCoin}`}
        </StyledTypography>
      </Grid>
      <Grid container justify="space-between">
        <StyledTypography>Available balance:</StyledTypography>
        <StyledTypography style={{ color: '#16253D' }}>
          {`${availableBalance} ${selectedCoin}`}
        </StyledTypography>
      </Grid>
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
