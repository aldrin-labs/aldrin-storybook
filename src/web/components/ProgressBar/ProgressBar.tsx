import React, { PureComponent, memo } from 'react'
import { withStyles, withTheme } from '@material-ui/styles'

import { LinearProgressCustom } from './ProgressBar.styles'
import { IProps, IState } from './ProgressBar.types'

const styles = {
  root: {
    flexGrow: 1,
    padding: '2rem 0',
  },
}

@withTheme
class ProgressBar extends PureComponent<IProps> {
  state: IState = {
    completed: 0,
    isError: false,
    transactionsData: this.props.transactionsData,
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (state.completed !== 100) {
      const isFailedTransaction = props.transactionsData.some(
        (el) => el.isDone === 'error'
      )

      if (isFailedTransaction) {
        props.getError(isFailedTransaction)
        return {
          completed: 100,
          isError: isFailedTransaction,
          dialogTransactionData: props.transactionsData,
        }
      }

      const successfulTransactionNumber = props.transactionsData.reduce(
        (acc, el) => {
          if (el.isDone === 'closed' || el.isDone === 'filled') {
            return acc + 1
          }
          return acc
        },
        0
      )

      const progressOfComplition =
        (successfulTransactionNumber * 100) / props.transactionsData.length

      if (progressOfComplition === 100 && props.isFinished === false) {
        props.isCompleted(progressOfComplition)
      }

      return {
        completed: progressOfComplition,
        isError: false,
        dialogTransactionData: props.transactionsData,
      }
    }

    return null
  }

  render() {
    const { classes, theme, isFinished, style } = this.props

    const { completed, isError } = this.state

    return (
      <div className={classes.root} style={style}>
        <LinearProgressCustom
          color={
            isError
              ? theme.customPalette.red.main
              : completed > 0 && isFinished === false
              ? 'secondary'
              : isFinished === true
              ? 'secondary'
              : '#E7ECF3'
          }
          variant="determinate"
          value={completed}
        />
      </div>
    )
  }
}

export default withStyles(styles)(ProgressBar)
