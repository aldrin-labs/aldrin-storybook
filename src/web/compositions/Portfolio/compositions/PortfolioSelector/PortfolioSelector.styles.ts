import styled from 'styled-components'
import FaFilter from '@material-ui/icons/FilterList'

export const Name = styled.h1`
  width: 100%;
  text-align: center;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2.5rem;
  padding: 0.5rem 0;
  text-align: center;
  color: ${(props: { color: string }) => props.color};
`

export const FilterValues = styled.div`
  width: 100%;
  display: flex;
  place-items: center;
`
export const FilterIcon = styled(FaFilter)`
  color: ${(props: { color: string }) => props.color};
  font-size: 1.5rem;
  margin: 0 0.5rem;
`

export const AccountsWalletsBlock = styled.div`
  font-family: ${(props: { fontFamily: string }) => props.fontFamily};
  min-width: 200px;
  background-color: ${(props: { background: string }) => props.background};
  padding: 16px;
  left: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? '0' : '-11.5rem'};
  cursor: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? 'auto' : 'pointer'};
  display: block;
  position: fixed;
  top: 0;
  z-index: 1008;
  height: 100vh;
  transition: right 0.2s ease-in;

  &:hover {
    background-color: ${({
      isSideNavOpen,
      background,
      hoverBackground,
    }: {
      isSideNavOpen: boolean
      background: string
      hoverBackground: string
    }) => (isSideNavOpen ? background : hoverBackground)};
  }
`
