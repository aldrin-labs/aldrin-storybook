import React from 'react'
import { Grid, Typography, Table } from '@material-ui/core'

import exclamationMark from '@icons/exclamationMark.svg'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import SvgIcon from '@sb/components/SvgIcon'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import { StyledInput, StyledTypography, StyledTable } from './Withdrawal.styles'
import { IProps } from './Withdrawal.types'

const columnNames = [
  {
    isNumber: false,
    label: 'Status',
    id: 'status',
  },
  { isNumber: false, label: 'Coin', id: 'coin' },
  { isNumber: true, label: 'Amount', id: 'amount' },
  { isNumber: true, label: 'Date', id: 'date' },
  { isNumber: true, label: 'Address', id: 'address' },
  { isNumber: false, label: 'Txid', id: 'txid' },
]

const Deposits = ({  }: IProps) => {
  const totalBalance = 0.000003241
  const inOrder = 0.000003241
  const availableBalance = 0.000003241

  const networkChange = () => {}

  return (
    <>
      <Grid
        container
        justify="center"
        style={{
          height: '67%',
          padding: '3% 1%',
          border: '2px solid #E0E5EC',
          boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
          borderRadius: '32px',
          marginBottom: '2%',
        }}
      >
        <Grid
          id="left_block"
          container
          direction="column"
          style={{ width: '35%' }}
          spacing={32}
        >
          <Grid item id="accounts_block">
            <StyledTypography>Account</StyledTypography>
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
            />
          </Grid>
          <Grid item id="balances_block" style={{ padding: '3rem 7rem' }}>
            <Grid container justify="space-between">
              <StyledTypography>Total balance:</StyledTypography>
              <StyledTypography style={{ color: '#16253D' }}>
                {totalBalance}
              </StyledTypography>
            </Grid>
            <Grid container justify="space-between">
              <StyledTypography>In order:</StyledTypography>
              <StyledTypography style={{ color: '#16253D' }}>
                {inOrder}
              </StyledTypography>
            </Grid>
            <Grid container justify="space-between">
              <StyledTypography>Available balance:</StyledTypography>
              <StyledTypography style={{ color: '#16253D' }}>
                {availableBalance}
              </StyledTypography>
            </Grid>
          </Grid>
          <Grid item id="description_block">
            <Typography>
            Do not withdraw directly to a crowdfund or ICO address, as your account will not be credited with tokens from such sales.
            </Typography>
          </Grid>
        </Grid>
        <Grid
          id="right_block"
          container
          direction="column"
          alignItems="center"
          style={{ width: '65%', paddingLeft: '20%' }}
        >
          <Grid
            container
            direction="column"
            spacing={32}
            // style={{ width: 'auto' }}
          >
            <Grid item>
              <StyledTypography style={{ paddingBottom: '1rem' }}>
                Select network
              </StyledTypography>
              <PillowButton
                firstHalfText={'BTC'}
                secondHalfText={'BEP2'}
                activeHalf={true ? 'first' : 'second'}
                changeHalf={networkChange}
                buttonAdditionalStyle={{
                  width: '40%',
                  borderWidth: '2px',
                }}
                containerStyle={{
                  margin: 0,
                }}
              />
            </Grid>
            <Grid item>
              <StyledTypography style={{ paddingBottom: '1rem' }}>
                BTC address
              </StyledTypography>
              <StyledInput value="x02376g6tgasd62321313123" />
              <StyledTypography style={{ paddingBottom: '1rem', paddingTop: '1rem' }}>
                Amount
              </StyledTypography>
              <StyledInput value="100" />
              <Grid item id="fee_block" style={{ padding: '3rem 0 1rem 0' }}>
                <Grid container>
                  <StyledTypography>Transaction fee:</StyledTypography>
                  <StyledTypography style={{ color: '#16253D', marginLeft: '1rem' }}>
                    {totalBalance}
                  </StyledTypography>
                </Grid>
                <Grid container>
                  <StyledTypography>You will get:</StyledTypography>
                  <StyledTypography style={{ color: '#16253D',  marginLeft: '1rem' }}>
                    {inOrder}
                  </StyledTypography>
                </Grid>
              </Grid>
              <Grid style={{ paddingTop: '16px' }}>
                <BtnCustom
                  btnWidth={'80%'}
                  borderRadius={'8px'}
                  btnColor={'#165BE0'}
                  borderWidth={'2px'}
                  fontWeight={'bold'}
                  margin={'0 2rem 0 0'}
                  height={'4rem'}
                  fontSize={'1.2rem'}
                >
                  Submit
                </BtnCustom>
              </Grid>
            </Grid>
            {/* <Grid item>
              <Grid container justify="space-between" style={{ width: '80%' }}>
                <Grid>
                  <SvgIcon src={exclamationMark} width="9.5px" height="auto" />
                </Grid>
                <Grid style={{ width: '89%' }}>
                  <Typography
                    style={{ color: '#16253D', paddingBottom: '1rem' }}
                  >
                    Send only BTC to this deposit address.
                  </Typography>
                  <Typography>
                    Sending coin or token other than BTC to this address may
                    result in the loss of your deposit.
                  </Typography>
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>

      <Grid style={{ height: '30%' }}>
        <StyledTable
          style={{
            height: '100%',
            position: 'relative',
            overflowY: 'scroll',
            overflowX: 'hidden',
            borderTopLeftRadius: '0',
            borderTopRightRadius: '0',
          }}
          id="Deposits"
          padding="dense"
          data={{ body: [] }}
          columnNames={columnNames}
          emptyTableText="No history"
          tableStyles={{
            heading: {
              top: '-1px',
              padding: '.6rem 1.6rem .6rem 1.2rem',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: 0.5,
              borderBottom: '2px solid #e0e5ec',
              whiteSpace: 'nowrap',
              color: '#7284A0',
              background: '#F2F4F6',
            },
            cell: {
              padding: '1.2rem 1.6rem 1.2rem 1.2rem',
              fontFamily: "'DM Sans Bold', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: '#7284A0',
            },
          }}
        />
      </Grid>
    </>
  )
}

export default Deposits
