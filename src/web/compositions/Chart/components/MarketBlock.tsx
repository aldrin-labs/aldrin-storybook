import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { Theme, withTheme } from '@material-ui/core'
import { Link, useLocation } from 'react-router-dom'
import { getTokenMintAddressByName, useMarket } from '@sb/dexUtils/markets'
import { getDecimalCount } from '@sb/dexUtils/utils'
import AutoSuggestSelect from '../Inputs/AutoSuggestSelect/AutoSuggestSelect'
import MarketStats from './MarketStats/MarketStats'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import LinkToSolanaExp from './LinkToSolanaExp'
import GreenCheckmark from '@icons/successIcon.svg'
import ThinkingFace from '@icons/thinkingFace.png'
import Warning from '@icons/warningPairSel.png'
import CCAILogo from '@icons/auth0Logo.svg'
import BlueTwitterIcon from '@icons/blueTwitter.svg'
import AnalyticsIcon from '@icons/analytics.svg'
import SvgIcon from '@sb/components/SvgIcon'
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { TokenIcon } from '@sb/components/TokenIcon'

export const ExclamationMark = styled(({ fontSize, lineHeight, ...props }) => (
  <span {...props}>!</span>
))`
  color: ${(props) => props.color || props.theme.palette.orange.dark};
  font-family: Avenir Next Demi;
  font-size: ${(props) => props.fontSize || '5rem'};
  line-height: ${(props) => props.lineHeight || '6rem'};
  margin: ${(props) => props.margin || '0 2rem 0 0'};
`

export const Title = styled(
  ({ width, fontFamily, fontSize, color, textAlign, margin, ...props }) => (
    <span {...props} />
  )
)`
  width: ${(props) => props.width || 'auto'};
  font-family: ${(props) => props.fontFamily || 'Avenir Next Medium'};
  font-style: normal;
  font-weight: normal;
  font-size: ${(props) => props.fontSize || '1.4rem'};
  text-align: center;
  color: ${(props) => props.color || '#ecf0f3'};
  text-align: ${(props) => props.textAlign || 'center'};
  margin: ${(props) => props.margin || '0'};
`
export const LinkToAnalytics = styled(Link)`
  font-size: 2rem;
  cursor: pointer;
  margin-left: 2rem;
`

export const LinkToTwitter = styled.a`
  font-size: 2rem;
  cursor: pointer;
  margin-left: 2rem;
`

const ChangeTerminalButton = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
`

const ChangeTradeButton = styled.button`
  display: flex;
  justify-content: center;
  text-transform: capitalize;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.5px;
  font-family: DM Sans, sans-serif;
  font-size: 1.4rem;
  line-height: 1.9rem;
  align-items: center;
  outline: none;
  border: none;
  width: 50%;
`

const selectStyles = (theme: Theme) => ({
  height: '100%',
  background: theme.palette.white.background,
  marginRight: '.8rem',
  cursor: 'pointer',
  padding: 0,
  backgroundColor: theme.palette.white.background,
  border: `.1rem solid ${theme.palette.blue.serum}`,
  borderRadius: '0.75rem',
  boxShadow: '0px 0px 1.2rem rgba(8, 22, 58, 0.1)',
  width: '14rem',
  '& div': {
    fontFamily: 'Avenir Next Demi',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: theme.palette.dark.main,
    textTransform: 'uppercase',
  },
  '& svg': {
    color: theme.palette.blue.serum,
  },
  '.custom-select-box__control': {
    padding: '0 .75rem',
  },
  '.custom-select-box__menu': {
    minWidth: '130px',
    marginTop: '0',
    borderRadius: '0',
    boxShadow: '0px 4px 8px rgba(10,19,43,0.1)',
  },
})

const MarketBlock = ({
  theme,
  activeExchange = 'serum',
  marketType = 0,
  isDefaultTerminalViewMode,
  isDefaultOnlyTablesMode,
  isSmartOrderMode,
  isFullScreenTablesMode,
  updateTerminalViewMode,
}) => {
  const { market, customMarkets } = useMarket()
  const location = useLocation()

  const tokenMap = useTokenInfos()
  const pair = location.pathname.split('/')[3]

  const quantityPrecision =
    market?.minOrderSize && getDecimalCount(market.minOrderSize)
  const pricePrecision = market?.tickSize && getDecimalCount(market.tickSize)
  const marketAddress = market?.address?.toBase58()

  if (!pair) {
    return null
  }

  const [base, quote] = pair.split('_')

  const baseTokenInfo = tokenMap.get(getTokenMintAddressByName(base))

  const marketName = pair.replaceAll('_', '/')
  const currentMarket = customMarkets?.find(
    (el) => el?.name.replaceAll('_', '/') === marketName
  )

  const isCustomUserMarket = currentMarket?.isCustomUserMarket

  const isPrivateCustomMarket =
    currentMarket?.isPrivateCustomMarket !== undefined && !isCustomUserMarket

  const isCCAIPair =
    pair.includes('CCAI') && !isPrivateCustomMarket && !isCustomUserMarket

  return (
    <RowContainer
      wrap={'nowrap'}
      justify={'space-between'}
      style={{
        height: '6rem',
        padding: '0 3rem',
        borderBottom: theme.palette.border.new,
      }}
    >
      <Row justify="flex-start">
        <DarkTooltip
          title={
            isPrivateCustomMarket
              ? 'This is an unofficial custom market. Use at your own risk.'
              : isCustomUserMarket
              ? 'This is curated but unofficial market.'
              : 'This is the official market.'
          }
        >
          <div
            style={{
              width: '5rem',
              fontSize: '2rem',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <TokenIcon
              mint={getTokenMintAddressByName(base)}
              width={'50%'}
              emojiIfNoLogo={true}
              isAwesomeMarket={isCustomUserMarket}
              isAdditionalCustomUserMarket={isPrivateCustomMarket}
            />
          </div>
        </DarkTooltip>
        <div
          data-tut="pairs"
          style={{ height: '100%', padding: '1rem 0', position: 'relative' }}
        >
          <AutoSuggestSelect
            value={pair}
            id={'pairSelector'}
            style={{ width: '20rem' }}
            activeExchange={activeExchange}
            selectStyles={{ ...selectStyles(theme) }}
            marketType={marketType}
            pair={pair}
            quantityPrecision={quantityPrecision}
            pricePrecision={pricePrecision}
            market={market}
            tokenMap={tokenMap}
          />
        </div>

        <MarketStats
          isCCAIPair={isCCAIPair}
          theme={theme}
          symbol={pair}
          marketType={marketType}
          exchange={activeExchange}
          quantityPrecision={quantityPrecision}
          pricePrecision={pricePrecision}
        />
        <Row align={'baseline'}>
          {' '}
          <LinkToSolanaExp marketAddress={marketAddress} />
          <DarkTooltip title={'Show analytics for this market.'}>
            <LinkToAnalytics to={`/analytics/${pair}`}>
              <SvgIcon src={AnalyticsIcon} width={'2.3rem'} height={'2.3rem'} />
            </LinkToAnalytics>
          </DarkTooltip>
          {baseTokenInfo?.extensions?.twitter && (
            <DarkTooltip title={'Twitter profile of base token.'}>
              <LinkToTwitter href={baseTokenInfo?.extensions?.twitter}>
                <SvgIcon
                  width={'2.5rem'}
                  height={'2.5rem'}
                  src={BlueTwitterIcon}
                />
              </LinkToTwitter>
            </DarkTooltip>
          )}
        </Row>
      </Row>
      <Row wrap="nowrap">
        <Row>
          <ChangeTerminalButton
            data-tut={'smart&basic'}
            style={{
              width: '30rem',
              height: '4rem',
            }}
          >
            <DarkTooltip title={'Terminal with traditional order types.'}>
              <ChangeTradeButton
                theme={theme}
                style={{
                  cursor: 'pointer',
                  height: '100%',
                  border: theme.palette.border.main,
                  borderRight: `.1rem solid ${theme.palette.grey.border}`,
                  borderTopLeftRadius: '0.8rem',
                  borderBottomLeftRadius: '0.8rem',
                  backgroundColor:
                    isDefaultTerminalViewMode
                      ? theme.palette.blue.main
                      : theme.palette.white.background,
                  color:
                    isDefaultTerminalViewMode 
                      ? theme.palette.white.main
                      : theme.palette.grey.light,
                }}
                //type={isDefaultTerminalViewMode ? 'buy' : 'sell'}
                id="basicTradingButton"
                onClick={() => {
                  updateTerminalViewMode('default')
                }}
              >
                <span
                  style={{
                    textDecoration: 'underline',
                  }}
                >
                  Basic Mode
                </span>
              </ChangeTradeButton>
            </DarkTooltip>

            <DarkTooltip
              title={
                'Our unique terminal with smart orders and advanced trading features.'
              }
            >
              <ChangeTradeButton
                theme={theme}
                style={{
                  height: '100%',
                  borderTopRightRadius: '0.8rem',
                  borderBottomRightRadius: '0.8rem',
                  border: theme.palette.border.main,
                  borderLeft: `.1rem solid ${theme.palette.grey.border}`,
                  cursor: 'pointer',
                  backgroundColor:
                    isSmartOrderMode || isDefaultOnlyTablesMode || isFullScreenTablesMode
                      ? theme.palette.blue.main
                      : theme.palette.white.background,
                  color:
                    isSmartOrderMode || isDefaultOnlyTablesMode || isFullScreenTablesMode
                      ? theme.palette.white.main
                      : theme.palette.grey.light,
                }}
                type={isDefaultTerminalViewMode ? 'buy' : 'sell'}
                id="smartTradingButton"
                onClick={() => {
                  updateTerminalViewMode('onlyTables')
                }}
              >
                <span
                  style={{
                    textDecoration: 'underline',
                  }}
                >
                  Advanced Mode
                </span>
                {/* <span
                style={{
                  backgroundColor: theme.palette.red.main,
                  marginLeft: '0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '1.5rem',
                  width: '2.7rem',
                  height: '1.6rem',
                  alignItems: 'center',
                  color: theme.palette.white.main,
                }}
              >
                {activeTradesLength}
              </span> */}
              </ChangeTradeButton>
            </DarkTooltip>
          </ChangeTerminalButton>
        </Row>
        {/* <Row align={'flex-start'} direction="column">
          <Title color={theme.palette.orange.dark}>
            SOL is the fuel for transactions on Solana. You must have
          </Title>
          <Title color={theme.palette.orange.dark}>
            some SOL in your wallet for DEX trading or other transactions.
          </Title>
        </Row>
        <ExclamationMark theme={theme} margin={'0 0 0 2rem'} fontSize="5rem" /> */}
      </Row>
    </RowContainer>
  )
}

export default compose(withTheme())(MarketBlock)
