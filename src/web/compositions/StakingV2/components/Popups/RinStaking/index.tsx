import React, { useCallback, useEffect, useState } from 'react'

import { Block, BlockContentStretched } from '@sb/components/Block'
import { FlexBlock, StretchedBlock } from '@sb/components/Layout'
import { Modal } from '@sb/components/Modal'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import SvgIcon from '@sb/components/SvgIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { ImagesPath } from '@sb/compositions/Chart/components/Inputs/Inputs.utils'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import {
  resolveStakingNotification,
  resolveUnstakingNotification,
} from '@sb/compositions/RinStaking/components/utils'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import {
  startFarmingV2,
  stopFarmingV2,
  useFarmersAccountInfo,
} from '@sb/dexUtils/farming'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import {
  useAssociatedTokenAccount,
  useUserTokenAccounts,
} from '@sb/dexUtils/token/hooks'
import { useInterval } from '@sb/dexUtils/useInterval'
import { formatNumberWithSpaces } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import { getStakingInfo } from '@core/graphql/queries/staking/getStakingInfo'
import { FARMING_V2_TEST_TOKEN } from '@core/solana'
import { stripByAmountAndFormat } from '@core/utils/numberUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { WithStakingInfo } from '../../../types'
import { NumberWithLabel } from '../../NumberWithLabel'
import { HeaderComponent } from '../Header'
import InfoIcon from '../Icons/Icon.svg'
import { Column } from '../index.styles'
import { ModalContainer } from '../WithdrawLiquidity/index.styles'
import { BigNumber, SRow } from './index.styles'
import { StakeContainer } from './StakeContainer'
import { UnstakeContainer } from './UnstakeContainer'

interface RinStakingProps extends WithStakingInfo {
  onClose: () => void
  open: boolean
  farms: any
  dexTokensPricesMap: Map<string, DexTokensPrices>
  setIsConnectWalletPopupOpen: (a: boolean) => void
  socials: any // TODO
}
export const RinStakingComp = ({
  onClose,
  open,
  farms,
  dexTokensPricesMap,
  setIsConnectWalletPopupOpen,
  socials,
  getStakingInfoQuery,
}: RinStakingProps) => {
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [isBalanceShowing, setIsBalanceShowing] = useState(true)
  const [allTokenData, refreshAllTokenData] = useUserTokenAccounts()

  const { wallet } = useWallet()

  const connection = useMultiEndpointConnection()

  const { data: farmersInfo, mutate: refreshFarmersInfo } =
    useFarmersAccountInfo()

  const farm = farms?.get(FARMING_V2_TEST_TOKEN)

  const farmer = farmersInfo?.get(farm?.publicKey.toString() || '')

  const tokenData = useAssociatedTokenAccount(farm?.stakeMint.toString())

  const [loading, setLoading] = useState({
    stake: false,
    unstake: false,
    claim: false,
  })

  const totalStaked = farmer?.totalStaked || '0'
  const maxAmount = totalStaked / 10 ** 9 // decimals

  const rinHarvest = farm?.harvests.find(
    (harvest) => harvest.mint.toString() === FARMING_V2_TEST_TOKEN
  )

  const refreshAll = async () => {
    await Promise.all([refreshAllTokenData(), refreshFarmersInfo()])
  }

  useInterval(() => {
    refreshAll()
  }, 30_000)

  const start = useCallback(
    async (amount: number) => {
      if (!tokenData?.address) {
        notify({ message: 'Account does not exists' })
        return false
      }
      console.log('farms', farms, farm)

      if (!farms) {
        throw new Error('No farms')
      }
      if (!farm) {
        throw new Error('No farms')
      }

      setLoading((prev) => ({ ...prev, stake: true }))
      const result = await startFarmingV2({
        wallet,
        connection,
        amount,
        farm,
        userTokens: allTokenData,
        farmer,
      })

      notify({
        type: result === 'success' ? 'success' : 'error',
        message: resolveStakingNotification(result),
      })

      if (result === 'success') {
        await refreshAll()
      }
      setLoading((prev) => ({ ...prev, stake: false }))
      return true
    },
    [connection, wallet, tokenData, refreshAll]
  )

  const end = async (amount: number) => {
    if (!tokenData?.address) {
      notify({ message: 'Create RIN token account please.' })
      return false
    }

    setLoading((prev) => ({ ...prev, unstake: true }))

    const result = await stopFarmingV2({
      wallet,
      connection,
      amount,
      farm,
      userTokens: allTokenData,
    })

    notify({
      type: result === 'success' ? 'success' : 'error',
      message: resolveUnstakingNotification(result),
    })

    if (result === 'success') {
      await refreshAll()
    }

    setLoading((prev) => ({ ...prev, unstake: false }))
    return true
  }

  const tokenPrice =
    dexTokensPricesMap?.get(getTokenNameByMintAddress(FARMING_V2_TEST_TOKEN))
      ?.price || 0

  const userStakingInfo = getStakingInfoQuery.getStakingInfo?.farmers.find(
    (_) => _.pubkey === wallet.publicKey?.toString()
  )

  const compoundedRewards = userStakingInfo?.reward || 0

  const stakedInUsd = stripByAmountAndFormat(+totalStaked * tokenPrice || 0, 2)

  // const rinValue = stripByAmountAndFormat(totalStaked)

  // const totalStakedValue = isBalanceShowing
  //   ? rinValue
  //   : new Array(rinValue.length).fill('∗').join('')

  // const totalStakedUsdValue = isBalanceShowing
  //   ? stakedInUsd
  //   : new Array(stakedInUsd.length).fill('∗').join('')

  // const isUnstakeLocked =
  //   parseFloat(farmer?.account.staked.amount.toString() || '0') === 0

  // const availableForUnstake = parseFloat(
  //   farmer?.account.staked.amount.toString() || '0'
  // )

  useEffect(() => {
    document.title = `Aldrin | Stake RIN | ${
      rinHarvest ? `${rinHarvest.apy}% APR` : ''
    }`
    return () => {
      document.title = 'Aldrin'
    }
  }, [rinHarvest?.apy])

  return (
    <ModalContainer needBlur>
      <Modal open={open} onClose={onClose}>
        <HeaderComponent
          socials={socials}
          close={() => onClose()}
          token="RIN"
        />
        <Column height="calc(100% - 10em)" margin="0 0 3em">
          <Column height="auto" width="100%">
            <StakeContainer
              stakeAmount={stakeAmount}
              setStakeAmount={setStakeAmount}
              start={start}
              setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
              maxAmount={tokenData?.amount || '0.00'}
            />

            <SRow>
              <Block
                needBorder
                className="stake-block"
                margin="0 8px 0 0"
                style={{
                  flex: 1,
                }}
              >
                <BlockContentStretched>
                  <FlexBlock justifyContent="space-between" alignItems="center">
                    <InlineText size="sm" color="white2">
                      Your stake
                    </InlineText>{' '}
                    <SvgIcon
                      style={{ cursor: 'pointer' }}
                      src={
                        isBalanceShowing ? ImagesPath.eye : ImagesPath.closedEye
                      }
                      width="0.9em"
                      height="auto"
                      onClick={() => {
                        setIsBalanceShowing(!isBalanceShowing)
                      }}
                    />
                  </FlexBlock>
                  <BigNumber>
                    <InlineText>
                      {isBalanceShowing
                        ? stripByAmountAndFormat(totalStaked)
                        : '***'}
                    </InlineText>{' '}
                    <InlineText color="white2">RIN</InlineText>
                  </BigNumber>
                  <StretchedBlock align="flex-end">
                    <InlineText size="sm">
                      <InlineText color="white2">$</InlineText>&nbsp;{' '}
                      {isBalanceShowing ? stakedInUsd : '***'}
                    </InlineText>{' '}
                  </StretchedBlock>
                </BlockContentStretched>
              </Block>

              <Block needBorder className="rewards-block">
                <BlockContentStretched>
                  <FlexBlock alignItems="center" justifyContent="space-between">
                    <InlineText color="white2" size="sm">
                      Compounded Rewards
                    </InlineText>
                    <DarkTooltip
                      title={
                        <>
                          <p>
                            APR is calculated based on last RIN buyback which
                            are weekly.
                          </p>
                        </>
                      }
                    >
                      <span>
                        <SvgIcon src={InfoIcon} width="0.8em" />
                      </span>
                    </DarkTooltip>
                  </FlexBlock>
                  <BigNumber>
                    <InlineText>
                      {isBalanceShowing
                        ? formatNumberWithSpaces(compoundedRewards)
                        : '***'}{' '}
                    </InlineText>{' '}
                    <InlineText color="white2">RIN</InlineText>
                  </BigNumber>
                  <StretchedBlock align="flex-end">
                    <InlineText size="sm">
                      <InlineText color="white2">$</InlineText>&nbsp;{' '}
                      {isBalanceShowing
                        ? formatNumberWithSpaces(compoundedRewards * tokenPrice)
                        : '***'}
                    </InlineText>
                    <NumberWithLabel
                      value={stripDigitPlaces(rinHarvest?.apy, 2)}
                      label="APY"
                    />
                  </StretchedBlock>
                </BlockContentStretched>
              </Block>
            </SRow>
          </Column>
          <UnstakeContainer
            unstakeAmount={unstakeAmount}
            setUnstakeAmount={setUnstakeAmount}
            end={end}
            setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
            maxAmount={maxAmount || '0.00'}
          />
        </Column>
      </Modal>
    </ModalContainer>
  )
}

export const RinStaking = queryRendererHoc({
  query: getStakingInfo,
  name: 'getStakingInfoQuery',
  fetchPolicy: 'network-only',
  withoutLoading: true,
})(RinStakingComp)
