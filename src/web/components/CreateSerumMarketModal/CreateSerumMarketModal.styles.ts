import styled from 'styled-components'

import { ModalBody } from '../Modal/styles'

export const Body = styled(ModalBody)`
  width: 750px;
`

export const Sidebar = styled.div`
  flex: 0 0 200px;
  border-right: 1px solid ${(props) => props.theme.colors.border};
  padding: 24px;
  box-sizing: border-box;
  min-height: 100%;
`

export const Content = styled.div`
  flex: 1;
  padding: 24px;
  box-sizing: border-box;
`

export const FormGroup = styled.div``

export const Label = styled.label``
