import React from 'react'
import { Query } from 'react-apollo'
import { withTheme } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { Grid } from '@material-ui/core'
import {
  TypographyHeading,
  TypographyTitleCell,
  TypographyValueCell,
  ExpansionPanelSummaryCustom,
  TypographySubHeading,
  GridColumn,
  GridRowWrapper,
  GridRow,
  ExpansionPanelDetailsCustom,
} from './AccordionOverView.style'

import { getPortfolioKeys } from '@core/graphql/queries/portfolio/getPortfolioKeys'
import { getPortfolioAssetsData } from '@core/utils/Overview.utils'
// import { getPortfolioMainQuery } from '@core/graphql/queries/portfolio/main/serverPortfolioQueries/getPortfolioMainQuery'
import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
import QueryRenderer from '@core/components/QueryRenderer'
import { addMainSymbol } from '@sb/components/index'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

const format = (number, baseCoin) => {
  const isUSDCurrently = baseCoin === 'USDT'

  return isUSDCurrently
    ? addMainSymbol(roundAndFormatNumber(number, 2, true), isUSDCurrently)
    : addMainSymbol(roundAndFormatNumber(number, 8, true), isUSDCurrently)
}

const gridBorder = `
&::after {
  position: absolute;
  top: 25%;
  left: 100%;
  display: block;
  content: '';
  height: 3.5rem;
  width: 1px;
  background-color: #e0e5ec;
}`

@withTheme()
class DetailedExpansionPanel extends React.Component {
  render() {
    const { theme, portfolioAssetsQuery, baseCoin } = this.props
    const { portfolioAssetsData, totalKeyAssetsData } = getPortfolioAssetsData(
      portfolioAssetsQuery.myPortfolios[0].portfolioAssets
    )

    return (
      <Grid style={{ width: '100%', minHeight: '11%', height: 'auto' }}>
        <ExpansionPanel CollapseProps={{ timeout: { enter: 425, exit: 350 } }}>
          <ExpansionPanelSummaryCustom expandIcon={<ExpandMoreIcon />}>
            <GridColumn style={{ justifyContent: 'flex-start' }}>
              <TypographyHeading textColor={theme.palette.text.primary}>
                overview
              </TypographyHeading>
            </GridColumn>
            <GridColumn gridBorder={gridBorder}>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  Value
                </TypographyTitleCell>
                <TypographyValueCell textColor={theme.palette.text.subPrimary}>
                  {format(totalKeyAssetsData.value, baseCoin)}
                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn gridBorder={gridBorder}>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  unique assets
                </TypographyTitleCell>
                <TypographyValueCell textColor={theme.palette.text.subPrimary}>
                  {totalKeyAssetsData.uniqueAssets.length}
                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn gridBorder={gridBorder}>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  realized P{`&`}L
                </TypographyTitleCell>
                <TypographyValueCell
                  textColor={
                    totalKeyAssetsData.realized < 0 ? '#B93B2B' : '#2F7619'
                  }
                >
                  {format(totalKeyAssetsData.realized, baseCoin)}
                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn gridBorder={gridBorder}>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  Unrealized P{`&`}L
                </TypographyTitleCell>
                <TypographyValueCell
                  textColor={
                    totalKeyAssetsData.unrealized < 0 ? '#B93B2B' : '#2F7619'
                  }
                >
                  {format(totalKeyAssetsData.unrealized, baseCoin)}
                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  Total P{`&`}L
                </TypographyTitleCell>
                <TypographyValueCell
                  textColor={
                    totalKeyAssetsData.total < 0 ? '#B93B2B' : '#2F7619'
                  }
                >
                  {format(totalKeyAssetsData.total, baseCoin)}
                </TypographyValueCell>
              </div>
            </GridColumn>
          </ExpansionPanelSummaryCustom>

          <ExpansionPanelDetailsCustom>
            <Grid container justify="center">
              {portfolioAssetsData.map((el, i) => {
                return (
                  <GridRowWrapper
                    item
                    hoverColor={theme.palette.hover[theme.palette.type]}
                  >
                    <GridRow>
                      <GridColumn>
                        <TypographySubHeading>{el.name}</TypographySubHeading>
                      </GridColumn>
                      <GridColumn
                        paddingCell={'0 1rem !important'}
                        gridBorder={i % 2 !== 0 ? gridBorder : ''}
                      >
                        <div>
                          <TypographyTitleCell>Value</TypographyTitleCell>
                          <TypographyValueCell
                            textColor={theme.palette.text.subPrimary}
                          >
                            {format(el.value, baseCoin)}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn gridBorder={i % 2 !== 0 ? gridBorder : ''}>
                        <div>
                          <TypographyTitleCell>assets</TypographyTitleCell>
                          <TypographyValueCell
                            textColor={theme.palette.text.subPrimary}
                          >
                            {el.assets}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn gridBorder={i % 2 !== 0 ? gridBorder : ''}>
                        <div>
                          <TypographyTitleCell>
                            realized P{`&`}L
                          </TypographyTitleCell>
                          <TypographyValueCell
                            textColor={el.realized < 0 ? '#B93B2B' : '#2F7619'}
                          >
                            {format(el.realized, baseCoin)}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn gridBorder={i % 2 !== 0 ? gridBorder : ''}>
                        <div>
                          <TypographyTitleCell>
                            Unrealized P{`&`}L
                          </TypographyTitleCell>
                          <TypographyValueCell
                            textColor={
                              el.unrealized < 0 ? '#B93B2B' : '#2F7619'
                            }
                          >
                            {format(el.unrealized, baseCoin)}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn>
                        <div>
                          <TypographyTitleCell>
                            Total P{`&`}L
                          </TypographyTitleCell>
                          <TypographyValueCell
                            textColor={el.total < 0 ? '#B93B2B' : '#2F7619'}
                          >
                            {format(el.total, baseCoin)}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                    </GridRow>
                  </GridRowWrapper>
                )
              })}
            </Grid>
          </ExpansionPanelDetailsCustom>
        </ExpansionPanel>
      </Grid>
    )
  }
}

const APIWrapper = (props: any) => {
  return (
    <Query query={GET_BASE_COIN}>
      {({ data }) => {
        const baseCoin = (data.portfolio && data.portfolio.baseCoin) || 'USDT'
        return (
          <QueryRenderer
            {...props}
            component={DetailedExpansionPanel}
            name={`portfolioAssetsQuery`}
            query={getPortfolioKeys}
            variables={{ baseCoin, innerSettings: true }}
            baseCoin={baseCoin}
            isUSDCurrently={baseCoin === 'USDT'}
            fetchPolicy={'cache-first'}
            withOutSpinner={false}
          />
        )
      }}
    </Query>
  )
}

export default APIWrapper
