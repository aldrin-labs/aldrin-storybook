import React from 'react'
import styled from 'styled-components'
import { Card } from '@material-ui/core'

import { CHARTS_API_URL } from '@core/utils/config'

const Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export const SingleChart = ({ additionalUrl }: { additionalUrl: string }) =>(
  <Wrapper>
    <iframe
      allow-scripts
      style={{ borderWidth: 0 }}
      src={`http://localhost:8080${additionalUrl}`}
      height={'100%'}
      name="target"
    />
  </Wrapper>
)

export default SingleChart
