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
} from './AccordionOverView.style'

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  title: {
    paddingLeft: '15px',
  },
  column: {
    flexBasis: '16.66%',
    display: 'flex',
    alignItems: 'center',
  },
  innerRow: {
    minWidth: '100%',
    display: 'flex',
    justifyContent: 'center',
    '&:nth-child(2n-1)': {
      background: '#E0E5EC',
      borderRadius: '20px',
    },
  },
  helper: {
    borderLeft: `1px solid ${theme.palette.divider}`,
    paddingLeft: `${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
})

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

function DetailedExpansionPanel(props: any) {
  const { classes } = props
  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummaryCustom expandIcon={<ExpandMoreIcon />}>
          <div className={classes.column}>
            <TypographyHeading>overview</TypographyHeading>
          </div>
          <div className={classes.column}>
            <div>
              <TypographyTitleCell>Value</TypographyTitleCell>
              <TypographyValueCell>$100,000</TypographyValueCell>
            </div>
          </div>
          <div className={classes.column}>
            <div>
              <TypographyTitleCell>assets</TypographyTitleCell>
              <TypographyValueCell>12</TypographyValueCell>
            </div>
          </div>
          <div className={classes.column}>
            <div>
              <TypographyTitleCell>realized P{`&`}L</TypographyTitleCell>
              <TypographyValueCell textColor={'#2F7619'}>
                $24500
              </TypographyValueCell>
            </div>
          </div>
          <div className={classes.column}>
            <div>
              <TypographyTitleCell>Unrealized P{`&`}L</TypographyTitleCell>
              <TypographyValueCell textColor={'#B93B2B'}>
                -$120300
              </TypographyValueCell>
            </div>
          </div>
          <div className={classes.column}>
            <div>
              <TypographyTitleCell>Total P{`&`}L</TypographyTitleCell>
              <TypographyValueCell textColor={'#B93B2B'}>
                -$120300
              </TypographyValueCell>
            </div>
          </div>
        </ExpansionPanelSummaryCustom>

        <ExpansionPanelDetails>
          <Grid container justify="center">
            {dataOverview.map((dataRow) => {
              return (
                <Grid
                  item
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                  className={classes.innerRow}
                >
                  <div className={classNames(classes.column, classes.title)}>
                    <TypographySubHeading>
                      Binance trade account
                    </TypographySubHeading>
                  </div>
                  <div className={classes.column}>
                    <div>
                      <TypographyTitleCell>Value</TypographyTitleCell>
                      <TypographyValueCell>$100,000</TypographyValueCell>
                    </div>
                  </div>
                  <div className={classes.column}>
                    <div>
                      <TypographyTitleCell>assets</TypographyTitleCell>
                      <TypographyValueCell>12</TypographyValueCell>
                    </div>
                  </div>
                  <div className={classes.column}>
                    <div>
                      <TypographyTitleCell>
                        realized P{`&`}L
                      </TypographyTitleCell>
                      <TypographyValueCell textColor={'#2F7619'}>
                        $24500
                      </TypographyValueCell>
                    </div>
                  </div>
                  <div className={classes.column}>
                    <div>
                      <TypographyTitleCell>
                        Unrealized P{`&`}L
                      </TypographyTitleCell>
                      <TypographyValueCell textColor={'#B93B2B'}>
                        -$120300
                      </TypographyValueCell>
                    </div>
                  </div>
                  <div className={classes.column}>
                    <div>
                      <TypographyTitleCell>Total P{`&`}L</TypographyTitleCell>
                      <TypographyValueCell textColor={'#B93B2B'}>
                        -$120300
                      </TypographyValueCell>
                    </div>
                  </div>
                </Grid>
              )
            })}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}

export default withStyles(styles)(DetailedExpansionPanel)
