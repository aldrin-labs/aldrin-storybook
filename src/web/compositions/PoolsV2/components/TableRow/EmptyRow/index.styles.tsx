import { BORDER_RADIUS, SECOND_FONT } from '@variables/variables'
import styled from 'styled-components'

import { InlineText } from '@sb/components/Typography'

type StyledInlineTextProps = {
  needDecoration?: boolean
}

export const Container = styled.div`
  width: 100%;
  background: ${(props) => props.theme.colors.white6};
  border-radius: ${BORDER_RADIUS.lg};
  margin-bottom: 1em;
  height: auto;
  transition: 0.3s;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
`

export const StyledInlineText = styled(InlineText)<StyledInlineTextProps>`
  font-family: ${SECOND_FONT};
  font-size: 1em;
  line-height: 200%;
  text-decoration: ${(props) => (props.needDecoration ? 'underline' : 'none')};
  cursor: ${(props) => (props.needDecoration ? 'pointer' : 'auto')};
`

export const TextContainer = styled.div`
  width: 65%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: end;
`
