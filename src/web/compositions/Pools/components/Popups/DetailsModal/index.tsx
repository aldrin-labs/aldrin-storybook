import { SvgIcon } from '@sb/components'
import { Button } from '@sb/components/Button'
import { Modal } from "@sb/components/Modal"
import { ShareButton } from '@sb/components/ShareButton'
import { TokenExternalLinks } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import React from 'react'
import { Link } from 'react-router-dom'
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
  PoolInfo,
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

interface DetailsModalProps {
  onClose: () => void
}
export const DetailsModal: React.FC<DetailsModalProps> = (props) => {
  const { onClose } = props
  return (
    <Modal open onClose={onClose}>
      <ModalBlock border>
        <div>
          <Button variant="secondary" onClick={onClose} borderRadius="lg">⟵ Close</Button>
        </div>
        <TokenInfo>
          <TokenInfoRow>
            <TokenIcon
              mint={'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp'}
              width={'1.2em'}
              height={'1.2em'}
            />
            <InlineText color="success">1</InlineText>
            <InlineText>SOL &nbsp;=&nbsp;</InlineText>

            <TokenIcon
              mint={'BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW'}
              width={'1.2em'}
              height={'1.2em'}
            />
            <InlineText color="success">33</InlineText>
            <InlineText>RIN</InlineText>

          </TokenInfoRow>
        </TokenInfo>
        <TokenInfo>
          <TokenInfoRow>
            <TokenIcon
              mint={'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp'}
              width={'1.2em'}
              height={'1.2em'}
            />
            <InlineText color="success">1</InlineText>
            <InlineText>SOL &nbsp;=&nbsp;</InlineText>

            <TokenIcon
              mint={'BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW'}
              width={'1.2em'}
              height={'1.2em'}
            />
            <InlineText color="success">33</InlineText>
            <InlineText>RIN</InlineText>
          </TokenInfoRow>
        </TokenInfo>
        <TokenGlobalInfo>
          <TokenInfoRow>
            <TokenIcon
              mint={'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp'}
              width={'1.2em'}
              height={'1.2em'}
            />
            <TokenInfoTextWrap>
              <TokenInfoText weight={700}>SOL</TokenInfoText>
              <TokenPrice>$6.03</TokenPrice>
            </TokenInfoTextWrap>
            <TokenExternalLinks tokenName="RIN" marketAddress="E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp" />
          </TokenInfoRow>
        </TokenGlobalInfo>
        <TokenGlobalInfo>
          <TokenInfoRow>
            <TokenIcon
              mint={'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp'}
              width={'1.2em'}
              height={'1.2em'}
            />
            <TokenInfoTextWrap>
              <TokenInfoText weight={700}>SOL <TokenInfoName>Solana</TokenInfoName></TokenInfoText>
              <TokenPrice>$6.03</TokenPrice>
            </TokenInfoTextWrap>
            <TokenExternalLinks tokenName="RIN" marketAddress="E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp" />
          </TokenInfoRow>
        </TokenGlobalInfo>
      </ModalBlock>
      <ModalBlock border>
        <PoolRow>
          {/* Pool name */}
          <PoolInfo>
            <Row>
              <TokenIcons>
                <TokenIcon
                  mint="E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp"
                  width={'4em'}
                  emojiIfNoLogo={false}
                  margin="0 0.5em 0 0"
                /> /
              <TokenIcon
                  mint="BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW"
                  width={'4em'}
                  emojiIfNoLogo={false}
                  margin="0 0 0 0.5em"
                />
              </TokenIcons>
              <div>
                <TokenSymbols>RIN/SOL</TokenSymbols>
                <TokenNames>Aldrin/USD Coin</TokenNames>
              </div>
            </Row>
            <ButtonsContainer>
              <SwapButton borderRadius="xl" as={Link} to={`/swap?base=RIN&quote=USDC`}>
                <SwapButtonIcon>
                  <SvgIcon src={SwapIcon}></SvgIcon>
                </SwapButtonIcon>
              Swap
            </SwapButton>
              <ShareButton iconFirst variant="primary" text="Aldrin's pool is amazing!" />
            </ButtonsContainer>
          </PoolInfo>
          {/* Pool stats */}
          <PoolStatsRow>
            <PoolStatsBlock>
              <PoolStatsTitle>Volume <span>24h</span></PoolStatsTitle>
              <PoolStatsData>
                <PoolStatsText>
                  $100,000,000
                  <PoolStatsNumber>125.00%</PoolStatsNumber>
                </PoolStatsText>
              </PoolStatsData>
            </PoolStatsBlock>
            <PoolStatsBlock>
              <PoolStatsTitle>Total Value Locked</PoolStatsTitle>
              <PoolStatsData>
                <PoolStatsText>
                  $100,000,000,000
                  <PoolStatsNumber>125.00%</PoolStatsNumber>
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