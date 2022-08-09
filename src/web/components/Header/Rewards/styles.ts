import { COLORS, BORDER_RADIUS } from '@variables/variables'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { BlockContent } from '../../Block'
import { ProgressBarProps } from './types'

export const Img = styled.img`
  border-radius: ${BORDER_RADIUS.md};
`

export const RewardsContent = styled(BlockContent)`
  max-width: 440px;
  width: 80vw;
  background: ${(props) => props.theme.colors.white4};
  margin: 20px;
  border-radius: ${BORDER_RADIUS.md};
`

export const Separator = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.colors.line};
  margin: 20px 0;
`

export const ProgressBar = styled.div<ProgressBarProps>`
  height: 80px;
  background: ${(props) => props.theme.colors.white5};
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
    width: ${(props: ProgressBarProps) => props.$value}%;
    position: absolute;
    left: 0;
    top: 0;
  }
`

export const RewardsLink = styled(Link)`
  color: ${(props) => props.theme.colors.green3};
`
