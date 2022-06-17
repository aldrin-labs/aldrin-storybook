import React from 'react'

import { SvgIcon } from '@sb/components'
import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { RIN_MINT } from '@sb/dexUtils/utils'

import AlmLogo from '@icons/alm_logo.png'
import CobanLogo from '@icons/coban_logo.svg'
import CoinPlaceholder from '@icons/coinPlaceholder.svg'
import FriesLogo from '@icons/fries_logo.png'
import GMCoinLogo from '@icons/gmcoinIcon.jpg'
import MangoLogo from '@icons/mango_logo.png'
import Warning from '@icons/warningPairSel.png'
import ThinkingFace from '@icons/thinkingFace.png'
import SunnyLogo from '@icons/sunny_logo.jpg'
import OTRLogo from '@icons/otrIcon.jpg'
import PTRLogo from '@icons/ptr_logo.png'
import RinLogo from '@icons/rin_logo.png'
import SYPLogo from '@icons/syp_logo.png'
import SfcnLogo from '@icons/sfcn_logo.png'
import SobLogo from '@icons/sob_logo.png'
import GreenCheckmark from '@icons/successIcon.svg'

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
  const tokenMap = useTokenInfos()

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

  let token = tokenMap.get(mint)

  // mango has no logo for now
  if (ALL_TOKENS_MINTS_MAP[mint] === 'MNGO') {
    token = {
      logoURI: MangoLogo,
    }
  }

  // rin has no logo for now
  if (ALL_TOKENS_MINTS_MAP[mint] === 'RIN') {
    token = {
      logoURI: RinLogo,
    }
  }

  // sunny has no logo for now
  if (ALL_TOKENS_MINTS_MAP[mint] === 'SUNNY') {
    token = {
      logoURI: SunnyLogo,
    }
  }

  if (ALL_TOKENS_MINTS_MAP[mint] === 'PRT') {
    token = {
      logoURI: PTRLogo,
    }
  }

  if (ALL_TOKENS_MINTS_MAP[mint] === 'SYP') {
    token = {
      logoURI: SYPLogo,
    }
  }

  if (ALL_TOKENS_MINTS_MAP[mint] === 'COBAN') {
    token = {
      logoURI: CobanLogo,
    }
  }

  if (ALL_TOKENS_MINTS_MAP[mint] === 'SFCN') {
    token = {
      logoURI: SfcnLogo,
    }
  }

  if (ALL_TOKENS_MINTS_MAP[mint] === 'ALM') {
    token = {
      logoURI: AlmLogo,
    }
  }

  if (ALL_TOKENS_MINTS_MAP[mint] === 'FRIES') {
    token = {
      logoURI: FriesLogo,
    }
  }

  if (ALL_TOKENS_MINTS_MAP[mint] === 'SOB') {
    token = {
      logoURI: SobLogo,
    }
  }

  if (ALL_TOKENS_MINTS_MAP[mint] === 'GMCOIN') {
    token = {
      logoURI: GMCoinLogo,
    }
  }

  if (ALL_TOKENS_MINTS_MAP[mint] === 'OTR') {
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
