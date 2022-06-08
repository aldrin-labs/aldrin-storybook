import { Grid } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

import { LineProps, RowProps } from './index.types'

export const Line = styled.div`
  position: absolute;
  top: ${(props: LineProps) => props.top || 'none'};
  bottom: ${(props: LineProps) => props.bottom || 'none'};
  width: 100%;
  height: 0.1rem;
  background: ${(props: LineProps) =>
    props.background || props.theme.palette.grey.block};
`

export const Row = styled.div`
  display: flex;
  flex-wrap: ${(props: RowProps) => props.wrap || 'wrap'};
  justify-content: ${(props: RowProps) => props.justify || 'center'};
  flex-direction: ${(props: RowProps) => props.direction || 'row'};
  align-items: ${(props: RowProps) => props.align || 'center'};
  width: ${(props: RowProps) => props.width || 'auto'};
  height: ${(props: RowProps) => props.height || 'auto'};
  margin: ${(props: RowProps) => props.margin || '0'};
  padding: ${(props: RowProps) => props.padding || '0'};
`
export const RowContainer = styled((props) => <Row {...props} />)`
  width: 100%;
`

export const ReusableTitle = styled(
  ({ width, fontFamily, fontSize, color, textAlign, margin, ...props }) => (
    <span {...props} />
  )
)`
  width: ${(props) => props.width || 'auto'};
  font-family: ${(props) => props.fontFamily || 'Avenir Next Medium'};
  font-style: normal;
  font-weight: normal;
  font-size: ${(props) => props.fontSize || '1.4rem'};
  text-align: center;
  color: ${(props) => props.color || '#ecf0f3'};
  text-align: ${(props) => props.textAlign || 'center'};
  margin: ${(props) => props.margin || '0'};
`

export const TokenTitleBlockContainer = styled(({ theme, ...props }) => (
  <Row {...props} />
))`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${(props) => props.height || '100%'};
  margin-right: 2rem;
  letter-spacing: 0.06rem;
  padding-left: 3rem;

  &:last-child {
    margin-right: 0;
  }

  @media (min-width: 1440px) and (max-width: 1560px) {
    margin-right: 1rem;
  }

  @media (min-width: 1921px) {
    margin-right: 1rem;
    padding-left: 2rem;
  }
`

export const Container = styled.div`
  height: 100%;
  background: ${(props) => props.theme.colors.gray9};
  font-family: Avenir Next;
`

export const TopBarContainer = styled((props) => <RowContainer {...props} />)`
  position: relative;
  width: calc(100% - 1.6rem);
  border-bottom: ${(props) => props.theme.colors.gray6};
  background: ${(props) => props.theme.colors.gray9};
  height: 6rem;
  padding-left: 6rem;
  padding-right: 6rem;
  margin-left: 0.8rem;
  margin-right: 0.8rem;

  @media (min-width: 1921px) {
    padding-left: 4rem;
    padding-right: 4rem;
  }
`

export const MainContentContainer = styled((props) => (
  <RowContainer {...props} />
))`
  height: calc(100% - 6rem);
  padding: 1.5rem;

  & > * ::-webkit-scrollbar {
    width: 0 !important;
  }
`

export const BlockContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const HeaderContainer = styled((props) => <RowContainer {...props} />)`
  height: 5rem;

  @media (min-width: 1921px) {
    height: 4rem;
  }
`

export const PairSelectorContainerGrid = styled((props) => <Grid {...props} />)`
  .pairSelectorRow:hover {
    background: ${(props) => props.theme.colors.gray6};
  }
`

export const ChartContainer = styled((props) => <RowContainer {...props} />)`
  height: ${(props) => props.height || 'calc(100% - 5rem)'};
  position: relative;

  @media (min-width: 1921px) {
    height: calc(100% - 4rem);
  }
`

export const Text = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 1.6rem;
  display: flex;
  align-items: flex-end;
  letter-spacing: 0.01rem;
  color: ${(props) => props.theme.palette.blue.serum};

  @media (min-width: 1440px) and (max-width: 1560px) {
    font-size: 1.4rem;
  }

  @media (min-width: 1921px) {
    font-size: 1.4rem;
  }
`

export const Title = styled(({ color, fontSize, fontFamily, ...rest }) => (
  <span {...rest} />
))`
  color: ${(props) => props.color || props.theme.colors.white};
  font-size: ${(props) => props.fontSize || '1.6rem'};
  font-family: ${(props) => props.fontFamily || 'Avenir Next'};
`

export const TopBarTitle = styled((props) => <Title {...props} />)`
  margin-right: 1rem;

  @media (min-width: 1440px) and (max-width: 1560px) {
    font-size: 1.4rem;
  }

  @media (min-width: 1921px) {
    font-size: 1.4rem;
  }
`

export const WhiteTitle = styled((props) => <Title {...props} />)`
  font-size: 1.6rem;
  color: ${(props) => props.color || props.theme.colors.gray0};
  font-weight: ${(props) => props.fontWeight || 'bold'};
  white-space: nowrap;

  @media (min-width: 1921px) {
    font-size: 1.4rem;
  }
`

export const TokenWhiteTitle = styled((props) => <WhiteTitle {...props} />)`
  @media (min-width: 1440px) and (max-width: 1560px) {
    font-size: 1.6rem;
  }

  @media (min-width: 1921px) {
    font-size: 1.6rem;
  }
`

export const Dot = styled.div`
  background: ${(props: { background: string }) => props.background};
  border-radius: 50%;
  box-shadow: 0.375em 0.375em 0 0 rgba(15, 28, 63, 0.125);
  height: 0.7rem;
  width: 0.7rem;
  margin-right: 0.7rem;
`

export const GreenTitle = styled((props) => <TokenWhiteTitle {...props} />)`
  color: ${(props) => props.theme.colors.green7};
  padding-left: 1rem;
`
