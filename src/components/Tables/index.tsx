import React, { ChangeEvent } from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import { hexToRgbAWithOpacity } from '@styles/helpers';
import styled from 'styled-components';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

import { Props, Cell, OnChange, Row, Rows, OnChangeWithEvent } from './index.types';
import { customAquaScrollBar } from '@styles/cssUtils';
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
    color: 'white',
  },
}))(TableCell);

const Settings = withStyles((theme: Theme) => ({
  root: { color: theme.palette.common.white, padding: 0 },
}))(IconButton);

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
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
    backgroundColor: hexToRgbAWithOpacity(theme.palette.primary[900], 0.45),
    '&:hover': {
      backgroundColor: hexToRgbAWithOpacity(theme.palette.primary[900], 0.45),
    },
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

const renderCell = (cell: Cell, id: number, numeric: boolean) => {
  if (cell !== null && typeof cell === 'object') {
    return (
      <CustomTableCell
        scope="row"
        variant="body"
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
      <CustomTableCell scope="row" variant="body" numeric={numeric} key={id}>
        {cell}
      </CustomTableCell>
    );
  }

  return (
    <CustomTableCell scope="row" variant="body" numeric={numeric} key={id}>
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
    return;
  }

  const howManyColumns = withCheckboxes ? rows.head.length : rows.head.length - 1;

  return (
    <Background className={classes.root} elevation={elevation}>
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
              <CustomTableCell padding="checkbox">
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
                  style={{ ...cell.style }}
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
                        disabled: expandable && row[row.length - 1].length === 0,
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
                      return;
                    }

                    return renderCell(cell, cellIndex, numeric);
                  })}
                </TableRow>
                {expandable &&
                  // rendering content of expanded row if it is expandable
                  (row[row.length - 1] as Row[]).map((collapsedRows: Row, i: number) => {
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
                  })}
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
                    opacity: 0.84,
                    ...cell.style,
                  },
                };

                return renderCell(footerCell as Cell, cellIndex, numeric);
              })}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </Background>
  );
};

const Background = styled(Paper)`
  width: 100%;
  ${customAquaScrollBar};
`;

export default withStyles(styles, { withTheme: true })(CustomTable);
