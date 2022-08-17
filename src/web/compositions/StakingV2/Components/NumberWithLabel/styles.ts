import { FONT_SIZES, BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

type LabelType = {
  weight?: string
  size?: string
  padding?: string
}

export const Container = styled.div`
  background: ${(props) => props.theme.colors.green8};
  color: ${(props) => props.theme.colors.green4};
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 36px;
  padding: 0 8px;
  width: auto;
  border-radius: ${BORDER_RADIUS.md};
  font-weight: 600;
`

export const Label = styled.span<LabelType>`
  font-weight: ${(props) => props.weight || '400'};
  padding: ${(props) => props.padding || '0 0 0 0.25em'};
  font-size: ${(props) => props.size || FONT_SIZES.md};
`
