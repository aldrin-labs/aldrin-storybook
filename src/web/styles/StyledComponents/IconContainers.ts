import styled from 'styled-components'

export const CloseIconContainer = styled.div`
  width: 1.7rem;
  height: 1.7rem;
  cursor: pointer;

  svg {
    path {
      stroke: ${(props) => props.theme.colors.gray0};
    }
  }
`
