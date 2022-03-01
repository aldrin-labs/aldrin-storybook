import { COLORS, BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

import { BlockContent } from '../../Block'
import { WalletButton } from '../styles'
import { ProgressBarProps } from './types'

export const RewardsButton = styled(WalletButton)`
  color: ${COLORS.newOrange};
  background: ${COLORS.newOrangeTransparent};
  padding-left: 10px;
  padding-right: 10px;
  width: auto;
  margin-right: 20px;

  &:hover,
  &:active,
  &:focus {
    background: ${COLORS.newOrangeTransparent};
  }
`

export const RewardsContent = styled(BlockContent)`
  width: 100vw;
  max-width: 440px;
  background: ${COLORS.cardsBack};
  margin: 20px;
  border-radius: ${BORDER_RADIUS.md};
`

export const Separator = styled.div`
  border-bottom: 1px solid ${COLORS.blockBlackBackground};
  margin: 20px 0;
`

export const ProgressBar = styled.div<ProgressBarProps>`
  height: 80px;
  background: ${COLORS.blockBlackBackground};
  border-radius: ${BORDER_RADIUS.md};
  flex: 1;
  margin-left: 30px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;

  &:before {
    content: '';
    height: 100%;
    background: ${COLORS.successTransparent};
    border-radius: ${BORDER_RADIUS.md};
    flex: 1;
    width: ${(props: ProgressBarProps) => props.value}%;
    position: absolute;
    left: 0;
    top: 0;
  }
`
