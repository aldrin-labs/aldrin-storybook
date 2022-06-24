import { Paper } from '@material-ui/core'
import { FONTS, FONT_SIZES } from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

export const BoldHeader = styled.h2`
  font-family: Avenir Next Bold;
  font-size: 2.5rem;
  letter-spacing: 0.01rem;
  color: ${(props) => props.theme.colors.gray0};
`
export const StyledInput = styled.div`
  background: ${(props) => props.theme.colors.gray5};
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
  border-top: 0.1rem solid ${(props) => props.theme.colors.gray1};
  height: 0rem;
  margin: 2rem 0;
  width: 100%;
`
export const InvisibleInput = styled.input`
  width: 100%;
  background: inherit;
  color: ${(props) => props.theme.colors.gray0};
  outline: none;
  border: none;

  font-family: ${FONTS.main};
  font-size: ${FONT_SIZES.md};
  line-height: ${FONT_SIZES.xlmd};
  font-weight: 600;

  &::placeholder {
    color: ${(props) => props.theme.colors.gray3};
  }
`

export const StyledPaper = styled(({ ...props }) => <Paper {...props} />)`
  height: auto;
  padding: 2rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: ${(props) => props.theme.colors.gray6};
  border-radius: 1.6rem;
  font-size: 16px;
`

export const ClaimRewardsStyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem 4rem;
  width: 80rem;
  background: ${(props) => props.theme.colors.gray5};
  border-radius: 1.6rem;
`
