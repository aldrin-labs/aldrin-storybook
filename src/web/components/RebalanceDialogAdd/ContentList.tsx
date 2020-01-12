import React from 'react'
import { withStyles } from '@material-ui/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import DoneIcon from '../../../icons/DoneIcon.svg'
import TradeIcon from '../../../icons/TradeIcon.svg'
import ProgressBar from '../ProgressBar/ProgressBar'
import Checkbox from '@material-ui/core/Checkbox'
import Radio from '@material-ui/core/Radio'
import SvgIcon from '../SvgIcon'
import { IProps } from './ContentList.types'

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

function ContentList({ classes, data, isSelected, handleRadioBtn }: IProps) {
  //const isSelected = true;
  const rows = data.map((item) => {
    const { categoryName } = item
    return { categoryName }
  })

  return (
    <>
      <Table className={classes.table}>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell
                component="th"
                scope="row"
                style={{ width: '250px', padding: '4px 15px 4px 24px' }}
              >
                {row.categoryName}
              </TableCell>
              <TableCell align="right">
                ...
                <Radio checked={isSelected} onClick={() => handleRadioBtn()} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withStyles(styles)(ContentList)
