import styled, { css } from 'styled-components'
import {
  COLORS,
  FONT_SIZES,
  FONTS,
  BORDER_RADIUS,
  WIDTH,
} from '../../../variables'

const VARIANTS = {
  primary: css`
    background: ${COLORS.primary};
    border-color: ${COLORS.primary};

    &:disabled {
      background: ${COLORS.hint};
      border-color: ${COLORS.hint};
    }
  `,

  'outline-white': css`
    background: transparent;
    border-color: ${COLORS.white};
  `,

  'link-error': css`
    background: transparent;
    border-color: transparent;
    color: ${COLORS.error};
  `,

  'link': css`
    background: transparent;
    border-color: transparent;
  `,
}

const PADDINGS = {
  md: '4px 10px', // 16px
  lg: '8px 16px',
}

export interface ButtonProps {
  fontSize?: keyof typeof FONT_SIZES
  variant?: keyof typeof VARIANTS
  borderRadius?: keyof typeof BORDER_RADIUS
  padding?: keyof typeof PADDINGS
  backgroundImage?: string
  width?: keyof typeof WIDTH
}

export const Button = styled.button<ButtonProps>`
  background: none;
  min-width: 8rem;
  color: white;
  text-align: center;
  font-size: ${(props: ButtonProps) => FONT_SIZES[props.fontSize || 'md']};
  border: 1px solid transparent;
  line-height: 150%;
  padding: ${(props: ButtonProps) => PADDINGS[props.padding || 'md']};
  ${(props: ButtonProps) => VARIANTS[props.variant || 'primary']};
  font-family: ${FONTS.main};
  border-radius: ${(props: ButtonProps) =>
    BORDER_RADIUS[props.borderRadius || 'md']};
  cursor: pointer;
  ${(props: ButtonProps) =>
    props.width ? ` width: ${WIDTH[props.width]};` : ''}
  text-decoration: none;

  ${({ backgroundImage }: ButtonProps) =>
    backgroundImage
      ? `
    background-color: #a1458a;
    border-color: transparent;
    background-image: url(${backgroundImage});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  `
      : ''}

  &:disabled {
    cursor: not-allowed;
  }
`
