import React, { useEffect } from 'react'

import {
  ModalContainer,
  ModalBody,
  ModalTitle,
  ModalTitleContainer,
  ModalContent,
  ModalSubtitle,
  CloseButton,
} from './styles'
import { ModalCommon, ModalProps } from './types'

export const ModalTitleBlock: React.FC<ModalCommon> = (props) => {
  const { title, subTitle, onClose } = props
  return (
    <ModalTitleContainer>
      <div>
        {title && <ModalTitle>{title}</ModalTitle>}
        {subTitle && <ModalSubtitle>{subTitle}</ModalSubtitle>}
      </div>
      <CloseButton
        $padding="lg"
        $variant="secondary"
        onClick={() => {
          onClose()
        }}
      >
        Esc
      </CloseButton>
    </ModalTitleContainer>
  )
}

export const Modal: React.FC<ModalProps> = (props) => {
  const { open, onClose, children, title, subTitle, backdrop = 'blur' } = props

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
    <ModalContainer backdrop={backdrop} onClick={() => onClose()}>
      <ModalBody onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          {(title || subTitle) && (
            <ModalTitleBlock
              subTitle={subTitle}
              title={title}
              onClose={onClose}
            />
          )}
          {children}
        </ModalContent>
      </ModalBody>
    </ModalContainer>
  )
}
