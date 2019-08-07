import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/styles'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import TablePanelSummary from './TablePanelSummary'

import { ExpansionPanelWrapper } from './RebalanceAccordionIndex.styles'

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
class RebalanceAccordionIndex extends React.Component {
  state = {
    expanded: null,
    value: this.props.sliderValue,
  }

  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }

  handleSlideChange = (event, value) => {
    console.log('change')
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
                timeout: 500
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
                />
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {children}
              </ExpansionPanelDetails>
            </ExpansionPanelWrapper>
          )
        })}
      </div>
    )
  }
}

export default withStyles(styles)(RebalanceAccordionIndex)
