import React, { ReactElement } from 'react'

import {
  GridContainer,
  TablesWrapper,
  TableWrapper,
  ChartContainer,
  GridTableContainer,
} from './Template.styles'

import { ProfileSettingsGrid as FuturesTableGrid } from '@sb/compositions/Profile/compositions/ProfileSettings/ProfileSettings.styles'

const Template = ({
  Chart,
  PortfolioActions,
  PortfolioMainTable,
  PortfolioMainFuturesTable,
  isSPOTCurrently,
}: {
  Chart: ReactElement<any>
  PortfolioActions: ReactElement<any>
  PortfolioMainTable: ReactElement<any>
  PortfolioMainFuturesTable: ReactElement<any>
  isSPOTCurrently: boolean
}) => {
  return (
    <GridContainer container={true} spacing={16}>
      {isSPOTCurrently ? (
        <>
          <ChartContainer item={true} xs={2} md={2}>
            {Chart}
          </ChartContainer>

          <TablesWrapper spacing={16} container={true} item={true} xs={10}>
            <GridTableContainer item={true} xs={12} md={12}>
              <TableWrapper className="PortfolioMainTable">
                {/* refactor to pass this via Apollo  */}
                {PortfolioMainTable}
              </TableWrapper>
            </GridTableContainer>
          </TablesWrapper>
        </>
      ) : (
        <FuturesTableGrid title={'History'}>
          {PortfolioMainFuturesTable}
        </FuturesTableGrid>
      )}
    </GridContainer>
  )
}

export default Template
