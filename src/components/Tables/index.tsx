import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import Paper from '@material-ui/core/Paper'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ExpandLess from '@material-ui/icons/ExpandLess'
import { fade } from '@material-ui/core/styles/colorManipulator'

import {
  Props,
  Cell,
  OnChange,
  Row,
  Rows,
  OnChangeWithEvent,
  sortTypes,
  Head,
} from './index.types'
import { isObject } from 'lodash-es'
import { Typography, IconButton, Grow, TableSortLabel } from '@material-ui/core'
import { withErrorFallback } from '../hoc/withErrorFallback/withErrorFallback'

const CustomTableCell = withStyles((theme) => ({
  head: {
    position: 'sticky',
    top: theme.spacing.unit * 4,
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.primary.dark
        : theme.palette.primary.light,
    color: fade(theme.palette.common.white, 0.66),
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
    zIndex: 100,
    color: 'white',
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.primary.dark
        : theme.palette.primary.light,
    padding: '1px 14px 1px 6px',
  },
}))(TableCell)

const Settings = withStyles((theme: Theme) => ({
  root: { color: theme.palette.common.white, padding: 0 },
}))(IconButton)

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
      backgroundColor:
        theme.palette.type === 'dark'
          ? theme.palette.grey[900]
          : theme.palette.primary.dark,
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
  })

const isNumeric = (cell: Cell) =>
  typeof cell !== 'string' &&
  ((cell !== null && typeof cell === 'number') ||
    (typeof cell !== 'number' &&
      (typeof cell.render === 'number' || cell.isNumber)))

const renderCheckBox = ({
  type,
  onChange,
  id = '',
  rows,
  checkedRows = [],
  className = '',
  checked = false,
  disabled = false,
}: {
  type: 'check' | 'expand' | 'checkAll' | 'expandAll' | null
  onChange: OnChange | OnChangeWithEvent
  id?: string
  checkedRows?: string[]
  rows?: Rows
  className?: any
  checked?: boolean
  disabled?: boolean
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
        ;(onChange as OnChange)(id)
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
        ;(onChange as OnChange)(id)
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
  ) : null

const renderCell = ({
  cell,
  id,
  numeric,
  variant = 'body',
}: {
  cell: Cell
  id: string
  numeric: boolean
  variant?: 'body' | 'footer' | 'head'
}) => {
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
    )
  }
  if (typeof cell !== 'object') {
    return (
      <CustomTableCell scope="row" variant={variant} numeric={numeric} key={id}>
        {cell}
      </CustomTableCell>
    )
  }

  return (
    <CustomTableCell scope="row" variant={variant} numeric={numeric} key={id}>
      {''}
    </CustomTableCell>
  )
}

const renderHeadCell = (
  cell: Head,
  isSortable: boolean,
  sort: sortTypes | undefined,
  column: number
) =>
  isSortable ? (
    <TableSortLabel
      active={sort!.sortColumn === column}
      direction={sort!.sortDirection}
      onClick={() => sort!.sortHandler(column)}
    >
      {cell.label}
    </TableSortLabel>
  ) : (
    cell.label
  )

const renderCells = (row: Row) => {
  const cells = []
  for (const key of Object.keys(row)) {
    // skiping rendering
    if (key === 'id' || key === 'options' || key === 'expandableContent') {
      continue
    }

    const cell = row[key]
    const numeric = isNumeric(cell)

    cells.push(
      renderCell({
        cell,
        numeric: numeric as boolean,
        id: key,
        variant: (row.options && row.options.variant) || 'body',
      })
    )
  }

  return cells
}

const renderFooterCells = (row: Row, stickyOffset: number, theme: Theme) => {
  const cells = []
  for (const key of Object.keys(row)) {
    // skiping rendering
    if (key === 'id' || key === 'options' || key === 'expandableContent') {
      continue
    }

    const cell = row[key]
    const numeric = isNumeric(cell)
    const spreadedCell = isObject(cell) ? cell : { render: cell }
    const bodyBackground =
      row.options && row.options.variant === 'body'
        ? { background: theme.palette.background.paper }
        : {}
    const style =
      typeof cell !== 'number' && typeof cell !== 'string' ? cell.style : {}
    const footerCell = {
      ...(spreadedCell as object),
      style: {
        ...bodyBackground,
        position: 'sticky',
        bottom: stickyOffset,
        ...style,
      },
    }

    cells.push(
      renderCell({
        numeric: numeric as boolean,
        cell: footerCell as Cell,
        id: key,
        variant: 'footer',
      })
    )
  }

  return cells
}

{
  /* ToDo:
            - Use reduce instead of for in loop
            - Add settings render
            - Add Tooltips To header
            - Break into files
          */
}

const CustomTable = (props: Props) => {
  const {
    classes,
    padding = 'dense',
    columnNames = [],
    withCheckboxes = false,
    title,
    elevation = 0,
    onChange = () => {
      return
    },
    expandableRows = false,
    expandedRows = [],
    onSelectAllClick = () => {
      return
    },
    checkedRows = [],
    staticCheckbox = false,
    sort,
    theme,
    data = { body: [] },
  } = props

  const isSortable = typeof sort !== 'undefined'
  if (
    data.body &&
    !Array.isArray(data.body) &&
    !Array.isArray(columnNames)
    // here you also can add check in future
    // for crashes
  ) {
    return null
  }
  const howManyColumns = withCheckboxes
    ? // space for checkbox
      columnNames.filter(Boolean).length
    : columnNames.filter(Boolean).length - 1
  //  if there is no title head must be at the top
  const isOnTop = !title ? { top: 0 } : {}

  return (
    <Paper className={classes.root} elevation={elevation}>
      <Table padding={padding ? padding : 'default'} className={classes.table}>
        <TableHead>
          {title && (
            <TableRow className={classes.headRow}>
              <CustomTableCell
                className={classes.title}
                colSpan={howManyColumns}
              >
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
                  checkedRows,
                  rows: data,
                  type: withCheckboxes ? 'checkAll' : 'expandAll',
                  checked: withCheckboxes
                    ? data && data.body.length === checkedRows.length
                    : expandedRows.length > 0,
                  onChange: onSelectAllClick,
                  className: {
                    indeterminate: classes.indeterminateCheckbox,
                    root: classes.checkbox,
                  },
                })}
              </CustomTableCell>
            )}

            {columnNames.map((column, index) => {
              return (
                <CustomTableCell
                  style={{ ...column.style, ...isOnTop }}
                  variant="head"
                  padding={column.disablePadding ? 'none' : 'default'}
                  numeric={column.isNumber}
                  key={column.id}
                >
                  {renderHeadCell(column, isSortable, sort, index)}
                </CustomTableCell>
              )
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.body.filter(Boolean).map((row) => {
            const selected = checkedRows.indexOf(row.id) !== -1

            const expandedRow = expandedRows.indexOf(row.id) !== -1
            const rowClassName = selected
              ? `${classes.row} + ${classes.rowSelected}`
              : classes.row
            const expandable = row.expandableContent
            const typeOfCheckbox: 'check' | 'expand' | null = withCheckboxes
              ? 'check'
              : expandableRows
                ? 'expand'
                : null
            const checkboxClasses = staticCheckbox
              ? `${classes.staticCheckbox} ${classes.checkbox}`
              : classes.checkbox

            return (
              <React.Fragment key={row.id}>
                <TableRow className={rowClassName}>
                  {typeOfCheckbox !== null && (
                    <CustomTableCell padding="checkbox">
                      {renderCheckBox({
                        onChange,
                        id: row.id,
                        checked: withCheckboxes ? selected : expandedRow,
                        disabled:
                          expandable &&
                          row.expandableContent &&
                          row.expandableContent.length === 0,
                        className: { checkboxClasses, disabledExpandRow: '' },
                        type: typeOfCheckbox,
                      })}
                    </CustomTableCell>
                  )}
                  {renderCells(row)}
                </TableRow>
                {expandable && // rendering content of expanded row if it is expandable
                  row!.expandableContent!.map(
                    (collapsedRows: Row, i: number) => {
                      return (
                        <Grow
                          in={expandedRow}
                          key={i}
                          unmountOnExit={true}
                          mountOnEnter={true}
                        >
                          <TableRow className={classes.rowExpanded}>
                            <CustomTableCell padding="checkbox" />
                            {renderCells(collapsedRows)}
                          </TableRow>
                        </Grow>
                      )
                    }
                  )}
              </React.Fragment>
            )
          })}
        </TableBody>
        {Array.isArray(data.footer) && (
          <TableFooter>
            {data.footer.filter(Boolean).map((row, index) => {
              const stickyOffset =
                (data.footer!.filter(Boolean).length - 1 - index) * 40
              return (
                <TableRow
                  key={index}
                  className={`${classes.row} ${classes.footer}`}
                >
                  {(withCheckboxes || expandableRows) && (
                    <CustomTableCell
                      padding="checkbox"
                      style={{
                        // temporary
                        position:
                          row.options && row.options.variant === 'body'
                            ? 'static'
                            : 'sticky',
                        bottom: stickyOffset,
                        background:
                          row.options && row.options.variant === 'body'
                            ? theme!.palette.background.paper
                            : '',
                      }}
                      variant={(row.options && row.options.variant) || 'footer'}
                    />
                  )}
                  {renderFooterCells(row, stickyOffset, theme!)}
                </TableRow>
              )
            })}
          </TableFooter>
        )}
      </Table>
    </Paper>
  )
}

export default withStyles(styles, { withTheme: true })(
  withErrorFallback(CustomTable)
)
