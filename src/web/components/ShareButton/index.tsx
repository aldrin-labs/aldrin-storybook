import React from 'react'
import styled from 'styled-components'

import lightBird from '@icons/lightBird.svg'

import { Button } from '../Button'

interface ShareButtonProps {
  url?: string
  text: string
}

const Img = styled.img`
  height: 0.8em;
  margin-left: 1em;
  position: relative;
  top: 1px;
`

export const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const { url = window.location.href, text } = props
  const fullUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  return (
    <Button
      borderRadius="lg"
      variant="outline-white"
      onClick={() => window.open(fullUrl, 'Twitter Share', 'height=600,width=550,resizable=1')}
    >
      Share
      <Img src={lightBird.replace(/"/gi, '')} />
    </Button>
  )
}