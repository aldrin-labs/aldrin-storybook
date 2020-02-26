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
      position="static"
      color="default"
      fullscreenMode={fullscreenMode}
      isChartPage={isChartPage}
    >
      <Block style={{ paddingLeft: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: '2rem',
            borderRight: '.1rem solid #e0e5ec',
            height: '100%',
          }}
        >
          <StyledTypography>Cryptocurrencies Ai, 2020 </StyledTypography>
        </div>

        {/* <Typography variant="h6" color="secondary">
          •
        </Typography> */}

        <StyledButton
          size="small"
          onClick={() => togglePrivacyPolicy(!showPrivacyPolicy)}
          color="default"
          style={{ marginLeft: '1rem' }}
        >
          Privacy Policy
        </StyledButton>
      </Block>

      <Block>
        <Feedback />
        {/* <IconButton href={'https://t.me/CryptocurrenciesAi'}>
          <Telegram color="secondary" width={32} height={32} />
        </IconButton> */}
      </Block>

      {/* {!MASTER_BUILD && (
        <Block>
          <StyledTypography color="textPrimary">NIGHT MODE</StyledTypography>
          <Switch
            checked={themeMode === 'dark'}
            onChange={async () => {
              await toggleThemeModeMutation()
            }}
            value="theme"
            color="default"
          />
        </Block>
      )} */}
      <PrivacyPolicy
        open={showPrivacyPolicy}
        onClick={() => togglePrivacyPolicy(!showPrivacyPolicy)}
      />
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
    background-color: #f9fbfd;
    box-shadow: none;
    border-top: 0.1rem solid #e0e5ec;
  }

  height: 6.4vh;
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

export default compose(
  withTheme,
  queryRendererHoc({
    query: GET_THEME_MODE,
    name: 'getThemeModeQuery',
  }),
  graphql(TOGGLE_THEME_MODE, {
    name: 'toggleThemeModeMutation',
  })
)(Footer)
