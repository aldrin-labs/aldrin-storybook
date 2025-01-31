import styled, { css, keyframes } from 'styled-components'

import { Block, BlockContent } from '../Block'
import { Page } from '../Layout'

const kf = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const BackdropStyle = {
  blur: css`
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
  `,
  dark: css`
    background: rgba(0, 0, 0, 0.5);
  `,
  none: css``,
}

export type ModalBackdropStyle = keyof typeof BackdropStyle

interface ModalContainerProps {
  backdrop: ModalBackdropStyle
}

export const ModalContainer = styled(Page)<ModalContainerProps>`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  z-index: 101;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  animation: 0.1s ${kf} ease-out;

  ${(props: ModalContainerProps) => BackdropStyle[props.backdrop]}
`

type ModalBodyProps = {
  $width?: string
}

export const ModalBody = styled(Block)<ModalBodyProps>`
  height: auto;
  max-width: 80em;
  max-height: 95vh;
  overflow: auto;
  background: ${(props) => props.theme.colors.white6};
  width: ${(props) => props.$width || 'auto'};
`

export const ModalContent = styled(BlockContent)`
  padding: 0;
`

export const ModalTitle = styled.h3`
  margin: 0;
  color: ${(props) => props.theme.colors.white1};
`

export const ModalTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
`

export const CloseIcon = styled.div`
  cursor: pointer;
  width: 2rem;
  height: 3rem;

  svg {
    path {
      stroke: ${(props) => props.theme.colors.white1};
    }
  }
`
