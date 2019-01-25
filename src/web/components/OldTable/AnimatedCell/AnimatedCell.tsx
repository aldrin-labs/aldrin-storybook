import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { Typography } from '@material-ui/core'

import { Cell as RowCell } from '@components/Table/Table'

export interface IProps {
  color: string
  width: string
  value: any
  animation:
    | 'fadeInRedAndBack'
    | 'fadeInGreenAndBack'
    | 'fadeInRed'
    | 'fadeInGreen'
}

class AnimatedCell extends Component<IProps> {
  state = {
    animated: true,
  }

  startAnimation(callback: Function) {
    // https://stanko.github.io/react-rerender-in-component-did-mount/
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        callback()
      })
    })
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.value !== this.props.value) {
      this.setState({ animated: false })
      setTimeout(() => {
        this.startAnimation(() => {
          this.setState({ animated: true })
        })
      }, 10)
    }
  }

  render() {
    const { color, width, value, animation, children } = this.props
    const { animated } = this.state

    return (
      <Cell animated={'none'} {...{ color, width }}>
        <Typography variant="body1" color="default">
          {value}
        </Typography>
        {children}
      </Cell>
    )
  }
}

const fadeInGreenAndBack = keyframes`
0% {
  color: #9ca2aa;
}
50% {
  color: #34cb86d1;
}
100% {
  color: #9ca2aa;
}
`
const fadeInRedAndBack = keyframes`
0% {
  color: #9ca2aa;
}
50% {
  color: #d77455;

}
100% {
  color: #9ca2aa;

}
`
const fadeInGreen = keyframes`
0% {
  color: #34cb86d1; 
}
50% {
  color: #9ca2aa;
}
100% {
  color: #34cb86d1;
}

`
const fadeInRed = keyframes`
0% {
  color: #d77455;
}
50% {
  color: #9ca2aa;
}
100% {
  color: #d77455;
}

`

const Cell = styled(RowCell)`
  position: relative;
  animation: ${(props: { animated?: string; width: string; color: string }) => {
    if (props.animated === 'none') {
      return ''
    }

    if (props.animated === 'fadeInGreenAndBack') {
      return `${fadeInGreenAndBack} 1.5s ease`
    }

    if (props.animated === 'fadeInRedAndBack') {
      return `${fadeInRedAndBack} 1.5s ease`
    }

    if (props.animated === 'fadeInRed') {
      return `${fadeInRed} 1.5s ease`
    }

    if (props.animated === 'fadeInGreen') {
      return `${fadeInGreen} 1.5s ease`
    }

    return ''
  }};
`

export default AnimatedCell
