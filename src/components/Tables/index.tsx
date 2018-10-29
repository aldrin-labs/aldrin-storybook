import React, { ChangeEvent } from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import { hexToRgbAWithOpacity } from '../cssUtils';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

import { Props, Cell, OnChange, Row, Rows, OnChangeWithEvent } from './index.types';
import { isObject } from 'lodash-es';
import { Typography, IconButton, Grow } from '@material-ui/core';

const CustomTableCell = withStyles(theme => ({
  head: {
    position: 'sticky',
    top: theme.spacing.unit * 4,
    backgroundColor: theme.palette.primary[700],
    color: hexToRgbAWithOpacity(theme.palette.common.white, 0.66),
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
    border: 0,
    whiteSpace: 'nowrap',
    zIndex: 100,
    padding: '1px 14px 1px 6px',
  },
  body: {
    borderBottom: 'none',
    fontSize: 12,
    padding: '1px 14px 1px 6px',
  },
  footer: {
    position: 'sticky',
    bottom: 0,
    zIndex: 100,
    color: 'white',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[500],
    padding: '1px 14px 1px 6px',
  },
}))(TableCell);

const Settings = withStyles((theme: Theme) => ({
  root: { color: theme.palette.common.white, padding: 0 },
}))(IconButton);

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowX: 'auto',
      '&::-webkit-scrollbar': {
        width: '3px',
        height: '6px',
      },

      '&::-webkit-scrollbar-track': {
        background: 'rgba(45, 49, 54, 0.1)',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#4ed8da',
      },
    },
    rowExpanded: {
      height: theme.spacing.unit * 4,
      backgroundColor: theme.palette.action.selected,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    indeterminateCheckbox: {
      color: theme.palette.secondary.main,
      padding: '0',
    },
    checkbox: {
      padding: '0',
    },
    table: {},
    title: {
      backgroundColor: theme.palette.primary[900],
      position: 'sticky',
      top: 0,
    },
    staticCheckbox: {
      '&& input': {
        transition: 'none',
      },
      '&& svg': {
        transition: 'none',
      },
    },
    headRow: {
      height: theme.spacing.unit * 4,
    },
    rowSelected: {
      backgroundColor: theme.palette.action.selected,
    },
    row: {
      height: theme.spacing.unit * 4,
      transition: `background-color ${theme.transitions.duration.short}ms  ${
        theme.transitions.easing.easeOut
      }`,
      borderBottom: '0',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    footer: {
      height: theme.spacing.unit * 5,
    },
  });

const isNumeric = (cell: Cell) =>
  (cell !== null && typeof cell.render === 'number') ||
  typeof cell === 'number' ||
  cell.isNumber;

const renderCheckBox = ({
  type,
  onChange,
  ind = -1,
  rows,
  checkedRows = [],
  className = '',
  checked = false,
  disabled = false,
}: {
  type: 'check' | 'expand' | 'checkAll' | 'expandAll' | null;
  onChange: OnChange & OnChangeWithEvent;
  ind?: number;
  checkedRows?: number[];
  rows?: Rows;
  className?: any;
  checked?: boolean;
  disabled?: boolean;
}) =>
  type === 'expand' ? (
    <Checkbox
      classes={{
        root: className.checkboxClasses,
      }}
      disabled={disabled}
      checkedIcon={<ExpandLess />}
      icon={<ExpandMore />}
      onChange={() => {
        onChange(ind);
      }}
      checked={checked}
    />
  ) : type === 'check' ? (
    <Checkbox
      classes={{
        root: className.checkboxClasses,
      }}
      indeterminate={false}
      checked={checked}
      onChange={() => {
        onChange(ind);
      }}
    />
  ) : type === 'checkAll' ? (
    <Checkbox
      classes={{
        indeterminate: className.indeterminate,
        root: className.root,
      }}
      indeterminate={
        rows && checkedRows.length > 0 && rows.body.length > checkedRows.length
      }
      checked={checked}
      onChange={onChange as OnChangeWithEvent}
    />
  ) : type === 'expandAll' ? (
    <Checkbox
      classes={{
        root: className.root,
      }}
      checkedIcon={<ExpandLess />}
      icon={<ExpandMore />}
      disabled={disabled}
      checked={checked}
      onChange={onChange as OnChangeWithEvent}
    />
  ) : null;

const renderCell = (
  cell: Cell,
  id: number,
  numeric: boolean,
  variant: 'body' | 'footer' | 'head' = 'body',
) => {
  if (cell !== null && typeof cell === 'object') {
    return (
      <CustomTableCell
        scope="row"
        variant={variant}
        style={{ color: cell.color, ...cell.style }}
        key={id}
        numeric={numeric}
      >
        {cell.render}
      </CustomTableCell>
    );
  }
  if (typeof cell !== 'object') {
    return (
      <CustomTableCell scope="row" variant={variant} numeric={numeric} key={id}>
        {cell}
      </CustomTableCell>
    );
  }

  return (
    <CustomTableCell scope="row" variant={variant} numeric={numeric} key={id}>
      {''}
    </CustomTableCell>
  );
};
{
  /* ToDo: - Add sorting
            - Fixed  summary
            - Add settings render
            - Add Tooltips To header
          */
}

const CustomTable = (props: Props) => {
  const {
    classes,
    padding = 'dense',
    rows = { head: [], body: [], footer: [] },
    withCheckboxes = false,
    title,
    elevation = 0,
    onChange = () => {
      return;
    },
    expandableRows = false,
    expandedRows = [],
    onSelectAllClick = () => {
      return;
    },
    checkedRows = [],
    staticCheckbox = false,
  } = props;
  if (rows !== undefined && !Array.isArray(rows.head) && !Array.isArray(rows.body)) {
    return null;
  }

  const howManyColumns = withCheckboxes ? rows.head.length : rows.head.length - 1;
  //  if there is no title head must be at the top
  const isOnTop = !title ? { top: 0 } : {};

  return (
    <Paper className={classes.root} elevation={elevation}>
      <Table padding={padding ? padding : 'default'} className={classes.table}>
        <TableHead>
          {title && (
            <TableRow className={classes.headRow}>
              <CustomTableCell className={classes.title} colSpan={howManyColumns}>
                <Typography variant="button" color="secondary">
                  {title}
                </Typography>
              </CustomTableCell>
              <CustomTableCell
                className={classes.title}
                numeric={true}
                colSpan={howManyColumns}
              >
                <Settings>
                  <MoreVertIcon />
                </Settings>
              </CustomTableCell>
            </TableRow>
          )}
          <TableRow className={classes.headRow}>
            {(withCheckboxes || expandableRows) && (
              <CustomTableCell padding="checkbox" style={{ ...isOnTop }}>
                {renderCheckBox({
                  rows,
                  checkedRows,
                  type: withCheckboxes ? 'checkAll' : 'expandAll',
                  checked: withCheckboxes
                    ? rows && rows.body.length === checkedRows.length
                    : expandedRows.length > 0,
                  onChange: onSelectAllClick,
                  className: {
                    indeterminate: classes.indeterminateCheckbox,
                    root: classes.checkbox,
                  },
                })}
              </CustomTableCell>
            )}

            {rows.head.map(cell => {
              return (
                <CustomTableCell
                  style={{ ...cell.style, ...isOnTop }}
                  variant="head"
                  numeric={cell.isNumber}
                  key={cell.render}
                >
                  {cell.render}
                </CustomTableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.body.map((row, ind: number) => {
            const selected = checkedRows.indexOf(ind) !== -1;
            const expandedRow = expandedRows.indexOf(ind) !== -1;
            const rowClassName = selected
              ? `${classes.row} + ${classes.rowSelected}`
              : classes.row;
            const expandable = Array.isArray(row[row.length - 1]);
            const typeOfCheckbox: 'check' | 'expand' | null = withCheckboxes
              ? 'check'
              : expandableRows
                ? 'expand'
                : null;
            const checkboxClasses = staticCheckbox
              ? `${classes.staticCheckbox} ${classes.checkbox}`
              : classes.checkbox;

            return (
              <React.Fragment key={ind}>
                <TableRow className={rowClassName}>
                  {typeOfCheckbox !== null && (
                    <CustomTableCell padding="checkbox">
                      {renderCheckBox({
                        onChange,
                        ind,
                        checked: withCheckboxes ? selected : expandedRow,
                        disabled:
                          expandable &&
                          ((row[row.length - 1] as unknown) as Row[]).length === 0,
                        className: { checkboxClasses, disabledExpandRow: '' },
                        type: typeOfCheckbox,
                      })}
                    </CustomTableCell>
                  )}

                  {row.map((cell, cellIndex: number) => {
                    const numeric = isNumeric(cell);

                    // skiping rendering cell if it is array and last one
                    //  this is how we are detecting if row expandable
                    if (cellIndex === row.length - 1 && expandable) {
                      return null;
                    }

                    return renderCell(cell, cellIndex, numeric);
                  })}
                </TableRow>
                {expandable && // rendering content of expanded row if it is expandable
                  ((row[row.length - 1] as unknown) as Row[]).map(
                    (collapsedRows: Row, i: number) => {
                      return (
                        <Grow
                          // but we hiding until have an expandedRow
                          // saying to open expanded content
                          in={expandedRow}
                          key={i}
                          unmountOnExit={true}
                          mountOnEnter={true}
                        >
                          <TableRow className={classes.rowExpanded}>
                            <CustomTableCell padding="checkbox" />
                            {collapsedRows.map((cell: Cell, cellIndex: number) => {
                              const numeric = isNumeric(cell);

                              return renderCell(cell, cellIndex, numeric);
                            })}
                          </TableRow>
                        </Grow>
                      );
                    },
                  )}
              </React.Fragment>
            );
          })}
        </TableBody>
        {Array.isArray(rows.footer) && (
          <TableFooter>
            <TableRow className={`${classes.row} ${classes.footer}`}>
              {(withCheckboxes || expandableRows) && (
                <CustomTableCell padding="checkbox" />
              )}
              {rows.footer.map((cell, cellIndex) => {
                const numeric = isNumeric(cell);

                const spreadedCell = isObject(cell) ? cell : { render: cell };

                const footerCell = {
                  ...(spreadedCell as object),
                  style: {
                    ...cell.style,
                  },
                };

                return renderCell(footerCell as Cell, cellIndex, numeric, 'footer');
              })}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </Paper>
  );
};

export default withStyles(styles, { withTheme: true })(CustomTable);
