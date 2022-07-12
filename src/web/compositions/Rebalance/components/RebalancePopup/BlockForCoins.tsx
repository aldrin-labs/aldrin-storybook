import React from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import Arrow from '@icons/smallBlueArrow.svg'

import { BlockForIcons } from './styles'

export const BlockForCoins = ({
  symbol,
  side,
}: {
  symbol: string
  side: 'buy' | 'sell'
}) => {
  const needReverseSymbols = side === 'buy'

  const splittedSymbols = symbol.split('_')
  if (needReverseSymbols) splittedSymbols.reverse()

  const [base, quote] = splittedSymbols

  return (
    <BlockForIcons>
      <TokenIcon
        mint={getTokenMintAddressByName(base)}
        size={32}
        margin="0 .5rem 0 0"
      />
      <Text
        fontSize="1.6rem"
        fontFamily="Avenir Next Medium"
        style={{ margin: '0 .5rem 0 0' }}
      >
        {base}
      </Text>
      <SvgIcon src={Arrow} />
      <TokenIcon
        mint={getTokenMintAddressByName(quote)}
        size={32}
        margin="0 .5rem 0 .5rem"
      />
      <Text
        fontSize="1.6rem"
        fontFamily="Avenir Next Medium"
        style={{ margin: '0' }}
      >
        {quote}
      </Text>
    </BlockForIcons>
  )
}
