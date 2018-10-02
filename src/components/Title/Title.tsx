import Typography from '@material-ui/core/Typography'
import React from 'react'
import styled from 'styled-components'

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

export const Title = ({ children }: any) => (
  <STitleContainer>
    <STypography align="center" gutterBottom>
      {children}
    </STypography>
  </STitleContainer>
)
