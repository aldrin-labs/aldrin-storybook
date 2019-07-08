import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'

import TooltipCustom from '../TooltipCustom/TooltipCustom'

import Tooltip from '@material-ui/core/Tooltip'

import Slider from '../Slider/Slider'
import TablePanelSummary from './TablePanelSummary'

import {
  TypographyCustom,
  ExpansionPanelWrapper,
  StyledTypography,
  StyledSubTypography,
  GridItemHeadingCustom,
  GridFlex,
} from './RebalanceAccordionIndex.styles'

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
    value: 0,
  }

  componentDidMount() {
    this.setState({
      value: this.props.sliderValue,
    })
  }

  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }

  handleSlideChange = (event, value) => {
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
              onChange={this.handleChange(`${panelId}`)}
            >
              <ExpansionPanelSummary
                style={{ background: 'transparent' }}
                expandIcon={<ExpandMoreIcon />}
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
                  handleSlideChange={() => handleSlideChange()}
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
