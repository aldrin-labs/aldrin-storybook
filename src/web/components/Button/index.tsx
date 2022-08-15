import {
  COLORS,
  FONT_SIZES,
  FONTS,
  BORDER_RADIUS,
  WIDTH,
  UCOLORS,
} from '@variables/variables'
import { rgba } from 'polished'
import styled, { css } from 'styled-components'

import RinLogo from '@icons/blueRINLogo.svg'

const VARIANTS = {
  primary: css`
    background: ${(props) => props.theme.colors.persistent.blue1};
    border-color: ${(props) => props.theme.colors.persistent.blue1};

    &:disabled {
      background: ${(props) => props.theme.colors.white2};
      border-color: ${(props) => props.theme.colors.white2};
    }
  `,
  secondary: css`
    background: ${(props) => props.theme.colors.block};
    border-color: ${(props) => props.theme.colors.block};

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

  border: css`
    border-color: ${UCOLORS.blue2};
    color: ${UCOLORS.blue2};
    border-radius: ${BORDER_RADIUS.sm};
    transition: 0.3s;

    &:hover {
      border-color: ${UCOLORS.blue1};
      background-color: ${UCOLORS.blue1};
      color: ${UCOLORS.blue5};
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
    border-color: ${(props) => props.theme.colors.white1};
    color: ${(props) => props.theme.colors.white1};

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

  blue: css`
    color: ${({ theme }) => theme.colors.blue1};
    font-weight: 600;
    background: rgba(94, 85, 242, 0.15);
  `,

  red: css`
    color: ${({ theme }) => theme.colors.red1};
    background: ${({ theme }) => rgba(theme.colors.red1, 0.15)};
  `,

  // TODO: rewrite with [disabled] html attribute
  disabled: css`
    background: ${COLORS.cardsBack};
    border-color: ${COLORS.hint};
    cursor: not-allowed;
  `,

  utility: css`
    background: ${COLORS.hint};
    border-color: ${COLORS.hint};
  `,

  violet: css`
    background: ${(props) => props.theme.colors.blue6};
    border: none;
    color: ${(props) => props.theme.colors.blue2};
    white-space: nowrap;
    font-weight: 600;
    line-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;

    &:hover {
      background: ${(props) => props.theme.colors.violet6};
    }

    &:active {
      background: ${(props) => props.theme.colors.violet7};
    }
  `,

  green: css`
    background: ${(props) => props.theme.colors.green0};
    border: none;
    color: ${(props) => props.theme.colors.green1};
    white-space: nowrap;
    font-weight: 700;
    line-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;

    &:hover {
      background: ${(props) => props.theme.colors.green11};
    }

    &:active {
      background: ${(props) => props.theme.colors.green12};
    }
  `,
  none: css``,
}

export const PADDINGS = {
  xs: '1px 6px',
  sm: '2px 8px',
  md: '4px 10px', // 16px
  lg: '8px 16px',
  xl: '11px 10px',
  xxl: '15px 11px',
  xxxl: '18px 20px',
}

export type ButtonVariants = keyof typeof VARIANTS

export interface ButtonProps {
  $fontSize?: keyof typeof FONT_SIZES
  $fontFamily?: keyof typeof FONTS
  $variant?: keyof typeof VARIANTS
  $borderRadius?: keyof typeof BORDER_RADIUS
  $padding?: keyof typeof PADDINGS
  $backgroundImage?: string
  $width?: keyof typeof WIDTH
  $color?: keyof typeof COLORS
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
  color: ${(props: ButtonProps) => COLORS[props.$color || 'white']};
  text-align: center;
  font-size: ${(props: ButtonProps) => FONT_SIZES[props.$fontSize || 'md']};
  border: 1px solid transparent;
  line-height: 150%;
  cursor: pointer;
  padding: ${(props: ButtonProps) => PADDINGS[props.$padding || 'md']};
  ${(props: ButtonProps) => VARIANTS[props.$variant || 'primary']};
  font-family: ${(props: ButtonProps) => FONTS[props.$fontFamily || 'main']};
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
    border: none;
    background-color: ${(props) => props.theme.colors.disabled};
  }

  ${({ $loading: loading }: ButtonProps) =>
    loading
      ? `

    position: relative;
    &, &:disabled {
      color: transparent;
      img {
        opacity: 0;
      }
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
