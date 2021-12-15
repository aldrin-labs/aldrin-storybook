import React from 'react'
import styled from 'styled-components'

import { Tooltip as MUTooltip } from '@material-ui/core'

export const TooltipContainer = styled.div`
  & > div[datatype='tooltip'] {
    transform: scale(1, 0) translateZ(0px)
      translateX(${(props) => props.translateX || '0%'});
    opacity: 1;
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
  background: rgba(22, 37, 61);
  color: #fff;
  border-radius: 1.6rem;
  box-shadow: 0px 0px 1.6rem rgba(8, 22, 58, 0.1);
  z-index: 10;
  font-size: 1.2rem;
`

export const DarkTooltip = styled((props) => {
  const { children, title, ...p } = props
  if (!title) {
    return children
  }
  return (
    <MUTooltip
      classes={{ popper: props.className, tooltip: 'tooltip' }}
      style={{ opacity: '1' }}
      enterDelay={props.delay || 100}
      {...p}
    >
      {children}
    </MUTooltip>
  )
})`
  & .tooltip {
    background: #222429;
    border: 1px solid #3a475c;
    font-family: Avenir Next Medium;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: right;
    letter-spacing: -0.523077px;
    border-radius: 1.2rem;
    color: #f8faff;
    font-size: 1.3rem;
    opacity: 1;
    max-width: ${(props) => props.maxWidth || 'auto'};
  }
`
