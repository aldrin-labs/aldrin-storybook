import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import lightBird from '@icons/lightBird.svg'

import { Button, ButtonVariants } from '../Button'

interface ShareButtonProps {
  url?: string
  text: string
  addUrl?: boolean
  variant?: ButtonVariants
  iconFirst?: true
  buttonStyle?: CSSProperties
}

const Img = styled.img<{ iconFirst?: true }>`
  height: 0.8em;
  margin: ${(props: { iconFirst?: true }) =>
    props.iconFirst ? '0 0.2em 0 0' : '0 0 0 0.2em'};
  position: relative;
  top: 1px;
`

export const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const {
    url = window.location.href,
    text,
    addUrl = false,
    variant = 'outline-white',
    iconFirst,
    buttonStyle,
  } = props
  const fullUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}${addUrl ? `&url=${encodeURIComponent(url)}` : ''}`
  return (
    <Button
      $variant={variant}
      style={buttonStyle}
      onClick={() =>
        window.open(
          fullUrl,
          'Twitter Share',
          'height=600,width=550,resizable=1'
        )
      }
    >
      {iconFirst && <Img iconFirst src={lightBird.replace(/"/gi, '')} />}
      Share
      {!iconFirst && <Img src={lightBird.replace(/"/gi, '')} />}
    </Button>
  )
}
