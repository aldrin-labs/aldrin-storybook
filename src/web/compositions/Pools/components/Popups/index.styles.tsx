import { Paper } from '@material-ui/core'
import { COLORS } from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

export const BoldHeader = styled.h2`
  font-family: Avenir Next Bold;
  font-size: 2.5rem;
  letter-spacing: 0.01rem;
  color: #f5f5fb;
`
export const StyledInput = styled.div`
  background: ${(props) =>
    props.disabled ? COLORS.darkBackground : '#222429'};
  border: 0.1rem solid #3a475c;
  border-radius: 1.5rem;
  color: #fbf2f2;
  font-size: 2rem;
  padding-top: 2rem;
  height: 7.5rem;
  width: ${(props) => props.width || '100%'};
  padding: 0 2rem;
  outline: none;
`

type TokenContainerProps = {
  top?: string
  bottom?: string
  left?: string
  right?: string
}

export const TokenContainer = styled.div`
  position: absolute;
  top: ${(props: TokenContainerProps) => props.top};
  right: ${(props: TokenContainerProps) => props.right};
  bottom: ${(props: TokenContainerProps) => props.bottom};
  left: ${(props: TokenContainerProps) => props.left};
`
export const Line = styled.div`
  border: 0.1rem solid #383b45;
  height: 0.1rem;
  margin: 2rem 0;
  width: 100%;
`
export const InvisibleInput = styled.input`
  width: 100%;
  background: ${(props) =>
    props.disabled ? COLORS.disabledInput : COLORS.blockBackground};
  color: ${COLORS.primaryWhite};
  font-size: 2rem;
  outline: none;
  border: none;
  font-family: Avenir Next Demi;
  &::placeholder {
    color: ${COLORS.inputPlaceholder};
  }
`

export const StyledPaper = styled(({ ...props }) => <Paper {...props} />)`
  height: auto;
  padding: 2rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 1.6rem;
`

export const ClaimRewardsStyledPaper = styled(({ ...props }) => (
  <Paper {...props} />
))`
  height: auto;
  padding: 2rem 4rem;
  width: 80rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 1.6rem;
`
