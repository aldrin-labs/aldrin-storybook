import styled from 'styled-components'

export const SWrapperStyles = `
  z-index: 100000;
  padding: 0;
  border-left: .1rem solid #e0e5ec;
  align-items: center;
  display: flex;
  justify-content: flex-end;
`

export const SWrapper = styled.div`
  ${SWrapperStyles}
  border-left: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.border &&
      props.theme.palette.border.main) ||
    '.1rem solid #e0e5ec'};
`
