import React from 'react'
import { withRouter } from 'react-router-dom'
import PortfolioMainAllocationContainer from '@core/containers/PortfolioMainAllocation/index'

const PortfolioMainAllocation = (props) => {
  return <PortfolioMainAllocationContainer {...props} />
}

export default withRouter(PortfolioMainAllocation)
