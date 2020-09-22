import React, { useState } from 'react'
import styled from 'styled-components'

export const TooltipContainer = styled.div`
  & > div[datatype='tooltip'] {
    transform: scale(1, 0) translateZ(0px)
      translateX(${(props) => props.translateX || '0%'});
    opacity: 0;
    transition: opacity 350ms 0ms,
      transform 0ms cubic-bezier(0.4, 0, 0.2, 1) 350ms;
  }

  &:hover > div[datatype='tooltip'] {
    opacity: 1;
    transition: opacity 350ms 0ms;
    transform: scale(1, 1) translateZ(0px)
      translateX(${(props) => props.translateX || '0%'});
  }
`

export const Tooltip = styled(({ ...props }) => (
  <div {...props} datatype="tooltip" />
))`
  position: absolute;
  top: 150%;
  padding: 0.4rem 2rem;
  background: rgba(22, 37, 61, 0.8);
  color: #fff;
  border-radius: 1.6rem;
  box-shadow: 0px 0px 1.6rem rgba(8, 22, 58, 0.1);
  z-index: 10;
  font-size: 1.2rem;
`

import { Tooltip as MUTooltip } from '@material-ui/core'

export const DarkTooltip = styled((props) => (
  <MUTooltip
    classes={{ popper: props.className, tooltip: 'tooltip' }}
    enterDelay={1000}
    {...props}
  />
))`
  & .tooltip {
    background-color: rgb(22, 37, 61);
    color: #fff;
    box-shadow: 0px 0px 8px rgba(8, 22, 58, 0.1);
    font-size: 1.2rem;
    max-width: ${(props) => props.maxWidth || 'auto'};
  }
`
