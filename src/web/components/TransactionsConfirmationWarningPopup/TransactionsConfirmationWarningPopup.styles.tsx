import React from 'react'
import styled from 'styled-components'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlueButton } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'

export const Container = styled(RowContainer)`
  position: absolute;
  bottom: ${(props) => (props.showOnTheBottom ? '0' : 'auto')};
  top: ${(props) => (props.showOnTheTop ? '0' : 'auto')};
  width: 100%;
  height: auto;
  background: #ffdb5e;
  box-shadow: 0px -0.2rem 0.4rem rgba(0, 0, 0, 0.65);
`

export const Text = styled.span`
  font-family: Avenir Next;
  font-size: 2.5rem;
  letter-spacing: 0.01rem;
  color: #000;
`

export const DemiText = styled(Text)`
  font-family: Avenir Next Demi;
`

export const BlackButton = styled(({ ...props }) => <BlueButton {...props} />)`
  height: ${(props) => props.height || '7rem'};
  background: #222429;
  font-size: ${(props) => props.fontSize || '2rem'};
  width: ${(props) => props.width || 'calc(50% - 2rem)'};
  white-space: nowrap;
`
export const TextButton = styled.button`
  background: none;
  color: #222429;
  text-decoration: underline;
  font-family: Avenir Next Light;
  outline: none;
  border: none;
  margin: 0 3rem 0 0;
  cursor: pointer;
  transition: 0.5s;
`
