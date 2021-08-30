import React from 'react'
import styled from 'styled-components'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlueButton } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'

export const Container = styled(RowContainer)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: auto;
  background: #ffdb5e;
  box-shadow: 0px -.2rem .4rem rgba(0, 0, 0, 0.65);
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
  height: 7rem;
  background: #222429;
  font-size: 2rem;
  width: calc(50% - 2rem);
`