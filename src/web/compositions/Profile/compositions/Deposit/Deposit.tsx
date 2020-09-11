import React, { useState, useEffect } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { Grid, Typography } from '@material-ui/core'
import copy from 'clipboard-copy'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { getProfileSettings } from '@core/graphql/queries/user/getProfileSettings'
import { getActivePromo } from '@core/graphql/queries/user/getActivePromo'
import { bonusRequest } from '@core/graphql/mutations/bonus/bonusRequest'
import { addGAEvent } from '@core/utils/ga.utils'
import { useSnackbar } from 'notistack'

import exclamationMark from '@icons/exclamationMark.svg'
import SvgIcon from '@sb/components/SvgIcon'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import AccountBlock from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock'
import RecentHistoryTable from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/RecentHistoryTable'
import QRCodePopup from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/QRCodePopup'
import InputAddress from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InputAddress'
import ClaimBonusPopup from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/ClaimBonusPopup'

import { StyledTypography } from '../Withdrawal/Withdrawal.styles'
import { IProps } from './Deposit.types'
import { Loading } from '@sb/components/index'

const Deposits = ({ ...props }: IProps) => {
  const { bonusRequestMutation } = props

  const {
    getProfileSettings: { depositSettings } = {
      depositSettings: { selectedKey: '' },
    },
  } = props.getProfileSettingsQuery || {
    getProfileSettings: { depositSettings: { selectedKey: '' } },
  }
  const {
    getActivePromoQuery: { getActivePromo: { code = '' } = { code: '' } } = {
      getActivePromo: { code: '' },
    },
  } = props
  const isUserHasActivePromo = !!code

  const { selectedKey: tempSelectedKey = '' } = depositSettings || {
    selectedKey: '',
  }
  const selectedKey = tempSelectedKey || ''
  const [popupOpened, togglePopup] = useState(false)
  const [claimPopupOpened, toggleClaimPopup] = useState(false)
  const [claimRequestLoading, toggleClaimRequestLoading] = useState(false)
  const [claimBonusId, setClaimBonusId] = useState('')
  const [claimRequestStatus, setClaimRequestStatus] = useState('')
  const [claimRequestErrorText, setClaimRequestErrorText] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const [selectedCoin, setSelectedCoin] = useState({
    label: 'BTC',
    name: 'Bitcoin',
  })
  const [coinAddress, setCoinAddress] = useState('')

  const copyCoinAddress = () => {
    copy(coinAddress)
  }

  useEffect(() => {
    setCoinAddress('')
  }, [selectedCoin.label, selectedKey])

  const networkChange = () => {}

  const handleClaimBonus = async () => {
    toggleClaimRequestLoading(true)
    toggleClaimPopup(true)

    try {
      const res = await bonusRequestMutation()

      const {
        data: {
          bonusRequest: { status, errorMessage, data },
        },
      } = res

      toggleClaimRequestLoading(false)
      if (status === 'OK') {
        setClaimRequestStatus(status)
        setClaimBonusId(data)
      }

      if (status === 'ERR') {
        setClaimRequestStatus(status)
        setClaimRequestErrorText(errorMessage)
      }
    } catch (e) {
      toggleClaimRequestLoading(false)
      setClaimRequestStatus('ERR')
      setClaimRequestErrorText(e.message)
    }
  }

  return (
    <>
      <QRCodePopup
        open={popupOpened}
        coinAddress={coinAddress}
        handleClose={() => togglePopup(false)}
      />
      <ClaimBonusPopup
        open={claimPopupOpened}
        claimRequestLoading={claimRequestLoading}
        claimBonusId={claimBonusId}
        claimRequestStatus={claimRequestStatus}
        claimRequestErrorText={claimRequestErrorText}
        handleClose={() => toggleClaimPopup(false)}
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
              <Grid
                style={{
                  height: '7rem',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <InputAddress
                  autoComplete="off"
                  value={coinAddress}
                  selectedCoin={selectedCoin.label}
                  setCoinAddress={setCoinAddress}
                  selectedAccount={selectedKey}
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
                  onClick={() => {
                    togglePopup(true)

                    addGAEvent({
                      action: 'Show qr code',
                      category: 'App - Show qr code',
                      label: `deposit_show_qr_code`,
                    })
                  }}
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
                  onClick={() => {
                    copyCoinAddress()
                    enqueueSnackbar('Copied!', {
                      variant: 'success',
                    })

                    addGAEvent({
                      action: 'Copy address',
                      category: 'App - Copy address',
                      label: `deposit_copy_address`,
                    })
                  }}
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
                    Sending coin or token other than {selectedCoin.label} to
                    this address may result in the loss of your deposit.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {isUserHasActivePromo && (
              <Grid item>
                <Grid>
                  <BtnCustom
                    btnWidth={'38%'}
                    borderRadius={'8px'}
                    btnColor={'#DD6956'}
                    borderWidth={'2px'}
                    fontWeight={'bold'}
                    fontSize={'1.2rem'}
                    height={'4rem'}
                    onClick={async () => {
                      await handleClaimBonus()

                      addGAEvent({
                        action: 'Claim bonus',
                        category: 'App - Claim bonus',
                        label: `deposit_claim_bonus`,
                      })
                    }}
                  >
                    Claim bonus
                  </BtnCustom>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <RecentHistoryTable isDepositPage={true} specificKey={selectedKey} />
    </>
  )
}

export default compose(
  queryRendererHoc({
    query: getProfileSettings,
    name: 'getProfileSettingsQuery',
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: true,
  }),
  queryRendererHoc({
    query: getActivePromo,
    name: 'getActivePromoQuery',
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: true,
  }),
  graphql(bonusRequest, { name: 'bonusRequestMutation' })
)(Deposits)
