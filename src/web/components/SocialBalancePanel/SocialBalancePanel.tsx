import React, { Component } from 'react'
import { Grid, withTheme } from '@material-ui/core'
import {
  GridColumn,
  TypographyTitleCell,
  TypographyValueCell,
  GridMainContainer,
} from './SocialBalancePanel.styles'
import { compose } from 'recompose'
import {
  roundAndFormatNumber,
  roundPercentage,
} from '@core/utils/PortfolioTableUtils'

@withTheme
class SocialBalancePanel extends Component {
  render() {
    const { theme, totalFolioAssetsData } = this.props
    return (
      <GridMainContainer container justify="space-between">
        <GridColumn>
          <div>
            <TypographyTitleCell textColor={theme.palette.text.primary}>
              Value
            </TypographyTitleCell>
            <TypographyValueCell textColor={theme.palette.text.subPrimary}>
              ${roundAndFormatNumber(totalFolioAssetsData.total, 3, true)}
            </TypographyValueCell>
          </div>
        </GridColumn>
        <GridColumn justify="center">
          <div>
            <TypographyTitleCell textColor={theme.palette.text.primary}>
              assets
            </TypographyTitleCell>
            <TypographyValueCell textColor={theme.palette.text.subPrimary}>
              {totalFolioAssetsData.assets}
            </TypographyValueCell>
          </div>
        </GridColumn>
        <GridColumn justify="center">
          <div>
            <TypographyTitleCell textColor={theme.palette.text.primary}>
              realized P{`&`}L
            </TypographyTitleCell>
            <TypographyValueCell
              textColor={
                totalFolioAssetsData.realized > 0
                  ? theme.palette.price.increase
                  : totalFolioAssetsData.realized < 0
                  ? theme.palette.price.decrease
                  : theme.palette.text.subPrimary
              }
            >
              {totalFolioAssetsData.realized < 0 ? '-' : ''}$
              {Math.sign(
                roundAndFormatNumber(totalFolioAssetsData.realized, 3, true)
              ) === 1
                ? roundAndFormatNumber(totalFolioAssetsData.realized, 3, true)
                : Math.abs(
                    roundAndFormatNumber(totalFolioAssetsData.realized, 3, true)
                  )}
            </TypographyValueCell>
          </div>
        </GridColumn>
        <GridColumn justify="center">
          <div>
            <TypographyTitleCell textColor={theme.palette.text.primary}>
              Unrealized P{`&`}L
            </TypographyTitleCell>
            <TypographyValueCell
              textColor={
                totalFolioAssetsData.unrealized > 0
                  ? theme.palette.price.increase
                  : totalFolioAssetsData.unrealized < 0
                  ? theme.palette.price.decrease
                  : theme.palette.text.subPrimary
              }
            >
              {totalFolioAssetsData.unrealized < 0 ? '-' : ''}$
              {Math.sign(
                roundAndFormatNumber(totalFolioAssetsData.unrealized, 3, true)
              ) === 1
                ? roundAndFormatNumber(totalFolioAssetsData.unrealized, 3, true)
                : Math.abs(
                    roundAndFormatNumber(
                      totalFolioAssetsData.unrealized,
                      3,
                      true
                    )
                  )}
            </TypographyValueCell>
          </div>
        </GridColumn>
        <GridColumn justify="flex-end">
          <div>
            <TypographyTitleCell textColor={theme.palette.text.primary}>
              Total P{`&`}L
            </TypographyTitleCell>
            <TypographyValueCell
              textColor={
                totalFolioAssetsData.realized +
                  totalFolioAssetsData.unrealized >
                0
                  ? theme.palette.price.increase
                  : totalFolioAssetsData.realized +
                      totalFolioAssetsData.unrealized <
                    0
                  ? theme.palette.price.decrease
                  : theme.palette.text.subPrimary
              }
            >
              {totalFolioAssetsData.realized + totalFolioAssetsData.unrealized <
              0
                ? '-'
                : ''}
              $
              {Math.abs(
                roundAndFormatNumber(
                  totalFolioAssetsData.realized +
                    totalFolioAssetsData.unrealized,
                  3,
                  true
                )
              )}
            </TypographyValueCell>
          </div>
        </GridColumn>
        {/* <Grid item lg={2}>
            <TypographyTitle>Value</TypographyTitle>
            <TypographyValue>$100,000</TypographyValue>
          </Grid>
          <Grid item lg={2}>
            <TypographyTitle>Value</TypographyTitle>
            <TypographyValue>$100,000</TypographyValue>
          </Grid>
          <Grid item lg={2}>
            <TypographyTitle>Value</TypographyTitle>
            <TypographyValue>$100,000</TypographyValue>
          </Grid>
          <Grid item lg={2}>
            <TypographyTitle>Value</TypographyTitle>
            <TypographyValue>$100,000</TypographyValue>
          </Grid>
          <Grid item lg={2}>
            <TypographyTitle>Value</TypographyTitle>
            <TypographyValue>$100,000</TypographyValue>
          </Grid> */}
      </GridMainContainer>
    )
  }
}

export default SocialBalancePanel
// export default compose(
//   queryRendererHoc({
//     query: GET_TOOLTIP_SETTINGS,
//     name: 'getTooltipSettingsQuery',
//   })
// )(SocialBalancePanel)
