import React, { useState } from 'react'
import { compose } from 'recompose'
import { Grid, Typography } from '@material-ui/core'
import copy from 'clipboard-copy'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { getProfileSettings } from '@core/graphql/queries/user/getProfileSettings'

import exclamationMark from '@icons/exclamationMark.svg'
import SvgIcon from '@sb/components/SvgIcon'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import AccountBlock from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock'
import RecentHistoryTable from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/RecentHistoryTable'
import QRCodePopup from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/QRCodePopup'
import InputAddress from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InputAddress'

import { StyledTypography } from '../Withdrawal/Withdrawal.styles'
import { IProps } from './Deposit.types'

const Deposits = ({ ...props }: IProps) => {
  const { depositSettings } = props.getProfileSettingsQuery.getProfileSettings
  const { selectedKey:tempSelectedKey = '' } = depositSettings || { selectedKey: '' }
  const selectedKey = tempSelectedKey || ''
  const [popupOpened, togglePopup] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState({ label: 'BTC', name: 'Bitcoin' })
  const [coinAddress, setCoinAddress] = useState('')

  const copyCoinAddress = () => {
    copy(coinAddress)
  }
  const networkChange = () => {}

  return (
    <>
      <QRCodePopup
        open={popupOpened}
        coinAddress={coinAddress}
        handleClose={() => togglePopup(false)}
      />
      <Grid
        container
        justify="center"
        style={{
          height: '67%',
          padding: '5% 1%',
          border: '2px solid #E0E5EC',
          boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
          borderRadius: '32px',
          marginBottom: '2%',
        }}
      >
        <AccountBlock
          isDepositPage={true}
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          selectedKey={selectedKey}
        />

        <Grid
          id="right_block"
          container
          direction="column"
          alignItems="center"
          justify="center"
          style={{ width: '65%', paddingLeft: '20%' }}
        >
          <Grid
            container
            direction="column"
            spacing={32}
            style={{ width: 'auto' }}
          >
            {/* <Grid item>
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
            </Grid> */}
            <Grid item>
              <StyledTypography style={{ paddingBottom: '1rem' }}>
                {selectedCoin.label} address
              </StyledTypography>
              <Grid style={{ height: '6rem', overflow: 'hidden' }}>
                <InputAddress autoComplete="off" value={coinAddress} selectedCoin={selectedCoin.label} setCoinAddress={setCoinAddress} selectedAccount={selectedKey}/>
              </Grid>
              {/* <StyledInput
                value={coinAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCoinAddress(e.target.value)
                }
              /> */}
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
                  onClick={() => togglePopup(true)}
                >
                  Show qr code
                </BtnCustom>
                <BtnCustom
                  btnWidth={'38%'}
                  borderRadius={'8px'}
                  btnColor={'#165BE0'}
                  borderWidth={'2px'}
                  fontWeight={'bold'}
                  fontSize={'1.2rem'}
                  height={'4rem'}
                  onClick={copyCoinAddress}
                >
                  Copy address
                </BtnCustom>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container justify="space-between" style={{ width: '80%' }}>
                <Grid>
                  <SvgIcon src={exclamationMark} width="9.5px" height="auto" />
                </Grid>
                <Grid style={{ width: '89%' }}>
                  <Typography
                    style={{ color: '#16253D', paddingBottom: '1rem' }}
                  >
                    Send only {selectedCoin.label} to this deposit address.
                  </Typography>
                  <Typography>
                    Sending coin or token other than {selectedCoin.label} to this
                    address may result in the loss of your deposit.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <RecentHistoryTable
        isDepositPage={true}
        specificKey={selectedKey}
      />
    </>
  )
}

export default compose(
  queryRendererHoc({ query: getProfileSettings, name: 'getProfileSettingsQuery', fetchPolicy: 'cache-and-network' })
)(Deposits)