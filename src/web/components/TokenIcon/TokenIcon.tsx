import React from 'react'

import SvgIcon from '@sb/components/SvgIcon'

import { RIN_MINT, useTokenInfos } from '@core/solana'
import { TOKENS_BY_MINT } from '@core/utils/awesomeMarkets/serum'

import AlmLogo from '@icons/alm_logo.png'
import CobanLogo from '@icons/coban_logo.svg'
import CoinPlaceholder from '@icons/coinPlaceholder.svg'
import FriesLogo from '@icons/fries_logo.png'
import GMCoinLogo from '@icons/gmcoinIcon.jpg'
import MangoLogo from '@icons/mango_logo.png'
import OTRLogo from '@icons/otrIcon.jpg'
import PTRLogo from '@icons/ptr_logo.png'
import RinLogo from '@icons/rin_logo.png'
import SfcnLogo from '@icons/sfcn_logo.png'
import SobLogo from '@icons/sob_logo.png'
import GreenCheckmark from '@icons/successIcon.svg'
import SunnyLogo from '@icons/sunny_logo.jpg'
import SYPLogo from '@icons/syp_logo.png'
import ThinkingFace from '@icons/thinkingFace.png'
import Warning from '@icons/warningPairSel.png'

export const TokenIcon = ({
  mint,
  height,
  width,
  margin,
  emojiIfNoLogo = false,
  isAwesomeMarket = false,
  isAdditionalCustomUserMarket = false,
  className,
}: {
  mint?: string | null
  height?: string
  width?: string
  margin?: string
  emojiIfNoLogo?: boolean
  isAwesomeMarket?: boolean
  isAdditionalCustomUserMarket?: boolean
  className?: string
}) => {
  const { data: tokenMap } = useTokenInfos()

  if (isAdditionalCustomUserMarket) {
    return (
      <SvgIcon className={className} width="50%" height="auto" src={Warning} />
    )
  }

  if (!mint) {
    return (
      <SvgIcon
        src={CoinPlaceholder}
        height={height}
        width={width}
        style={{ margin }}
        className={className}
      />
    )
  }

  let token: { logoURI?: string } | undefined = tokenMap?.get(mint)

  // mango has no logo for now
  if (TOKENS_BY_MINT.get(mint)?.name === 'MNGO') {
    token = {
      logoURI: MangoLogo,
    }
  }

  // rin has no logo for now
  if (TOKENS_BY_MINT.get(mint)?.name === 'RIN') {
    token = {
      logoURI: RinLogo,
    }
  }

  // sunny has no logo for now
  if (TOKENS_BY_MINT.get(mint)?.name === 'SUNNY') {
    token = {
      logoURI: SunnyLogo,
    }
  }

  if (TOKENS_BY_MINT.get(mint)?.name === 'PRT') {
    token = {
      logoURI: PTRLogo,
    }
  }

  if (TOKENS_BY_MINT.get(mint)?.name === 'SYP') {
    token = {
      logoURI: SYPLogo,
    }
  }

  if (TOKENS_BY_MINT.get(mint)?.name === 'COBAN') {
    token = {
      logoURI: CobanLogo,
    }
  }

  if (TOKENS_BY_MINT.get(mint)?.name === 'SFCN') {
    token = {
      logoURI: SfcnLogo,
    }
  }

  if (TOKENS_BY_MINT.get(mint)?.name === 'ALM') {
    token = {
      logoURI: AlmLogo,
    }
  }

  if (TOKENS_BY_MINT.get(mint)?.name === 'FRIES') {
    token = {
      logoURI: FriesLogo,
    }
  }

  if (TOKENS_BY_MINT.get(mint)?.name === 'SOB') {
    token = {
      logoURI: SobLogo,
    }
  }

  if (TOKENS_BY_MINT.get(mint)?.name === 'GMCOIN') {
    token = {
      logoURI: GMCoinLogo,
    }
  }

  if (TOKENS_BY_MINT.get(mint)?.name === 'OTR') {
    token = {
      logoURI: OTRLogo,
    }
  }

  if (!token || !token.logoURI) {
    if (emojiIfNoLogo) {
      return isAwesomeMarket ? (
        <SvgIcon
          className={className}
          width="50%"
          height="auto"
          src={ThinkingFace}
        />
      ) : (
        <SvgIcon
          className={className}
          width="50%"
          height="auto"
          src={GreenCheckmark}
        />
      )
    }

    return (
      <SvgIcon
        src={CoinPlaceholder}
        height={height}
        width={width}
        style={{ margin }}
        className={className}
      />
    )
  }

  return (
    <img
      src={token.logoURI}
      alt={mint}
      style={{
        height,
        width,
        margin,
        borderRadius: mint === RIN_MINT ? '0' : '50%',
      }}
      className={className}
    />
  )
}
