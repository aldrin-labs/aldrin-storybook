import React, { PureComponent } from 'react'
import { withRouter } from 'react-router'
import { compose } from 'recompose'
import styled from 'styled-components'
import { getSearchParamsObject } from '@sb/compositions/App/App.utils'
import { NavBar } from './NavBar'
import { syncStorage } from '@storage'

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
    const { location: { pathname, search } } = this.props

    const pageIsRegistration = pathname.includes('regist')
    const searchParamsObject = getSearchParamsObject({ search })
    const isRefInUrlParamExist = !!searchParamsObject['ref']
    if (isRefInUrlParamExist) {
      const ref = searchParamsObject['ref']
      syncStorage.setItem('ref', ref)
    }
    const isDiscountCodeExist = !!searchParamsObject['code']
    if (isDiscountCodeExist) {
      const code = searchParamsObject['code']
      syncStorage.setItem('code', code)
    }

    return (
      pageIsRegistration ? null :
      <AnimatedContainer>
        <NavBar pathname={pathname} />
      </AnimatedContainer>
    )
  }
}

export default compose(withRouter)(AnimatedNavBar)
