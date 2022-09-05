import React, { useCallback, useEffect, useState } from 'react'
import compose from 'recompose/compose'

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
import { useWallet } from '@sb/dexUtils/wallet'
import { withPublicKey } from '@sb/hoc'

import { getStakingInfo } from '@core/graphql/queries/staking/getStakingInfo'
import { Farm, RIN_MINT, FARMING_V2_TOKEN } from '@core/solana'
import { removeDecimals } from '@core/utils/helpers'
import { stripByAmountAndFormat } from '@core/utils/numberUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { WithStakingInfo } from '../../../types'
import { NumberWithLabel } from '../../NumberWithLabel'
import { HeaderComponent } from '../Header'
import InfoIcon from '../Icons/Icon.svg'
import { Column, ModalContainer } from '../index.styles'
import { BigNumber, SRow } from './index.styles'
import { StakeContainer } from './StakeContainer'
import { UnstakeContainer } from './UnstakeContainer'

interface RinStakingProps extends WithStakingInfo {
  onClose: () => void
  open: boolean
  farms: Farm[]
  dexTokensPricesMap: Map<string, DexTokensPrices>
  setIsConnectWalletPopupOpen: (a: boolean) => void
  socials: string[]
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

  const farm = farms?.get(FARMING_V2_TOKEN)

  const farmer = farmersInfo?.get(farm?.publicKey.toString() || '')

  const tokenData = useAssociatedTokenAccount(farm?.stakeMint.toString())

  const [loading, setLoading] = useState({
    stake: false,
    unstake: false,
  })

  const totalStaked = farmer?.totalStaked || '0'
  const totalStakedWithDecimals = removeDecimals(
    totalStaked,
    farm?.stakeVaultDecimals
  )

  const rinHarvest = farm?.harvests.find(
    (harvest) => harvest.mint.toString() === FARMING_V2_TOKEN
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
      setStakeAmount('')
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
    setUnstakeAmount('')
    return true
  }

  const tokenPrice =
    dexTokensPricesMap?.get(getTokenNameByMintAddress(RIN_MINT))?.price || 0

  const userStakingInfo = getStakingInfoQuery.getStakingInfo?.farmers

  const compoundedRewards =
    userStakingInfo?.reduce((acc, current) => {
      return acc + current.reward
    }, 0) || 0

  const compoundedRewardsWithputDecimals = !wallet.connected
    ? 0
    : removeDecimals(compoundedRewards, farm?.stakeVaultDecimals)

  const stakedInUsd = stripByAmountAndFormat(
    +totalStakedWithDecimals * tokenPrice || 0,
    2
  )

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
              loading={loading.stake}
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
                        ? stripByAmountAndFormat(totalStakedWithDecimals)
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
                        ? stripByAmountAndFormat(
                            compoundedRewardsWithputDecimals
                          )
                        : '***'}{' '}
                    </InlineText>{' '}
                    <InlineText color="white2">RIN</InlineText>
                  </BigNumber>
                  <StretchedBlock align="flex-end">
                    <InlineText size="sm">
                      <InlineText color="white2">$</InlineText>&nbsp;{' '}
                      {isBalanceShowing
                        ? stripByAmountAndFormat(
                            compoundedRewardsWithputDecimals * tokenPrice
                          )
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
            loading={loading.unstake}
            unstakeAmount={unstakeAmount}
            setUnstakeAmount={setUnstakeAmount}
            end={end}
            setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
            maxAmount={totalStakedWithDecimals || '0.00'}
          />
        </Column>
      </Modal>
    </ModalContainer>
  )
}

export default compose(
  withPublicKey,
  queryRendererHoc({
    query: getStakingInfo,
    name: 'getStakingInfoQuery',
    fetchPolicy: 'cache-and-network',
    variables: (props) => ({
      farmerPubkey: props.publicKey,
    }),
    withoutLoading: true,
  })
)(RinStakingComp)
