import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import TransactionTable from './TransactionTable'
import { IProps, IState } from './AccordionTable.types'
import { withTheme } from '@material-ui/styles'

import {
  ExpansionPanelCustom,
  ExpansionPanelSummaryCustom,
  TypographyCustom,
} from './AccordionTable.styles'

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
})

@withTheme()
class AccordionTable extends React.Component<IProps, IState> {
  state: IState = {
    expanded: false,
  }

  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }

  render() {
    const {
      classes,
      transactionsData,
      accordionTitle,
      getError,
      isCompleted,
      isFinished,
      status,
      theme: {
        palette: { grey },
      },
    } = this.props

    const { expanded } = this.state

    return (
      <div className={classes.root}>
        <ExpansionPanelCustom
          expanded={expanded === 'panel1'}
          onChange={this.handleChange('panel1')}
        >
          <ExpansionPanelSummaryCustom
            border={`1px solid ${grey.light}`}
            expandIcon={<ExpandMoreIcon />}
          >
            <TypographyCustom>{accordionTitle}</TypographyCustom>
          </ExpansionPanelSummaryCustom>
          <ExpansionPanelDetails>
            <Typography>
              <TransactionTable
                isCompleted={isCompleted}
                getError={getError}
                transactionsData={transactionsData}
                isFinished={isFinished}
                status={status}
              />
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanelCustom>
      </div>
    )
  }
}

export default withStyles(styles)(AccordionTable)
