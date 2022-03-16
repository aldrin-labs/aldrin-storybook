import { Button, Theme } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

export const TitleSecondRowContainer = styled.div`
  position: relative;
  align-items: center;
  display: flex;
  background-color: ${(props) => props.theme.palette.white.background};
  padding: 0.2rem auto;
  border-bottom: ${(props) => props.theme.palette.border.main};
`

export const TitleButton = styled(
  ({ isActive = false, secondary = '', ...rest }) => <Button {...rest} />
)`
  font-size: 0.9rem;
  color: ${(props: { isActive?: boolean; theme: Theme }) =>
    props.isActive
      ? props.theme.palette.blue.main
      : props.theme.palette.grey.text};
  border-color: ${(props: { isActive?: boolean; theme: Theme }) =>
    props.isActive
      ? props.theme.palette.blue.main
      : props.theme.palette.grey.border};
  background-color: ${(props: { isActive?: boolean; theme: Theme }) =>
    props.theme.palette.white.background};
  margin: 0.7rem;
  padding: 0px 0.4rem;
  border-radius: 1rem;
  min-width: 4rem;

  &:hover {
    background-color: ${(props: { isActive?: boolean }) =>
      props.isActive && props.theme.palette.blue.main};
    color: ${(props) => props.theme.palette.white.main};
  }
`

export const TableButton = styled(({ ...rest }) => <Button {...rest} />)`
  &&& {
    padding: 0.25rem 1.5rem;
    border-radius: 1.8rem;
    background: transparent;
    color: #f69894;
    font-family: Avenir Next Medium;
    text-align: center;
    font-size: 1.2rem;
    text-transform: none;
    width: 12rem;
    height: 3.5rem;
    margin: 1rem 0 1rem 0;
    border: 0.1rem solid #f69894;
    @media (max-width: 600px) {
      font-size: 2rem;
      padding: 0.5rem 2.5rem;
    }
  }
`

export const ClearButton = styled(TitleButton)`
  position: absolute;
  top: -2px;
  right: 1rem;
  color: #651ce4;
  border-color: #651ce4;
  font-size: 1.1rem;
  min-width: 70px;
  font-weight: bold;
  border-radius: 4px;
`

export const PaginationBlock = styled.div`
  font-family: 'DM Sans';
  display: flex;
  padding-left: 2rem;
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.grey &&
      props.theme.palette.grey.light) ||
    '#7284A0'};
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
`

export const AdlIndicator = styled.div`
  height: 2rem;
  width: 0.5rem;
  border: 0.1rem solid ${(props) => props.color};
  background: ${(props) => (props.adl > props.i ? props.color : 'inherit')};
  margin-right: 0.2rem;
  border-radius: 0.1rem;
`
export const StyledTitle = styled.span`
  font-family: Avenir Next Light;
  font-size: 2rem;
  padding: 0.7rem 0;
  letter-spacing: 0.01rem;
  color: ${(props) => props.color || '#93a0b2'};
`
