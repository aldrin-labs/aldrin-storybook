import React from 'react'

import SunSvg from '@icons/sun.svg'
import MoonSvg from '@icons/moon.svg'

import DisabledSunSvg from '@icons/sunDisabled.svg'
import ActiveMoonSvg from '@icons/moonActive.svg'

import SvgIcon from '@sb/components/SvgIcon'
import {
  ExchangePair,
  SelectR,
} from '../AutoSuggestSelect/AutoSuggestSelect.styles'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { Text, Row } from './index.styles'

class IntegrationReactSelect extends React.PureComponent {
  state = {
    isClosed: true,
    isMenuOpen: false,
  }

  onMenuOpen = () => {
    this.setState({ isClosed: false })
  }

  onMenuClose = () => {
    this.setState({ isClosed: true })
  }

  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }))
  }

  closeMenu = () => {
    this.setState({ isMenuOpen: false })
  }

  openMenu = () => {
    this.setState({ isMenuOpen: true })
  }

  render() {
    const {
      value,
      theme,
      themeMode,
      hedgeMode,
      toggleThemeMode,
      changePositionModeWithStatus,
      selectStyles,
      updateFavoritePairsMutation,
      marketType,
      activeExchange,
      hideDepthChart,
      hideOrderbook,
      hideTradeHistory,
      hideTradingViewChart,
      changeChartLayout,
    } = this.props

    const { isClosed, isMenuOpen } = this.state

    return (
      <>
        {isMenuOpen && (
          <Row
            direction="column"
            style={{
              top: '2.5rem',
              right: '.8rem',
              position: 'absolute',
              zIndex: 900,
              background: theme.palette.white.background,
              width: '22rem',
              marginTop: '3rem',
              borderRadius: '.4rem',
              overflow: 'hidden',
              border: theme.palette.border.main,
              boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
            }}
          >
            <Row
              width={'100%'}
              style={{
                padding: '.5rem 0',
                borderBottom: theme.palette.border.main,
              }}
            >
              <Row
                width="50%"
                style={{
                  borderRight: theme.palette.border.main,
                  padding: '1rem 0',
                  cursor: 'pointer',
                }}
                onClick={themeMode === 'light' ? null : toggleThemeMode}
              >
                <SvgIcon src={themeMode === 'dark' ? DisabledSunSvg : SunSvg} />
                <Text
                  active={themeMode === 'light'}
                  theme={theme}
                  style={{ paddingLeft: '.8rem' }}
                >
                  light
                </Text>
              </Row>
              <Row
                width="50%"
                style={{
                  padding: '.8rem 0',
                  cursor: 'pointer',
                }}
                onClick={themeMode === 'dark' ? null : toggleThemeMode}
              >
                <SvgIcon src={themeMode === 'dark' ? ActiveMoonSvg : MoonSvg} />
                <Text
                  active={themeMode === 'dark'}
                  theme={theme}
                  style={{
                    paddingLeft: '.8rem',
                    color:
                      themeMode === 'dark'
                        ? '#CBDAF3'
                        : theme.palette.grey.text,
                  }}
                >
                  dark
                </Text>
              </Row>
            </Row>
            <Row
              justify="flex-start"
              style={{
                padding: '1rem',
                borderBottom: theme.palette.border.main,
                cursor: 'pointer',
              }}
              onClick={() =>
                changeChartLayout({
                  hideDepthChart: !hideDepthChart,
                  ...(!hideDepthChart
                    ? {}
                    : { hideOrderbook: false, hideTradeHistory: false }),
                })
              }
            >
              <SCheckbox
                style={{ padding: '.4rem .8rem' }}
                checked={!hideDepthChart}
              />
              <Text theme={theme} style={{ paddingBottom: '.15rem' }}>
                depth chart
              </Text>
            </Row>
            <Row
              justify="flex-start"
              style={{
                padding: '1rem',
                borderBottom: theme.palette.border.main,
                cursor: 'pointer',
              }}
              onClick={() =>
                changeChartLayout({
                  hideOrderbook: !hideOrderbook,
                  ...(!hideOrderbook
                    ? { hideDepthChart: true }
                    : { hideTradeHistory: false }),
                })
              }
            >
              <SCheckbox
                style={{ padding: '.4rem .8rem' }}
                checked={!hideOrderbook}
              />
              <Text theme={theme} style={{ paddingBottom: '.15rem' }}>
                orderbook
              </Text>
            </Row>
            <Row
              justify="flex-start"
              style={{
                padding: '1rem',
                borderBottom: theme.palette.border.main,
                cursor: 'pointer',
              }}
              onClick={() =>
                changeChartLayout({
                  hideTradeHistory: !hideTradeHistory,
                  ...(!hideTradeHistory
                    ? { hideOrderbook: true, hideDepthChart: true }
                    : {}),
                })
              }
            >
              <SCheckbox
                style={{ padding: '.4rem .8rem' }}
                checked={!hideTradeHistory}
              />
              <Text theme={theme} style={{ paddingBottom: '.15rem' }}>
                trade history
              </Text>
            </Row>
            <Row
              justify="flex-start"
              style={{
                padding: '1rem',
                borderBottom: theme.palette.border.main,
                cursor: 'pointer',
              }}
              onClick={() =>
                changeChartLayout({
                  hideTradingViewChart: !hideTradingViewChart,
                  // ...(!hideTradingViewChart
                  //   ? { hideOrderbook, hideDepthChart, hideTradingViewChart, }
                  //   : {}),
                })
              }
            >
              <SCheckbox
                style={{ padding: '.4rem .8rem' }}
                checked={!hideTradingViewChart}
              />
              <Text theme={theme} style={{ paddingBottom: '.15rem' }}>
                Main Chart
              </Text>
            </Row>
            <Row
              width={'100%'}
              style={{
                padding: '.5rem 0',
              }}
            >
              <Row
                width="50%"
                style={{
                  borderRight: theme.palette.border.main,
                  padding: '1rem 0',
                  cursor: 'pointer',
                }}
                onClick={
                  hedgeMode ? () => changePositionModeWithStatus(false) : null
                }
              >
                <Text active={!hedgeMode} theme={theme}>
                  one-way
                </Text>
              </Row>
              <Row
                width="50%"
                style={{ padding: '.8rem 0', cursor: 'pointer' }}
                onClick={
                  !hedgeMode ? () => changePositionModeWithStatus(true) : null
                }
              >
                <Text active={hedgeMode} theme={theme}>
                  hedge
                </Text>
              </Row>
            </Row>
          </Row>
        )}
        <ExchangePair
          style={{ marginLeft: '.8rem' }}
          selectStyles={selectStyles}
          onClick={this.toggleMenu}
          // onMouseOver={this.openMenu}
        >
          <SelectR
            id={this.props.id}
            style={{ width: '100%' }}
            value={isClosed && value && { value, label: value }}
            fullWidth={true}
            isDisabled={true}
          />
        </ExchangePair>
      </>
    )
  }
}

export default IntegrationReactSelect
