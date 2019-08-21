import React from 'react'
import { withWidth } from '@material-ui/core'
import { compose } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Slider from '@sb/components/Slider/Slider'
import Tooltip from '@material-ui/core/Tooltip'
import { withTheme } from '@material-ui/core/styles'

import {
  StyledTypography,
  StyledSubTypography,
  StyledTypographyAccordionHeader,
  TableCellLast,
  SliderTypography,
} from './RebalanceAccordionIndex.styles'

import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

@withTheme()

class TablePanelSummary extends React.Component {
  render() {
    const {
      //classes,
      accordionPanelHeadingBorderColor,
      accordionPanelHeading,
      secondColValue,
      fourthColValue,
      value,
      handleSlideChange,
      theme,
      width,
      expanded
    } = this.props


    return (
      <Table style={{ minWidth: '700' }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ padding: '0px', width: '12vw', border: 'none' }}>
              <StyledTypographyAccordionHeader fontWeight="700">
                Portfolio
              </StyledTypographyAccordionHeader>
            </TableCell>
            <TableCell
              align="left"
              style={{ padding: '0px', width: '26vw', border: 'none' }}
            >
              <StyledTypography fontWeight="700" fontSize="1.2rem">Current value</StyledTypography>
              <StyledSubTypography color={theme.palette.text.subPrimary}>
                ${roundAndFormatNumber(+secondColValue, 2, false)}
              </StyledSubTypography>
            </TableCell>
            <TableCell
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignText: 'left',
                marginTop: '15px',
                padding: '0',
                border: 'none',
              }}
            >
              <Slider
                thumbWidth="25px"
                thumbHeight="25px"
                sliderWidth="18rem"
                sliderHeight="17px"
                sliderHeightAfter="20px"
                borderRadius="30px"
                borderRadiusAfter="30px"
                thumbBackground="#165BE0"
                borderThumb="2px solid white"
                trackAfterBackground="#E7ECF3"
                trackBeforeBackground={accordionPanelHeadingBorderColor}
                value={value}
                onChange={handleSlideChange}
                // style={{ margin: 'auto 0' }}
                disabled
              />
              <Tooltip title={`${value.toFixed(4)}%`} placement="bottom-end">
                <SliderTypography
                  fontWeight="bold"
                  color={theme.palette.text.subPrimary}
                  fontSize={`1.2rem`}
                  marginLeft="15px"
                >
                  {value.toFixed(0)}%
                </SliderTypography>
              </Tooltip>
            </TableCell>
            {/* //TODO padding for all screens */}
            <TableCellLast
              align="left"
              // style={{ border: 'none', padding: '0 120px 0 0' }}
            >
              <StyledTypography fontWeight="700" fontSize="1.2rem">Target value</StyledTypography>
              <StyledSubTypography color={theme.palette.text.subPrimary}>
                ${roundAndFormatNumber(+fourthColValue, 2, false)}
              </StyledSubTypography>
            </TableCellLast>
            <TableCell align="right">
              <ExpandMoreIcon style={{
                transform: `rotate(${expanded ? '180deg' : '0'})`
              }}/>
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    )
  }
}

// export default withStyles(styles)(TablePanelSummary)
export default withWidth()(TablePanelSummary)
