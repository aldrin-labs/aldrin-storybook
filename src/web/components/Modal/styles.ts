import { SvgIcon } from '@sb/components'
import styled, { keyframes } from 'styled-components'
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

export const ModalContainer = styled(Page)`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 100;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(30px);

    animation: 0.1s ${kf} ease-out;
`

export const ModalBody = styled(Block)`
  height: auto;
  max-width: 80em;
  max-height: 95vh;
  overflow: auto;

`

export const ModalContent = styled(BlockContent)`
  padding: 0;
`

export const ModalTitle = styled.h3`
  margin: 0;
`

export const ModalTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
`

export const CloseIcon = styled(SvgIcon)`
  cursor: pointer;
`