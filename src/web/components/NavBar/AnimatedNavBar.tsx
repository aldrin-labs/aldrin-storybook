import React, { Component } from 'react'
import posed from 'react-pose'
import styled from 'styled-components'

import { NavBar } from './NavBar'

export interface Props {
  hide?: boolean
  pathname: string
}
const AnimatedContainer = styled(
  posed.div({
    visible: { bottom: 0, opacity: 1 },
    hidden: { bottom: 100, opacity: 0.25 },
  })
)`
  position: sticky;
  z-index: 999;
  height: 3rem;

  @media (max-width: 1400px) {
    height: 5rem;
  }
`

export default class AnimatedNavBar extends Component<Props> {
  state = {
    delayedHide: false,
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.hide !== this.props.hide) {
      setTimeout(() => {
        this.setState({ delayedHide: this.props.hide })
      }, 300)
    }
  }

  render() {
    const { hide, pathname } = this.props
    const { delayedHide } = this.state
    return (
      <AnimatedContainer pose={hide ? 'hidden' : 'visible'}>
        <NavBar pathname={pathname} $hide={delayedHide} />
      </AnimatedContainer>
    )
  }
}
