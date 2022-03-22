import { css } from 'styled-components'

import { COLORS } from './colors'
import { FONT_SIZES } from './fonts'

export const THEME = {
  button: {
    variants: {
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
    },
  },
  block: {
    style: css`
      border-radius: 12px;
      box-shadow: 0px 0px 48px rgba(0, 0, 0, 0.55);
      margin: 8px;
    `,
  },

  table: {
    borderColor: COLORS.borderDark,
    hoverBackground: COLORS.tableHover,
  },

  label: {
    color: COLORS.white,
  },

  checkbox: {
    color: COLORS.black,
    borderColor: COLORS.main,
  },

  input: {
    color: COLORS.white,
  },
}
