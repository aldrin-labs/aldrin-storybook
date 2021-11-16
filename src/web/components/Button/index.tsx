import styled, { css } from 'styled-components'
import {
  COLORS,
  FONT_SIZES,
  FONTS,
  BORDER_RADIUS,
  WIDTH,
} from '@variables/variables'

const VARIANTS = {
  primary: css`
    background: ${COLORS.primary};
    border-color: ${COLORS.primary};

    &:disabled {
      background: ${COLORS.hint};
      border-color: ${COLORS.hint};
    }
  `,
  secondary: css`
    background: ${COLORS.background};
    border-color: ${COLORS.background};

    &:disabled {
      background: ${COLORS.hint};
      border-color: ${COLORS.hint};
    }
  `,

  rainbow: css`
    background: linear-gradient(91.8deg, ${COLORS.primary} 15.31%, ${COLORS.errorAlt} 89.64%);
    border: 0;
  `,

  error: css`
    background: ${COLORS.error};
    border-color: ${COLORS.error};
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

  link: css`
    background: transparent;
    border-color: transparent;
    color: ${COLORS.main};
    padding: 0 10px;
  `,

  // TODO: rewrite with [disabled] html attribute
  disabled: css`
    background: ${COLORS.hint};
    border-color: ${COLORS.hint};
    cursor: not-allowed;
  `,

  
}

const PADDINGS = {
  md: '4px 10px', // 16px
  lg: '8px 16px',
}

export type ButtonVariants = keyof typeof VARIANTS

export interface ButtonProps {
  fontSize?: keyof typeof FONT_SIZES
  variant?: ButtonVariants
  borderRadius?: keyof typeof BORDER_RADIUS
  padding?: keyof typeof PADDINGS
  backgroundImage?: string
  width?: keyof typeof WIDTH
  backgroundColor?: string
}

export const Button = styled.button<ButtonProps>`
  background-color: ${(props: ButtonProps) => props.backgroundColor || 'none'};
  background: ${(props: ButtonProps) => props.backgroundColor || 'none'};
  min-width: 9rem;
  color: white;
  text-align: center;
  font-size: ${(props: ButtonProps) => FONT_SIZES[props.fontSize || 'md']};
  border: 1px solid transparent;
  line-height: 150%;
  cursor: pointer;
  padding: ${(props: ButtonProps) => PADDINGS[props.padding || 'md']};
  ${(props: ButtonProps) => VARIANTS[props.variant || 'primary']};
  font-family: ${FONTS.main};
  border-radius: ${(props: ButtonProps) =>
    BORDER_RADIUS[props.borderRadius || 'md']};
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
