import { RadioButtonUnchecked } from '@material-ui/icons'
import React from 'react'
import styled from 'styled-components'

export const Container = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  width: ${(props) => props.width || '40%'};
  height: 100%;
  div:last-child {
    border-bottom: ${(props) => props.borderBottom || 'none'};
  }
`
export const Stroke = styled.div`
  width: 100%;
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: start;
  text-align: left;
  border-bottom: ${(props) => props.theme.palette.border.main};
  padding: ${(props) => props.padding || '0'};
  margin: auto 1rem;
  cursor: default;
`
export const PortfolioTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
  font-family: Avenir Next Light;
  height: 3rem;
  width: 95%;
  white-space: nowrap;
  background: ${(props) =>
    props.isActive
      ? props.theme.palette.red.portfolio
      : props.theme.palette.grey.selector};
  padding: 0 1rem;
  cursor: pointer;
`
export const AccountTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
  font-family: Avenir Next Light;
  height: 3rem;
  width: 60%;
  white-space: nowrap;
  background: ${(props) =>
    props.isActive
      ? props.theme.palette.green.account
      : props.theme.palette.grey.selector};
  padding: 0 1rem;
  cursor: pointer;
`
export const Name = styled.div`
  display: flex;
  cursor: pointer;
  min-width: 70%;
  align-items: end;
  justify-content: end;
  width: auto%;
  сolor: ${(props) =>
    props.isActive
      ? props.theme.palette.grey.activeBtnText
      : props.theme.palette.grey.selectorText};
  .radio {
    position: absolute;
    top: 0.2rem;
    left: 0;
    height: 2.5rem;
    width: 2.5rem;
    background: #c9ded6;
    border-radius: 50%;
    &::after {
      content: '';
      position: absolute;
      opacity: 0;
      top: 0.5rem;
      left: 0.5rem;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: #fff;
    }
  }
`
export const DepositBtn = styled.button`
  border: none;
  font-family: Avenir Next Medium;
  background: none;
  color: #165be0;
  width: 10%;
  font-size: 1.3rem;
  outline: none;
  cursor: pointer;
`
export const AddPortfolioBtn = styled.button`
  border: none;
  font-family: Avenir Next Demi;
  background: none;
  color: #7380eb;
  width: ${(props) => props.width || '100%'};
  font-size: 1.6rem;
  outline: none;
  cursor: pointer;
`
export const CloseButton = styled.button`
  width: 50%;
  color: #fff;
  background: #7380eb;
  border: none;
  font-size: 1.5rem;
  height: 3rem;
  border-radius: 1rem;
  outline: none;
  cursor: pointer;
`
export const Balances = styled.div`
  padding: 0 1rem;
  color: #157e23;
  width: 20%;
  font-size: 1.3rem;
  font-family: Avenir Next Medium;
  cursor: default;
`
