import React from 'react'
import { RowContainer } from '../AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { Text } from '@sb/compositions/Addressbook/index'
import Cross from '@icons/Cross.svg'

export const NotEligibleWalletBlock = ({ theme }: { theme: any }) => {
  return (
    <RowContainer direction="column">
      <SvgIcon
        width={'6rem'}
        height={'6rem'}
        src={Cross}
        style={{ marginBottom: '3rem' }}
      />
      <Text color={'#f2fbfb'} fontFamily={'Avenir Next Medium'}>
        Sorry, this wallet is not eligible to claim CCAI token.
      </Text>
    </RowContainer>
  )
}
