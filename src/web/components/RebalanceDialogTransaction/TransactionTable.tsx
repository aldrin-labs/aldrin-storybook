import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Table, TableBody, TableCell, TableRow } from '@material-ui/core'
import ProgressBar from '@sb/components/ProgressBar/ProgressBar'
import SvgIcon from '../SvgIcon'
import { IProps } from './TransactionTable.types'

import {
  TransactionTablePrice,
  TransactionTableCoin,
  TransactionTableResult,
  TransactionTableStatus,
} from './TransactionTable.styles'

import DoneIcon from '../../../icons/DoneIcon.svg'
import Cross from '../../../icons/Cross.svg'
import Spinner from '../../../icons/Spinner.svg'
import TradeIcon from '../../../icons/TradeIcon.svg'

import { Loading } from '@sb/components/index'

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
  showLoader,
}: IProps) => {
  let loaderExists = false

  return (
    <>
      <ProgressBar
        isCompleted={isCompleted}
        getError={getError}
        transactionsData={transactionsData}
        isFinished={isFinished}
        style={{
          padding: 0,
          marginBottom: '1.5rem',
        }}
      />
      <Table className={classes.table}>
        <TableBody>
          {transactionsData.map((row, index) => {
            const symbol = row.sum.slice(
              parseFloat(row.sum).toString().length + 1
            )
            const sum =
              symbol === row.convertedTo
                ? (parseFloat(row.sum) * row.convertedToPrice) /
                  row.convertedFromPrice
                : parseFloat(row.sum)

            // How much will user receive after exchange in convertedTo coin
            const convertedSum =
              (sum * row.convertedFromPrice) / row.convertedToPrice
            const convertedSumUSDT = convertedSum * row.convertedToPrice

            return (
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                  style={{
                    width: '250px',
                    padding: '.4rem 1.5rem .4rem 2.4rem',
                  }}
                >
                  <Grid container alignItems="flex-start" wrap="nowrap">
                    <TransactionTableCoin>
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {parseFloat(sum.toFixed(6))} {row.convertedFrom}
                      </span>
                      <TransactionTablePrice>
                        ${parseFloat(row.convertedFromPrice.toFixed(8))}
                      </TransactionTablePrice>
                    </TransactionTableCoin>
                    {
                      <SvgIcon
                        width={20}
                        height={10}
                        src={TradeIcon}
                        style={{ margin: '.2rem .5rem 0' }}
                      />
                    }
                    <TransactionTableCoin>
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {parseFloat(convertedSum.toFixed(6))} {row.convertedTo}
                      </span>
                      <TransactionTablePrice>
                        ${parseFloat(row.convertedToPrice.toFixed(8))}
                      </TransactionTablePrice>
                    </TransactionTableCoin>
                  </Grid>
                </TableCell>
                <TableCell align="left" style={{ paddingRight: '10px' }}>
                  <TransactionTableResult>
                    ${parseFloat(convertedSumUSDT.toFixed(1))}
                  </TransactionTableResult>
                </TableCell>
                <TableCell
                  align="left"
                  className={classes.cell}
                  style={{ minWidth: '18rem' }}
                >
                  <TransactionTableStatus>
                    {row.isDone === 'success'
                      ? 'order executed'
                      : row.isDone === 'fail'
                      ? 'unsuccessful'
                      : row.isDone === 'loading'
                      ? 'order placed'
                      : null}
                  </TransactionTableStatus>
                </TableCell>
                <TableCell align="right" style={{ position: 'relative' }}>
                  {row.isDone === 'success' ? (
                    <SvgIcon src={DoneIcon} />
                  ) : row.isDone === 'fail' ? (
                    <SvgIcon src={Cross} />
                  ) : (showLoader || row.isDone === 'loading') &&
                    !loaderExists ? (
                    (loaderExists = true && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '17px',
                          right: '20px',
                          height: '24px',
                          width: '24px',
                        }}
                      >
                        <Loading size={24} />
                      </div>
                    ))
                  ) : null}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default withStyles(styles)(TransactionTable)
