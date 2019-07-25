import styled from 'styled-components'
import Arrow from '@material-ui/icons/ChevronRight'
import { TypographyFullWidth } from '@sb/styles/cssUtils'
import { Typography } from '@material-ui/core'

export const AccountsListItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 1em;
  font-weight: 500;
  text-align: left;
  color: ${(props: { color: string }) => props.color};
  padding: 0;
`

export const AccountsList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding-left: 8px;
  margin: 0;
`

export const AccountsWalletsHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledIcon = styled(Arrow)`
  color: ${(props: { color: string }) => props.color};
  text-align: center;
  opacity: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? '1' : '0'};
  font-size: 2rem;
  right: -0.5rem;

  position: absolute;
  bottom: 50%;
  transition: opacity 0.2s linear;
`

export const CloseContainer = styled.div`
  height: 100%;
`

export const SelectAll = styled.div`
  margin-top: 1rem;
  padding-left: 0.5rem;
  display: flex;
`

export const AccountName = styled(TypographyFullWidth)`
  font-weight: 700;
  height: 50%;
  margin: auto;
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `0.75rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#ABBAD1'};
  padding: 0;
  border-bottom: '1px solid #E0E5EC';
  padding-top: '10px';
`

export const Headline = styled.div`
  color: ${(props: { color: string }) => props.color};
  opacity: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? '0' : '1'};
  font-size: 0.7em;
  transform: rotate(-90deg);
  left: -0.6rem;
  transform-origin: right, top;
  position: absolute;
  bottom: 50%;
  transition: opacity 0.4s linear;

  @media (min-width: 1000px) {
    font-size: 1rem;
    right: 10.8rem;
  }
`

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `0.75rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#ABBAD1'};
  padding: ${(props) => props.textPadding || 0};
`
