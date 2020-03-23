import React from 'react'
import styled from 'styled-components'
import Arrow from '@material-ui/icons/ChevronRight'
import { Typography, Grid } from '@material-ui/core'

export const AccountsListItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 1em;
  font-weight: 500;
  text-align: left;
  color: ${(props: { color: string }) => props.color};
  padding: 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e0e5ec;
  }

  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`

export const AccountsList = styled(({ isTransactions, ...rest }) => (
  <ul {...rest} />
))`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.isTransactions ? '0rem 0.3rem' : '0')};
  margin: 0;

  height: 75%;
  overflow: hidden scroll;
`

export const AccountsWalletsHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`

export const StyledIcon = styled(({ color, isSideNavOpen, ...rest }) => (
  <Arrow {...rest} />
))`
  color: ${(props: { color: string }) => props.color};
  text-align: center;
  opacity: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? '1' : '0'};
  font-size: 3.2rem;
  right: -0.8rem;

  position: absolute;
  bottom: 50%;
  transition: opacity 0.2s linear;
`

export const CloseContainer = styled.div`
  height: 100%;
`

export const SelectAll = styled.div`
  margin-top: 1.6rem;
  padding-left: 0.8rem;
  display: flex;
`

export const AccountName = styled(({ textColor, lineHeight, ...rest }) => (
  <div {...rest} />
))`
  height: 100%;
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `1.2rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: ${(props) => props.letterSpacing || '1.5px'};
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#ABBAD1'};
  padding: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;

  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
  margin: 0 auto 0 0;
  overflow: hidden;
`

export const Headline = styled(({ color, isSideNavOpen, ...rest }) => (
  <div {...rest} />
))`
  color: ${(props: { color: string }) => props.color};
  opacity: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? '0' : '1'};
  font-size: 0.7em;
  transform: rotate(-90deg);
  left: -0.96rem;
  transform-origin: right, top;
  position: absolute;
  bottom: 50%;
  transition: opacity 0.4s linear;

  @media (min-width: 1000px) {
    font-size: 1.6rem;
    right: 17.28rem;
  }
`

export const TypographyTitle = styled(
  ({ textColor, textPadding, lineHeight, ...rest }) => <Typography {...rest} />
)`
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `1.2rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#ABBAD1'};
  padding: ${(props) => props.textPadding || 0};
`

export const AddAccountButtonContainer = styled(({ ...rest }) => (
  <Grid {...rest} />
))`
  padding: 0.5rem 0;
  margin: 0;

  & > button {
    padding: 0;
    margin: 0;
  }
`
