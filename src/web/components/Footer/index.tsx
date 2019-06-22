import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import styled from 'styled-components'
import { withTheme } from '@material-ui/styles'
import Telegram from '@material-ui/icons/NearMeSharp'
import {
  AppBar,
  IconButton,
  Switch,
  Typography,
  Button,
} from '@material-ui/core'

import { PrivacyPolicy } from '@sb/components/index'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
import { TOGGLE_THEME_MODE } from '@core/graphql/mutations/app/toggleThemeMode'
import Props from './index.types'

const Footer = ({
  fullscreenMode,
  getThemeModeQuery,
  toggleThemeModeMutation,
  showFooter,
}: Props) => {
  const themeMode =
    getThemeModeQuery &&
    getThemeModeQuery.app &&
    getThemeModeQuery.app.themeMode

  const [showPrivacyPolicy, togglePrivacyPolicy] = useState(false)

  if (!showFooter) {
    return null
  }

  return (
    <Container
      position="static"
      color="default"
      fullscreenMode={fullscreenMode}
    >
      <Block>
        <Typography variant="caption" color="default">
          Cryptocurrencies Ai, 2018{' '}
        </Typography>

        <Typography variant="h6" color="secondary">
          •
        </Typography>

        <Button
          size="small"
          onClick={() => togglePrivacyPolicy(!showPrivacyPolicy)}
          color="default"
        >
          Privacy Policy
        </Button>
      </Block>

      <Block>
        <IconButton href={'https://t.me/CryptocurrenciesAi'}>
          <Telegram color="secondary" width={32} height={32} />
        </IconButton>
      </Block>

      <Block>
        <Typography variant="body1" color="textPrimary">
          NIGHT MODE
        </Typography>
        <Switch
          checked={themeMode === 'dark'}
          onChange={async () => {
            await toggleThemeModeMutation()
          }}
          value="theme"
          color="default"
        />
      </Block>
      <PrivacyPolicy
        open={showPrivacyPolicy}
        onClick={() => togglePrivacyPolicy(!showPrivacyPolicy)}
      />
    </Container>
  )
}

const Container = styled(({ fullscreenMode, ...rest }) => <AppBar {...rest} />)`
  flex-wrap: nowrap;
  justify-content: space-around;
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
  }
`

const Block = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin: 0 8px;
  }
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
