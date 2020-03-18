import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { NavBar } from './NavBar'

export interface Props {
  pathname: string
}
const AnimatedContainer = styled.div`
  position: sticky;
  z-index: 999;
  height: 3.8rem;

  @media (max-width: 1400px) {
    height: 5rem;
  }
`

export default class AnimatedNavBar extends PureComponent<Props> {
  render() {
    const { pathname } = this.props

    return (
      <AnimatedContainer>
        <NavBar pathname={pathname} />
      </AnimatedContainer>
    )
  }
}
