import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Slider from '../Slider/Slider'
import Tooltip from '@material-ui/core/Tooltip'
import TooltipCustom from '../TooltipCustom/TooltipCustom'

import {
  TypographyCustom,
  ExpansionPanelWrapper,
  StyledTypography,
  StyledSubTypography,
  GridItemHeadingCustom,
  GridFlex,
} from './RebalanceAccordionIndex.styles'

import Paper from '@material-ui/core/Paper'

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
})

function TablePanelSummary(props) {
  const {
    classes,
    accordionPanelHeadingBorderColor,
    accordionPanelHeading,
    secondColValue,
    fourthColValue,
    percentage,
    value,
    handleSlideChange,
  } = props

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell
            style={{ padding: '0px', width: '12vw', border: 'none' }}
          >
            <StyledTypography
              style={{
                textAlign: 'left',
                fontSize: '14px',
                borderLeft: '5px solid orange',
                borderRadius: '3px 0 3px 0',
                paddingLeft: '24px',
              }}
            >
              {accordionPanelHeading}
            </StyledTypography>
          </TableCell>
          <TableCell
            align="left"
            style={{ padding: '0px', width: '26vw', border: 'none' }}
          >
            <StyledTypography
              style={
                {
                  /*marginLeft: '75px'*/
                }
              }
            >
              Current value
            </StyledTypography>
            <StyledSubTypography
              color="#16253D" //{black.custom}
            >
              ${secondColValue}
            </StyledSubTypography>
          </TableCell>
          <TableCell
            style={{
              padding: '0 0 0 3px',
              display: 'flex',
              justifyContent: 'flex-start',
              alignContent: 'left',
              marginTop: '15px',
              //width: '13vw',
              border: 'none',
            }}
          >
            <Slider
              thumbWidth="25px"
              thumbHeight="25px"
              sliderWidth="125px"
              sliderHeight="17px"
              sliderHeightAfter="20px"
              borderRadius="30px"
              borderRadiusAfter="30px"
              thumbBackground="blue"
              borderThumb="2px solid white"
              trackAfterBackground="#E7ECF3"
              trackBeforeBackground={accordionPanelHeadingBorderColor}
              value={value}
              onChange={handleSlideChange}
              style={{ margin: 'auto 0' }}
              disabled
            />
            <Tooltip title={`${value.toFixed(4)}%`} placement="bottom-end">
              <StyledTypography
                fontWeight="bold"
                fontSize="16px"
                marginLeft="15px"
              >
                {value.toFixed(0)}%
              </StyledTypography>
            </Tooltip>
          </TableCell>
          <TableCell
            align="left"
            style={{ border: 'none', padding: '0px 61px 0px 0px' }}
          >
            <StyledTypography style={{}}>Target value</StyledTypography>
            <StyledSubTypography
              color="#16253D" //{black.custom}
            >
              ${fourthColValue}
            </StyledSubTypography>
          </TableCell>
          <TableCell align="right" />
        </TableRow>
      </TableHead>
    </Table>
  )
}

export default withStyles(styles)(TablePanelSummary)
