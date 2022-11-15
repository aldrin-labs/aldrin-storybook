import styled from 'styled-components'

import { FONT_SIZES } from '../../../variables/variables'
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
  font-size: ${FONT_SIZES.sm};
  color: ${(props) => props.theme.colors.white2};

  ol {
    padding: 0 0 0 24px;
  }
`

export const Li = styled.li<{ $isActive: boolean }>`
  padding: 6px 0;
  color: ${(props) =>
    props.$isActive ? props.theme.colors.white1 : props.theme.colors.white2};
  font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
`

export const Content = styled.div`
  flex: 1;
  padding: 24px;
  box-sizing: border-box;
`

export const FormGroup = styled.div`
  padding: 12px 0;
`

export const Label = styled.label`
  color: ${(props) => props.theme.colors.white2};
  font-size: ${FONT_SIZES.sm};
`
