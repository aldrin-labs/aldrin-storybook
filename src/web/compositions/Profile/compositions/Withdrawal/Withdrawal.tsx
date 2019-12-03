import React, { useState } from 'react'
import { Grid } from '@material-ui/core'

import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import AccountBlock from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock'
import RecentHistoryTable from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/RecentHistoryTable'
import InputAmount from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InputAmount'
import {
  StyledInput,
  StyledTypography,
  StyledTypographyCaption,
} from './Withdrawal.styles'
import { IProps } from './Withdrawal.types'

const Withdrawal = ({  }: IProps) => {
  const totalBalance = 0.000003241
  const inOrder = 0.000003241
  const availableBalance = 0.000003241

  const [selectedCoin, setSelectedCoin] = useState('BTC')
  const [coinAddress, setCoinAddress] = useState('')
  const [coinAmount, setCoinAmount] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('#')

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
        <AccountBlock
          isDepositPage={true}
          totalBalance={totalBalance}
          inOrder={inOrder}
          availableBalance={availableBalance}
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
        />

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
              <StyledInput
                value={coinAddress}
                onChange={(e) => setCoinAddress(e.target.value)}
              />
              <StyledTypography
                style={{ paddingBottom: '1rem', paddingTop: '1rem' }}
              >
                Amount
              </StyledTypography>
              <InputAmount
                selectedCoin={selectedCoin}
                selectedAccount={selectedAccount}
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
              />
              <StyledTypographyCaption style={{ paddingTop: '0.2rem' }}>
                Minimum Withdrawal: 0.00100000 BTC
              </StyledTypographyCaption>
              <Grid item id="fee_block" style={{ padding: '3rem 0 1rem 0' }}>
                <Grid container>
                  <StyledTypography>Transaction fee:</StyledTypography>
                  <StyledTypography
                    style={{ color: '#16253D', marginLeft: '1rem' }}
                  >
                    {totalBalance}
                  </StyledTypography>
                </Grid>
                <Grid container>
                  <StyledTypography>You will get:</StyledTypography>
                  <StyledTypography
                    style={{ color: '#16253D', marginLeft: '1rem' }}
                  >
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
      <RecentHistoryTable isDepositPage={false} specificKey={selectedAccount} />
    </>
  )
}

export default Withdrawal
