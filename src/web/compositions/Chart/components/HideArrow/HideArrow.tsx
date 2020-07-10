import React from 'react'
import styled from 'styled-components'

const HideArrowStyledBlock = styled(({ right, ...props }) => (
  <div {...props} />
))`
  &&:hover {
    background-color: #fff;
  }
  position: absolute;
  cursor: pointer;
  top: 50%;
  right: ${({ right }) => (right ? right : '-6px')};
  transform: translate(-50%, -50%);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #165be0;
  font-weight: bold;
  border: 1px solid #e0e5ec;
  z-index: 9;
`

export const HideArrow = ({
  revertArrow,
  right,
  onClick,
  ...props
}: {
  revertArrow?: boolean
  right?: string
  onClick: () => Promise<any>
  props?: any[]
}) => {
  return (
    <HideArrowStyledBlock right={right} onClick={onClick} {...props}>{`${
      revertArrow ? '<' : '>'
    }`}</HideArrowStyledBlock>
  )
}
