import React from 'react'
import { notify } from '@sb/dexUtils/notifications'
import copy from 'clipboard-copy'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { Line } from '@sb/compositions/Pools/components/Popups/index.styles'
import { TextArea } from './SelectWrapperStyles'
import SvgIcon from '@sb/components/SvgIcon'

import CopyIcon from '@icons/copyIcon.svg'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { SolExplorerLink } from '@sb/components/TokenExternalLinks'

export const MarketAddressWithLabel = ({ marketAddress }) => {
  return (
    <RowContainer margin={'1rem 0'}>
      <RowContainer wrap="nowrap">
        <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
          Market ID
        </Text>
        <Line />
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <TextArea>{marketAddress}</TextArea>
        <Row width={'12%'} justify={'space-between'}>
          <SolExplorerLink mint={marketAddress} />
          <SvgIcon
            style={{ cursor: 'pointer' }}
            src={CopyIcon}
            width={'2.5rem'}
            height={'2.5rem'}
            onClick={() => {
              copy(marketAddress)
              notify({ type: 'success', message: 'Copied!' })
            }}
          />
        </Row>
      </RowContainer>
    </RowContainer>
  )
}

export const CoinAddressWithLabel = ({ symbol }) => {
  return (
    <RowContainer margin={'1rem 0'}>
      <RowContainer wrap="nowrap">
        <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
          {symbol} Mint
        </Text>
        <Line />
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <TextArea>{getTokenMintAddressByName(symbol)}</TextArea>
        <Row width={'12%'} justify={'space-between'}>
          <SolExplorerLink mint={getTokenMintAddressByName(symbol)} />
          <SvgIcon
            style={{ cursor: 'pointer' }}
            src={CopyIcon}
            width={'2.5rem'}
            height={'2.5rem'}
            onClick={() => {
              copy(getTokenMintAddressByName(symbol))
              notify({ type: 'success', message: 'Copied!' })
            }}
          />
        </Row>
      </RowContainer>
    </RowContainer>
  )
}
