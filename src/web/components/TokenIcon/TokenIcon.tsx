import React from 'react'

import { SvgIcon } from '@sb/components'
import { TokenIconContainer } from '@sb/components/TokenIcon/TokenIcon.styles'
import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'

import AlmLogo from '@icons/alm_logo.png'
import CoinPlaceholder from '@icons/coinPlaceholder.svg'
import FriesLogo from '@icons/fries_logo.png'
import GMCoinLogo from '@icons/gmcoinIcon.jpg'
import OTRLogo from '@icons/otrIcon.jpg'
import PTRLogo from '@icons/ptr_logo.png'
import SfcnLogo from '@icons/sfcn_logo.png'
import SobLogo from '@icons/sob_logo.png'
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
  size = 24,
  margin,
  isAwesomeMarket = false,
  isAdditionalCustomUserMarket = false,
  className,
}: {
  mint?: string | null
  size?: number
  margin?: string
  isAwesomeMarket?: boolean
  isAdditionalCustomUserMarket?: boolean
  className?: string
}) => {
  let IconComponent = (
    <SvgIcon width="100%" height="100%" src={CoinPlaceholder} />
  )

  if (isAdditionalCustomUserMarket) {
    IconComponent = <SvgIcon src={Warning} width="100%" height="100%" />
  }

  if (!mint) {
    IconComponent = <SvgIcon src={CoinPlaceholder} />
  } else if (
    Object.keys(CUSTOM_TOKEN_IMAGES).includes(ALL_TOKENS_MINTS_MAP[mint])
  ) {
    IconComponent = (
      <img
        src={CUSTOM_TOKEN_IMAGES[mint]}
        alt={ALL_TOKENS_MINTS_MAP[mint]}
        width="100%"
        height="100%"
        style={{ borderRadius: 100 }}
      />
    )
  }

  const spriteToken = spriteJson.icons.find((item) => item.address === mint)

  if (spriteToken) {
    IconComponent = (
      <div
        style={{
          ...spriteToken.styles,
          backgroundImage: `url(${spriteImage})`,
          zoom: `calc(${size}/64)`,
          borderRadius: 100,
        }}
      />
    )
  } else if (isAwesomeMarket) {
    IconComponent = <SvgIcon src={ThinkingFace} width="100%" height="100%" />
  }

  return (
    <TokenIconContainer $size={size} $margin={margin} className={className}>
      {IconComponent}
    </TokenIconContainer>
  )
}
