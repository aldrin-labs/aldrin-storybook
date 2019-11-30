import React from 'react'
import { Grid, Typography, Input, Table } from '@material-ui/core'

import exclamationMark from '@icons/exclamationMark.svg'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import SvgIcon from '@sb/components/SvgIcon'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import { IProps } from './Deposit.types'

const Deposits = ({  }: IProps) => {
  const totalBalance = 0.000003241
  const inOrder = 0.000003241
  const availableBalance = 0.000003241

  const networkChange = () => {}

  return (
    <>
      <Grid container style={{ height: '70%', padding: '10% 0 0 0' }}>
        <Grid
          id="left_block"
          container
          direction="column"
          style={{ width: '35%' }}
          spacing={32}
        >
          <Grid item id="accounts_block">
            <Typography>Account</Typography>
            <SelectCoinList
              classNamePrefix="custom-select-box"
              isSearchable={true}
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
                fontSize: '1.2rem',
                minWidth: '150px',
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
                color: '#7284A0',
                background: 'transparent',
                textAlign: 'left',
                fontSize: '1.2rem',
                borderBottom: '.1rem solid #e0e5ec',
                position: 'relative',
                padding: '0',

                '&:hover': {
                  borderRadius: '1rem',
                  color: '#16253D',
                  background: '#E7ECF3',
                },
              }}
              controlStyles={{
                padding: '1rem 1.5rem 0 1.5rem',
              }}
              clearIndicatorStyles={{
                padding: '2px',
              }}
              inputStyles={{
                marginLeft: '0',
              }}
              dropdownIndicatorStyles={{
                display: 'none',
              }}
              // noOptionsMessage={() => `No such coin in our DB found`}
              valueContainerStyles={{
                border: '1px solid #E7ECF3',
                borderRadius: '3rem',
                background: '#F2F4F6',
                paddingLeft: '15px',
              }}
              noOptionsMessageStyles={{
                textAlign: 'left',
              }}
            />
          </Grid>
          <Grid item id="coins_block">
            <Typography>Coin</Typography>
            <SelectCoinList
              classNamePrefix="custom-select-box"
              isSearchable={true}
              menuPortalTarget={document.body}
              menuPortalStyles={{
                zIndex: 11111,
              }}
              placeholder={'BTC'}
              defaultOptions={[{ label: 'BTC', value: 'BTC' }]}
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
              // noOptionsMessage={() => `No such coin in our DB found`}
              menuStyles={{
                fontSize: '1.2rem',
                minWidth: '150px',
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
                color: '#7284A0',
                background: 'transparent',
                textAlign: 'left',
                fontSize: '1.2rem',
                borderBottom: '.1rem solid #e0e5ec',
                position: 'relative',
                padding: '0',

                '&:hover': {
                  borderRadius: '1rem',
                  color: '#16253D',
                  background: '#E7ECF3',
                },
              }}
              controlStyles={{
                padding: '1rem 1.5rem 0 1.5rem',
              }}
              clearIndicatorStyles={{
                padding: '2px',
              }}
              inputStyles={{
                marginLeft: '0',
              }}
              dropdownIndicatorStyles={{
                display: 'none',
              }}
              valueContainerStyles={{
                border: '1px solid #E7ECF3',
                borderRadius: '3rem',
                background: '#F2F4F6',
                paddingLeft: '15px',
              }}
              noOptionsMessageStyles={{
                textAlign: 'left',
              }}
            />
          </Grid>
          <Grid item id="balances_block" style={{ padding: '3rem 5rem' }}>
            <Grid container justify="space-between">
              <Typography>Total balance</Typography>
              <Typography>{totalBalance}</Typography>
            </Grid>
            <Grid container justify="space-between">
              <Typography>In order</Typography>
              <Typography>{inOrder}</Typography>
            </Grid>
            <Grid container justify="space-between">
              <Typography>Available balance</Typography>
              <Typography>{availableBalance}</Typography>
            </Grid>
          </Grid>
          <Grid item id="description_block">
            <Typography>
              Coins will be deposited after 1 network confirmations.
            </Typography>
          </Grid>
        </Grid>
        <Grid
          id="right_block"
          container
          direction="column"
          alignItems="center"
          style={{ width: '65%' }}
        >
          <Grid
            container
            direction="column"
            spacing={32}
            style={{ width: 'auto' }}
          >
            <Grid item>
              <Typography style={{ paddingBottom: '1rem' }}>
                Select network
              </Typography>
              <PillowButton
                firstHalfText={'BTC'}
                secondHalfText={'BEP2'}
                activeHalf={true ? 'first' : 'second'}
                changeHalf={networkChange}
                buttonAdditionalStyle={{
                  width: '40%',
                }}
              />
            </Grid>
            <Grid item>
              <Typography>BTC address</Typography>
              <Input
                style={{ width: '80%' }}
                value="x02376g6tgasd62321313123"
              />
              <Grid style={{ paddingTop: '16px' }}>
                <BtnCustom
                  btnWidth={'40%'}
                  borderRadius={'32px'}
                  btnColor={'#165BE0'}
                >
                  Show qr code
                </BtnCustom>
                <BtnCustom
                  btnWidth={'40%'}
                  borderRadius={'32px'}
                  btnColor={'#165BE0'}
                >
                  Copy adress
                </BtnCustom>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container>
                <Grid>
                  <SvgIcon src={exclamationMark} width="9.5px" height="auto" />
                </Grid>
                <Grid>
                  <Typography>
                    Send only BTC to this deposit address.
                  </Typography>
                  <Typography>
                    Sending coin or token other than BTC to this address may
                    result in the loss of your deposit.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid style={{ height: '30%' }}>
        <Table />
      </Grid>
    </>
  )
}

export default Deposits
