import React, { useEffect, ReactNode } from 'react'

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
  width?: string
  styles?: {
    root?: Record<string, any>
    body?: Record<string, any>
    content?: Record<string, any>
  }
}

export const ModalTitleBlock: React.FC<ModalCommon> = (props) => {
  const { title, onClose } = props

  return (
    <ModalTitleContainer>
      <ModalTitle>{title}</ModalTitle>
      <CloseIcon onClick={onClose}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 18L9.5 9.5M18 1L9.5 9.5M9.5 9.5L18 18L1 1"
            stroke="#F5F5FB"
            strokeWidth="2"
          />
        </svg>
      </CloseIcon>
    </ModalTitleContainer>
  )
}

export const Modal: React.FC<ModalProps> = (props) => {
  const {
    open,
    onClose,
    children,
    title,
    backdrop = 'blur',
    width,
    styles = {
      root: {},
      body: {},
      content: {},
    },
  } = props

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
      backdrop={backdrop}
      onClick={() => onClose()}
      style={styles.root}
    >
      <ModalBody
        onClick={(e) => e.stopPropagation()}
        $width={width}
        style={styles.body}
      >
        <ModalContent style={styles.content}>
          <>
            {title && <ModalTitleBlock title={title} onClose={onClose} />}
            {children}
          </>
        </ModalContent>
      </ModalBody>
    </ModalContainer>
  )
}
