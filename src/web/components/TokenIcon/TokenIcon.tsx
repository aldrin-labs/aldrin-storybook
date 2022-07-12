import { keyBy } from 'lodash-es'
import React from 'react'

import { SvgIcon } from '@sb/components'
import { TokenIconContainer } from '@sb/components/TokenIcon/TokenIcon.styles'

import CoinPlaceholder from '@icons/coinPlaceholder.svg'
import ThinkingFace from '@icons/thinkingFace.png'
import Warning from '@icons/warningPairSel.png'

import spriteJson from './sprite/token-icons.json'
import spriteImage from './sprite/token-icons.webp'

const TOKEN_MAP = keyBy(spriteJson.icons, 'address')

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
  }

  const spriteToken = TOKEN_MAP[mint]

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
