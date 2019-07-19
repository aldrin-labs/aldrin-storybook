import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'

import * as UTILS from '@core/utils/PortfolioRebalanceUtils'

import { Grid } from '@material-ui/core'
import {
  GridFlex,
  LinearProgressCustom,
  IconCircle,
  TypographyCustom,
} from './ProgressAccordion.styles'

const styles = (theme) => ({
  root: {
    width: '100%',
    boxShadow: 'none',
    '&:last-child': {
      paddingRight: '2px',
    },
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
    alignItems: 'flex-start',
    padding: '0 0 0 18px ',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  progressbarPanel: {
    padding: '0px',
    '&:last-child': {
      paddingRight: '0px',
    },
  },
})

function ProgressAccordion(props) {
  const { classes, children, otherCoinData } = props

  // if (otherCoinData) {
  //     return null
  // }

  return (
    <div className={classes.root}>
      <ExpansionPanel
        style={{
          background: 'transparent',
          border: 'none',
          padding: '0',
        }}
      >
        <ExpansionPanelSummary
          className={classes.progressbarPanel}
          style={{
            background: 'transparent',
            border: 'none',
          }}
          //expandIcon={<ExpandMoreIcon />}
        >
          {children}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          className={classes.details}
          style={{ display: 'block', marginBottom: '10px', padding: '0' }}
        >
          {otherCoinData.map((datum, index) => {
            return (
              <Grid
                container
                style={{ marginBottom: '8px' }}
                lg={12}
              >
                <GridFlex item lg={3} md={3} padding="0">
                  <IconCircle
                    className="fa fa-circle"
                    style={{
                      // justifySelf: 'flex-start',
                      fontSize: '10px',
                      margin: 'auto 11px auto 14px',
                      color: '#97C15C',
                    }}
                  />
                  <TypographyCustom style={{ marginLeft: '1px' }}>
                    {datum.symbol}
                  </TypographyCustom>
                </GridFlex>
                <Grid
                  item
                  lg={6}
                  md={6}
                  style={{
                    background: '#E7ECF3',
                    borderRadius: '35px',
                    height: '12px',
                    marginTop: '2px',
                  }}
                >
                  <LinearProgressCustom
                    height="12px"
                    marginTop="2px"
                    width={`${datum.portfolioPerc}%`}
                    variant="determinate"
                    value={0}
                    color={
                      index === 0
                        ? '#F29C38'
                        : index === 1
                        ? '#4152AF'
                        : index === 2
                        ? '#DEDB8E'
                        : '#97C15C'
                    }
                  />
                </Grid>

                <GridFlex
                  item
                  lg={3}
                  md={3}
                  style={{ paddingLeft: '43px' }}
                >
                  <TypographyCustom>
                    {datum.portfolioPerc !== '0'
                      ? UTILS.preparePercentage(datum.portfolioPerc)
                      : '0 %'}
                  </TypographyCustom>
                </GridFlex>
              </Grid>
            ) // end of return
          })}
        </ExpansionPanelDetails>
        {/* <Divider /> */}
      </ExpansionPanel>
    </div>
  )
}

export default withStyles(styles)(ProgressAccordion)
