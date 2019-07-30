import React, { Component } from 'react'
import { Grid, withTheme } from '@material-ui/core'
import {
  GridColumn,
  TypographyTitleCell,
  TypographyValueCell,
  GridMainContainer,
} from './SocialBalancePanel.styles'
import { compose } from 'recompose'

@withTheme()
class SocialBalancePanel extends Component {
  render() {
    const { theme } = this.props
    return (
      <GridMainContainer container justify="space-between">
        <GridColumn>
          <div>
            <TypographyTitleCell textColor={theme.palette.text.primary}>
              Value
            </TypographyTitleCell>
            <TypographyValueCell textColor={theme.palette.text.subPrimary}>
              $100,000
            </TypographyValueCell>
          </div>
        </GridColumn>
        <GridColumn justify="center">
          <div>
            <TypographyTitleCell textColor={theme.palette.text.primary}>
              assets
            </TypographyTitleCell>
            <TypographyValueCell textColor={theme.palette.text.subPrimary}>
              12
            </TypographyValueCell>
          </div>
        </GridColumn>
        <GridColumn justify="center">
          <div>
            <TypographyTitleCell textColor={theme.palette.text.primary}>
              realized P{`&`}L
            </TypographyTitleCell>
            <TypographyValueCell textColor={'#2F7619'}>
              $24500
            </TypographyValueCell>
          </div>
        </GridColumn>
        <GridColumn justify="center">
          <div>
            <TypographyTitleCell textColor={theme.palette.text.primary}>
              Unrealized P{`&`}L
            </TypographyTitleCell>
            <TypographyValueCell textColor={'#B93B2B'}>
              -$120300
            </TypographyValueCell>
          </div>
        </GridColumn>
        <GridColumn justify="flex-end">
          <div>
            <TypographyTitleCell textColor={theme.palette.text.primary}>
              Total P{`&`}L
            </TypographyTitleCell>
            <TypographyValueCell textColor={'#B93B2B'}>
              -$120300
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
