import {
  COLORS,
  FONT_SIZES,
  FONTS,
  BORDER_RADIUS,
  WIDTH,
  BUTTON_PADDINGS,
  LOGO,
  THEME,
} from '@variables/variables'
import styled, { css } from 'styled-components'

export type ButtonVariants = keyof typeof THEME.button.variants

export interface ButtonProps {
  $fontSize?: keyof typeof FONT_SIZES
  $variant?: ButtonVariants
  $borderRadius?: keyof typeof BORDER_RADIUS
  $padding?: keyof typeof BUTTON_PADDINGS
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
  padding: ${(props: ButtonProps) => BUTTON_PADDINGS[props.$padding || 'md']};
  ${(props: ButtonProps) => THEME.button.variants[props.$variant || 'primary']};
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
    background-color: ${COLORS.buttonImgBg};
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
      background: url(${LOGO}) center center no-repeat;
      position: absolute;
      left: 10%;
      top: 15%;
      background-size: contain;
    }
  `
      : ''}
`
