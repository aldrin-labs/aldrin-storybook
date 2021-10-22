import styled from 'styled-components'
import { COLORS, FONT_SIZES } from '../../../variables'


interface TextProps {
  size?: keyof typeof FONT_SIZES
  color?: keyof typeof COLORS
  weight?: 100 | 200 | 400 | 500 | 600 | 700
  maxWidth?: string
}

export const Text = styled.p<TextProps>`
  font-size: ${(props: TextProps) => FONT_SIZES[props.size || 'md']};
  line-height: 150%;
  color: ${(props: TextProps) => COLORS[props.color || 'white']};
  font-weight: ${(props: TextProps) => props.weight || 400};
  letter-spacing: 0.7px;
  margin: 10px 0 0 0;
  ${(props: TextProps) => props.maxWidth ? `max-width: ${props.maxWidth};` : ''} 
`

interface InlineProps {
  color?: keyof typeof COLORS
  size?: keyof typeof FONT_SIZES
}

export const InlineText = styled.span<InlineProps>`
  ${(props: InlineProps) => props.color?  `color: ${COLORS[props.color]};` : ''}
  ${(props: InlineProps) => props.size?  `font-size: ${FONT_SIZES[props.size]};` : ''}
`