import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import PortfolioRebalanceTableContainer from '@core/containers/PortfolioRebalanceTableContainer/PortfolioRebalanceTableContainer'

import Slider from '../Slider/Slider';
import { TypographyCustom, ExpansionPanelWrapper, StyledTypography, StyledSubTypography, GridItemHeadingCustom, GridFlex } from './RebalanceAccordionIndex.styles' 

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

@withTheme()

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
      accordionData,
      theme: {palette: {black}}
    } = this.props;
    const { expanded } = this.state;

    let panelId = 1;
    
    return (
      <div className={classes.root}>

      {
        (accordionData && accordionData.length > 0) ? (
          accordionData.map((item:any, i:any) => {

            const {         
              accordionPanelHeadingBorderColor,
              accordionPanelHeading,
              secondColValue,
              fourthColValue,
              percentage
            } = item;

            const panelId = `panel`+`${i}`;

            return(
              <ExpansionPanelWrapper expanded={expanded === `${panelId}`} onChange={this.handleChange(`${panelId}`)}>
                <ExpansionPanelSummary style={{borderRadius: '50%'}} expandIcon={<ExpandMoreIcon />}>
                  <Grid container justify="space-between">
                    <GridItemHeadingCustom borderColor={accordionPanelHeadingBorderColor} lg={3}>
                      <TypographyCustom fontWeight={'bold'}>{accordionPanelHeading}</TypographyCustom>
                    </GridItemHeadingCustom>
                    <Grid item lg={2}>
                      <StyledTypography>Current value</StyledTypography>
                      <StyledSubTypography color={black.custom}>${secondColValue}</StyledSubTypography>
                    </Grid>
                    <GridFlex item lg={3} justify="space-around" alignItems="center">
                      <Slider 
                        thumbWidth='22px' 
                        thumbHeight='22px' 
                        sliderWidth='150px'
                        sliderHeight='22px' 
                        borderRadius='18px' 
                        thumbBackground='blue' 
                        trackAfterBackground='orange' 
                        trackBeforeBackground='#E7ECF3' 
                        />
                      <StyledTypography>{percentage}%</StyledTypography>

                    </GridFlex>
         
                    <Grid item lg={2}>
                      <StyledTypography>Target value</StyledTypography>
                      <StyledSubTypography color={black.custom}>${fourthColValue}</StyledSubTypography>
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
              </ExpansionPanelWrapper>
            )
            
          })
        ) : ('')
      }
      </div>
    );
  }
}

export default withStyles(styles)(RebalanceAccordionIndex);