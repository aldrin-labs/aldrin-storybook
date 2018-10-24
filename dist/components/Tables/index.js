import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import { hexToRgbAWithOpacity } from '@styles/helpers';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
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
const Settings = withStyles((theme) => ({
    root: { color: theme.palette.common.white, padding: 0 },
}))(IconButton);
const styles = (theme) => createStyles({
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
        transition: `background-color ${theme.transitions.duration.short}ms  ${theme.transitions.easing.easeOut}`,
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
const isNumeric = (cell) => (cell !== null && typeof cell.render === 'number') ||
    typeof cell === 'number' ||
    cell.isNumber;
const renderCheckBox = ({ type, onChange, ind = -1, rows, checkedRows = [], className = '', checked = false, disabled = false, }) => type === 'expand' ? (React.createElement(Checkbox, { classes: {
        root: className.checkboxClasses,
    }, disabled: disabled, checkedIcon: React.createElement(ExpandLess, null), icon: React.createElement(ExpandMore, null), onChange: () => {
        onChange(ind);
    }, checked: checked })) : type === 'check' ? (React.createElement(Checkbox, { classes: {
        root: className.checkboxClasses,
    }, indeterminate: false, checked: checked, onChange: () => {
        onChange(ind);
    } })) : type === 'checkAll' ? (React.createElement(Checkbox, { classes: {
        indeterminate: className.indeterminate,
        root: className.root,
    }, indeterminate: rows && checkedRows.length > 0 && rows.body.length > checkedRows.length, checked: checked, onChange: onChange })) : type === 'expandAll' ? (React.createElement(Checkbox, { classes: {
        root: className.root,
    }, checkedIcon: React.createElement(ExpandLess, null), icon: React.createElement(ExpandMore, null), disabled: disabled, checked: checked, onChange: onChange })) : null;
const renderCell = (cell, id, numeric) => {
    if (cell !== null && typeof cell === 'object') {
        return (React.createElement(CustomTableCell, { scope: "row", variant: "body", style: Object.assign({ color: cell.color }, cell.style), key: id, numeric: numeric }, cell.render));
    }
    if (typeof cell !== 'object') {
        return (React.createElement(CustomTableCell, { scope: "row", variant: "body", numeric: numeric, key: id }, cell));
    }
    return (React.createElement(CustomTableCell, { scope: "row", variant: "body", numeric: numeric, key: id }, ''));
};
{
    /* ToDo: - Add sorting
              - Fixed  summary
              - Add settings render
              - Add Tooltips To header
            */
}
const CustomTable = (props) => {
    const { classes, padding = 'dense', rows = { head: [], body: [], footer: [] }, withCheckboxes = false, title, elevation = 0, onChange = () => {
        return;
    }, expandableRows = false, expandedRows = [], onSelectAllClick = () => {
        return;
    }, checkedRows = [], staticCheckbox = false, } = props;
    if (rows !== undefined && !Array.isArray(rows.head) && !Array.isArray(rows.body)) {
        return null;
    }
    const howManyColumns = withCheckboxes ? rows.head.length : rows.head.length - 1;
    return (React.createElement(Paper, { className: classes.root, elevation: elevation },
        React.createElement(Table, { padding: padding ? padding : 'default', className: classes.table },
            React.createElement(TableHead, null,
                title && (React.createElement(TableRow, { className: classes.headRow },
                    React.createElement(CustomTableCell, { className: classes.title, colSpan: howManyColumns },
                        React.createElement(Typography, { variant: "button", color: "secondary" }, title)),
                    React.createElement(CustomTableCell, { className: classes.title, numeric: true, colSpan: howManyColumns },
                        React.createElement(Settings, null,
                            React.createElement(MoreVertIcon, null))))),
                React.createElement(TableRow, { className: classes.headRow },
                    (withCheckboxes || expandableRows) && (React.createElement(CustomTableCell, { padding: "checkbox" }, renderCheckBox({
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
                    }))),
                    rows.head.map(cell => {
                        return (React.createElement(CustomTableCell, { style: Object.assign({}, cell.style), variant: "head", numeric: cell.isNumber, key: cell.render }, cell.render));
                    }))),
            React.createElement(TableBody, null, rows.body.map((row, ind) => {
                const selected = checkedRows.indexOf(ind) !== -1;
                const expandedRow = expandedRows.indexOf(ind) !== -1;
                const rowClassName = selected
                    ? `${classes.row} + ${classes.rowSelected}`
                    : classes.row;
                const expandable = Array.isArray(row[row.length - 1]);
                const typeOfCheckbox = withCheckboxes
                    ? 'check'
                    : expandableRows
                        ? 'expand'
                        : null;
                const checkboxClasses = staticCheckbox
                    ? `${classes.staticCheckbox} ${classes.checkbox}`
                    : classes.checkbox;
                return (React.createElement(React.Fragment, { key: ind },
                    React.createElement(TableRow, { className: rowClassName },
                        typeOfCheckbox !== null && (React.createElement(CustomTableCell, { padding: "checkbox" }, renderCheckBox({
                            onChange,
                            ind,
                            checked: withCheckboxes ? selected : expandedRow,
                            disabled: expandable &&
                                row[row.length - 1].length === 0,
                            className: { checkboxClasses, disabledExpandRow: '' },
                            type: typeOfCheckbox,
                        }))),
                        row.map((cell, cellIndex) => {
                            const numeric = isNumeric(cell);
                            // skiping rendering cell if it is array and last one
                            //  this is how we are detecting if row expandable
                            if (cellIndex === row.length - 1 && expandable) {
                                return null;
                            }
                            return renderCell(cell, cellIndex, numeric);
                        })),
                    expandable && // rendering content of expanded row if it is expandable
                        row[row.length - 1].map((collapsedRows, i) => {
                            return (React.createElement(Grow
                            // but we hiding until have an expandedRow
                            // saying to open expanded content
                            , { 
                                // but we hiding until have an expandedRow
                                // saying to open expanded content
                                in: expandedRow, key: i, unmountOnExit: true, mountOnEnter: true },
                                React.createElement(TableRow, { className: classes.rowExpanded },
                                    React.createElement(CustomTableCell, { padding: "checkbox" }),
                                    collapsedRows.map((cell, cellIndex) => {
                                        const numeric = isNumeric(cell);
                                        return renderCell(cell, cellIndex, numeric);
                                    }))));
                        })));
            })),
            Array.isArray(rows.footer) && (React.createElement(TableFooter, null,
                React.createElement(TableRow, { className: `${classes.row} ${classes.footer}` },
                    (withCheckboxes || expandableRows) && (React.createElement(CustomTableCell, { padding: "checkbox" })),
                    rows.footer.map((cell, cellIndex) => {
                        const numeric = isNumeric(cell);
                        const spreadedCell = isObject(cell) ? cell : { render: cell };
                        const footerCell = Object.assign({}, spreadedCell, { style: Object.assign({ opacity: 0.84 }, cell.style) });
                        return renderCell(footerCell, cellIndex, numeric);
                    })))))));
};
export default withStyles(styles, { withTheme: true })(CustomTable);
//# sourceMappingURL=index.js.map