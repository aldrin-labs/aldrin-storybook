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
  min-height: 7vh;
`

export const AccountsList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding-left: 8px;
  margin: 0;
  overflow-y: scroll;
  max-height: 30vh;
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

export const AccountName = styled(TypographyFullWidth)`
  font-weight: 700;
  height: 50%;
  margin: auto;
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `1.2rem`};
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

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `1.2rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#ABBAD1'};
  padding: ${(props) => props.textPadding || 0};
`
