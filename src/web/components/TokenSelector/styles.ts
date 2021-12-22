import { BORDER_RADIUS, COLORS, FONTS } from '@variables/variables'
import styled from 'styled-components'
import { Input } from '../Input'
import { FlexBlock } from '../Layout'


export const Container = styled(FlexBlock)`
  height: 72px;
  align-items: center;
  padding: 0 24px;
  border: 1px solid ${COLORS.border};
  border-radius: ${BORDER_RADIUS.lg};
  font-family: ${FONTS.main};
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
`

export const DropdownArrow = styled.span`
  display: block;
  height: 6px;
  width: 6px;
  border-left: 1px solid ${COLORS.white};
  border-bottom: 1px solid ${COLORS.white};
  transform: rotate(-45deg);
  margin-left: auto;
`


export const TokenName = styled.span`
  margin-left: 10px;
`

export const Balance = styled.span`
  margin-left: auto;
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
  margin: -15px 0 20px 0;
`