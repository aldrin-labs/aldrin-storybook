import React from 'react'
import { withTheme } from '@sb/types/materialUI'
import { compose } from 'recompose'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { ReloadTimer } from '../Rebalance/components/ReloadTimer'

const SwapsPage = ({ theme }) => {
  return (
    <RowContainer height={'100%'}>
      <BlockTemplate
        theme={theme}
        width={'50rem'}
        height={'40rem'}
        style={{ padding: '2rem' }}
      >
        <RowContainer>
          <Text>
            Slippage Tolerance: <strong>0.1%</strong>
          </Text>
          <Row>
            <ReloadTimer callback={() => {}} />
          </Row>
        </RowContainer>{' '}
        <RowContainer></RowContainer>
        <RowContainer></RowContainer> <RowContainer></RowContainer>
        <RowContainer></RowContainer>
      </BlockTemplate>
    </RowContainer>
  )
}

export default compose(withTheme())(SwapsPage)
