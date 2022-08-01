import { Grid, Card, Theme } from '@material-ui/core'
import { GridProps } from '@material-ui/core/Grid'
import React from 'react'
import styled, { css } from 'styled-components'

import ReactSelectComponent from '@sb/components/ReactSelectComponent'
import { CSS_CONFIG } from '@sb/config/cssConfig'
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

export const customAquaScrollBar = css`
  &::-webkit-scrollbar {
    width: ${({ scrollBarWidth }: { scrollBarWidth?: number }) =>
      scrollBarWidth ? `${scrollBarWidth}px` : '3px'};
    height: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
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

export const ChartSelectStyles = css`
  border: 2px solid ${(props: { border: string }) => props.border};
  padding: 0 16px;
  height: 38px;
  place-content: center;
  display: flex;
  width: 130px;
  background: transparent;
`

