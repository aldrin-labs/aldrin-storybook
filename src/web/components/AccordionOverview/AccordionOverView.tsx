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

import { addMainSymbol } from '@sb/components/index'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

const format = (number, baseCoin) => {
  const isUSDCurrently = baseCoin === 'USDT'

  return isUSDCurrently
    ? addMainSymbol(roundAndFormatNumber(number, 2, true), isUSDCurrently)
    : addMainSymbol(roundAndFormatNumber(number, 8, false), isUSDCurrently)
}

const getWalletTotal = (getFuturesOverview: any) => {
  return getFuturesOverview.reduce((acc, el) => {
    if (el.keyAssetsInfo.length > 0) {
      return el.keyAssetsInfo[0].walletBalance + acc
    }
    return acc
  }, 0)
}

const getRealizedTotal = (getFuturesOverview: any) => {
  if (getFuturesOverview.length < 1) return 0

  return getFuturesOverview.reduce(
    (acc, el) =>
      (el.tradesInfoSummary.length > 0
        ? el.tradesInfoSummary[0].realizedPnl
        : 0) + acc,
    0
  )
}

const getFuturesAccountName = (getFuturesOverviewRow: any, keyId: string) => {
  return getFuturesOverviewRow.portfolioInfo[0].keys.find(
    (key) => key.keyId === keyId
  ).name
}

const getFuturesAccountRealized = (getFuturesOverviewRow: any) => {
  return getFuturesOverviewRow.tradesInfoSummary.length > 0
    ? getFuturesOverviewRow.tradesInfoSummary[0].realizedPnl
    : 0
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
    const {
      theme,
      portfolioAssetsData,
      totalKeyAssetsData,
      baseCoin,
      isSPOTCurrently,
      getFuturesOverview,
    } = this.props

    const assetsData = isSPOTCurrently
      ? portfolioAssetsData
      : getFuturesOverview

    console.log('assets', assetsData)

    return (
      <Grid style={{ width: '100%', minHeight: '11%', height: 'auto' }}>
        <ExpansionPanel
          CollapseProps={{ timeout: { enter: 425, exit: 350 } }}
          id="accordionOverview"
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
                  {isSPOTCurrently ? 'Value' : 'Balance'}
                </TypographyTitleCell>
                <TypographyValueCell textColor={theme.palette.text.subPrimary}>
                  {isSPOTCurrently
                    ? format(totalKeyAssetsData.value, baseCoin)
                    : format(getWalletTotal(getFuturesOverview), 'USDT')}
                </TypographyValueCell>
              </div>
            </GridColumn>
            <GridColumn gridBorder={gridBorder}>
              <div>
                <TypographyTitleCell textColor={theme.palette.text.primary}>
                  {isSPOTCurrently ? 'unique assets' : 'Maintenance margin'}
                </TypographyTitleCell>
                <TypographyValueCell textColor={theme.palette.text.subPrimary}>
                  {isSPOTCurrently
                    ? totalKeyAssetsData.uniqueAssets.length
                    : '-'}
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
                  {isSPOTCurrently
                    ? format(totalKeyAssetsData.realized, baseCoin)
                    : format(getRealizedTotal(getFuturesOverview), 'USDT')}
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
                  {isSPOTCurrently
                    ? format(totalKeyAssetsData.unrealized, baseCoin)
                    : '-'}
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
                  {isSPOTCurrently
                    ? format(totalKeyAssetsData.total, baseCoin)
                    : format(getRealizedTotal(getFuturesOverview), 'USDT')}
                </TypographyValueCell>
              </div>
            </GridColumn>
          </ExpansionPanelSummaryCustom>

          <ExpansionPanelDetailsCustom>
            <Grid container justify="center">
              {assetsData.map((el, i) => {
                if (!isSPOTCurrently && el.keyAssetsInfo.length === 0) return

                const currentKeyId =
                  !isSPOTCurrently && el.keyAssetsInfo[0].keyId

                const realizedPnl = isSPOTCurrently
                  ? el.realized
                  : getFuturesAccountRealized(el)

                const unrealizedPnl = isSPOTCurrently ? el.realized : 0

                const totalPnl = isSPOTCurrently
                  ? el.total
                  : getFuturesAccountRealized(el)

                return (
                  <GridRowWrapper
                    item
                    key={`${el.value}-${i}`}
                    hoverColor={theme.palette.hover[theme.palette.type]}
                  >
                    <GridRow>
                      <GridColumn>
                        <TypographySubHeading>
                          {isSPOTCurrently
                            ? el.name
                            : getFuturesAccountName(el, currentKeyId)}
                        </TypographySubHeading>
                      </GridColumn>
                      <GridColumn
                        paddingCell={'0 1rem !important'}
                        gridBorder={i % 2 !== 0 ? gridBorder : ''}
                      >
                        <div>
                          <TypographyTitleCell>
                            {isSPOTCurrently ? 'Value' : 'Balance'}
                          </TypographyTitleCell>
                          <TypographyValueCell
                            textColor={theme.palette.text.subPrimary}
                          >
                            {isSPOTCurrently
                              ? format(el.value, baseCoin)
                              : format(
                                  el.keyAssetsInfo[0].walletBalance,
                                  'USDT'
                                )}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn gridBorder={i % 2 !== 0 ? gridBorder : ''}>
                        <div>
                          <TypographyTitleCell>
                            {isSPOTCurrently ? 'assets' : 'Maintenance margin'}
                          </TypographyTitleCell>
                          <TypographyValueCell
                            textColor={theme.palette.text.subPrimary}
                          >
                            {isSPOTCurrently ? el.assets : '-'}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn gridBorder={i % 2 !== 0 ? gridBorder : ''}>
                        <div>
                          <TypographyTitleCell>
                            realized P{`&`}L
                          </TypographyTitleCell>
                          <TypographyValueCell
                            textColor={realizedPnl < 0 ? '#B93B2B' : '#2F7619'}
                          >
                            {isSPOTCurrently
                              ? format(el.realized, baseCoin)
                              : format(getFuturesAccountRealized(el), 'USDT')}
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
                              unrealizedPnl < 0 ? '#B93B2B' : '#2F7619'
                            }
                          >
                            {isSPOTCurrently
                              ? format(el.unrealized, baseCoin)
                              : '-'}
                          </TypographyValueCell>
                        </div>
                      </GridColumn>
                      <GridColumn>
                        <div>
                          <TypographyTitleCell>
                            Total P{`&`}L
                          </TypographyTitleCell>
                          <TypographyValueCell
                            textColor={totalPnl < 0 ? '#B93B2B' : '#2F7619'}
                          >
                            {isSPOTCurrently
                              ? format(el.total, baseCoin)
                              : format(getFuturesAccountRealized(el), 'USDT')}
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

export default DetailedExpansionPanel
