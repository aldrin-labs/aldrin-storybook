import React, { useEffect, useState } from 'react'
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'
import CoinPlaceholder from '@icons/coinPlaceholder.svg'
import { SvgIcon } from '@sb/components'

import GreenCheckmark from '@icons/successIcon.svg'
import Warning from '@icons/warningPairSel.png'
import ThinkingFace from '@icons/thinkingFace.png'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { CCAI_MINT } from '@sb/dexUtils/utils'

export const TokenIcon = ({
  mint,
  height,
  width,
  margin,
  emojiIfNoLogo = false,
  isAwesomeMarket = false,
  isAdditionalCustomUserMarket = false,
}: {
  mint?: string | null
  height?: string
  width?: string
  margin?: string
  emojiIfNoLogo?: boolean
  isAwesomeMarket?: boolean
  isAdditionalCustomUserMarket?: boolean
}) => {
  const tokenMap = useTokenInfos()

  if (isAdditionalCustomUserMarket) {
    return <SvgIcon width={'50%'} height={'auto'} src={Warning} />
  }

  if (!mint) {
    return (
      <SvgIcon
        src={CoinPlaceholder}
        height={height}
        width={width}
        style={{ margin: margin }}
      />
    )
  }

  const token = tokenMap.get(mint)

  if (!token || !token.logoURI) {
    if (emojiIfNoLogo) {
      return isAwesomeMarket ? (
        <SvgIcon width={'50%'} height={'auto'} src={ThinkingFace} />
      ) : (
        <SvgIcon width={'50%'} height={'auto'} src={GreenCheckmark} />
      )
    }

    return (
      <SvgIcon
        src={CoinPlaceholder}
        height={height}
        width={width}
        style={{ margin: margin }}
      />
    )
  }

  return (
    <img
      src={token.logoURI}
      style={{ height, width, margin, borderRadius: mint === CCAI_MINT ? '0' : '50%' }}
    />
  )
}
