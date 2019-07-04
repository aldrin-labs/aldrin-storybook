import React from 'react'
import { withStyles, withTheme } from '@material-ui/core/styles'
import { LinearProgressCustom } from './ProgressBar.styles'

const styles = {
  root: {
    flexGrow: 1,
  },
}

@withTheme()
class ProgressBar extends React.Component {
  state = {
    completed: 0,
    isError: false,
    totalParts: 0,
    dialogTransactionData: this.props.data,
  }

  static getDerivedStateFromProps(props, state) {
    console.log(state.dialogTransactionData)
    const { completed, dialogTransactionData } = state
    if (completed !== 100) {
      if (props.data !== dialogTransactionData) {
        const isFailedTransaction = props.data.some(
          (el) => el.isDone === false
        )

        if (isFailedTransaction) {
          return {
            completed: 100,
            isError: isFailedTransaction,
            dialogTransactionData: props.data,
          }
        }

        const successfulTransactionNumber = dialogTransactionData.reduce(
          (acc, el) => {
            if (el.isDone === true) {
              return ++acc
            }
            return acc
          }
        )

        let diff = 100 / dialogTransactionData.length

        return {
          completed: Math.min(completed + diff, 100),
          isError: isFailedTransaction,
          successfulTransactionNumber,
          dialogTransactionData: props.dialogTransactionData,
        }
      } // 2nd IF
    } // 1st IF
    return null
  }

  // progress = () => {
  //   const { completed } = this.state;
  //   if (completed === 100) {
  //     this.setState({ completed: 0 });
  //   } else {
  //     const diff = Math.random() * 10;
  //     this.setState({ completed: Math.min(completed + diff, 100) });
  //   }
  // };

  render() {
    const {
      classes,
      theme: {
        palette: { green },
      },
    } = this.props
    return (
      <div className={classes.root}>
        {/* (this.state.isError) ?  */}
        <LinearProgressCustom
          color='secondary'
          height="20px"
          variant="determinate"
          value={20} //{this.state.completed}
        />
      </div>
    )
  }
}

export default withStyles(styles)(ProgressBar)
