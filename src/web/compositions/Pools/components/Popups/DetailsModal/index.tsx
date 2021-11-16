import { SvgIcon } from '@sb/components'
import { Button } from '@sb/components/Button'
import { Modal } from "@sb/components/Modal"
import { ShareButton } from '@sb/components/ShareButton'
import { TokenExternalLinks } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import React from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import SwapIcon from './icons/swapIcon.svg'
import {
  ModalBlock,
  SwapButton,
  SwapButtonIcon, TokenGlobalInfo, TokenInfo,
  TokenInfoName, TokenInfoRow,
  TokenInfoText,
  TokenInfoTextWrap,
  TokenPrice,
  TokenSymbols,
  TokenNames,
  PoolStatsBlock,
  PoolStatsData,
  PoolStatsTitle,
  PoolInfoBlock,
  TokenIcons,
  ButtonsContainer,
  PoolStatsRow,
  PoolRow,
  PoolStatsText,
  PoolStatsNumber,
  LiquidityBlock,
  FarmingBlock,
  LiquidityWrap,
  LiquidityTitle,
  LiquidityItem,
  LiquidityText,
  LiquidityButton,
  FarmingButton,
  FarmingButtonsContainer,
} from './styles'
import { Row, Cell } from '@sb/components/Layout'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { PoolInfo, DexTokensPrices } from '../../../index.types'
import { stripByAmountAndFormat, stripByAmount } from '@core/utils/chartPageUtils'
import { formatNumberToUSFormat } from '../../../../../../../../core/src/utils/PortfolioTableUtils'

interface DetailsModalProps {
  pools?: PoolInfo[]
  prices: Map<string, DexTokensPrices>
}
export const DetailsModal: React.FC<DetailsModalProps> = (props) => {

  const { pools, prices } = props
  const history = useHistory()
  const { symbol } = useParams()

  const [base, quote] = (symbol as string).split('_')

  const goBack = () => history.push('/pools')

  const pool = pools?.find((p) => p.parsedName === symbol)

  if (!pool) {
    return null
  }

  const basePrice = pool.tvl.tokenB / pool.tvl.tokenA
  const quotePrice = pool.tvl.tokenA / pool.tvl.tokenB

  const baseUsdPrice = prices.get(base)
  const quoteUsdPrice = prices.get(quote)

  const tvlUsd = pool.tvl.tokenA * (baseUsdPrice?.price || 0) + pool.tvl.tokenB * (quoteUsdPrice?.price || 0)

  console.log('pool: ', pool)

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
              <TokenInfoText weight={700}>{base}</TokenInfoText>
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
              <TokenInfoText weight={700}>{quote}<TokenInfoName>Solana</TokenInfoName></TokenInfoText>
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
                  width={'4em'}
                  emojiIfNoLogo={false}
                  margin="0 0.5em 0 0"
                /> /
              <TokenIcon
                  mint={pool.tokenB}
                  width={'4em'}
                  emojiIfNoLogo={false}
                  margin="0 0 0 0.5em"
                />
              </TokenIcons>
              <div>
                <TokenSymbols>{base}/{quote}</TokenSymbols>
                <TokenNames>Aldrin/USD Coin</TokenNames>
              </div>
            </Row>
            <ButtonsContainer>
              <SwapButton borderRadius="xl" as={Link} to={`/swap?base=${base}&quote=${quote}`}>
                <SwapButtonIcon>
                  <SvgIcon src={SwapIcon}></SvgIcon>
                </SwapButtonIcon>
              Swap
            </SwapButton>
              <ShareButton iconFirst variant="primary" text="Aldrin's pool is amazing!" />
            </ButtonsContainer>
          </PoolInfoBlock>
          {/* Pool stats */}
          <PoolStatsRow>
            <PoolStatsBlock>
              <PoolStatsTitle>Volume <span>24h</span></PoolStatsTitle>
              <PoolStatsData>
                <PoolStatsText>
                  $100,000,000
                </PoolStatsText>
              </PoolStatsData>
            </PoolStatsBlock>
            <PoolStatsBlock>
              <PoolStatsTitle>Total Value Locked</PoolStatsTitle>
              <PoolStatsData>
                <PoolStatsText>
                  ${stripByAmountAndFormat(tvlUsd)}
                </PoolStatsText>
              </PoolStatsData>
            </PoolStatsBlock>
            <PoolStatsBlock>
              <PoolStatsTitle>Fees <span>24h</span></PoolStatsTitle>
              <PoolStatsData>
                <PoolStatsText>
                  $100,000
                </PoolStatsText>
              </PoolStatsData>
            </PoolStatsBlock>
            <PoolStatsBlock>
              <PoolStatsTitle>APR</PoolStatsTitle>
              <PoolStatsData>
                <PoolStatsText color="success">
                  243%
                </PoolStatsText>
              </PoolStatsData>
            </PoolStatsBlock>
            <PoolStatsBlock>
              <PoolStatsTitle>Farming</PoolStatsTitle>
              <PoolStatsData>
                <div>
                  <PoolStatsText>
                    <PoolStatsText color="success">100 </PoolStatsText>RIN +
                    <PoolStatsText color="success">100 </PoolStatsText>MNDE / Day
                  </PoolStatsText>
                </div>
                <div>
                  <PoolStatsText>
                    Per each   <PoolStatsText color="success">$1000</PoolStatsText>
                  </PoolStatsText>
                </div>
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
    </Modal>
  )
}