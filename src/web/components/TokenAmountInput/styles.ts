import { COLORS } from '@variables/variables'
import styled from 'styled-components'

export const InputAppendContainer = styled.div`
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: right;
  align-items: flex-end;
`

export const TokensAvailableText = styled.div`
  color: ${COLORS.primaryWhite};
  font-size: 0.8em;
  line-height: 1.2;
  padding: 4px 0;
  cursor: pointer;
`
