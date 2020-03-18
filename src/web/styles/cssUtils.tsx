import React from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import { Grid, Card, Theme, LinearProgress } from '@material-ui/core'
import { GridProps } from '@material-ui/core/Grid'

import { CSS_CONFIG } from '@sb/config/cssConfig'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

export const customAquaScrollBar = css`
  &::-webkit-scrollbar {
    width: ${({ scrollBarWidth }: { scrollBarWidth?: number }) =>
      scrollBarWidth ? `${scrollBarWidth}px` : '3px'};
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(39, 39, 45);
  }
`

export const borderRadiusScrollBar = css`
  &::-webkit-scrollbar-track {
    margin: calc(3rem + 11px) 0 11px 0;
    border-bottom-right-radius: 10px;
  }
`

export const TypographyFullWidth = styled(({ textColor, ...rest }) => (
  <TypographyWithCustomColor {...rest} />
))`
  width: 100%;
  flex-grow: 1;
  font-family: 'DM Sans', sans-serif;
  font-size: ${(props) => props.fontSize || `1.2rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#ABBAD1'};
  padding: 0 1rem;
`

export const PTWrapper = styled(({ tableData, ...rest }) => <Card {...rest} />)`
  grid-column: 2;
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 3.2rem)' : '100%'};
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 2.4rem auto;
  padding: 1.6rem 0;
  height: calc(100vh - 130px);
  overflow-y: auto;
  @media (max-width: 840px) {
    margin: 2.4rem auto;
  }

  @media (max-width: 550px) {
    width: calc(100% - 90px);
    margin: 1rem auto;
  }

  @media (max-width: 425px) {
    width: calc(100% - 20px);
  }
`

export const Container = styled(Grid as React.FunctionComponent<GridProps>)`
  && {
    height: calc(100vh - ${CSS_CONFIG.navBarHeight}px);
    margin: 0;
    width: 100%;
  }
`

export const LegendContainer = styled.div`
  border-radius: 5px;
  position: absolute;
  font-family: ${(props: { fontFamily: string }) => props.fontFamily};
  background-color: #869eb180;
  top: ${({ top }: { top: number }) => (top ? `${top}` : 0)};
  left: ${({ left }: { left: number }) => (left ? `${left}` : '')};
  right: ${({ right }: { right: number }) => (right ? `${right}` : '')};
  color: ${(props: { color: string }) => props.color};
  transition: opacity 0.25s ease-out;
`

export const SelectR = styled(ReactSelectComponent)`
  font-family: DM Sans;
  width: 100%;
  font-size: 16px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  & input {
    opacity: 1 !important;
  }
`

export const Icon = styled.i`
  margin-right: -1px;
`

export const chooseRed = (theme: Theme) =>
  theme.palette.type === 'dark'
    ? theme.palette.red.main
    : theme.palette.red.dark
export const chooseGreen = (theme: Theme) =>
  theme.palette.type === 'dark'
    ? theme.palette.green.main
    : theme.palette.green.dark

export const CentredContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const ChartSelectStyles = css`
  border: 2px solid ${(props: { border: string }) => props.border};
  padding: 0 16px;
  height: 38px;
  place-content: center;
  display: flex;
  width: 130px;
  background: transparent;
`

export const StyledWrapperForDateRangePicker = styled.div`
  width: auto;
  padding: ${(props: { dateRangePadding: string }) =>
    props.dateRangePadding || '6px 0'};

  & .DateInput {
    display: flex;
    width: 9.5rem;
    background-color: transparent;
  }

  & .DateInput:first-child .DateInput_input {
    padding-left: 0;
  }

  & .DateInput_input {
    padding: 0.2rem 0.5rem;
    font-size: 1.4rem;
    font-family: ${(props: { fontFamily: string }) => props.fontFamily};
    font-size: ${(props: { fontSize?: string }) =>
      props.fontSize ? props.fontSize : ''};
    font-weight: 400;
    height: ${(props: { dateInputHeight?: string }) =>
      props.dateInputHeight || '36px'};
    color: #16253d;
    background: #fff;
    border: 1px solid #e0e5ec;
    text-align: center;
    border-radius: 4px;
    box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.15);
  }

  & .DateRangePicker_picker {
    font-size: ${(props: { fontSize?: string }) =>
      props.fontSize ? props.fontSize : ''};
    font-family: ${(props: { fontFamily: string }) => props.fontFamily};
    z-index: ${(props: { zIndexPicker: number }) => props.zIndexPicker || 10};
  }

  & .DateRangePickerInput {
    display: flex;
    align-items: center;
    background: ${(props: { background: string }) =>
      props.background || 'transparent'};
    border: 0;
  }

  & .DateInput_input__focused {
    border-bottom: 1px solid #fff;
    transition: all 100ms;
  }

  & .DateRangePickerInput_arrow_svg {
    fill: #7284a0;
    width: 14px;
    height: 14px;
    margin: 0 0.5rem;
  }
`

export const LinearProgressCustom = styled(
  ({ width, color, height, ...rest }) => <LinearProgress {...rest} />
)`
  width: ${(props) => props.width || `100%`};
  background-color: ${(props) => props.color || '#E7ECF3'};
  border-radius: 1rem;
  height: 1.75rem;
  padding: 0;
`

export const GridProgressBarContainer = styled(Grid)`
  height: 1.75rem;
`

export const IconCircle = styled.i`
  padding-right: 5px;
  font-size: 1rem;
`

export const IconArrow = styled.i`
  padding: 0 5px;
  font-size: 1rem;

  position: relative;
  top: -1px;
  left: 0;
`

export const GridTableTypographyContainer = styled(Grid)`
  font-size: 1.2rem;

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //font-size: 2.4rem;
  }
`
