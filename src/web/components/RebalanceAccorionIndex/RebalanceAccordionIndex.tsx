import React from 'react'
import { withStyles } from '@material-ui/styles'
import { withTheme } from '@material-ui/styles'
import { ExpansionPanelDetails } from '@material-ui/core'
import { ExpansionPanelSummary } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import TablePanelSummary from './TablePanelSummary'

import { ExpansionPanelWrapper } from './RebalanceAccordionIndex.styles'

const styles = (theme) => ({
  root: {
    width: '100%',
    marginBottom: '2.5rem',
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
class RebalanceAccordionIndex extends React.Component {
  state = {
    // change it after we'll do indexes and social portfolios at rebalance
    expanded: 'panel0',
    value: this.props.sliderValue,
  }

  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }

  handleSlideChange(event, value) {
    this.setState({ value })
  }

  render() {
    const {
      classes,
      children,
      accordionData,
      theme: {
        palette: { black, table },
      },
    } = this.props
    const { expanded } = this.state

    return (
      <div className={classes.root}>
        {accordionData.map((item: any, i: any) => {
          const {
            accordionPanelHeadingBorderColor,
            accordionPanelHeading,
            secondColValue,
            fourthColValue,
            percentage,
          } = item

          const panelId = `panel` + `${i}`

          return (
            <ExpansionPanelWrapper
              expanded={expanded === `${panelId}`}
              //TODO: change on in the future version
              //expanded={expanded === `${panelId}`}
              onChange={this.handleChange(`${panelId}`)}
              CollapseProps={{
                timeout: 500,
              }}
            >
              <ExpansionPanelSummary
                style={{ background: 'transparent' }}
                //TODO ICON expandIcon={<ExpandMoreIcon />}
              >
                <TablePanelSummary
                  accordionPanelHeadingBorderColor={
                    accordionPanelHeadingBorderColor
                  }
                  accordionPanelHeading={accordionPanelHeading}
                  secondColValue={secondColValue}
                  fourthColValue={fourthColValue}
                  percentage={percentage}
                  value={this.state.value}
                  handleSlideChange={() => this.handleSlideChange()}
                  expanded={expanded === `${panelId}`}
                />
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
            </ExpansionPanelWrapper>
          )
        })}
      </div>
    )
  }
}

export default withStyles(styles)(RebalanceAccordionIndex)
