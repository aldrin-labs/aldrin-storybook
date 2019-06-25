import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DoneIcon from '../../../icons/DoneIcon.svg'
import TradeIcon from '../../../icons/TradeIcon.svg'
import ProgressBar from '../ProgressBar/ProgressBar'
import SvgIcon from '../SvgIcon'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 500,
  },
});

let id = 0;
function createData(convertedFrom, convertedTo, sum, isDone) {
  id += 1;
  return { id, convertedFrom, convertedTo, sum, isDone };
}

function TransactionTable(props) {
  const { classes, data } = props;

  const rows = data.map(item => {
    const { convertedFrom, convertedTo, sum, isDone } = item;
    return createData(convertedFrom, convertedTo, sum, isDone);
  })

  return (
    // <Paper className={classes.root}>
    <>
      <ProgressBar />
      <Table className={classes.table}>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row"  style={{width: '250px', padding: '4px 15px 4px 24px'}}>
                {row.convertedFrom} {<SvgIcon  width='20' height='10'  src={TradeIcon} />} {row.convertedTo}
              </TableCell>
              <TableCell align="left" >{row.sum}</TableCell>
              <TableCell align="right">
          
                {(row.isDone) ? (<SvgIcon src={DoneIcon} />) : (``)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </>
    // </Paper>
  );
}

TransactionTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionTable);