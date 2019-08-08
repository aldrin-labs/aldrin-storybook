import React from 'react'
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

import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_PORTFOLIO_KEY_ASSETS } from '@core/graphql/queries/portfolio/main/getPortfolioKeysAssets'

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
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  )
}

const format = (number) => {
  return formatMoney(number, 2, '.', ',')
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
    const { classes, theme, getPortfolioKeyAssetsQuery } = this.props

    const totalKeyAssetsData = getPortfolioKeyAssetsQuery.portfolioKeys.keys.reduce(
      (acc, el) => {
        acc.portfolioKeyAssetsValue += el.portfolioKeyAssetsValue
        acc.portfolioKeyAssetsCount += el.portfolioKeyAssetsCount
        acc.realizedPnl += el.realizedPnl
        acc.unrealizedPnl += el.unrealizedPnl
        acc.totalPnl += el.totalPnl

        return acc
      },
      {
        portfolioKeyAssetsValue: 0,
        portfolioKeyAssetsCount: 0,
        realizedPnl: 0,
        unrealizedPnl: 0,
        totalPnl: 0,
      }
    )

    return (
      <Grid style={{ width: '100%' }}>
        <ExpansionPanel>
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
                  ${format(totalKeyAssetsData.portfolioKeyAssetsValue)}
                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn gridBorder={gridBorder}>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  assets
                </TypographyTitleCell>
                <TypographyValueCell textColor={theme.palette.text.subPrimary}>
                  {totalKeyAssetsData.portfolioKeyAssetsCount}
                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn gridBorder={gridBorder}>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  realized P{`&`}L
                </TypographyTitleCell>
                <TypographyValueCell textColor={'#2F7619'}>
                  ${format(totalKeyAssetsData.realizedPnl)}
                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn gridBorder={gridBorder}>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  Unrealized P{`&`}L
                </TypographyTitleCell>
                <TypographyValueCell textColor={'#B93B2B'}>
                  ${format(totalKeyAssetsData.unrealizedPnl)}
                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  Total P{`&`}L
                </TypographyTitleCell>
                <TypographyValueCell textColor={'#B93B2B'}>
                  ${format(totalKeyAssetsData.totalPnl)}
                </TypographyValueCell>
              </div>
            </GridColumn>
          </ExpansionPanelSummaryCustom>

          <ExpansionPanelDetailsCustom>
            <Grid container justify="center">
              {getPortfolioKeyAssetsQuery.portfolioKeys.keys.map((el, i) => {
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
                            ${format(el.portfolioKeyAssetsValue)}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn gridBorder={i % 2 !== 0 ? gridBorder : ''}>
                        <div>
                          <TypographyTitleCell>assets</TypographyTitleCell>
                          <TypographyValueCell
                            textColor={theme.palette.text.subPrimary}
                          >
                            {el.portfolioKeyAssetsCount}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn gridBorder={i % 2 !== 0 ? gridBorder : ''}>
                        <div>
                          <TypographyTitleCell>
                            realized P{`&`}L
                          </TypographyTitleCell>
                          <TypographyValueCell textColor={'#2F7619'}>
                            ${format(el.realizedPnl)}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn gridBorder={i % 2 !== 0 ? gridBorder : ''}>
                        <div>
                          <TypographyTitleCell>
                            Unrealized P{`&`}L
                          </TypographyTitleCell>
                          <TypographyValueCell textColor={'#B93B2B'}>
                            ${format(el.unrealizedPnl)}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn>
                        <div>
                          <TypographyTitleCell>
                            Total P{`&`}L
                          </TypographyTitleCell>
                          <TypographyValueCell textColor={'#B93B2B'}>
                            ${format(el.totalPnl)}
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

export default compose(
  queryRendererHoc({
    query: GET_PORTFOLIO_KEY_ASSETS,
    name: 'getPortfolioKeyAssetsQuery',
  })
)(DetailedExpansionPanel)
