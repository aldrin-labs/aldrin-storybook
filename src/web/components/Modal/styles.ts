import { Paper } from '@material-ui/core'
import styled from 'styled-components'
import { Block, BlockContent } from '../Block'
import { Page } from '../Layout'
import { SvgIcon } from '@sb/components'
import { COLORS } from '../../../variables/variables'

export const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  max-width: 100%;
  min-width: auto;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 1.6rem;
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
`

export const ModalBody = styled(Block)`
  height: auto;
  max-width: 80em;
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
  margin-bottom: 20px;
`

export const CloseIcon = styled(SvgIcon)`
  cursor: pointer;
`