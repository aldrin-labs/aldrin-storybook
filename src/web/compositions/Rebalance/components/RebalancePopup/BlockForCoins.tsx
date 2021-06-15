import React from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import Arrow from '@icons/smallBlueArrow.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { TokenIcon } from '@sb/components/TokenIcon'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { BlockForIcons } from './styles'

export const BlockForCoins = ({ symbol, side }: { symbol: string, side: 'buy' | 'sell' }) => {
    const [base, quote] = symbol.split('_')
    const isFlipArrowToRight = side === 'buy' 
  
    return (
      <BlockForIcons>
        <TokenIcon
          mint={getTokenMintAddressByName(base)}
          width={'2.5rem'}
          height={'2.5rem'}
          margin={'0 1rem 0 0'}
        />
        <Text
          fontSize={'1.6rem'}
          fontFamily={'Avenir Next Medium'}
          style={{ margin: '0 1rem 0 0' }}
        >
          {base}
        </Text>
        <SvgIcon style={isFlipArrowToRight ? {transform: "scaleX(-1)"} : {}} src={Arrow} />
        <TokenIcon
          mint={getTokenMintAddressByName(quote)}
          width={'2.5rem'}
          height={'2.5rem'}
          margin={'0 1rem 0 1rem'}
        />
        <Text
          fontSize={'1.6rem'}
          fontFamily={'Avenir Next Medium'}
          style={{ margin: '0' }}
        >
          {quote}
        </Text>
      </BlockForIcons>
    )
  }