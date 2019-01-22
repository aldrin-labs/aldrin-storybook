import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Grid, Card } from '@material-ui/core'
import { GridProps } from '@material-ui/core/Grid'

import { CSS_CONFIG } from '@storybook/config/cssConfig'
import ReactSelectComponent from '@storybook/components/ReactSelectComponent'

export const customAquaScrollBar = `
  &::-webkit-scrollbar {
    width: 3px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }`

export const PTWrapper = styled(({ tableData, ...rest }) => <Card {...rest} />)`
  grid-column: 2;
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 2rem)' : '100%'};
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 1.5rem auto;
  padding: 1rem 0;
  height: calc(100vh - 130px);
  overflow-y: auto;
  @media (max-width: 840px) {
    margin: 1.5rem auto;
  }

  @media (max-width: 550px) {
    width: calc(100% - 90px);
    margin: 0.625rem auto;
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
