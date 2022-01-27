import { ReactNode } from 'react'

import { BackdropStyle } from './styles'

export type ModalBackdropStyle = keyof typeof BackdropStyle

export interface ModalContainerProps {
  backdrop: ModalBackdropStyle
}

export interface ModalCommon {
  onClose: () => void
  title?: ReactNode
  subTitle?: ReactNode
}

export interface ModalProps extends ModalCommon {
  open: boolean
  backdrop?: ModalBackdropStyle
  className?: string
}
