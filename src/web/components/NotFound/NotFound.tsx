import Typography from '@material-ui/core/Typography'
import React from 'react'
import styled from 'styled-components'

const NotFoundText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 800px;
`

export const NotFound = () => (
  <div>
    <NotFoundText>
      <Typography variant="h2">🚧 Under construction 🚧</Typography>
    </NotFoundText>
  </div>
)
