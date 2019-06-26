import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import PortfolioRebalanceTableContainer from '@core/containers/PortfolioRebalanceTableContainer/PortfolioRebalanceTableContainer'

import Slider from '../Slider/Slider';
import {TypographyHeading, StyledTypography, StyledSubTypography, GridItemHeadingCustom} from './RebalanceAccorionIndex.styles' 

const styles = theme => ({
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
});

class RebalanceAccordionIndex extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { 
      classes, 
      isEditModeEnabled,
      staticRows,
      staticRowsMap,
      totalStaticRows,
      rows,
      totalRows,
      totalPercents,
      totalTableRows,
      isPercentSumGood,
      undistributedMoney,
      isUSDCurrently,
      addMoneyInputValue,
      theme,
      loading,
      red,
      saveButtonColor,
      secondary,
      fontFamily,
      totalSnapshotRows,
      timestampSnapshot,
      onDiscardChanges,
      onSaveClick,
      onReset,
      onEditModeEnable,
      updateState,
      onNewSnapshot,
      dustFilter,
      showWarning,

      accordionIndexPanelData
    } = this.props;
    const { expanded } = this.state;

    let panelId = 1;
    
    return (
      <div className={classes.root}>
      {
        accordionIndexPanelData.map((item, i) => {

          const {         
            accordionPanelHeadingBorderColor,
            accordionPanelHeading,
            secondColValue,
            fourthColValue
          } = item;

          const panelId = `panel`+`${i}`;

          return(
            <ExpansionPanel expanded={expanded === `${panelId}`} onChange={this.handleChange(`${panelId}`)}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container justify="space-between">
                  <GridItemHeadingCustom borderColor={accordionPanelHeadingBorderColor} lg={3}>
                    <TypographyHeading>{accordionPanelHeading}</TypographyHeading>
                  </GridItemHeadingCustom>
                  <Grid item lg={3}>
                    <StyledTypography>Current value</StyledTypography>
                    <StyledSubTypography>{secondColValue}</StyledSubTypography>
                  </Grid>
                  <Grid item lg={3} style={{alignSelf: 'center'}}>
                    <Slider 
                      thumbWidth='30px' 
                      thumbHeight='30px' 
                      sliderWidth='200px'
                      sliderHeight='20px' 
                      borderRadius='18px' 
                      thumbBackground='blue' 
                      trackAfterBackground='orange' 
                      trackBeforeBackground='#E7ECF3' 
                      />
                  </Grid>
                  <Grid item lg={2}>
                    <StyledTypography>Target value</StyledTypography>
                    <StyledSubTypography>{fourthColValue}</StyledSubTypography>
                  </Grid>
                  <Grid item lg={1}>
                    <Typography>...</Typography>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>

                <PortfolioRebalanceTableContainer
                  key={`PortfolioRebalanceTableContainer`}
                {...{
                  isEditModeEnabled,
                  staticRows,
                  staticRowsMap,
                  totalStaticRows,
                  rows,
                  totalRows,
                  totalPercents,
                  totalTableRows,
                  isPercentSumGood,
                  undistributedMoney,
                  isUSDCurrently,
                  addMoneyInputValue,
                  theme,
                  loading,
                  red,
                  saveButtonColor,
                  secondary,
                  fontFamily,
                  totalSnapshotRows,
                  timestampSnapshot,
                  onDiscardChanges,
                  onSaveClick,
                  onReset,
                  onEditModeEnable,
                  updateState,
                  onNewSnapshot,
                  dustFilter,
                  showWarning,
                  }}
                />

              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
          
        })
      }
      </div>
    );
  }
}

RebalanceAccordionIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RebalanceAccordionIndex);