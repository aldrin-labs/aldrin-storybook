import React from 'react'
import styled from 'styled-components'

import DeleteIcon from '@material-ui/icons/Delete'
import { Card } from '@material-ui/core'
import Slider from '@material-ui/lab/Slider'


export const SDeleteIcon = styled(({hoverColor, ...rest}) => <DeleteIcon {...rest}/>)`
  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }
`

export const LoaderWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props: { background: string }) => props.background};

  z-index: 1000;

  & > div {
    z-index: 1;
  }
`

export const LoaderInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const ContentInner = styled(({...props}) => <Card {...props} />)`
  height: 100%;
  display: flex;
`

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const StyledSlider = styled(({trackAfterBackground, trackBeforeBackground, trackAfterOpacity, thumbBackground, ...rest}) => <Slider {...rest} />)`
  & .trackAfter {
    background: ${(props: { trackAfterBackground: string }) => props.trackAfterBackground};
    opacity: ${(props: { trackAfterOpacity: string }) => props.trackAfterOpacity};
  }
  
  & .trackBefore {
    background: ${(props: { trackBeforeBackground: string }) => props.trackBeforeBackground};
    opacity: 1;
  }
  
  & .thumb {
    background: ${(props: { thumbBackground: string }) => props.thumbBackground};;
  }
`
export const TitleItem = styled.div``
