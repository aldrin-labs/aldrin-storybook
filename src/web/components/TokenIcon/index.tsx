import React, { useEffect, useState } from 'react'
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'
import CoinPlaceholder from '@icons/coinPlaceholder.svg'
import { SvgIcon } from '@sb/components'

import GreenCheckmark from '@icons/successIcon.svg'
import Warning from '@icons/warningPairSel.png'
import ThinkingFace from '@icons/thinkingFace.png'
import MangoLogo from '@icons/mango_logo.png'
import RinLogo from '@icons/rin_logo.png'
import SunnyLogo from '@icons/sunny_logo.jpg'
import PTRLogo from '@icons/ptr_logo.png'
import SYPLogo from '@icons/syp_logo.png'
import CobanLogo from '@icons/coban_logo.png'
import SfcnLogo from '@icons/sfcn_logo.png'
import FriesLogo from '@icons/fries_logo.png'
import AlmLogo from '@icons/alm_logo.png'
import SobLogo from '@icons/sob_logo.png'

import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { CCAI_MINT } from '@sb/dexUtils/utils'
import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'

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
      style={{
        height,
        width,
        margin,
        borderRadius: mint === CCAI_MINT ? '0' : '50%',
      }}
    />
  )
}
