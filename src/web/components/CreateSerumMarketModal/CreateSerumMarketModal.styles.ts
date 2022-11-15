import styled from 'styled-components'

export const Sidebar = styled.div`
  flex: 0 0 200px;
  border-right: 1px solid ${(props) => props.theme.border};
  padding: 24px;
  box-sizing: border-box;
`

export const Content = styled.div`
  flex: 0 0 540px;
  padding: 24px;
  box-sizing: border-box;
`
