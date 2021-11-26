import React from 'react'
import tokensLinksMap from '@core/config/tokensTwitterLinks'

import Coinmarketcap from '@icons/coinmarketcap.svg'
import CoinGecko from '@icons/coingecko.svg'
import Nomics from '@icons/nomics.svg'
import SolanaExplorerIcon from '@icons/SolanaExplorerIcon.svg'
import AnalyticsIcon from '@icons/analytics.svg'

import BlueTwitterIcon from '@icons/blueTwitter.svg'

import Inform from '@icons/inform.svg'

import { Container, Anchor, Icon, AnalyticsIcon as AnalyticsIconComponent } from './styles'
import { DarkTooltip } from '../TooltipCustom/Tooltip'
import { Link } from 'react-router-dom'

interface TokenExternalLinksProps {
  tokenName: string
  marketAddress: string
  marketPair?: string
  onInfoClick?: (e: React.SyntheticEvent) => void
}


interface SolExplorerLinkProps {
  mint: string
}


const resolveExplorerIcon = (link: string) => {
  if (link.includes('coinmarketcap')) {
    return Coinmarketcap
  }
  if (link.includes('coingecko')) {
    return CoinGecko
  }

  return Nomics
}

export const SolExplorerLink: React.FC<SolExplorerLinkProps> = (props) =>
  <Anchor
    href={`https://solscan.io/account/${props.mint}`}
    rel="noopener noreferrer"
    target="_blank"
  >
    <Icon
      alt="View on Solan explorer"
      src={SolanaExplorerIcon}
    />
  </Anchor>

export const TokenExternalLinks: React.FC<TokenExternalLinksProps> = (props) => {
  const { tokenName, marketAddress, marketPair, onInfoClick } = props
  const token = tokensLinksMap.get(tokenName.toUpperCase()) || { marketCapLink: '', twitterLink: '' }
  const { twitterLink = '', marketCapLink = '' } = token

  return (
    <Container>
      {onInfoClick &&
        <Anchor as="span" >
          <Icon
            src={Inform}
            onClick={onInfoClick}
          />
        </Anchor>
      }
      <SolExplorerLink mint={marketAddress || ''} />
      {/* {marketPair &&
        <DarkTooltip title={'Show analytics for this market.'}>
          <Anchor as={Link} to={`/analytics/${marketPair}`}>
            <AnalyticsIconComponent
              src={AnalyticsIcon}
            />
          </Anchor>
        </DarkTooltip>
      } */}

      {twitterLink && (
        <DarkTooltip title={'Twitter profile of the token.'}>
          <Anchor
            target="_blank"
            rel="noopener noreferrer"
            href={twitterLink}
          >
            <Icon
              src={BlueTwitterIcon}
            />
          </Anchor>
        </DarkTooltip>
      )}
      {marketCapLink && (
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href={marketCapLink}
        >
          <Icon
            src={resolveExplorerIcon(marketCapLink)}
          />
        </Anchor>
      )}
    </Container>
  )
}