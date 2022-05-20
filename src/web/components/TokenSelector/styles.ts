import { BORDER_RADIUS, COLORS, FONTS } from '@variables/variables'
import styled from 'styled-components'

import { Input } from '../Input'
import { FlexBlock } from '../Layout'

export const Container = styled(FlexBlock)`
  height: 72px;
  align-items: center;
  padding: 0 24px;
  border: none;
  border-radius: ${BORDER_RADIUS.lg};
  font-family: ${FONTS.main};
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  background: ${(props) => props.theme.colors.gray5};
`

export const DropdownArrow = styled.span`
  display: block;
  height: 6px;
  width: 6px;
  border-left: 1px solid ${(props) => props.theme.colors.gray1};
  border-bottom: 1px solid ${(props) => props.theme.colors.gray1};
  transform: rotate(-45deg);
  margin-left: auto;
`

export const TokenName = styled.span`
  margin-left: 10px;
`

export const Balance = styled.span`
  margin-left: auto;
  color: ${(props) => props.theme.colors.gray0};
`

export const TokenRow = styled(FlexBlock)`
  padding: 10px 0;
  align-items: center;
  font-weight: 600;
  width: 240px;
  cursor: pointer;
`

export const TokenModalRow = styled(TokenRow)`
  border-bottom: 1px solid ${COLORS.background};
  &:hover {
    ${TokenName} {
      font-weight: bold;
    }
  }
`

export const SearchInput = styled(Input)`
  border-radius: ${BORDER_RADIUS.lg};
  border: none;
  margin: -15px 0 20px 0;
`

export const IconContainer = styled.div`
  margin-left: auto;
`
