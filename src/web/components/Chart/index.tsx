import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export const SingleChart = ({ additionalUrl, chartsApiUrl }: { additionalUrl: string, chartsApiUrl: string }) => (
  <Wrapper>
    <iframe src={`https://${chartsApiUrl}${additionalUrl}`} height={'100%'} />
  </Wrapper>
)

export default SingleChart
