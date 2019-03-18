import React from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'

const STitleContainer = styled.div`
  align-items: center;
  align-self: center;
  display: flex;
  justify-content: center;
  margin: 80px auto;
`
// TODO: fix
const STypography = styled(Typography)`
  font-size: 30px !important;
`

export const TraidingTerminal = ({ children }: any) => (
  <STitleContainer>
    <STypography align="center" gutterBottom>
      {children}
    </STypography>
  </STitleContainer>
)

export default TraidingTerminal
