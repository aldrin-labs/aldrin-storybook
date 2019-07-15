import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Slider from '@sb/components/Slider/Slider'
import Tooltip from '@material-ui/core/Tooltip'

import {
  StyledTypography,
  StyledSubTypography,
  StyledTypographyAccordionHeader,
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
            <StyledTypographyAccordionHeader fontWeight="700">
              {accordionPanelHeading}
            </StyledTypographyAccordionHeader>
          </TableCell>
          <TableCell
            align="left"
            style={{ padding: '0px', width: '26vw', border: 'none' }}
          >
            <StyledTypography fontWeight="700">
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
              display: 'flex',
              justifyContent: 'flex-start',
              alignText: 'left',
              marginTop: '15px',
              padding: '0',
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
                color="#16253D"
                fontSize="12px" 
                marginLeft="15px"
              >
                {value.toFixed(0)}%
              </StyledTypography>
            </Tooltip>
          </TableCell>
          {/* //TODO padding for all screens */}
          <TableCell
            align="left"
            style={{ border: 'none', padding: '0 120px 0 0' }}
          >
            <StyledTypography fontWeight="700">Target value</StyledTypography>
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
