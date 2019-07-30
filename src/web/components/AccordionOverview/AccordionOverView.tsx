import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import classNames from 'classnames'
// import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
// import Chip from '@material-ui/core/Chip'
// import Button from '@material-ui/core/Button'
// import Divider from '@material-ui/core/Divider'

import { Grid } from '@material-ui/core'
import {
  TypographyHeading,
  TypographyTitleCell,
  TypographyValueCell,
  ExpansionPanelSummaryCustom,
  TypographySubHeading,
  GridColumn,
  GridRow,
} from './AccordionOverView.style'

import { withTheme } from '@material-ui/styles'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_PORTFOLIO_KEY_ASSETS } from '@core/graphql/queries/portfolio/main/getPortfolioKeysAssets'

const dataOverview = [
  {
    exchange: 'Binance trade account',
    value: '100000',
    assets: '12',
    realized: '138000.50',
    unrealized: '138000.50',
    total: '138000.50',
  },
  {
    exchange: 'Bittrex trade account',
    value: '100000',
    assets: '12',
    realized: '138000.50',
    unrealized: '138000.50',
    total: '138000.50',
  },
  {
    exchange: 'Huobi trade account',
    value: '100000',
    assets: '12',
    realized: '138000.50',
    unrealized: '138000.50',
    total: '138000.50',
  },
  {
    exchange: 'Kraken trade account',
    value: '100000',
    assets: '12',
    realized: '138000.50',
    unrealized: '138000.50',
    total: '138000.50',
  },
]

@withTheme()

class DetailedExpansionPanel extends React.Component {
  render() {
    const { classes, theme, getPortfolioKeyAssetsQuery } = this.props

    console.log('this.props', this.props);
    console.log('getPortfolioKeyAssetsQuery', getPortfolioKeyAssetsQuery);

    const totalKeyAssetsData = getPortfolioKeyAssetsQuery.portfolioKeys.keys.reduce((acc, el) => {
      acc.portfolioKeyAssetsValue += el.portfolioKeyAssetsValue
      acc.portfolioKeyAssetsCount += el.portfolioKeyAssetsCount
      acc.realizedPnl += el.realizedPnl
      acc.unrealizedPnl += el.unrealizedPnl
      acc.totalPnl += el.totalPnl

      return acc
    }, {
      portfolioKeyAssetsValue: 0,
      portfolioKeyAssetsCount: 0,
      realizedPnl: 0,
      unrealizedPnl: 0,
      totalPnl: 0,
    })


    return (
      <Grid style={{ width: '100%' }}>
        <ExpansionPanel>
          <ExpansionPanelSummaryCustom expandIcon={<ExpandMoreIcon />}>
            <GridColumn>
              <TypographyHeading textColor={theme.palette.text.primary}>
                overview
              </TypographyHeading>
            </GridColumn>
            <GridColumn>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  Value
                </TypographyTitleCell>
                <TypographyValueCell textColor={theme.palette.text.subPrimary}>
                  {totalKeyAssetsData.portfolioKeyAssetsValue}
                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  assets
                </TypographyTitleCell>
                <TypographyValueCell textColor={theme.palette.text.subPrimary}>
                  {totalKeyAssetsData.portfolioKeyAssetsCount}

                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  realized P{`&`}L
                </TypographyTitleCell>
                <TypographyValueCell textColor={'#2F7619'}>
                  {totalKeyAssetsData.realizedPnl}

                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  Unrealized P{`&`}L
                </TypographyTitleCell>
                <TypographyValueCell textColor={'#B93B2B'}>
                  {totalKeyAssetsData.unrealizedPnl}

                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  Total P{`&`}L
                </TypographyTitleCell>
                <TypographyValueCell textColor={'#B93B2B'}>
                  {totalKeyAssetsData.totalPnl}

                </TypographyValueCell>
              </div>
            </GridColumn>
          </ExpansionPanelSummaryCustom>

          <ExpansionPanelDetails>
            <Grid container justify="center">
              {getPortfolioKeyAssetsQuery.portfolioKeys.keys.map((el) => {
                return (
                  <GridRow
                    item
                    hoverColor={theme.palette.hover[theme.palette.type]}
                  >
                    <GridColumn>
                      <TypographySubHeading>
                        {el.name}
                      </TypographySubHeading>
                    </GridColumn>
                    <GridColumn>
                      <div>
                        <TypographyTitleCell>Value</TypographyTitleCell>
                        <TypographyValueCell
                          textColor={theme.palette.text.subPrimary}
                        >
                          {el.portfolioKeyAssetsValue}
                        </TypographyValueCell>
                      </div>
                    </GridColumn>
                    <GridColumn>
                      <div>
                        <TypographyTitleCell>assets</TypographyTitleCell>
                        <TypographyValueCell
                          textColor={theme.palette.text.subPrimary}
                        >
                          {el.portfolioKeyAssetsCount}
                        </TypographyValueCell>
                      </div>
                    </GridColumn>
                    <GridColumn>
                      <div>
                        <TypographyTitleCell>
                          realized P{`&`}L
                        </TypographyTitleCell>
                        <TypographyValueCell textColor={'#2F7619'}>
                          {el.realizedPnl}
                        </TypographyValueCell>
                      </div>
                    </GridColumn>
                    <GridColumn>
                      <div>
                        <TypographyTitleCell>
                          Unrealized P{`&`}L
                        </TypographyTitleCell>
                        <TypographyValueCell textColor={'#B93B2B'}>
                          {el.unrealizedPnl}
                        </TypographyValueCell>
                      </div>
                    </GridColumn>
                    <GridColumn>
                      <div>
                        <TypographyTitleCell>Total P{`&`}L</TypographyTitleCell>
                        <TypographyValueCell textColor={'#B93B2B'}>
                          {el.totalPnl}
                        </TypographyValueCell>
                      </div>
                    </GridColumn>
                  </GridRow>
                )
              })}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: GET_PORTFOLIO_KEY_ASSETS,
    name: 'getPortfolioKeyAssetsQuery',
  }),
)(DetailedExpansionPanel)
