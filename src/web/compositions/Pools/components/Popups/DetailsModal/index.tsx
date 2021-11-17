import { stripByAmount, stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { SvgIcon } from '@sb/components'
import { Button } from '@sb/components/Button'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Cell, Row } from '@sb/components/Layout'
import { Modal } from "@sb/components/Modal"
import { ShareButton } from '@sb/components/ShareButton'
import { TokenExternalLinks } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import React from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { DexTokensPrices, FeesEarned, PoolInfo, TradingVolumeStats } from '../../../index.types'
import SwapIcon from './icons/swapIcon.svg'
import { PoolStats } from './PoolStats'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import {
  ButtonsContainer,
  FarmingBlock,
  FarmingButton,
  FarmingButtonsContainer, LiquidityBlock,
  LiquidityButton, LiquidityItem,
  LiquidityText, LiquidityTitle, LiquidityWrap, ModalBlock,
  PoolInfoBlock,
  PoolRow, PoolStatsBlock,
  PoolStatsData,
  PoolStatsRow,
  PoolStatsText, PoolStatsTitle, SwapButton,
  SwapButtonIcon, TokenGlobalInfo,
  TokenIcons, TokenInfo,
  TokenInfoName, TokenInfoRow,
  TokenInfoText,
  TokenInfoTextWrap,
  TokenNames, TokenPrice,
  TokenSymbols,
  FarmingData,
  FarmingDataIcons,
  FarmingIconWrap
} from './styles'
import { getFarmingStateDailyFarmingValue } from '../../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValue'
import { getTokenNameByMintAddress } from '../../../../../dexUtils/markets'
import { stripDigitPlaces, formatNumberToUSFormat } from '@core/utils/PortfolioTableUtils'
import { getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity } from '../../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity'
import { useTokenInfos } from '../../../../../dexUtils/tokenRegistry'


interface DetailsModalProps {
  pools?: PoolInfo[]
  prices: Map<string, DexTokensPrices>
  tradingVolumes: TradingVolumeStats[]
  fees: FeesEarned[]
}

const trimTo = (str: string, maxLength = 13) => {
  const trimmedSuffix = '...'
  const trLength = trimmedSuffix.length

  if (str.length > maxLength + trLength) {
    return `${str.substr(0, maxLength)}${trimmedSuffix}`
  }

  return str
}

export const DetailsModal: React.FC<DetailsModalProps> = (props) => {

  const { pools, prices, tradingVolumes, fees } = props
  const history = useHistory()
  const { symbol } = useParams()

  const tokenMap = useTokenInfos()

  const [base, quote] = (symbol as string).split('_')

  const goBack = () => history.push('/pools')

  const pool = pools?.find((p) => p.parsedName === symbol)

  if (!pool) {
    return null
  }



  const baseTokenInfo = tokenMap.get(pool.tokenA)
  const quoteTokenInfo = tokenMap.get(pool.tokenB)

  const baseTokenName = trimTo(baseTokenInfo?.name || '')
  const quoteTokenName = trimTo(quoteTokenInfo?.name || '')


  const tradingVolume = tradingVolumes.find((tv) => tv.pool === pool.swapToken) || {
    dailyTradingVolume: 0,
    weeklyTradingVolume: 0,
  }

  const feesForPool = fees.find((f) => f.pool === pool.swapToken) || {
    totalBaseTokenFee: 0,
    totalQuoteTokenFee: 0,
  }

  const basePrice = pool.tvl.tokenB / pool.tvl.tokenA
  const quotePrice = pool.tvl.tokenA / pool.tvl.tokenB

  const baseUsdPrice = prices.get(base)
  const quoteUsdPrice = prices.get(quote)


  const feesUsd = feesForPool.totalBaseTokenFee * basePrice + feesForPool.totalQuoteTokenFee * quotePrice

  const tvlUsd = pool.tvl.tokenA * (baseUsdPrice?.price || 0) + pool.tvl.tokenB * (quoteUsdPrice?.price || 0)

  const lpTokenPrice = calculatePoolTokenPrice({
    pool,
    dexTokensPricesMap: prices
  })

  const lpUsdValue = lpTokenPrice * pool.lpTokenFreezeVaultBalance

  const farmings = filterOpenFarmingStates(pool.farming || [])
  const dailyUsdReward = farmings.reduce(
    (acc, farmingState) => {
      const dailyRewardPerThousand = getFarmingStateDailyFarmingValue({ farmingState, totalStakedLpTokensUSD: lpUsdValue })

      const farmingTokenSymbol = getTokenNameByMintAddress(farmingState.farmingTokenMint)

      const farmingTokenPrice = prices.get(farmingTokenSymbol)?.price || 0

      const dailyUsdRewardPerThousand = dailyRewardPerThousand * farmingTokenPrice

      return acc + dailyUsdRewardPerThousand
    },
    0
  )

  const farmingAPR = ((dailyUsdReward * 365) / lpUsdValue) * 100

  const totalApr = farmingAPR + pool.apy24h

  const aprFormatted = formatNumberToUSFormat(stripDigitPlaces(totalApr, 2))

  const shareText = `I farm on ${base}/${quote} liquidity pool with ${aprFormatted}% APR on @aldrin_exchange
Don't miss your chance.`

  return (
    <Modal open onClose={goBack}>
      <ModalBlock border>
        <div>
          <Button variant="secondary" onClick={goBack} borderRadius="lg">⟵ Close</Button>
        </div>
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
              <TokenInfoText weight={700}>{base}<TokenInfoName>{baseTokenName}</TokenInfoName></TokenInfoText>
              <TokenPrice>
                {baseUsdPrice ? `$${stripByAmount(baseUsdPrice.price, 4)}` : '-'}
              </TokenPrice>
            </TokenInfoTextWrap>
            <TokenExternalLinks
              tokenName={base}
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
              <TokenInfoText weight={700}>{quote}<TokenInfoName>{quoteTokenName}</TokenInfoName></TokenInfoText>
              <TokenPrice>
                {quoteUsdPrice ? `$${stripByAmount(quoteUsdPrice.price, 4)}` : '-'}
              </TokenPrice>
            </TokenInfoTextWrap>
            <TokenExternalLinks
              tokenName={quote}
              marketAddress={pool.tokenB}
            />
          </TokenInfoRow>
        </TokenGlobalInfo>
      </ModalBlock>
      <ModalBlock border>
        <PoolRow>
          {/* Pool name */}
          <PoolInfoBlock>
            <Row>
              <TokenIcons>
                <TokenIcon
                  mint={pool.tokenA}
                  width={'3em'}
                  emojiIfNoLogo={false}
                  margin="0 0.5em 0 0"
                /> /
              <TokenIcon
                  mint={pool.tokenB}
                  width={'3em'}
                  emojiIfNoLogo={false}
                  margin="0 0 0 0.5em"
                />
              </TokenIcons>
              <div>
                <TokenSymbols>{base}/{quote}</TokenSymbols>
                {!!baseTokenName && !!quoteTokenName &&
                  <TokenNames>{baseTokenName}/{quoteTokenName}</TokenNames>
                }

              </div>
            </Row>
            <ButtonsContainer>
              <SwapButton borderRadius="xl" as={Link} to={`/swap?base=${base}&quote=${quote}`}>
                <SwapButtonIcon>
                  <SvgIcon src={SwapIcon}></SvgIcon>
                </SwapButtonIcon>
              Swap
            </SwapButton>
              <ShareButton iconFirst variant="primary" text={shareText} />
            </ButtonsContainer>
          </PoolInfoBlock>
          {/* Pool stats */}
          <PoolStatsRow>
            <PoolStats title={<>Volume <span>24h</span></>} value={tradingVolume.dailyTradingVolume} />
            <PoolStats title="Total Value Locked" value={tvlUsd} />
            <PoolStats title={<>Fees <span>24h</span></>} value={feesUsd} />
            <PoolStatsBlock>
              <PoolStatsTitle>APR</PoolStatsTitle>
              <PoolStatsData>
                <PoolStatsText color="success">
                  {aprFormatted}%
                </PoolStatsText>
              </PoolStatsData>
            </PoolStatsBlock>
            <PoolStatsBlock>
              <PoolStatsTitle>Farming</PoolStatsTitle>
              <PoolStatsData>
                <FarmingData>
                  <FarmingDataIcons>
                    {farmings.map((farmingState) => {
                      return (
                        <FarmingIconWrap
                          key={`farming_icon_${farmingState.farmingTokenMint}`}
                        >
                          <TokenIcon
                            mint={farmingState.farmingTokenMint}
                            width={'1.3em'}
                            emojiIfNoLogo={false}
                          />
                        </FarmingIconWrap>
                      )
                    })}
                  </FarmingDataIcons>
                  <div>
                    <PoolStatsText>
                      {farmings.map((farmingState, i, arr) => {
                        const tokensPerThousand = getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity({
                          farmingState, totalStakedLpTokensUSD: lpUsdValue
                        })
                        return (
                          <PoolStatsText key={`fs_reward_${farmingState.farmingTokenMint}`}>
                            {i > 0 ? ' + ' : ''}
                            <PoolStatsText color="success">
                              {stripByAmountAndFormat(tokensPerThousand)}&nbsp;
                            </PoolStatsText>
                            {getTokenNameByMintAddress(farmingState.farmingTokenMint)}
                          </PoolStatsText>
                        )
                      })} / Day
                    </PoolStatsText>
                    <div>
                      <PoolStatsText>
                        Per each  <PoolStatsText color="success">$1000</PoolStatsText>
                      </PoolStatsText>
                    </div>
                  </div>
                </FarmingData>

              </PoolStatsData>
            </PoolStatsBlock>
          </PoolStatsRow>
        </PoolRow>
      </ModalBlock>
      <ModalBlock>
        <LiquidityWrap>
          <ConnectWalletWrapper size="sm">
            <Row>
              <Cell col={6}>
                <LiquidityBlock>
                  <LiquidityItem>
                    <LiquidityTitle>Your Liquidity:</LiquidityTitle>
                    <div>
                      <LiquidityText weight={600}>
                        <LiquidityText color="success">12345.23</LiquidityText> RIN
                        <LiquidityText color="success"> / 15.8234</LiquidityText> SOL
                      </LiquidityText>
                    </div>
                    <div>
                      <LiquidityText color="success">$1000,000.00</LiquidityText>
                    </div>
                    <LiquidityButton variant="rainbow">Deposit Liquidity</LiquidityButton>
                  </LiquidityItem>
                  <LiquidityItem>
                    <LiquidityTitle>Fees Earned:</LiquidityTitle>
                    <div>
                      <LiquidityText weight={600}>
                        <LiquidityText color="success">12345.23</LiquidityText> RIN
                        <LiquidityText color="success"> / 15.8234</LiquidityText> SOL
                      </LiquidityText>
                    </div>
                    <div>
                      <LiquidityText color="success">$1000,000.00</LiquidityText>
                    </div>
                    <LiquidityButton>Withdraw Liquidity + Fees</LiquidityButton>
                  </LiquidityItem>
                </LiquidityBlock>
              </Cell>
              <Cell col={6}>
                <FarmingBlock>
                  <LiquidityItem>
                    <LiquidityTitle>Stake LP Tokens</LiquidityTitle>
                    <div>
                      <LiquidityText weight={600}>
                        <LiquidityText color="success">12345.23</LiquidityText> RIN
                        <LiquidityText color="success"> / 15.8234</LiquidityText> SOL
                      </LiquidityText>
                    </div>
                    <div>
                      <LiquidityText color="success">$1000,000.00</LiquidityText>
                    </div>
                    <FarmingButtonsContainer>
                      <FarmingButton>Stake LP Tokens</FarmingButton>
                      <FarmingButton variant="error">Unstake LP Tokens</FarmingButton>
                    </FarmingButtonsContainer>
                  </LiquidityItem>
                  <LiquidityItem>
                    <LiquidityTitle>Claimable Rewards:</LiquidityTitle>
                    <div>
                      <LiquidityText weight={600}>
                        <LiquidityText color="success">12345.23</LiquidityText> RIN
                        <LiquidityText color="success"> / 15.8234</LiquidityText> SOL
                      </LiquidityText>
                    </div>
                    <div>
                      <LiquidityText color="success">$1000,000.00</LiquidityText>
                    </div>
                    <FarmingButton variant="rainbow">Claim</FarmingButton>
                  </LiquidityItem>
                </FarmingBlock>
              </Cell>
            </Row>
          </ConnectWalletWrapper>
        </LiquidityWrap>

      </ModalBlock>
    </Modal >
  )
}