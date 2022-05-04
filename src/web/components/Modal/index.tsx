import React, { useEffect, ReactNode } from 'react'

import CloseIconImg from '@icons/closeIcon.svg'

import {
  ModalContainer,
  ModalBody,
  ModalTitle,
  ModalTitleContainer,
  CloseIcon,
  ModalContent,
  ModalBackdropStyle,
} from './styles'

interface ModalCommon {
  onClose: () => void
  title?: ReactNode
}

interface ModalProps extends ModalCommon {
  open: boolean
  backdrop?: ModalBackdropStyle
}

export const ModalTitleBlock: React.FC<ModalCommon> = (props) => (
  <ModalTitleContainer>
    <ModalTitle>{props.title}</ModalTitle>
    <CloseIcon
      src={CloseIconImg}
      onClick={() => {
        props.onClose()
      }}
    />
  </ModalTitleContainer>
)

export const Modal: React.FC<ModalProps> = (props) => {
  const { open, onClose, children, title, backdrop = 'blur' } = props

  if (!open) {
    return null
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [])

  return (
    <ModalContainer
      $background="gray6"
      backdrop={backdrop}
      onClick={() => onClose()}
    >
      <ModalBody onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          {title && <ModalTitleBlock title={title} onClose={onClose} />}
          {children}
        </ModalContent>
      </ModalBody>
    </ModalContainer>
  )
}
