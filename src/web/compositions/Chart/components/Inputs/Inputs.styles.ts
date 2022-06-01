import styled from 'styled-components'

export const SearchInput = styled.input`
  background: ${(props) => props.theme.colors.gray5};
  border-radius: 1.7rem;
  outline: none;
  width: 100%;
  height: 3.5rem;
  color: ${(props) => props.theme.colors.gray0};
  padding: 0 2rem;
  border: none;
  @media (max-width: 540px) {
    height: 4.5rem;
  }
`
