import React, { useCallback, useState } from 'react'

import { Block, BlockContentStretched } from '@sb/components/Block'
import { FlexBlock, StretchedBlock } from '@sb/components/Layout'
import { Modal } from '@sb/components/Modal'
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

import { FARMING_V2_TEST_TOKEN } from '@core/solana'
import {
  stripByAmountAndFormat,
  stripToMillions,
} from '@core/utils/numberUtils'

import { NumberWithLabel } from '../../NumberWithLabel'
import { HeaderComponent } from '../Header'
import InfoIcon from '../Icons/Icon.svg'
import { Column, Row } from '../index.styles'
import { ModalContainer } from '../WithdrawLiquidity/index.styles'
import { BigNumber } from './index.styles'
import { StakeContainer } from './StakeContainer'
import { UnstakeContainer } from './UnstakeContainer'

export const RinStaking = ({
  onClose,
  open,
  farms,
  dexTokensPricesMap,
  setIsConnectWalletPopupOpen,
}: {
  onClose: () => void
  open: boolean
  farms: any
  dexTokensPricesMap: Map<string, DexTokensPrices>
  setIsConnectWalletPopupOpen: (a: boolean) => void
}) => {
  const [stakeAmount, setStakeAmount] = useState(0)
  const [unstakeAmount, setUnstakeAmount] = useState(0)
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

      if (!farms) {
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

  // useEffect(() => {
  //   document.title = `Aldrin | Stake RIN | ${}% APR`
  //   return () => {
  //     document.title = 'Aldrin'
  //   }
  // }, [apr])

  return (
    <ModalContainer needBlur>
      <Modal open={open} onClose={onClose}>
        <HeaderComponent close={() => onClose()} token="RIN" />
        <Column height="calc(100% - 10em)" margin="0 0 3em">
          <Column height="auto" width="100%">
            <StakeContainer
              stakeAmount={stakeAmount}
              setStakeAmount={setStakeAmount}
              start={start}
              setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
              maxAmount={tokenData?.amount || '0.00'}
            />

            <Row width="100%" margin="1.25em 0">
              <Block
                margin="0 8px 0 0"
                style={{
                  flex: 1,
                }}
              >
                <BlockContentStretched>
                  <FlexBlock justifyContent="space-between" alignItems="center">
                    <InlineText size="sm">Your stake</InlineText>{' '}
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
                      {isBalanceShowing ? stripToMillions(totalStaked) : '***'}
                    </InlineText>{' '}
                    <InlineText>RIN</InlineText>
                  </BigNumber>
                  <StretchedBlock align="flex-end">
                    <InlineText size="sm">
                      <InlineText>$</InlineText>&nbsp;{' '}
                      {isBalanceShowing ? stakedInUsd : '***'}
                    </InlineText>{' '}
                  </StretchedBlock>
                </BlockContentStretched>
              </Block>

              <Block className="rewards-block">
                <BlockContentStretched>
                  <FlexBlock alignItems="center" justifyContent="space-between">
                    <InlineText size="sm">Compounded Rewards</InlineText>
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
                      {isBalanceShowing ? formatNumberWithSpaces(8000) : '***'}{' '}
                    </InlineText>{' '}
                    <InlineText>RIN</InlineText>
                  </BigNumber>
                  <StretchedBlock align="flex-end">
                    <InlineText size="sm">
                      <InlineText>$</InlineText>&nbsp;{' '}
                      {isBalanceShowing ? formatNumberWithSpaces(1800) : '***'}
                    </InlineText>
                    <NumberWithLabel value={12} label="APY" />
                  </StretchedBlock>
                </BlockContentStretched>
              </Block>
            </Row>
          </Column>
          <UnstakeContainer
            unstakeAmount={unstakeAmount}
            setUnstakeAmount={setUnstakeAmount}
            end={end}
            setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
            maxAmount={totalStaked || '0.00'}
          />
        </Column>
      </Modal>
    </ModalContainer>
  )
}
