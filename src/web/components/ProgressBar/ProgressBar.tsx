import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
  },
};

//TODO: just mock data
const dialogTransactionData = [
      {
        convertedFrom:'0.01BTC',
        convertedTo:'6.234ETH', 
        sum: '$68.5',
        isDone: true
      },
      {
        convertedFrom:'0.01BTC',
        convertedTo:'6.234ETH',                   
        sum: '$68.5',
        isDone: true
      },
      {
        convertedFrom:'0.01BTC',
        convertedTo:'6.234ETH',
        sum: '$68.5',
        isDone: null
      },
      {
        convertedFrom:'0.01BTC',
        convertedTo:'6.234ETH',
        sum: '$68.5',
        isDone: null
      }
    ];

    //TODO: just mock data end
    

  // Test variables
  //let isError = false;
  let  diff = 0;
  let  totalParts = 0;
  let  addParts = 1;
  let successfulTransactionNumber = 0;
  let prevTransactionNumber =  0;

class ProgressBar extends React.Component {
  state = {
    completedProgress: 0,
    isError: false,
    addParts: 0,
    //successfulTransactionNumber: 0
    dialogTransactionData: []
  };
  
  // static getDerivedStateFromProps(props, state) {
  //   if (props.successfulTransactionNumber !== state.successfulTransactionNumber) {
  //     return {
  //       completedProgress: props.completedProgress,
  //       successfulTransactionNumber: props.successfulTransactionNumber
  //     };
  //   }
  //   return null;
  // }


processProgress = () => {
    const {data} = this.props;
    this.setState({dialogTransactionData: data});
    if (totalParts <= 0 ) totalParts = this.state.dialogTransactionData.length;

    data.forEach(item => {
      if(item.isDone == true) {
        this.setState({
          addParts: this.state.addParts + 1 
        });
      }
      this.state.isError = true;
    });

    this.progress(totalParts, this.state.addParts)

   // this.timer = setInterval(this.progress(totalParts, addParts), 1000);
  }


 progress = (totalParts, addParts) => { // Diff - number of parts to load
  
    const { completedProgress } = this.state;
    let diff = completedProgress;
      
    if (completedProgress === 100) { // Если дошли до 100% тогда обнуляем бар
      this.setState({ completedProgress: 0 }); 
    } else {
      diff = diff + (totalParts/100)*addParts;
      this.setState({ completedProgress: Math.min(completedProgress + diff, 100) });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <LinearProgress color="primary" variant={(this.state.isError) ? ("determinate") : ("primary")} value={this.state.completedProgress} />
      </div>
    );
  }
}

export default withStyles(styles)(ProgressBar);