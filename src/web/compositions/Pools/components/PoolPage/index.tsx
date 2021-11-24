import { stripByAmount, stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { Button } from '@sb/components/Button'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Cell, Row } from '@sb/components/Layout'
import { Modal } from "@sb/components/Modal"
import { TokenExternalLinks } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { FarmingTicket, SnapshotQueue } from '@sb/dexUtils/common/types'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { RefreshFunction, TokenInfo as TokenInfoType } from '@sb/dexUtils/types'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { DexTokensPrices, FeesEarned, PoolInfo, PoolWithOperation, TradingVolumeStats } from '../../index.types'
import { AddLiquidityPopup } from '../Popups/AddLiquidity'
import { ClaimRewards } from '../Popups/ClaimRewards/ClaimRewards'
import { StakePopup } from '../Popups/Staking/StakePopup'
import { UnstakePopup } from '../Popups/Unstaking/UnstakePopup'
import { WithdrawalPopup } from '../Popups/WithdrawLiquidity'
import { PoolStatsBlock, trimTo } from './PoolStats'


import {
  LiquidityWrap,
  ModalBlock,
  TokenGlobalInfo,
  TokenInfo,
  TokenInfoName, TokenInfoRow,
  TokenInfos, TokenInfoText,
  TokenInfoTextWrap,
  TokenPrice
} from './styles'
import { UserFarmingBlock } from './UserFarmingBlock'
import { UserLiquidityBlock } from './UserLiquidityBlock'
import { getTokenNameByMintAddress } from '../../../../dexUtils/markets'


interface PoolPageProps {
  pools?: PoolInfo[]
  prices: Map<string, DexTokensPrices>
  tradingVolumes: Map<string, TradingVolumeStats>
  fees: FeesEarned[]
  userTokensData: TokenInfoType[]
  farmingTickets: Map<string, FarmingTicket[]>
  earnedFees: Map<string, FeesEarned>
  refreshUserTokensData: RefreshFunction
  refreshAll: RefreshFunction
  snapshotQueues: SnapshotQueue[]
}



type ModalType = '' | 'deposit' | 'withdraw' | 'stake' | 'claim' | 'remindToStake' | 'unstake'

export const PoolPage: React.FC<PoolPageProps> = (props) => {

  const {
    pools,
    prices,
    tradingVolumes,
    fees,
    userTokensData,
    farmingTickets,
    earnedFees,
    snapshotQueues,
    refreshUserTokensData,
    refreshAll,
  } = props

  const history = useHistory()
  const { symbol } = useParams()

  const tokenMap = useTokenInfos()

  const [openedPopup, setOpenedPopup] = useState<ModalType>('')

  const [poolUpdateOperation, setPoolUpdateOperation] = useState<PoolWithOperation>({ pool: '', operation: '' })

  const liquidityProcessing = poolUpdateOperation.operation === 'deposit' || poolUpdateOperation.operation === 'withdraw'
  const farmingProcessing = poolUpdateOperation.operation === 'claim' || poolUpdateOperation.operation === 'stake' || poolUpdateOperation.operation === 'unstake'

  const closePopup = () => setOpenedPopup('')


  const goBack = () => history.push('/pools')

  const pool = pools?.find((p) => p.parsedName === symbol)

  if (!pool) {
    return null
  }

  const baseInfo = tokenMap.get(pool.tokenA)
  const quoteInfo = tokenMap.get(pool.tokenB)

  const base = baseInfo?.symbol || getTokenNameByMintAddress(pool.tokenA)
  const quote = quoteInfo?.symbol || getTokenNameByMintAddress(pool.tokenB)


  const baseTokenName = trimTo(baseInfo?.symbol || '')
  const quoteTokenName = trimTo(quoteInfo?.symbol || '')


  const baseDoubleTrimmed = trimTo(baseInfo?.name || '', 7)
  const quoteDoubleTrimmed = trimTo(quoteInfo?.name || '', 7)


  const basePrice = pool.tvl.tokenB / pool.tvl.tokenA
  const quotePrice = pool.tvl.tokenA / pool.tvl.tokenB

  const baseUsdPrice = prices.get(baseTokenName) || { price: 0 }
  const quoteUsdPrice = prices.get(quoteTokenName) || { price: 0 }


  return (
    <Modal open onClose={goBack}>
      <ModalBlock border>
        <div>
          <Button $variant="secondary" onClick={goBack} $borderRadius="lg">⟵ Close</Button>
        </div>
        <TokenInfos>
          <TokenInfo>
            <TokenInfoRow>
              <TokenIcon
                mint={pool.tokenA}
                width={'1.2em'}
                height={'1.2em'}
              />
              <InlineText color="success">1</InlineText>
              <InlineText>{base}&nbsp;=&nbsp;</InlineText>
              <TokenIcon
                mint={pool.tokenB}
                width={'1.2em'}
                height={'1.2em'}
              />
              <InlineText color="success">{stripByAmountAndFormat(basePrice, 4)}</InlineText>
              <InlineText>{quote}</InlineText>
            </TokenInfoRow>
          </TokenInfo>
          <TokenInfo>
            <TokenInfoRow>
              <TokenIcon
                mint={pool.tokenB}
                width={'1.2em'}
                height={'1.2em'}
              />
              <InlineText color="success">1</InlineText>
              <InlineText>{quote}&nbsp;=&nbsp;</InlineText>
              <TokenIcon
                mint={pool.tokenA}
                width={'1.2em'}
                height={'1.2em'}
              />
              <InlineText color="success">{stripByAmountAndFormat(quotePrice, 4)}</InlineText>
              <InlineText>{base}</InlineText>
            </TokenInfoRow>
          </TokenInfo>
          <TokenGlobalInfo>
            <TokenInfoRow>
              <TokenIcon
                mint={pool.tokenA}
                width={'1.2em'}
                height={'1.2em'}
              />
              <TokenInfoTextWrap>
                <TokenInfoText weight={700}>{base}<TokenInfoName>{baseDoubleTrimmed}</TokenInfoName></TokenInfoText>
                <TokenPrice>
                  {baseUsdPrice ? `$${stripByAmount(baseUsdPrice.price, 4)}` : '-'}
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
              <TokenIcon
                mint={pool.tokenB}
                width={'1.2em'}
                height={'1.2em'}
              />
              <TokenInfoTextWrap>
                <TokenInfoText weight={700}>{quote}<TokenInfoName>{quoteDoubleTrimmed}</TokenInfoName></TokenInfoText>
                <TokenPrice>
                  {quoteUsdPrice ? `$${stripByAmount(quoteUsdPrice.price, 4)}` : '-'}
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
                  pool={pool}
                  userTokensData={userTokensData}
                  farmingTickets={farmingTickets}
                  basePrice={baseUsdPrice.price}
                  quotePrice={quoteUsdPrice.price}
                  earnedFees={earnedFees}
                  onDepositClick={() => setOpenedPopup('deposit')}
                  onWithdrawClick={() => setOpenedPopup('withdraw')}
                  processing={liquidityProcessing}
                />
              </Cell>
              <Cell col={12} colLg={6}>
                <UserFarmingBlock
                  pool={pool}
                  farmingTickets={farmingTickets}
                  userTokensData={userTokensData}
                  prices={prices}
                  onStakeClick={() => setOpenedPopup('stake')}
                  onClaimClick={() => setOpenedPopup('claim')}
                  onUnstakeClick={() => setOpenedPopup('unstake')}
                  processing={farmingProcessing}
                />
              </Cell>
            </Row>
          </ConnectWalletWrapper>
        </LiquidityWrap>
      </ModalBlock>

      {openedPopup === 'deposit' &&
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
      }

      {openedPopup === 'withdraw' &&
        <WithdrawalPopup
          selectedPool={pool}
          dexTokensPricesMap={prices}
          farmingTicketsMap={farmingTickets}
          earnedFeesInPoolForUserMap={earnedFees}
          allTokensData={userTokensData}
          close={closePopup}
          setIsUnstakePopupOpen={() => setOpenedPopup('unstake')}
          refreshAllTokensData={refreshUserTokensData}
          setPoolWaitingForUpdateAfterOperation={setPoolUpdateOperation}
        />
      }

      {(openedPopup === 'stake' || openedPopup === 'remindToStake') &&
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
      }

      {openedPopup === 'unstake' && (
        <UnstakePopup
          selectedPool={pool}
          close={closePopup}
          allTokensData={userTokensData}
          refreshTokensWithFarmingTickets={refreshAll}
          setPoolWaitingForUpdateAfterOperation={setPoolUpdateOperation}
        />
      )}

      {openedPopup === 'claim' && (
        <ClaimRewards
          selectedPool={pool}
          farmingTicketsMap={farmingTickets}
          snapshotQueues={snapshotQueues}
          allTokensData={userTokensData}
          close={closePopup}
          refreshTokensWithFarmingTickets={refreshAll}
          setPoolWaitingForUpdateAfterOperation={setPoolUpdateOperation}
        />
      )}


    </Modal>
  )
}