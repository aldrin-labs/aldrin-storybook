import * as React from 'react'
import styled from 'styled-components'
import withTheme from '@material-ui/core/styles/withTheme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import { changeThemeMode } from '@containers/App/actions'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import github from '../../icons/github.svg'
import telegram from '../../icons/telegram.svg'
import twitter from '../../icons/twitter.svg'
import Props from './index.types'

const socialIcons = [
  // { icon: github, link: '' },
  { icon: telegram, link: 'https://t.me/CryptocurrenciesAi' },
  // { icon: twitter, link: '' },
]

const Footer = ({
  theme: { palette },
  changeModeTheme,
  themeMode,
  hide,
}: Props) => (
  <Container
    hide={hide}
    background={
      themeMode === 'dark' ? palette.primary.dark : palette.primary.light
    }
  >
    <Block>
      <Typography variant="caption" color="default">
        Cryptocurrencies Ai, 2018{' '}
      </Typography>
      <Typography variant="title" color="secondary">
        •
      </Typography>
      <Button size="small" color="default">
        Terms of Use
      </Button>
      <Typography variant="title" color="secondary">
        •
      </Typography>
      <Button size="small" color="default">
        Privacy Policy
      </Button>
    </Block>

    <Block>
      {socialIcons.map((socio) => (
        <LinkWithIcon key={socio.icon} href={socio.link}>
          <SvgIcon
            styledComponentsAdditionalStyle={
              'opacity: 0.5; transition: all .5s linear; &:hover{opacity:1;}'
            }
            src={socio.icon}
            width={30}
            height={30}
          />
        </LinkWithIcon>
      ))}
    </Block>

    <Block>
      <Typography variant="caption" color="secondary">
        NIGHT MODE
      </Typography>
      <Switch
        checked={themeMode === 'dark'}
        onChange={() => {
          changeModeTheme()
        }}
        value="theme"
        color="secondary"
      />
    </Block>
  </Container>
)

const Link = styled.a`
  &:visited {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
`

const LinkWithIcon = styled(Link)`
  margin: 0 1rem !important;
`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background: ${(props: { background: string }) => props.background};
  transition: background 0.25s ease-in-out;
  ${(props: { hide: boolean; background: string }) =>
    props.hide
      ? `opacity: 0;
    position: absolute;
    top: 0;
    z-index: -100;`
      : ''};
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
})

const mapDispatchToProps = (dispatch: any) => ({
  changeModeTheme: () => dispatch(changeThemeMode()),
})

export default compose(
  withTheme(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Footer)
