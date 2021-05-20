import React from 'react'
import styled from 'styled-components'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

const AllocationChartContainer = styled(({ ...props }) => <Row {...props} />)`
  width: 40%;
  height: 100%;
`

const AllocationLegendContainer = styled(({ ...props }) => <Row {...props} />)`
  width: 60%;
  height: 100%;
  padding: 2rem;
`
export const ChartContainer = styled(RowContainer)`
  height: 30rem;
`

export { AllocationChartContainer, AllocationLegendContainer }
