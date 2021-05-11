import React from 'react'
import styled from 'styled-components'
import { RowContainer, Row } from '../AnalyticsRoute/index.styles'
import { Text } from '../Addressbook/index'
import { compose } from 'recompose'
import { WithTheme } from '@material-ui/core/styles'

const Box = styled(Row)`
  box-shadow: 0px 0px 16px 0px #00000073;
  background: #222429;
  border-radius: 1.5rem;
  height: ${(props) => props.height || 'auto'};
`
const LiquidityDataContainer = styled(Row)`
  width: 50%;
  border-right: 0.1rem solid #383b45;
  height: 6rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 2rem;
  justify-content: space-around;
`

export const PoolsComponent = ({}) => {
  return (
    <RowContainer direction={'column'} padding={'5rem 15rem'}>
      <RowContainer justify={'space-between'}>
        <Box width={'calc(50% - 1rem)'} height={'30rem'}></Box>
        <Box width={'calc(50% - 1rem)'} height={'30rem'}>
          f
        </Box>
      </RowContainer>
      <RowContainer>
        <Box
          width={'100%'}
          height={'45rem'}
          padding="3rem"
          style={{ marginTop: '2rem' }}
          align={'start'}
        >
          <RowContainer justify={'space-between'} alignItems="flex-start">
            <Text>Your Liquidity</Text>
            <Row width={'33%%'}>
              <LiquidityDataContainer>
                <Text
                  color={theme.customPalette.grey.text}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Liquidity (Including Fees)
                </Text>
                <Text>$32,874</Text>
              </LiquidityDataContainer>
              <LiquidityDataContainer style={{ paddingLeft: '3rem' }}>
                <Text
                  color={theme.customPalette.grey.text}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Fees Earned (Cumulative)
                </Text>
                <Text>$32,874</Text>
              </LiquidityDataContainer>
            </Row>
          </RowContainer>
        </Box>
      </RowContainer>
    </RowContainer>
  )
}

export default compose(withTheme())(PoolsComponent)
