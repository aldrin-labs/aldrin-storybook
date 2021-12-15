import React, { useEffect } from 'react'
import {
  ModalContainer,
  ModalBody,
  ModalTitle,
  ModalTitleContainer,
  CloseIcon,
  ModalContent,
} from './styles'
import CloseIconImg from '@icons/closeIcon.svg'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactChild
}

export const Modal: React.FC<ModalProps> = (props) => {
  const {
    open,
    onClose,
    children,
    title,
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
    <ModalContainer onClick={() => onClose()}>
      <ModalBody onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          {title &&
            <ModalTitleContainer>
              <ModalTitle>{title}</ModalTitle>
              <CloseIcon
                src={CloseIconImg}
                onClick={() => {
                  onClose()
                }}
              />
            </ModalTitleContainer>
          }
          {children}
        </ModalContent>
      </ModalBody>
    </ModalContainer >
  )
}
