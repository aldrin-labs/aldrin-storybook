import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import DoneIcon from '../../../icons/DoneIcon.svg'
import Cross from '../../../icons/Cross.svg'
import Spinner from '../../../icons/Spinner.svg'
import TradeIcon from '../../../icons/TradeIcon.svg'
import ProgressBar from '../ProgressBar/ProgressBar'
import SvgIcon from '../SvgIcon'
import { IProps } from './TransactionTable.types'

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
  status,
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
              <TableCell align="left">{row.sum}</TableCell>
              <TableCell align="right">
                {status === 'success' ? (
                  <SvgIcon src={DoneIcon} />
                ) : status === 'fail' ? (
                  <SvgIcon src={Cross} />
                ) : status === 'loading' ? (
                  <SvgIcon width="35px" height="35px" src={Spinner} />
                ) : null}
              </TableCell>
              {/* <TableCell align="right"> //TODO Запас, в случае работы верхнего компонента, удалить
                {row.isDone ? (
                  <SvgIcon src={DoneIcon} />
                ) : row.isDone === false ? (
                  <SvgIcon src={Cross} />
                ) : null}
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withStyles(styles)(TransactionTable)
