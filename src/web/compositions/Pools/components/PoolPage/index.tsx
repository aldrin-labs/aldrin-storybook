import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { Button } from '@sb/components/Button'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Cell, Row } from '@sb/components/Layout'
import { Modal } from '@sb/components/Modal'
import { TokenExternalLinks } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { withdrawStaked } from '@sb/dexUtils/common/actions'
import { useConnection } from '@sb/dexUtils/connection'
import { getTokenName } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { usePoolBalances } from '@sb/dexUtils/pools/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  getMinimumReceivedAmountFromSwap,
  getPoolsProgramAddress,
} from '@core/solana'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'

import { PoolWithOperation } from '../../index.types'
import { AddLiquidityPopup } from '../Popups/AddLiquidity'
import { StakePopup } from '../Popups/Staking/StakePopup'
import { UnstakePopup } from '../Popups/Unstaking/UnstakePopup'
import { WithdrawalPopup } from '../Popups/WithdrawLiquidity'
import { PoolStatsBlock, trimTo } from './PoolStats'
import {
  LiquidityWrap,
  ModalBlock,
  TokenGlobalInfo,
  TokenInfo,
  TokenInfoName,
  TokenInfoRow,
  TokenInfos,
  TokenInfoText,
  TokenInfoTextWrap,
  TokenPrice,
} from './styles'
import { ModalType, PoolPageProps } from './types'
import { UserFarmingBlock } from './UserFarmingBlock'
import { UserLiquidityBlock } from './UserLiquidityBlock'

const resolveClaimNotification = (
  status: 'success' | 'failed' | 'cancelled' | string
) => {
  if (status === 'success') {
    return 'Successfully claimed rewards.'
  }
  if (status === 'failed') {
    return 'Claim rewards failed, please try again later or contact us in telegram.'
  }
  if (status === 'cancelled') {
    return 'Claim rewards cancelled.'
  }

  return 'Operation timeout, please claim rest rewards in a few seconds.'
}

export const PoolPage: React.FC<PoolPageProps> = (props) => {
  const {
    pools,
    prices,
    tradingVolumes,
    fees,
    userTokensData,
    farmingTickets,
    earnedFees,
    refreshUserTokensData,
    refreshAll,
    vestingsForWallet,
    refetchPools,
  } = props

  const history = useHistory()
  const { symbol } = useParams<{ symbol: string }>()

  const tokenMap = useTokenInfos()

  const connection = useConnection()
  const { wallet } = useWallet()
  const [openedPopup, setOpenedPopup] = useState<ModalType>('')

  const [poolUpdateOperation, setPoolUpdateOperation] =
    useState<PoolWithOperation>({ pool: '', operation: '' })

  const liquidityProcessing =
    poolUpdateOperation.operation === 'deposit' ||
    poolUpdateOperation.operation === 'withdraw'

  const farmingProcessing =
    poolUpdateOperation.operation === 'claim' ||
    poolUpdateOperation.operation === 'stake' ||
    poolUpdateOperation.operation === 'unstake'

  const closePopup = () => setOpenedPopup('')

  const goBack = () => history.push('/pools')

  const pool = pools?.find((p) => {
    const tokenAName = getTokenName({
      address: p.tokenA,
      tokensInfoMap: tokenMap,
    })
    const tokenBName = getTokenName({
      address: p.tokenB,
      tokensInfoMap: tokenMap,
    })
    return `${tokenAName}_${tokenBName}` === symbol
  })

  const [poolBalances] = usePoolBalances(pool || {})

  const vesting = vestingsForWallet.get(pool?.poolTokenMint || '')

  if (!pool) {
    return null
  }

  const baseInfo = tokenMap.get(pool.tokenA)
  const quoteInfo = tokenMap.get(pool.tokenB)

  const base = getTokenName({ address: pool.tokenA, tokensInfoMap: tokenMap })
  const quote = getTokenName({ address: pool.tokenB, tokensInfoMap: tokenMap })

  const baseTokenName = trimTo(baseInfo?.symbol || '')
  const quoteTokenName = trimTo(quoteInfo?.symbol || '')

  const baseDoubleTrimmed = trimTo(baseInfo?.name || '', 7)
  const quoteDoubleTrimmed = trimTo(quoteInfo?.name || '', 7)

  const basePrice = getMinimumReceivedAmountFromSwap({
    isSwapBaseToQuote: true,
    slippage: 0,
    pool,
    swapAmountIn: 1,
    poolBalances,
  })

  const quotePrice = getMinimumReceivedAmountFromSwap({
    isSwapBaseToQuote: false,
    slippage: 0,
    pool,
    swapAmountIn: 1,
    poolBalances,
  })

  const baseUsdPrice = prices.get(baseTokenName) || { price: 0 }
  const quoteUsdPrice = prices.get(quoteTokenName) || { price: 0 }

  const claimRewards = async () => {
    setPoolUpdateOperation({ pool: '', operation: 'claim' })
    const result = await withdrawStaked({
      connection,
      wallet,
      stakingPool: pool,
      farmingTickets: farmingTickets.get(pool.swapToken) || [],
      programAddress: getPoolsProgramAddress({ curveType: pool.curveType }),
      allTokensData: userTokensData,
    })

    notify({
      type: result === 'success' ? 'success' : 'error',
      message: resolveClaimNotification(result),
    })

    refreshAll()
    setPoolUpdateOperation({ pool: '', operation: '' })
  }
  return (
    <Modal open onClose={goBack}>
      <ModalBlock border>
        <div>
          <Button $variant="secondary" onClick={goBack} $borderRadius="lg">
            ⟵ Close
          </Button>
        </div>
        <TokenInfos>
          <TokenInfo>
            <TokenInfoRow>
              <TokenIcon mint={pool.tokenA} />
              <InlineText color="green4">1</InlineText>
              <InlineText>
                {base}
                {` = `}
              </InlineText>
              <TokenIcon mint={pool.tokenB} />
              <InlineText color="green4">
                {stripByAmountAndFormat(basePrice, 4)}
              </InlineText>
              <InlineText>{quote}</InlineText>
            </TokenInfoRow>
          </TokenInfo>
          <TokenInfo>
            <TokenInfoRow>
              <TokenIcon mint={pool.tokenB} />
              <InlineText color="green4">1</InlineText>
              <InlineText>
                {quote}
                {` = `}
              </InlineText>
              <TokenIcon mint={pool.tokenA} />
              <InlineText color="green4">
                {stripByAmountAndFormat(quotePrice, 4)}
              </InlineText>
              <InlineText>{base}</InlineText>
            </TokenInfoRow>
          </TokenInfo>
          <TokenGlobalInfo>
            <TokenInfoRow>
              <TokenIcon mint={pool.tokenA} />
              <TokenInfoTextWrap>
                <TokenInfoText weight={700}>
                  {base}
                  <TokenInfoName>{baseDoubleTrimmed}</TokenInfoName>
                </TokenInfoText>
                <TokenPrice>
                  {baseUsdPrice
                    ? `$${stripByAmount(baseUsdPrice.price, 4)}`
                    : '-'}
                </TokenPrice>
              </TokenInfoTextWrap>
              <TokenExternalLinks
                tokenName={baseTokenName}
                marketAddress={pool.tokenA}
              />
            </TokenInfoRow>
          </TokenGlobalInfo>
          <TokenGlobalInfo>
            <TokenInfoRow>
              <TokenIcon mint={pool.tokenB} />
              <TokenInfoTextWrap>
                <TokenInfoText weight={700}>
                  {quote}
                  <TokenInfoName>{quoteDoubleTrimmed}</TokenInfoName>
                </TokenInfoText>
                <TokenPrice>
                  {quoteUsdPrice
                    ? `$${stripByAmount(quoteUsdPrice.price, 4)}`
                    : '-'}
                </TokenPrice>
              </TokenInfoTextWrap>
              <TokenExternalLinks
                tokenName={quoteTokenName}
                marketAddress={pool.tokenB}
              />
            </TokenInfoRow>
          </TokenGlobalInfo>
        </TokenInfos>
      </ModalBlock>
      <ModalBlock border>
        <PoolStatsBlock
          pool={pool}
          tradingVolumes={tradingVolumes}
          fees={fees}
          baseUsdPrice={baseUsdPrice.price}
          quoteUsdPrice={quoteUsdPrice.price}
          prices={prices}
        />
      </ModalBlock>
      <ModalBlock>
        <LiquidityWrap>
          <ConnectWalletWrapper size="sm">
            <Row>
              <Cell col={12} colLg={6}>
                <UserLiquidityBlock
                  tokenMap={tokenMap}
                  pool={pool}
                  userTokensData={userTokensData}
                  farmingTickets={farmingTickets}
                  basePrice={baseUsdPrice.price}
                  quotePrice={quoteUsdPrice.price}
                  earnedFees={earnedFees}
                  onDepositClick={() => setOpenedPopup('deposit')}
                  onWithdrawClick={() => setOpenedPopup('withdraw')}
                  processing={liquidityProcessing}
                  vesting={vesting}
                />
              </Cell>
              <Cell col={12} colLg={6}>
                <UserFarmingBlock
                  pool={pool}
                  farmingTickets={farmingTickets}
                  userTokensData={userTokensData}
                  prices={prices}
                  onStakeClick={() => setOpenedPopup('stake')}
                  onClaimClick={claimRewards}
                  onUnstakeClick={() => setOpenedPopup('unstake')}
                  processing={farmingProcessing}
                  refetchPools={refetchPools}
                />
              </Cell>
            </Row>
          </ConnectWalletWrapper>
        </LiquidityWrap>
      </ModalBlock>

      {openedPopup === 'deposit' && (
        <AddLiquidityPopup
          dexTokensPricesMap={prices}
          allTokensData={userTokensData}
          close={closePopup}
          refreshAllTokensData={refreshUserTokensData}
          setPoolWaitingForUpdateAfterOperation={setPoolUpdateOperation}
          setIsRemindToStakePopupOpen={() => {
            setOpenedPopup('remindToStake')
          }}
          selectedPool={pool}
        />
      )}

      {openedPopup === 'withdraw' && (
        <WithdrawalPopup
          selectedPool={pool}
          dexTokensPricesMap={prices}
          farmingTicketsMap={farmingTickets}
          // earnedFeesInPoolForUserMap={earnedFees}
          allTokensData={userTokensData}
          close={closePopup}
          setIsUnstakePopupOpen={() => setOpenedPopup('unstake')}
          refreshAllTokensData={refreshUserTokensData}
          setPoolWaitingForUpdateAfterOperation={setPoolUpdateOperation}
          vesting={vesting}
        />
      )}

      {(openedPopup === 'stake' || openedPopup === 'remindToStake') && (
        <StakePopup
          selectedPool={pool}
          dexTokensPricesMap={prices}
          farmingTicketsMap={farmingTickets}
          refreshTokensWithFarmingTickets={refreshAll}
          setPoolWaitingForUpdateAfterOperation={setPoolUpdateOperation}
          isReminderPopup={openedPopup === 'remindToStake'}
          allTokensData={userTokensData}
          close={closePopup}
        />
      )}

      {openedPopup === 'unstake' && (
        <UnstakePopup
          selectedPool={pool}
          close={closePopup}
          farmingTicketsMap={farmingTickets}
          allTokensData={userTokensData}
          refreshTokensWithFarmingTickets={refreshAll}
          setPoolWaitingForUpdateAfterOperation={setPoolUpdateOperation}
        />
      )}
    </Modal>
  )
}
