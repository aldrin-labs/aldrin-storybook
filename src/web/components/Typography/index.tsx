import { COLORS, FONT_SIZES, FONTS } from '@variables/variables'
import styled from 'styled-components'

type Weight = 100 | 200 | 400 | 500 | 600 | 700
export interface TextProps {
  size?: keyof typeof FONT_SIZES
  color?: keyof typeof COLORS
  weight?: Weight
  maxWidth?: string
  noWrap?: boolean
  margin?: string
  lineHeight?: string
  align?: 'center' | 'left' | 'right'
}

export const Text = styled.p<TextProps>`
  font-family: ${FONTS.main};
  font-size: ${(props: TextProps) => FONT_SIZES[props.size || 'md']};
  line-height: ${(props: TextProps) => props.lineHeight || '150%'};
  color: ${(props: TextProps) => COLORS[props.color || 'white']};
  font-weight: ${(props: TextProps) => props.weight || 400};
  letter-spacing: -0.52px;
  margin: ${(props) => props.margin || '10px 0 0 0'};
  ${(props: TextProps) =>
    props.maxWidth ? `max-width: ${props.maxWidth};` : ''}
  ${(props: TextProps) => (props.noWrap ? `white-space: nowrap;` : '')}
  text-align: ${(props: TextProps) => props.align || 'left'}
`

export interface InlineProps {
  color?: keyof typeof COLORS | string
  size?: keyof typeof FONT_SIZES
  weight?: Weight
  cursor?: 'pointer' | 'help' | 'auto' | 'default' | 'none'
}

export const InlineText = styled.span<InlineProps>`
  font-family: ${FONTS.main};
  ${(props: InlineProps) =>
    props.color ? `color: ${COLORS[props.color]};` : ''}
  ${(props: InlineProps) =>
    props.size ? `font-size: ${FONT_SIZES[props.size]};` : ''}
  ${(props: InlineProps) =>
    props.weight ? `font-weight: ${props.weight};` : ''};
  ${(props: InlineProps) => (props.cursor ? `cursor: ${props.cursor};` : '')}
`
