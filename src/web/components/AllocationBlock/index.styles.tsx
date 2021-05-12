import React from 'react'
import styled from 'styled-components'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'

const AllocationChartContainer = styled(({ ...props }) => <Row {...props} />)`
  width: 40%;
  height: 100%;
`

const AllocationLegendContainer = styled(({ ...props }) => <Row {...props} />)`
  width: 60%;
  height: 100%;
  padding: 2rem;
`

export { AllocationChartContainer, AllocationLegendContainer }
