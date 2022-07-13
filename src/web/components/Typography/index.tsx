import { UCOLORS, FONT_SIZES, FONTS } from '@variables/variables'
import { get } from 'lodash-es'
import styled from 'styled-components'

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700

export interface TextProps {
  size?: keyof typeof FONT_SIZES
  color?: keyof typeof UCOLORS
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
  color: ${(props: TextProps) => props.theme.colors[props.color || 'white1']};
  font-weight: ${(props: TextProps) => props.weight || 400};
  letter-spacing: -0.52px;
  margin: ${(props) => props.margin || '10px 0 0 0'};
  ${(props: TextProps) =>
    props.maxWidth ? `max-width: ${props.maxWidth};` : ''}
  ${(props: TextProps) => (props.noWrap ? `white-space: nowrap;` : '')}
  text-align: ${(props: TextProps) => props.align || 'left'}
`

export interface InlineProps {
  color?: string
  size?: keyof typeof FONT_SIZES
  weight?: Weight
  cursor?: 'pointer' | 'help' | 'auto' | 'default' | 'none'
}

export const InlineText = styled.span<InlineProps>`
  font-family: ${FONTS.main};
  color: ${(props) =>
    get(props.theme.colors, props.color, props.theme.colors.white1)};
  ${(props: InlineProps) =>
    props.size ? `font-size: ${FONT_SIZES[props.size]};` : ''}
  ${(props: InlineProps) =>
    props.weight ? `font-weight: ${props.weight};` : ''};
  ${(props: InlineProps) => (props.cursor ? `cursor: ${props.cursor};` : '')}
`
