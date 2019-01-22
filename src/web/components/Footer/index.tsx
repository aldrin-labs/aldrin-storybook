import * as React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Telegram from '@material-ui/icons/NearMeSharp'

import {
  changeThemeMode,
  togglePrivacyPolicy as togglePrivacyPolicyAction,
} from '@containers/App/actions'
import Props from './index.types'
import { AppBar, IconButton } from '@material-ui/core'
import { PrivacyPolicy } from '@storybook/components/index'

const Footer = ({
  changeModeTheme,
  themeMode,
  fullscreenMode,
  togglePrivacyPolicy,
  openPrivacyPolicy,
  theme: {
    palette: { secondary },
  },
}: Props) => (
  <Container position="static" color="default" fullscreenMode={fullscreenMode}>
    <Block>
      <Typography variant="caption" color="default">
        Cryptocurrencies Ai, 2018{' '}
      </Typography>

      <Typography variant="h6" color="secondary">
        •
      </Typography>

      <Button size="small" onClick={togglePrivacyPolicy} color="default">
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
        onChange={() => {
          changeModeTheme()
        }}
        value="theme"
        color="default"
      />
    </Block>
    <PrivacyPolicy open={openPrivacyPolicy} onClick={togglePrivacyPolicy} />
  </Container>
)

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

const mapStateToProps = (store: any) => ({
  themeMode: store.ui.theme,
  openPrivacyPolicy: store.ui.showPrivacyPolicy,
})

const mapDispatchToProps = (dispatch: any) => ({
  changeModeTheme: () => dispatch(changeThemeMode()),
  togglePrivacyPolicy: () => dispatch(togglePrivacyPolicyAction()),
})

export default compose(
  withTheme(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Footer)
