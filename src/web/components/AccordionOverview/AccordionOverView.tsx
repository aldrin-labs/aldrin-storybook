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

function DetailedExpansionPanel(props) {
  const { classes } = props
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
                $100,000
              </TypographyValueCell>
            </div>
          </GridColumn>
          <GridColumn>
            <div>
              <TypographyTitleCell textColor={theme.palette.text.primary}>
                assets
              </TypographyTitleCell>
              <TypographyValueCell textColor={theme.palette.text.subPrimary}>
                12
              </TypographyValueCell>
            </div>
          </GridColumn>
          <GridColumn>
            <div>
              <TypographyTitleCell textColor={theme.palette.text.primary}>
                realized P{`&`}L
              </TypographyTitleCell>
              <TypographyValueCell textColor={'#2F7619'}>
                $24500
              </TypographyValueCell>
            </div>
          </GridColumn>
          <GridColumn>
            <div>
              <TypographyTitleCell textColor={theme.palette.text.primary}>
                Unrealized P{`&`}L
              </TypographyTitleCell>
              <TypographyValueCell textColor={'#B93B2B'}>
                -$120300
              </TypographyValueCell>
            </div>
          </GridColumn>
          <GridColumn>
            <div>
              <TypographyTitleCell textColor={theme.palette.text.primary}>
                Total P{`&`}L
              </TypographyTitleCell>
              <TypographyValueCell textColor={'#B93B2B'}>
                -$120300
              </TypographyValueCell>
            </div>
          </GridColumn>
        </ExpansionPanelSummaryCustom>

        <ExpansionPanelDetails>
          <Grid container justify="center">
            {dataOverview.map((dataRow) => {
              return (
                <GridRow
                  item
                  hoverColor={theme.palette.hover[theme.palette.type]}
                >
                  <GridColumn>
                    <TypographySubHeading>
                      Binance trade account
                    </TypographySubHeading>
                  </GridColumn>
                  <GridColumn>
                    <div>
                      <TypographyTitleCell>Value</TypographyTitleCell>
                      <TypographyValueCell
                        textColor={theme.palette.text.subPrimary}
                      >
                        $100,000
                      </TypographyValueCell>
                    </div>
                  </GridColumn>
                  <GridColumn>
                    <div>
                      <TypographyTitleCell>assets</TypographyTitleCell>
                      <TypographyValueCell
                        textColor={theme.palette.text.subPrimary}
                      >
                        12
                      </TypographyValueCell>
                    </div>
                  </GridColumn>
                  <GridColumn>
                    <div>
                      <TypographyTitleCell>
                        realized P{`&`}L
                      </TypographyTitleCell>
                      <TypographyValueCell textColor={'#2F7619'}>
                        $24500
                      </TypographyValueCell>
                    </div>
                  </GridColumn>
                  <GridColumn>
                    <div>
                      <TypographyTitleCell>
                        Unrealized P{`&`}L
                      </TypographyTitleCell>
                      <TypographyValueCell textColor={'#B93B2B'}>
                        -$120300
                      </TypographyValueCell>
                    </div>
                  </GridColumn>
                  <GridColumn>
                    <div>
                      <TypographyTitleCell>Total P{`&`}L</TypographyTitleCell>
                      <TypographyValueCell textColor={'#B93B2B'}>
                        -$120300
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

export default withTheme()(DetailedExpansionPanel)
