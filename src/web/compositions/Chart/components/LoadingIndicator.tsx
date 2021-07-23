import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useEffectAfterTimeout } from '@sb/dexUtils/utils'
import styled from 'styled-components'

const Root = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%
    padding: 2`

export default function LoadingIndicator({
  height = null,
  delay = 500,
  ...rest
}) {
  const [visible, setVisible] = useState(false)

  useEffectAfterTimeout(() => setVisible(true), delay)

  let style = {}
  if (height) {
    style.height = height
  }

  if (!visible) {
    return height ? <div style={style} /> : null
  }

  return (
    <Root style={style} {...rest}>
      <CircularProgress />
    </Root>
  )
}
