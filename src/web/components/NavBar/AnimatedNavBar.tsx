import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { NavBar } from './NavBar'
import CardsPanel  from '@sb/compositions/Chart/components/CardsPanel'
import { ChartGridContainer } from '@sb/compositions/Chart/Chart.styles'
import { withTheme } from '@material-ui/core'
import { compose } from 'recompose'

export interface Props {
  pathname: string
}
const AnimatedContainer = styled.div`
  position: sticky;
  z-index: 999;
  height: 5.4vh;

  @media (max-width: 1400px) {
    height: 5.4vh;
  }
`

class AnimatedNavBar extends PureComponent<Props> {
  render() {
    const { theme } = this.props

    return (
      <ChartGridContainer theme={theme} >
        <CardsPanel />
      </ChartGridContainer>
    )
  }
}

export default compose(withTheme())(AnimatedNavBar)