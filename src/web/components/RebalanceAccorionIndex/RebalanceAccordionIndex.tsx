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
    } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container justify="center">
              <GridItemHeadingCustom borderColor="#F29C38" lg={3}>
                <TypographyHeading>Free Assets</TypographyHeading>
              </GridItemHeadingCustom>
              <Grid item lg={3}>
                <StyledTypography>Current value</StyledTypography>
                <StyledSubTypography>$56,500.00</StyledSubTypography>
              </Grid>
              <Grid item lg={3}>
                <Slider thumbBackground='blue' trackAfterBackground='red' trackBeforeBackground='green' />
              </Grid>
              <Grid item lg={2}>
                <StyledTypography>Target value</StyledTypography>
                <StyledSubTypography>$56,500.00</StyledSubTypography>
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
        
        <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container justify="center">
              <GridItemHeadingCustom borderColor="#DEDB8E" lg={3}>
                <TypographyHeading>Free Assets</TypographyHeading>
              </GridItemHeadingCustom>
              <Grid item lg={3}>
                <StyledTypography>Current value</StyledTypography>
                <StyledSubTypography>$74,500.00</StyledSubTypography>
              </Grid>
              <Grid item lg={3}>
                <Typography>POLZUNOK</Typography>
              </Grid>
              <Grid item lg={2}>
                <StyledTypography>Target value</StyledTypography>
                <StyledSubTypography>$90,500.00</StyledSubTypography>
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
        <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container justify="center">
              <GridItemHeadingCustom borderColor="#4152AF" lg={3}>
                <TypographyHeading>Free Assets</TypographyHeading>
              </GridItemHeadingCustom>
              <Grid item lg={3}>
                <StyledTypography>Current value</StyledTypography>
                <StyledSubTypography>$65,500.00</StyledSubTypography>
              </Grid>
              <Grid item lg={3}>
                <Typography>POLZUNOK</Typography>
              </Grid>
              <Grid item lg={2}>
                <StyledTypography>Target value</StyledTypography>
                <StyledSubTypography>$45,500.00</StyledSubTypography>
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
      </div>
    );
  }
}

RebalanceAccordionIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RebalanceAccordionIndex);