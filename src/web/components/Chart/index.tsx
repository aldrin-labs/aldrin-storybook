import React from 'react'
import styled from 'styled-components'
import { Card } from '@material-ui/core'

import { CHARTS_API_URL } from '@core/utils/config'

const Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 0;
  padding-bottom: 0.4rem;
`

export const SingleChart = ({
  additionalUrl,
  name,
}: {
  additionalUrl: string
}) => (
  <Wrapper>
    <iframe
      allowfullscreen="" // needed for fullscreen of chart to work
      style={{ borderWidth: 0 }}
      src={`https://${CHARTS_API_URL}${additionalUrl}`}
      height={'100%'}
      id={name}
    />
  </Wrapper>
)

export default SingleChart
