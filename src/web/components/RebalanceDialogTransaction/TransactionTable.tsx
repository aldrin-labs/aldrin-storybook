import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

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
function createData(converted, sum, fee, isSelected) {
  id += 1;
  return { id, converted, sum, fee, isSelected };
}

function TransactionTable(props) {
  const { classes, data } = props;

  const rows = data.map(item => {
    const { converted, sum, fee, isSelected } = item;
    return createData(converted, sum, fee, isSelected);
  })

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row"  style={{width: '250px', padding: '4px 15px 4px 24px'}}>
                {row.converted}
              </TableCell>
              <TableCell align="left" >{row.sum}</TableCell>
              <TableCell align="right">{row.fee}</TableCell>
              <TableCell align="right">
                <Checkbox checked={row.isSelected} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

TransactionTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionTable);