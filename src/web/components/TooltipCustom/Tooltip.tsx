import { Tooltip as MUTooltip } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

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
  background: ${(props) => props.theme.colors.tooltip};
  color: ${(props) => props.theme.colors.white1};
  border-radius: 1.6rem;
  box-shadow: 0px 0px 1.6rem rgba(8, 22, 58, 0.1);
  z-index: 10;
  font-size: 12px;
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
      title={title}
      {...p}
    >
      {children}
    </MUTooltip>
  )
})`
  & .tooltip {
    background: ${(props) => props.theme.colors.tooltip};
    color: ${(props) => props.theme.colors.white1};
    font-family: Avenir Next Medium;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: right;
    letter-spacing: -0.523077px;
    border-radius: 1.2rem;
    opacity: 1;
    max-width: ${(props) => props.maxWidth || 'auto'};
  }
`
