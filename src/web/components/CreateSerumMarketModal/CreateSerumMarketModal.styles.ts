import styled from 'styled-components'

import { FONT_SIZES } from '../../../variables/variables'
import { Button } from '../Button'
import { InputField } from '../Input'
import { Append, InputContainer, InputEl } from '../Input/styles'
import { FlexBlock } from '../Layout'
import { ModalBody } from '../Modal/styles'
import { InlineText } from '../Typography'

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

export const Li = styled.li<{ $isActive: boolean; $color: string }>`
  padding: 6px 0;
  color: ${(props) =>
    props.theme.colors[props.$color] || props.theme.colors.white2};
  font-weight: 600;
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

export const FormInput = styled(InputField)`
  ${InputContainer} {
    flex: 1;
    display: flex;
  }
  ${InputEl} {
    flex: 1;
    font-size: ${FONT_SIZES.sm};
  }
  ${Append} {
    flex: 0;
  }
`

export const Step2Head = styled.div`
  padding: 24px 0 48px;

  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

export const BottomSectionBlock = styled(FlexBlock)`
  margin-top: 12px;
`

export const ActionButton = styled(Button)`
  height: 48px;
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  background: ${(props) => props.theme.colors.red1};

  flex: 1;

  margin: 0 12px 0;
  line-height: 24px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`

export const Step2CloseButton = styled(ActionButton)`
  color: ${(props) => props.theme.colors.red1};
  background: inherit;
  border: 1px solid ${(props) => props.theme.colors.red1};
`

export const IconWrap = styled.div`
  margin-right: 12px;
`

export const BottomLinkContainer = styled(FlexBlock)`
  margin-top: 12px;
`

export const InlineTextLink = styled(InlineText)`
  text-decoration: none;
`
