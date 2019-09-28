import React from 'react'
import { withStyles } from '@material-ui/core/styles'
// import ExpansionPanel from '@material-ui/core/ExpansionPanel'
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
// import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import TransactionTable from './TransactionTable'
import { IProps, IState } from './AccordionTable.types'
import { withTheme } from '@material-ui/styles'

import { Loading } from '@sb/components/index'

import {
  ExpansionPanelCustom,
  ExpansionPanelSummaryCustom,
  TypographyCustom,
} from './AccordionTable.styles'

const styles = (theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    expanded: 'panel1',
  }

  handleChange = (panel: string) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }

  render() {
    let {
      classes,
      transactionsData,
      accordionTitle,
      getError,
      isCompleted,
      isFinished,
      showLoader,
      cancelOrder,
    } = this.props

    const { expanded } = this.state

    return (
      <div className={classes.root}>
        <ExpansionPanelCustom
          expanded={expanded === 'panel1'}
          onChange={this.handleChange('panel1')}
        >
          <ExpansionPanelSummaryCustom expandIcon={<ExpandMoreIcon />}>
            <TypographyCustom>{accordionTitle}</TypographyCustom>
            {showLoader && (
              <div
                style={{
                  position: 'absolute',
                  top: expanded === 'panel1' ? '15px' : '10px',
                  right: '12px',
                  height: '24px',
                  width: '24px',
                }}
              >
                <Loading size={24} />
              </div>
            )}
          </ExpansionPanelSummaryCustom>
          <ExpansionPanelDetails
            style={{ padding: '0.1rem 0 2rem 0', display: 'block' }}
          >
            <TransactionTable
              isCompleted={isCompleted}
              getError={getError}
              transactionsData={transactionsData}
              isFinished={isFinished}
              showLoader={showLoader}
              cancelOrder={cancelOrder}
            />
          </ExpansionPanelDetails>
        </ExpansionPanelCustom>
      </div>
    )
  }
}

export default withStyles(styles)(AccordionTable)
