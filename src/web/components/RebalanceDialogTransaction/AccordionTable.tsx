import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TransactionTable from './TransactionTable'
import { IProps, IState } from './AccordionTable.types';


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




class AccordionTable extends React.Component<IProps, IState> {
  state = {
    expanded: null,
    dialogTransactionData: this.props.data
  };




  //TODO
  componentDidMount() {
    console.log('1 --==========++++++++', this.props.data);
    console.log('2 --==========++++++++', this.state.dialogTransactionData);
    this.timer = setInterval(this.dataFlowGenerator(this.state.data), 5000);    
  }

  dataFlowGenerator = (dialogTransactionData: any) => {
    let count = 0;
    console.log('aaaaaaaaaaa    ', count);
     
    this.state.dialogTransactionData.forEach(item => {
      if(count = 0) {
        if(item.isDone === null) {
          item.isDone = true;
          count = 1;
        }
      }
    });

  }

  // TODO END





  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes, data, accordionTitle } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography style={{ margin: 'auto' }}>{accordionTitle}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography><TransactionTable data={this.state.dialogTransactionData}/></Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(AccordionTable);