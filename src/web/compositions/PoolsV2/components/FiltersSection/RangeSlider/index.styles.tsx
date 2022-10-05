/* eslint-disable no-nested-ternary */
import { rgba } from 'polished'
import ReactSlider from 'react-slider'
import styled from 'styled-components'

import { StyledTrackProps } from '../types'

export const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 3px;
`

export const StyledThumb = styled.div`
  height: 16px;
  line-height: 40px;
  width: 16px;
  text-align: center;
  background-color: ${(props) => props.theme.colors.white1};
  color: #fff;
  border: 0.3em solid ${(props) => props.theme.colors.blue2};
  border-radius: 50%;
  cursor: grab;
  transform: translateY(-7px);
`

export const StyledTrack = styled.div<StyledTrackProps>`
  top: 0;
  bottom: 0;
  background: ${(props) =>
    props.index === 2
      ? props.theme.colors.white4
      : props.index === 1
      ? rgba(props.theme.colors.blue2, 0.8)
      : props.theme.colors.white4};
  border-radius: 999px;
`
