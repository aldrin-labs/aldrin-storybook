import {
  COLORS,
  FONT_SIZES,
  FONTS,
  BORDER_RADIUS,
  WIDTH,
} from '@variables/variables'
import styled, { css } from 'styled-components'

import RinLogo from '@icons/DarkLogo.svg'

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
    background: linear-gradient(
      91.8deg,
      ${COLORS.primary} 15.31%,
      ${COLORS.errorAlt} 89.64%
    );
    border: 0;

    &:disabled {
      background: ${COLORS.hint};
      border-color: ${COLORS.hint};
    }
  `,

  error: css`
    background: ${COLORS.error};
    border-color: ${COLORS.error};

    &:disabled {
      background: ${COLORS.hint};
      border-color: ${COLORS.hint};
    }
  `,

  'outline-white': css`
    background: transparent;
    border-color: ${COLORS.white};

    &:disabled {
      color: ${COLORS.hint};
      border-color: ${COLORS.hint};
    }
  `,

  'link-error': css`
    background: transparent;
    border-color: transparent;
    color: ${COLORS.error};

    &:disabled {
      color: ${COLORS.hint};
      border-color: ${COLORS.hint};
    }
  `,

  link: css`
    background: transparent;
    border-color: transparent;
    color: ${COLORS.success};

    &:disabled {
      color: ${COLORS.hint};
    }
  `,

  input: css`
    background: ${COLORS.mainBlack};
    color: ${COLORS.newOrange};
    padding: 0.2rem 1rem;
    font-weight: 600;
    font-size: ${FONT_SIZES.xs};
  `,

  // TODO: rewrite with [disabled] html attribute
  disabled: css`
    background: ${COLORS.hint};
    border-color: ${COLORS.hint};
    cursor: not-allowed;
  `,

  utility: css`
    background: ${COLORS.hint};
    border-color: ${COLORS.hint};
  `,
}

const PADDINGS = {
  md: '4px 10px', // 16px
  lg: '8px 16px',
}

export type ButtonVariants = keyof typeof VARIANTS

export interface ButtonProps {
  $fontSize?: keyof typeof FONT_SIZES
  $variant?: keyof typeof VARIANTS
  $borderRadius?: keyof typeof BORDER_RADIUS
  $padding?: keyof typeof PADDINGS
  $backgroundImage?: string
  $width?: keyof typeof WIDTH
  minWidth?: string
  backgroundColor?: string
  $loading?: boolean
}

const rotate = css`
  @keyframes button-rotate-loading {
    0% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(60deg);
    }

    50% {
      transform: rotate(0deg);
    }

    75% {
      transform: rotate(-60deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }
`

export const Button = styled.button<ButtonProps>`
  background-color: ${(props: ButtonProps) => props.backgroundColor || 'none'};
  background: ${(props: ButtonProps) => props.backgroundColor || 'none'};
  min-width: ${(props: ButtonProps) => props.minWidth || '9rem'};
  color: white;
  text-align: center;
  font-size: ${(props: ButtonProps) => FONT_SIZES[props.$fontSize || 'md']};
  border: 1px solid transparent;
  line-height: 150%;
  cursor: pointer;
  padding: ${(props: ButtonProps) => PADDINGS[props.$padding || 'md']};
  ${(props: ButtonProps) => VARIANTS[props.$variant || 'primary']};
  font-family: ${FONTS.main};
  border-radius: ${(props: ButtonProps) =>
    BORDER_RADIUS[props.$borderRadius || 'md']};
  ${(props: ButtonProps) =>
    props.$width ? ` width: ${WIDTH[props.$width]};` : ''}
  text-decoration: none;

  ${rotate}

  ${({ $backgroundImage: backgroundImage }: ButtonProps) =>
    backgroundImage
      ? `
    background-color: ${COLORS.buttonAltPink};
    border-color: transparent;
    background-image: url(${backgroundImage});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  `
      : ''}

  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    pointer-events: none;
  }

  ${({ $loading: loading }: ButtonProps) =>
    loading
      ? `

    position: relative;
    &, &:disabled {
      color: transparent;
    }
    &:before {
      animation: 5s button-rotate-loading infinite linear;
      content: "";
      width: 80%;
      height: 70%;
      background: url(${RinLogo}) center center no-repeat;
      position: absolute;
      left: 10%;
      top: 15%;
      background-size: contain;


    }
  `
      : ''}
`
