import styled from 'styled-components'
import { COLORS } from '../../../variables'

const SIZES = {
  sm: '0.8125em', // 13px
  md: '1em', // 16px
}

interface TextProps {
  size?: keyof typeof SIZES
  color?: keyof typeof COLORS
  weight?: 100 | 200 | 400 | 500 | 600 | 700
  maxWidth?: string
}

export const Text = styled.p<TextProps>`
  font-size: ${(props: TextProps) => SIZES[props.size || 'md']};
  line-height: 150%;
  color: ${(props: TextProps) => COLORS[props.color || 'white']};
  font-weight: ${(props: TextProps) => props.weight || 400};
  letter-spacing: 0.7px;
  margin: 10px 0 0 0;
  ${(props: TextProps) => props.maxWidth ? `max-width: ${props.maxWidth};` : ''} 
`