import React, { ReactElement } from 'react'

import {
  GridContainer,
  TablesWrapper,
  TableWrapper,
  ChartContainer,
  GridTableContainer,
} from './Template.styles'

const Template = ({
  Chart,
  PortfolioActions,
  PortfolioMainTable,
}: {
  Chart: ReactElement<any>
  PortfolioActions: ReactElement<any>
  PortfolioMainTable: ReactElement<any>
}) => {
  return (
    <GridContainer container={true} spacing={16}>
      <TablesWrapper spacing={16} container={true} item={true} xs={12}>
        <GridTableContainer item={true} xs={12} md={8}>
          <TableWrapper className="PortfolioMainTable">
            {/* refactor to pass this via Apollo  */}
            {PortfolioMainTable}
          </TableWrapper>
        </GridTableContainer>
      </TablesWrapper>
    </GridContainer>
  )
}

export default Template
