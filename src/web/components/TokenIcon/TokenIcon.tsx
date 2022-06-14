import React from 'react'

import { SvgIcon } from '@sb/components'
import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import AlmLogo from '@icons/alm_logo.png'
import CobanLogo from '@icons/coban_logo.svg'
import CoinPlaceholder from '@icons/coinPlaceholder.svg'
import FriesLogo from '@icons/fries_logo.png'
import GMCoinLogo from '@icons/gmcoinIcon.jpg'
import OTRLogo from '@icons/otrIcon.jpg'
import PTRLogo from '@icons/ptr_logo.png'
import SfcnLogo from '@icons/sfcn_logo.png'
import SobLogo from '@icons/sob_logo.png'
import GreenCheckmark from '@icons/successIcon.svg'
import SunnyLogo from '@icons/sunny_logo.jpg'
import SYPLogo from '@icons/syp_logo.png'
import ThinkingFace from '@icons/thinkingFace.png'
import Warning from '@icons/warningPairSel.png'

import spriteJson from './sprite/token-icons.json'
import spriteImage from './sprite/token-icons.webp'

const CUSTOM_TOKEN_IMAGES = {
  SUNNY: SunnyLogo,
  PRT: PTRLogo,
  SYP: SYPLogo,
  SFCN: SfcnLogo,
  ALM: AlmLogo,
  FRIES: FriesLogo,
  SOB: SobLogo,
  GMCOIN: GMCoinLogo,
  OTR: OTRLogo,
}

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
  // console.log('debug tokenMap', tokenMap)

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

  if (Object.keys(CUSTOM_TOKEN_IMAGES).includes(ALL_TOKENS_MINTS_MAP[mint])) {
    return (
      <div style={{ width, height, margin }} className={className}>
        <img src={CUSTOM_TOKEN_IMAGES[mint]} />
      </div>
    )
  }

  const spriteToken = spriteJson.icons.find((item) => item.address === mint)

  if (!spriteToken) {
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
    <div style={{ width, height, margin }} className={className}>
      <div
        style={{
          ...spriteToken.styles,
          backgroundImage: `url(${spriteImage})`,
          zoom: `calc(24/64)`,
          borderRadius: 100,
        }}
      />
    </div>
  )
}
