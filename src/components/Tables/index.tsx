import React, { memo } from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell, { Padding } from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ExpandLess from '@material-ui/icons/ExpandLess'
import { fade } from '@material-ui/core/styles/colorManipulator'

import {
  Props,
  Cell,
  OnChange,
  Row,
  Data,
  OnChangeWithEvent,
  sortTypes,
  Head,
  NotExpandableRow,
  renderCellType,
  Pagination,
} from './index.types'
import { isObject } from 'lodash-es'
import {
  Typography,
  IconButton,
  Grow,
  TableSortLabel,
  TablePagination,
} from '@material-ui/core'
import { withErrorFallback } from '../hoc/withErrorFallback/withErrorFallback'
import withStandartSettings from './withStandartSettings/withStandartSettings'
import withPagination from './withPagination/withPagination'

const CustomTableCell = withStyles((theme) => ({
  head: {
    position: 'sticky',
    top: theme.spacing.unit * 4,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: 'bold',
    border: 0,
    whiteSpace: 'nowrap',
    zIndex: 100,
    padding: '0.125rem 1rem 0.125rem  0.375rem',
  },
  body: {
    color: theme.palette.text.primary,
    borderBottom: 'none',
    fontSize: 14,
    padding: '0.125rem 1rem 0.125rem  0.375rem',
  },
  footer: {
    fontSize: 14,
    zIndex: 100,
    backgroundColor: theme.palette.primary.dark,
    padding: '0.125rem 1rem 0.125rem  0.375rem',
  },
  paddingDense: {
    padding: '1px 0.25rem 1px 0.25rem',
    '&:last-child': {
      padding: '1px 0.5rem 1px 0.25rem',
    },
  },
  paddingNone: {
    padding: '0',
    '&:last-child': {
      padding: '0',
    },
  },
}))(TableCell)

const ActionButton = withStyles(() => ({
  root: { padding: 0 },
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
        background: theme.palette.background.paper,
      },
      '&::-webkit-scrollbar-thumb': {
        background:
          theme.palette.type === 'dark'
            ? theme.palette.primary.main
            : theme.palette.secondary.main,
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
      color: theme.palette.primary.main,
      padding: '0',
    },
    checkbox: {
      padding: '0',
    },
    table: {},
    title: {
      color: theme.typography.title.color,
      backgroundColor: theme.palette.primary.light,
      position: 'sticky',
      top: 0,
      fontSize: 16,
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
      height: theme.spacing.unit * 4,
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
  checkedRows?: ReadonlyArray<string>
  rows?: Data
  className?: any
  checked?: boolean
  disabled?: boolean | '' | 0
}) =>
  type === 'expand' ? (
    <Checkbox
      classes={{
        root: className.checkboxClasses,
      }}
      disabled={Boolean(disabled)}
      checkedIcon={<ExpandLess />}
      icon={<ExpandMore />}
      onChange={() => {
        ;(onChange as OnChange)(id)
      }}
      color="default"
      checked={checked}
    />
  ) : type === 'check' ? (
    <Checkbox
      classes={{
        root: className.checkboxClasses,
      }}
      color="default"
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
      color="default"
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
      color="default"
      checkedIcon={<ExpandLess />}
      icon={<ExpandMore />}
      disabled={Boolean(disabled)}
      checked={checked}
      onChange={onChange as OnChangeWithEvent}
    />
  ) : null

const renderCell = ({
  cell,
  id,
  numeric,
  variant = 'body',
  padding = 'default',
}: renderCellType) => {
  if (cell !== null && typeof cell === 'object') {
    return (
      <CustomTableCell
        scope="row"
        variant={variant}
        style={{ color: cell.color, ...cell.style }}
        key={id}
        padding={padding}
        numeric={numeric}
      >
        {cell.render}
      </CustomTableCell>
    )
  }
  if (typeof cell !== 'object') {
    return (
      <CustomTableCell
        padding={padding}
        scope="row"
        variant={variant}
        numeric={numeric}
        key={id}
      >
        {cell}
      </CustomTableCell>
    )
  }

  return (
    <CustomTableCell
      padding={padding}
      scope="row"
      variant={variant}
      numeric={numeric}
      key={id}
    >
      {''}
    </CustomTableCell>
  )
}

const renderHeadCell = ({
  cell,
  isSortable,
  sort,
}: {
  cell: Head
  isSortable: boolean
  sort: sortTypes | undefined
}) =>
  isSortable ? (
    <TableSortLabel
      active={sort!.sortColumn === cell.id}
      direction={sort!.sortDirection}
      onClick={() => sort!.sortHandler(cell.id)}
    >
      {cell.label}
    </TableSortLabel>
  ) : (
    cell.label
  )

const renderCells = ({
  row,
  renderCellObject,
  padding,
}: {
  row: NotExpandableRow
  renderCellObject?: (cell: Cell, key: string) => renderCellType
  padding?: Padding
}) => {
  const reduce = Object.keys(row)
    .map((key) => {
      if (key === 'id' || key === 'options' || key === 'expandableContent') {
        return null
      }

      const cell = row[key]
      const numeric = isNumeric(cell)

      const renderCellArg = renderCellObject
        ? renderCellObject(cell, key)
        : {
            cell,
            numeric: numeric as boolean,
            id: key,
            variant: (row.options && row.options.variant) || 'body',
            padding: padding ? padding : 'default',
          }

      return renderCell(renderCellArg)
    })
    .filter(Boolean)

  return reduce
}

const renderFooterCells = ({
  row,
  stickyOffset,
  theme,
  padding,
}: {
  row: NotExpandableRow
  stickyOffset: number
  theme: Theme
  padding?: Padding
}) => {
  const setFooterCellObject = (cell: Cell, key: string) => {
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
        position: row.options && row.options.static ? 'static' : 'sticky',
        bottom: stickyOffset,
        ...style,
      },
    }
    const variant: 'footer' | 'body' = 'footer'

    return {
      padding,
      numeric: numeric as boolean,
      cell: footerCell as Cell,
      id: key,
      variant: variant,
    }
  }

  return renderCells({ row, renderCellObject: setFooterCellObject })
}

const addPagination = (data: ReadonlyArray<any> = [], pagination: Pagination) =>
  data.slice(
    pagination!.page * pagination!.rowsPerPage,
    pagination!.page * pagination!.rowsPerPage + pagination!.rowsPerPage
  )

{
  /* ToDo:
            - Add settings render
            - Add Tooltips To header
            - Break into files
          */
}

const CustomTable = (props: Props) => {
  const defaultRowsPerPage: 10 | 25 | 100 = 100

  const {
    classes,
    padding = 'default',
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
    pagination = {
      rowsPerPage: defaultRowsPerPage,
      page: 0,
      handleChangePage: () => {
        return
      },
      handleChangeRowsPerPage: () => {
        return
      },
    },
    actions = [],
    actionsColSpan = 1,
    borderBottom = false,
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
  const howManyColumns =
    withCheckboxes || expandableRows
      ? // space for checkbox
        (columnNames as ReadonlyArray<any>).filter(Boolean).length + 1
      : (columnNames as ReadonlyArray<any>).filter(Boolean).length

  //  if there is no title head must be at the top
  const isOnTop = !title ? { top: 0 } : {}

  return (
    <Paper className={classes.root} elevation={elevation}>
      <Table padding={padding ? padding : 'default'} className={classes.table}>
        <TableHead>
          {title && (
            <TableRow className={classes.headRow}>
              <CustomTableCell
                padding="default"
                className={classes.title}
                colSpan={howManyColumns - actionsColSpan}
              >
                <Typography
                  style={{ fontSize: 16, textTransform: 'none' }}
                  variant="button"
                  color="default"
                >
                  {title}
                </Typography>
              </CustomTableCell>
              <CustomTableCell
                padding="default"
                colSpan={actionsColSpan}
                className={classes.title}
                numeric={true}
              >
                {actions.map((action) => (
                  <ActionButton
                    color={action.color || 'default'}
                    key={action.id}
                    onClick={action.onClick}
                  >
                    {action.icon}
                  </ActionButton>
                ))}
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

            {(columnNames as ReadonlyArray<Head>).map((column) => {
              return (
                <CustomTableCell
                  style={{ ...column.style, ...isOnTop }}
                  variant="head"
                  padding={column.disablePadding ? 'none' : padding}
                  numeric={column.isNumber}
                  key={column.id}
                >
                  {renderHeadCell({ isSortable, sort, cell: column })}
                </CustomTableCell>
              )
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {addPagination(
            data.body.filter(Boolean).map((row) => {
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
                  <TableRow
                    style={
                      borderBottom
                        ? {
                            borderBottom: `1px solid ${fade(
                              theme!.palette.divider,
                              0.5
                            )}`,
                          }
                        : {}
                    }
                    className={rowClassName}
                  >
                    {typeOfCheckbox !== null && (
                      <CustomTableCell padding="checkbox">
                        {renderCheckBox({
                          onChange,
                          id: row.id,
                          checked: withCheckboxes ? selected : expandedRow,
                          disabled:
                            expandable &&
                            row.expandableContent &&
                            (row.expandableContent as ReadonlyArray<
                              NotExpandableRow
                            >).length === 0,
                          className: { checkboxClasses, disabledExpandRow: '' },
                          type: typeOfCheckbox,
                        })}
                      </CustomTableCell>
                    )}
                    {renderCells({ row, padding })}
                  </TableRow>
                  {expandable && // rendering content of expanded row if it is expandable
                    (row!.expandableContent! as ReadonlyArray<
                      NotExpandableRow
                    >).map((collapsedRows: Row, i: number) => {
                      return (
                        <Grow
                          in={expandedRow}
                          key={i}
                          unmountOnExit={true}
                          mountOnEnter={true}
                        >
                          <TableRow className={classes.rowExpanded}>
                            <CustomTableCell padding="checkbox" />
                            {renderCells({ padding, row: collapsedRows })}
                          </TableRow>
                        </Grow>
                      )
                    })}
                </React.Fragment>
              )
            }),
            pagination
          )}
        </TableBody>
        {Array.isArray(data.footer) && (
          <TableFooter>
            {data.footer.filter(Boolean).map((row, index) => {
              const stickyOffset =
                ((data.footer!.filter(Boolean).length - 1 - index) * 32) - (data.footer.length - index + 1)
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
                          row.options && row.options.static
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

                  {renderFooterCells({
                    row,
                    stickyOffset,
                    padding,
                    theme: theme!,
                  })}
                </TableRow>
              )
            })}
          </TableFooter>
        )}
      </Table>

      <Grow
        // only show paginations
        // when there is more rows then
        // we can display on 1 page
        in={data.body.length > pagination.rowsPerPage}
        mountOnEnter
        unmountOnExit
      >
        <>
          <TablePagination
            component="div"
            count={data.body.length}
            rowsPerPage={pagination.rowsPerPage}
            page={pagination.page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            rowsPerPageOptions={[10, 50, 100, 200]}
            onChangePage={pagination.handleChangePage}
            onChangeRowsPerPage={pagination.handleChangeRowsPerPage}
          />
        </>
      </Grow>
    </Paper>
  )
}

// rewrite with hooks
export default withStyles(styles, { withTheme: true })(
  withErrorFallback(withStandartSettings(withPagination(memo(CustomTable))))
)
