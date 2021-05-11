import React from 'react'
import styled from 'styled-components'
import { RowContainer, Row } from '../AnalyticsRoute/index.styles'

const Box = styled(Row)`
  box-shadow: 0px 0px 16px 0px #00000073;
  background: #222429;
  border-radius: 1.5rem;
  height: ${(props) => props.height || 'auto'};
`

export const PoolsComponent = ({}) => {
  return (
    <RowContainer direction={'column'} padding={'5rem 15rem'}>
      <RowContainer justify={'space-between'}>
        <Box width={'calc(50% - 1rem)'} height={'30rem'}>
          f
        </Box>
        <Box width={'calc(50% - 1rem)'} height={'30rem'}>
          f
        </Box>
      </RowContainer>
      <RowContainer>
        <Box width={'100%'} height={'45rem'} style={{ marginTop: '2rem' }}>
          f
        </Box>
      </RowContainer>
    </RowContainer>
  )
}
