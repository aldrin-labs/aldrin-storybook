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

import { getPortfolioAssetsData } from '@core/utils/Overview.utils'
import { getPortfolioMainQuery } from '@core/graphql/queries/portfolio/main/serverPortfolioQueries/getPortfolioMainQuery'
import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
import QueryRenderer from '@core/components/QueryRenderer'
import { addMainSymbol } from '@sb/components/index'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
/*
 * 	params:
 *		c (integer): count numbers of digits after sign
 *		d (string): decimals sign separator
 *		t (string): miles sign separator
 *
 *	example:
 *		(123456789.12345).formatMoney(2, ',', '.');
 *			=> "123.456.789,12" Latinoamerican moneyFormat
 */

const formatMoney = function(number, c: number, d: string, t: string) {
  var n = number,
    c = isNaN((c = Math.abs(c))) ? 2 : c,
    d = d == undefined ? ',' : d,
    t = t == undefined ? '.' : t,
    s = n < 0 ? '-' : '',
    i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + '',
    j = (j = i.length) > 3 ? j % 3 : 0
  return (
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  )
}

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
      <Grid style={{ width: '100%' }}>
        <ExpansionPanel
          TransitionProps={{ timeout: { enter: 375, exit: 250 } }}
        >
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

const APIWrapper = (props: any) => (
  <Query query={GET_BASE_COIN}>
    {({ data }) => {
      const baseCoin = (data.portfolio && data.portfolio.baseCoin) || 'USDT'
      return (
        <QueryRenderer
          {...props}
          component={DetailedExpansionPanel}
          name={`portfolioAssetsQuery`}
          query={getPortfolioMainQuery}
          variables={{ baseCoin }}
          baseCoin={baseCoin}
          isUSDCurrently={baseCoin === 'USDT'}
          withOutSpinner={true}
          withTableLoader={true}
        />
      )
    }}
  </Query>
)

export default APIWrapper
