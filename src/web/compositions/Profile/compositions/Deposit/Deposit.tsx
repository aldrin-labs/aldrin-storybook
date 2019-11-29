import React from 'react'
import { Grid, Typography, Input } from '@material-ui/core'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import { IProps } from './Deposit.types'

const Deposits = ({  }: IProps) => {
  const totalBalance = 0.000003241
  const inOrder = 0.000003241
  const availableBalance = 0.000003241

  const networkChange = () => {}

  return (
    <Grid>
      <Grid style={{ height: '70%' }}>
        <Grid id="left_block" style={{ width: '35%' }}>
          <Grid id="accounts_block">
            <Typography>Account</Typography>
            {/* Select ACCOUNTS component */}
          </Grid>
          <Grid id="coins_block">
            <Typography>Coin</Typography>
            {/* Select COINS component */}
          </Grid>
          <Grid id="balances_block" style={{ padding: '3rem 2rem' }}>
            <Grid justify="space-between">
              <Typography>Total balance</Typography>
              <Typography>{totalBalance}</Typography>
            </Grid>
            <Grid justify="space-between">
              <Typography>In order</Typography>
              <Typography>{inOrder}</Typography>
            </Grid>
            <Grid justify="space-between">
              <Typography>Available balance</Typography>
              <Typography>{availableBalance}</Typography>
            </Grid>
          </Grid>
          <Grid id="description_block">
            <Typography>
              Coins will be deposited after 1 network confirmations.
            </Typography>
          </Grid>
        </Grid>
        <Grid id="right_block">
          <Grid>
            <Typography>Select network</Typography>
            <PillowButton
              firstHalfText={'BTC'}
              secondHalfText={'BEP2'}
              activeHalf={true ? 'first' : 'second'}
              changeHalf={networkChange}
            />
          </Grid>
          <Grid>
            <Typography>BTC address</Typography>
            <Input value="x02376g6tgasd62321313123" />
            <Grid>
              <BtnCustom
                btnWidth={'85px'}
                borderRadius={'32px'}
                btnColor={'#165BE0'}
                type="submit"
              >
                Show qr code
              </BtnCustom>
              <BtnCustom
                btnWidth={'85px'}
                borderRadius={'32px'}
                btnColor={'#165BE0'}
                type="submit"
              >
                Copy adress
              </BtnCustom>
            </Grid>
          </Grid>
          <Grid />
        </Grid>
      </Grid>

      <Grid style={{ height: '30%' }}>z</Grid>
    </Grid>
  )
}

export default ProfileAccounts
