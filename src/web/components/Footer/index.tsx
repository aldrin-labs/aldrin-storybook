import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import styled from 'styled-components'
import { withTheme } from '@material-ui/styles'
import Telegram from '@material-ui/icons/NearMeSharp'
import { AppBar, IconButton, Switch, Typography } from '@material-ui/core'

import { StyledButton, StyledTypography } from './index.styles'

import { PrivacyPolicy } from '@sb/components/index'
import Feedback from '@sb/components/Feedback'

import { MASTER_BUILD } from '@core/utils/config'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
import { TOGGLE_THEME_MODE } from '@core/graphql/mutations/app/toggleThemeMode'
import Props from './index.types'

const Footer = ({
  fullscreenMode,
  getThemeModeQuery,
  toggleThemeModeMutation,
  showFooter,
  isChartPage,
  theme
}: Props) => {
  const themeMode =
    getThemeModeQuery &&
    getThemeModeQuery.app &&
    getThemeModeQuery.app.themeMode

  const [showPrivacyPolicy, togglePrivacyPolicy] = useState(false)

  if (!showFooter) {
    return null
  }

  if (isChartPage) {
    return null
  }

  return (
    <Container
      theme={theme}
      position="static"
      color="default"
      fullscreenMode={fullscreenMode}
      isChartPage={isChartPage}
    >
      <RowContainer>
        <Line theme={theme} bottom={'5.7rem'}/>
        <Link  href="https://cryptocurrencies.ai/">cryptocurrencies.ai</Link>
      </RowContainer>
    </Container>
  )
}

const Container = styled(({ fullscreenMode, isChartPage, ...rest }) => (
  <AppBar {...rest} />
))`
  flex-wrap: nowrap;
  justify-content: space-between;
  transition: background 0.25s ease-in-out;
  ${(props: { fullscreenMode: boolean }) =>
    props.fullscreenMode
      ? `opacity: 0;
    position: absolute;
    top: 0;
    z-index: -100;`
      : ''};

  && {
    flex-direction: row;
    background-color: ${props => props.theme.palette.grey.additional};
    box-shadow: none;
    border-top: ${props => props.theme.palette.border.main};
  }

  height: 5.7rem;
  position: ${(props) => (props.isChartPage ? 'absolute' : 'fixed')};
  bottom: ${(props) => (props.isChartPage ? '-6.4vh' : '0')};
  z-index: 1;
`

// @media (max-width: 1920px) {
//   height: 48px;
// }

const Block = styled.div`
  display: flex;
  align-items: center;
`

const Row = styled.div`
  display: flex;
  flex-wrap: ${(props) => props.wrap || 'wrap'};
  justify-content: ${(props) => props.justify || 'center'};
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => props.align || 'center'};
  
`
const RowContainer = styled(Row)`
  width: 100%;
`
const Line = styled.div`
    position:absolute;
    top:${(props) => props.top || 'none'};
    bottom:${(props) => props.bottom || 'none'};
    width: 100%;
    height: .1rem;
    background: ${(props) => props.background || theme.palette.grey.block};
`
const Link = styled.a`
display: block;
  width: fit-content;
  color: ${(props)=>props.color || theme.palette.blue.serum};

  text-decoration: none;
  text-transform: ${(props) => props.textTransform || 'uppercase'};

  font-family: 'DM Sans', sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 109.6%;
  letter-spacing: 1px;

  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
`

export default compose(
  withTheme(),
  queryRendererHoc({
    query: GET_THEME_MODE,
    name: 'getThemeModeQuery',
  }),
  graphql(TOGGLE_THEME_MODE, {
    name: 'toggleThemeModeMutation',
  })
)(Footer)
