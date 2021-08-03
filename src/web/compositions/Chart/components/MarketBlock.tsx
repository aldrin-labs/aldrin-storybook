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
import tokensLinksMap from '@core/config/tokensTwitterLinks'
import Coinmarketcap from '@icons/coinmarketcap.svg'
import CoinGecko from '@icons/coingecko.svg'
import Inform from '@icons/inform.svg'
import { MintsPopup } from '../Inputs/SelectWrapper/MintsPopup'

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
  margin-left: 1.5rem;
`

export const LinkToTwitter = styled.a`
  font-size: 2rem;
  cursor: pointer;
  margin-left: 1.5rem;
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

const MarketBlock = ({ theme, activeExchange = 'serum', marketType = 0 }) => {
  const { market, customMarkets } = useMarket()
  const location = useLocation()
  const [isMintsPopupOpen, setIsMintsPopupOpen] = useState(false)

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

  const twitterLink = tokensLinksMap?.get(base)?.twitterLink || ''
  const marketCapLink = tokensLinksMap?.get(base)?.marketCapLink || ''
  const marketCapIcon = marketCapLink.includes('coinmarketcap')
    ? Coinmarketcap
    : CoinGecko

  return (
    <RowContainer
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
            isMintsPopupOpen={isMintsPopupOpen}
            setIsMintsPopupOpen={() => setIsMintsPopupOpen}
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
          <SvgIcon
            src={Inform}
            onClick={() => {
              setIsMintsPopupOpen(true)
            }}
            style={{ margin: '0 1.5rem', cursor: 'pointer' }}
            width={'2.3rem'}
            height={'2.3rem'}
          />
          <LinkToSolanaExp marketAddress={marketAddress} />
          <DarkTooltip title={'Show analytics for this market.'}>
            <LinkToAnalytics to={`/analytics/${pair}`}>
              <SvgIcon src={AnalyticsIcon} width={'2.3rem'} height={'2.3rem'} />
            </LinkToAnalytics>
          </DarkTooltip>
          {twitterLink !== '' && (
            <DarkTooltip title={'Twitter profile of base token.'}>
              <LinkToTwitter
                target="_blank"
                rel="noopener noreferrer"
                href={twitterLink}
              >
                <SvgIcon
                  width={'2.5rem'}
                  height={'2.5rem'}
                  src={BlueTwitterIcon}
                />
              </LinkToTwitter>
            </DarkTooltip>
          )}
          {marketCapLink !== '' && (
            <a
              style={{ marginLeft: '1.5rem' }}
              target="_blank"
              rel="noopener noreferrer"
              href={marketCapLink}
            >
              <SvgIcon width={'2.5rem'} height={'2.5rem'} src={marketCapIcon} />
            </a>
          )}
        </Row>
      </Row>
      <Row>
        <Row align={'flex-start'} direction="column">
          <Title color={theme.palette.green.main}>
            SOL is the fuel for transactions on Solana. You must have
          </Title>
          <Title color={theme.palette.green.main}>
            some SOL in your wallet for DEX trading or other transactions.
          </Title>
        </Row>
        <ExclamationMark theme={theme} color={theme.palette.green.main} margin={'0 0 0 2rem'} fontSize="5rem" />
      </Row>
      <MintsPopup
        theme={theme}
        symbol={marketName}
        marketAddress={marketAddress}
        open={isMintsPopupOpen}
        onClose={() => setIsMintsPopupOpen(false)}
      />
    </RowContainer>
  )
}

export default compose(withTheme())(MarketBlock)
