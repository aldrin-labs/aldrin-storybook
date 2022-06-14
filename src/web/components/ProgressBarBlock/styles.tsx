import { COLORS } from '@variables/variables'
import styled from 'styled-components'

export type ProgressBar = {
  width?: string
  padding?: string
}

export type ProgressContainer = {
  background?: string
}

export const ProgressBarContainer = styled.div<ProgressContainer>`
  width: 100%;
  height: 2em;
  line-height: 2em;
  border-radius: 7px;
  position: relative;
  background: ${(props) => props.theme.colors.disabled || COLORS.cardsBack};
  padding: 0 1em;
`

export const Progress = styled.div<ProgressBar>`
  position: absolute;
  height: 100%;
  left: 0;
  bottom: 0;
  border-radius: 7px;
  background: rgba(38, 159, 19, 0.25);
  width: ${(props) => props.width || '0%'};
  display: flex;
  align-items: center;
  padding: ${(props) => props.padding || '1em'};
`
