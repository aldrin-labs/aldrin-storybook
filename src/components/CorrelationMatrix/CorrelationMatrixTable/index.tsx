import React, { PureComponent } from 'react'
import styled from 'styled-components'
import FaAngleRight from '@material-ui/icons/ChevronRight'
import FaAngleDown from '@material-ui/icons/ExpandMore'

import { getColorDarken } from './utils'
import {
  IProps,
  IState,
  IGridTableProps,
  ICellContentProps,
  ICellProps,
} from './types'

export class CorrelationMatrixTable extends PureComponent<IProps, IState> {

  state: IState = {
    activeRow: null,
    activeColumn: null,
  }

  onCellMouseOver = (activeRow: number, activeColumn: number) => {
    this.setState({ activeRow, activeColumn })
  }

  onMouseLeave = () => {
    this.setState({ activeRow: null, activeColumn: null })
  }

  render() {
    const { isFullscreenEnabled, data, colors, oneColor } = this.props
    const { activeRow, activeColumn } = this.state

    const cols = data.values
    const rows = data.header

    return (
      <GridTable
        isFullscreenEnabled={isFullscreenEnabled}
        onMouseLeave={this.onMouseLeave}
        rows={cols.length + 1}
        columns={cols[0].length + 1}
      >
        {/* first empty cell */}
        <HeadCell sticky={!isFullscreenEnabled} style={{ zIndex: 102 }} />

        {/* first row with coin names */}
        {rows.map((el, i) => (
          <HeadCell
            cols={cols[0].length}
            isFullscreenEnabled={isFullscreenEnabled}
            sticky={!isFullscreenEnabled}
            textColor={activeRow === i ? '#4ed8da' : '#dedede'}
            key={el}
          >
            {rows.length <= 5 && <StyledArrowDown show={activeRow === i} />}
            {el}
          </HeadCell>
        ))}

        {/* first column with coin names */}
        {rows.map((el, i) => (
          <HeadCell
            cols={cols[0].length}
            isFullscreenEnabled={isFullscreenEnabled}
            sticky={false}
            textColor={activeColumn === i ? '#4ed8da' : '#dedede'}
            style={{ gridColumnStart: 1 }}
            key={el}
          >
            {rows.length <= 5 && <StyledArrowRight show={activeColumn === i} />}{' '}
            {el}
          </HeadCell>
        ))}

        {/* content */}
        {cols.map((col, ind) =>
          col.map((el: string, i: number) => {
            const backgroundColor = getColorDarken(el, colors, oneColor, 0.8)
            const textColor = "white"
            let value = +el

            if (value < 0 && value > -0.01) {
              value = 0
            }

            return (
              <Cell
                cols={cols[0].length}
                isFullscreenEnabled={isFullscreenEnabled}
                textColor={textColor}
                onMouseOver={() => {
                  this.onCellMouseOver(i, ind)
                }}
                style={{ gridColumnStart: i + 2, gridRowStart: ind + 2 }}
                //  ETH/ETH BTC/ETH etc...
                key={`${rows[i]}/${rows[ind]}`}
              >
                <CellContent
                  color={backgroundColor}
                  active={i === activeRow && ind === activeColumn}
                >
                  {value !== 1 && <CenterText>{(value * 100).toFixed(1)}</CenterText>}
                </CellContent>
              </Cell>
            )
          })
        )}
      </GridTable>
    )
  }
}

const CenterText = styled.span``

const StyledArrowRight = styled(FaAngleRight)`
  opacity: ${(props: { show?: boolean }) => (props.show ? '1' : '0')};
  left: 0rem;
  color: #4ed8da;
  position: absolute;
  transition: opacity 0.25s ease-out;
`
const StyledArrowDown = styled(FaAngleDown)`
  opacity: ${(props: { show?: boolean }) => (props.show ? '1' : '0')};
  top: 0;
  color: #4ed8da;
  position: absolute;
  transition: opacity 0.25s ease-out;
`

const GridTable = styled.div`
  width: ${(props: IGridTableProps) => (props.isFullscreenEnabled ? 'auto' : '100%')};
  margin: ${(props: IGridTableProps) => (props.isFullscreenEnabled ? '0 auto' : '')};
  position: relative;
  right: ${(props: IGridTableProps) => (props.isFullscreenEnabled ? '5vh' : '0')};
  height: 100%;
  display: grid;
  background: ${(props: IGridTableProps) =>
    props.isFullscreenEnabled ? '#393e44' : 'transparent'};
  grid-template-rows: ${(props: IGridTableProps) =>
    props.isFullscreenEnabled
      ? `repeat(${props.rows}, ${100 / props.rows}vh)`
      : `repeat(${props.rows}, 1fr)`};
  grid-template-columns: ${(props: IGridTableProps) =>
    props.isFullscreenEnabled
      ? `repeat(${props.columns}, ${100 / props.columns}vh)`
      : `repeat(${props.columns}, 1fr)`};
`

const CellContent = styled.div`
  display: flex;
  place-content: center;
  place-items: center;
  background-color: ${(props: { color?: string, active?: boolean }) => {
    if (props.color) {
      return props.color
    }

    return 'transparent'
  }};
  padding: 0.25rem;
  width: ${(props: ICellContentProps) => (props.active ? '100%' : '97%')};
  height: ${(props: ICellContentProps) => (props.active ? '100%' : '97%')};
  border: ${(props: ICellContentProps) =>
    props.active ? '2px solid #4ed8da' : '1px solid #292d31'};
  transition: border 0.25s ease-in-out;
`
/* tslint:disable */
const Cell = styled.div`
  z-index: 100;

  font-family: Roboto, sans-serif;
  font-size: ${(props: ICellProps) => {
    const { isFullscreenEnabled, cols } = props

    if (!isFullscreenEnabled && cols > 1 && cols < 5) {
      return '2rem'
    }
    if (!isFullscreenEnabled && cols >= 5 && cols < 10) {
      return '1.5rem'
    }
    if (!isFullscreenEnabled && cols >= 10 && cols < 16) {
      return '0.7rem'
    }
    if (!isFullscreenEnabled) {
      return '0.4rem'
    }

    if (isFullscreenEnabled && cols > 1 && cols <= 10) {
      return '2.5rem'
    }
    if (isFullscreenEnabled && cols > 10 && cols <= 15) {
      return '2rem'
    }
    if (isFullscreenEnabled && cols > 15 && cols <= 20) {
      return '1rem'
    }
    if (isFullscreenEnabled && cols > 20) {
      return '0.5rem'
    }

    return '1rem'
  }};
  color: ${(props: ICellProps) => props.textColor};
  font-weight: 500;
  display: flex;
  place-content: center;
  place-items: center;
  text-align: center;
  line-height: 3rem;
  overflow: hidden;
  white-space: nowrap;
  transition: color 0.25s ease-out;
`

const HeadCell = styled(Cell)`
  z-index: 101;
  position: relative;
  position: ${(props: {sticky: boolean}) => (props.sticky ? 'sticky' : 'relative')};

  top: 0;
`

export default CorrelationMatrixTable
