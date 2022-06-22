import tokens from 'aldrin-registry/src/tokens.json'
import React from 'react'
import useSWR from 'swr'

import BlueTwitterIcon from '@icons/blueTwitter.svg'
import CoinGecko from '@icons/coingecko.svg'
import Coinmarketcap from '@icons/coinmarketcap.svg'
import Inform from '@icons/inform.svg'
import Nomics from '@icons/nomics.svg'
import SolanaExplorerIcon from '@icons/SolanaExplorerIcon.svg'

import SvgIcon from '../SvgIcon'
import { DarkTooltip } from '../TooltipCustom/Tooltip'
import SolanaFm from './assets/solanafm.png'
import SolanaFmDark from './assets/solanafmdark.png'
import Solscan from './assets/solscan.png'
import {
  Container,
  Anchor,
  Wrap,
  Icon,
  IconsInner,
  IconsContainer,
} from './styles'

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

export const SolExplorerLink: React.FC<SolExplorerLinkProps> = (props) => {
  const { data: theme } = useSWR('theme')
  return (
    <IconsContainer>
      <Icon alt="View on Solana explorer" src={SolanaExplorerIcon} />
      <IconsInner>
        <Wrap>
          <Anchor
            href={`https://solscan.io/account/${props.mint}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <SvgIcon src={Solscan} alt="solscan" />
          </Anchor>
          <Anchor
            href={`https://solana.fm/account/${props.mint}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <SvgIcon
              src={theme === 'dark' ? SolanaFm : SolanaFmDark}
              alt="solana.fm"
            />
          </Anchor>
        </Wrap>
      </IconsInner>
    </IconsContainer>
  )
}

export const TokenExternalLinks: React.FC<TokenExternalLinksProps> = (
  props
) => {
  const { tokenName, marketAddress, onInfoClick } = props

  const tokensMap = new Map<string, any>()
  tokens.forEach((el) => tokensMap.set(el.symbol.toUpperCase(), el))

  const token = tokensMap.get(tokenName.toUpperCase()) || {
    twitterLink: '',
    marketCapLink: '',
  }

  return (
    <Container>
      {onInfoClick && (
        <Anchor as="span">
          <Icon src={Inform} onClick={onInfoClick} />
        </Anchor>
      )}
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

      {token.twitterLink && (
        <DarkTooltip title="Twitter profile of the token.">
          <Anchor
            target="_blank"
            rel="noopener noreferrer"
            href={token.twitterLink}
          >
            <Icon src={BlueTwitterIcon} />
          </Anchor>
        </DarkTooltip>
      )}
      {token.marketCapLink && (
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href={token.marketCapLink}
        >
          <Icon src={resolveExplorerIcon(token.marketCapLink)} />
        </Anchor>
      )}
    </Container>
  )
}
