import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import ProgressBar from '@sb/components/ProgressBar/ProgressBar'
import SvgIcon from '../SvgIcon'
import { IProps } from './TransactionTable.types'

import DoneIcon from '../../../icons/DoneIcon.svg'
import Cross from '../../../icons/Cross.svg'
import Spinner from '../../../icons/Spinner.svg'
import TradeIcon from '../../../icons/TradeIcon.svg'

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 500,
  },
})

const TransactionTable = ({
  classes,
  transactionsData,
  getError,
  isCompleted,
  isFinished,
}: IProps) => {
  return (
    <>
      <ProgressBar
        isCompleted={isCompleted}
        getError={getError}
        transactionsData={transactionsData}
        isFinished={isFinished}
      />
      <Table className={classes.table}>
        <TableBody>
          {transactionsData.map((row, index) => (
            <TableRow key={index}>
              <TableCell
                component="th"
                scope="row"
                style={{ width: '250px', padding: '4px 15px 4px 24px' }}
              >
                {row.convertedFrom}
                {<SvgIcon width="20" height="10" src={TradeIcon} />}{' '}
                {row.convertedTo}
              </TableCell>
              <TableCell align="left">{`!** `}{row.sum}</TableCell>
              <TableCell align="right">
                {row.isDone === 'success' ? (
                  <SvgIcon src={DoneIcon} />
                ) : row.isDone === 'fail' ? (
                  <SvgIcon src={Cross} />
                ) : row.isDone === 'loading' ? (
                  <SvgIcon width="35px" height="35px" src={Spinner} />
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withStyles(styles)(TransactionTable)
