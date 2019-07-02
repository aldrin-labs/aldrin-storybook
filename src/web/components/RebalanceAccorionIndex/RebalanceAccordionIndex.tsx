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
        palette: { black },
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
                style={{ borderRadius: '50%' }}
                expandIcon={<ExpandMoreIcon />}
              >
                <Grid container justify="space-between">
                  <GridItemHeadingCustom
                    borderColor={accordionPanelHeadingBorderColor}
                    lg={3}
                    md={3}
                  >
                    <TypographyCustom fontWeight={'bold'}>
                      {accordionPanelHeading}
                    </TypographyCustom>
                  </GridItemHeadingCustom>
                  <Grid item lg={2} md={3} style={{}}>
                    <StyledTypography>Current value</StyledTypography>
                    <StyledSubTypography color={black.custom}>
                      ${secondColValue}
                    </StyledSubTypography>
                  </Grid>
                  <GridFlex
                    item
                    lg={3}
                    md={3}
                    justify="center"
                    alignItems="center"
                  >
                    <Slider
                      thumbWidth="25px"
                      thumbHeight="25px"
                      sliderWidth="125px"
                      sliderHeight="17px"
                      sliderHeightAfter="20px"
                      borderRadius="30px"
                      borderRadiusAfter="30px"
                      thumbBackground="blue"
                      borderThumb="2px solid white"
                      trackAfterBackground="#E7ECF3"
                      trackBeforeBackground={accordionPanelHeadingBorderColor}
                      value={this.state.value}
                      onChange={this.handleSlideChange}
                      style={{ marginLeft: '-20px' }}

                      disabled
                    />
                    <Tooltip
                      title={`${this.state.value.toFixed(4)}%`}
                      placement="bottom-end"
                    >
                      <StyledTypography
                        fontWeight="bold"
                        fontSize="16px"
                        marginLeft="15px"
                      >
                        {/* {percentage} */}
                        {this.state.value.toFixed(0)}%
                      </StyledTypography>
                    </Tooltip>
                  </GridFlex>

                  <Grid item lg={3} md={3}>
                    <StyledTypography style={{ marginLeft: '75px' }}>
                      Target value
                    </StyledTypography>
                    <StyledSubTypography
                      style={{ marginLeft: '75px' }}
                      color={black.custom}
                    >
                      ${fourthColValue}
                    </StyledSubTypography>
                  </Grid>
                  <GridFlex item lg={1} md={3} />
                </Grid>
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
