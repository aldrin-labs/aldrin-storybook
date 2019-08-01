import React from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import { Grid, Card, Theme } from '@material-ui/core'
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

export const TypographyFullWidth = styled(TypographyWithCustomColor)`
  width: 100%;
  flex-grow: 1;
  font-family: 'DM Sans', sans-serif;
  font-size: ${(props) => props.fontSize || `1.2rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#ABBAD1'};
  padding-left: 9px;
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
    overflow-y: auto;
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

export const GlobalStyle = createGlobalStyle`
 
 html {
  font-size: 10px;
 }
 
 &::-webkit-scrollbar {
    width: ${({ scrollBarWidth }: { scrollBarWidth?: number }) =>
    scrollBarWidth ? `${scrollBarWidth}px` : '3px'};
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #165BE0;
  }
  
  .DateRangePicker_picker.DateRangePicker_picker__portal {
    z-index: 200;
  }

  @media only screen and (min-width: 1921px) {
    html {
      font-size: 15px;
    }
  }

  @media only screen and (min-width: 2560px) {
    html {
      font-size: 20px;
    }
  }
`

export const SelectR = styled(ReactSelectComponent)`
  font-family: Roboto;
  width: 100%;
  font-size: 16px;
  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 2px solid #fff;
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
  margin-left: 1.12rem;
  border-radius: 24px;
  border: 2px solid ${(props: { border: string }) => props.border};
  padding: 0 16px;
  height: 38px;
  place-content: center;
  display: flex;
  width: 130px;
  background: transparent;
`

export const StyledWrapperForDateRangePicker = styled.div`
  width: 206px;
  padding: ${(props: { dateRangePadding: string }) =>
    props.dateRangePadding || '6px 0'};

  & .DateInput {
    width: 95px;
    background-color: transparent;
  }

  & .DateInput:first-child .DateInput_input {
    padding-left: 0;
  }

  & .DateInput_input {
    padding: ${(props: { dateInputPadding: string }) =>
    props.dateInputPadding || '5px'};
    font-size: 1.4rem;
    font-family: ${(props: { fontFamily: string }) => props.fontFamily};
    font-size: ${(props: { fontSize?: string }) =>
    props.fontSize ? props.fontSize : ''};
    font-weight: 400;
    height: ${(props: { dateInputHeight?: string }) =>
    props.dateInputHeight || '36px'};
    color: ${(props: { color: string }) => props.color};
    background: ${(props: { background?: string }) =>
    props.background || 'transparent'};
  }

  & .DateRangePicker_picker {
    font-size: ${(props: { fontSize?: string }) =>
    props.fontSize ? props.fontSize : ''};
    font-family: ${(props: { fontFamily: string }) => props.fontFamily};
    z-index: ${(props: { zIndexPicker: number }) => props.zIndexPicker || 10};
  }

  & .DateRangePickerInput {
    border: 0;
    background: ${(props: { background: string }) =>
    props.background || 'transparent'};
    border-bottom: 1px solid #c1c1c1;
  }

  & .DateInput_input__focused {
    border-bottom: 1px solid #fff;
    transition: all 100ms;
  }

  & .DateRangePickerInput_arrow_svg {
    fill: ${(props: { color: string }) => props.color};
    width: 14px;
    height: 14px;
  }
`

export const GridProgressBarContainer = styled(Grid)`
  height: 12px;

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    height: 36px;
  }
`

export const IconCircle = styled.i`
  padding-right: 5px;
  font-size: 1rem;

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //font-size: 2.2rem;
  }
`

export const GridTableTypographyContainer = styled(Grid)`
  font-size: 1.2rem;

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //font-size: 2.4rem;
  }
`
