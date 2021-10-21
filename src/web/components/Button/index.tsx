import styled, { css } from 'styled-components'
import { COLORS, FONT_SIZES, FONTS, BORDER_RADIUS } from '../../../variables'

const VARIANTS = {
  primary: css`
    background: ${COLORS.primary};

    &:disabled {
      background: ${COLORS.hint}
    }
  `,
}

const PADDINGS = {
  md: '0 10px', // 16px
  lg: '8px 16px',
}


interface ButtonProps {
  fontSize?: keyof typeof FONT_SIZES 
  variant?: keyof typeof VARIANTS
  borderRadis?: keyof typeof BORDER_RADIUS
  padding?: keyof typeof PADDINGS
  backgroundImage?: string
}

export const Button = styled.button<ButtonProps>`
  background: none;
  border: 0;
  color: white;
  text-align: center;
  font-size:  ${(props: ButtonProps) => FONT_SIZES[props.fontSize || 'md']};
  line-height: 150%;
  padding: ${(props: ButtonProps) => PADDINGS[props.padding || 'md']};
  ${(props: ButtonProps) => VARIANTS[props.variant || 'primary']};
  font-family: ${FONTS.main};
  border-radius: ${(props: ButtonProps) => BORDER_RADIUS[props.borderRadis || 'md']};
  cursor: pointer;

  ${({ backgroundImage }: ButtonProps) => backgroundImage ? 
  `
    background-image: url(${backgroundImage});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  ` : ''}

  &:disabled {
    cursor: not-allowed;
  }

`