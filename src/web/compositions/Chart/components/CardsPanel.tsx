import React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { useLocation, useHistory } from 'react-router-dom'
import AutoSuggestSelect from '../Inputs/AutoSuggestSelect/AutoSuggestSelect'
import PreferencesSelect from '../Inputs/PreferencesSelect'
import LayoutSelector from '@core/components/LayoutSelector'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import KeySelector from '@core/components/KeySelector'
import SelectExchange from '../Inputs/SelectExchange/SelectExchange'
import { getActiveStrategies } from '@core/graphql/queries/chart/getActiveStrategies'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { IProps, IQueryProps, INextQueryProps } from './TradingTabs.types'

import {
  SmartTradeButton,
  ChangeTerminalButton,
  ChangeTradeButton,
} from '@sb/components/TraidingTerminal/styles'
import MarketStats from './MarketStats/MarketStats'
import { TooltipCustom } from '@sb/components/index'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { changePositionMode } from '@core/graphql/mutations/chart/changePositionMode'
import { TOGGLE_THEME_MODE } from '@core/graphql/mutations/app/toggleThemeMode'
import { changeHedgeModeInCache } from '@core/utils/tradingComponent.utils'
import { checkLoginStatus } from '@core/utils/loginUtils'
import { PanelWrapper, CustomCard } from '../Chart.styles'
import { withApolloPersist } from '@sb/compositions/App/ApolloPersistWrapper/withApolloPersist'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
import { updateThemeMode } from '@core/graphql/mutations/chart/updateThemeMode'
import { writeQueryData } from '@core/utils/TradingTable.utils'
import { getThemeMode } from '@core/graphql/queries/chart/getThemeMode'
import { Button } from '@material-ui/core'

const selectStyles = (theme: Theme) => ({
  height: '100%',
  background: theme.palette.white.background,
  marginRight: '.8rem',
  cursor: 'pointer',
  padding: 0,
  backgroundColor: theme.palette.white.background,
  border: theme.palette.border.main,
  borderRadius: '0.75rem',
  boxShadow: '0px 0px 1.2rem rgba(8, 22, 58, 0.1)',
  width: '20%',
  '& div': {
    cursor: 'pointer',
    color: theme.palette.dark.main,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  '& svg': {
    color: theme.palette.grey.light,
  },
  '.custom-select-box__control': {
    padding: '0 .75rem',
  },
  '.custom-select-box__menu': {
    minWidth: '130px',
    marginTop: '0',
    borderRadius: '0',
    boxShadow: '0px 4px 8px rgba(10,19,43,0.1)',
  },
})

export const CardsPanel = ({
  _id,
  pair,
  view,
  theme,
  themeMode,
  activeExchange,
  terminalViewMode,
  isDefaultTerminalViewMode,
  updateTerminalViewMode,
  marketType,
  quantityPrecision,
  pricePrecision,
  changePositionModeMutation,
  selectedKey,
  showChangePositionModeResult,
  toggleThemeMode,
  hideDepthChart,
  hideOrderbook,
  hideTradeHistory,
  hideTradingViewChart,
  isDefaultOnlyTables,
  changeChartLayout,
  persistorInstance,
  updateThemeModeMutation,
  getActiveStrategiesQuery: {
    getActiveStrategies = { strategies: [], count: 0 },
  } = {
    getActiveStrategies: { strategies: [], count: 0 },
  },
}) => {
  const hedgeMode = selectedKey.hedgeMode

  const changePositionMode = async (hedgeMode: boolean) => {
    try {
      const result = await changePositionModeMutation({
        variables: {
          keyId: selectedKey.keyId,
          hedgeMode,
        },
      })

      return result.data.changePositionMode
    } catch (err) {
      return { errors: err }
    }
  }

  const changePositionModeWithStatus = async (hedgeMode: boolean) => {
    changeHedgeModeInCache({
      selectedTradingKey: selectedKey.keyId,
      hedgeMode,
      isFuturesWarsKey: selectedKey.isFuturesWarsKey,
    })

    const result = await changePositionMode(hedgeMode)

    if (
      (result.status === 'ERR' || result.errors) &&
      result.binanceMessage !== 'No need to change position side.'
    ) {
      changeHedgeModeInCache({
        selectedTradingKey: selectedKey.keyId,
        hedgeMode: !hedgeMode,
        isFuturesWarsKey: selectedKey.isFuturesWarsKey,
      })
    }

    showChangePositionModeResult(result, 'Position mode')
  }

  const activeTradesLength = getActiveStrategies.strategies.filter(
    (a) =>
      a !== null &&
      (a.enabled ||
        (a.conditions.isTemplate && a.conditions.templateStatus !== 'disabled'))
  ).length

  const history = useHistory()
  const location = useLocation()
  const { pathname } = location

  const authenticated = checkLoginStatus()
  const isSmartOrderMode = terminalViewMode === 'smartOrderMode'

  return (
    <>
      <PanelWrapper>
        {/* {view === 'onlyCharts' && (
          <LayoutSelector userId={_id} themeMode={themeMode} />
        )} */}

        {/* <SelectExchange
          style={{ height: '100%', width: '20%' }}
          changeActiveExchangeMutation={changeActiveExchangeMutation}
          activeExchange={activeExchange}
          currencyPair={pair}
          selectStyles={selectStyles}
        /> */}

        <CustomCard
          theme={theme}
          style={{
            position: 'relative',
            display: 'flex',
            maxWidth: marketType === 0 ? '50%' : '58.33333%',
            marginRight: '.4rem',
            flexGrow: 1,
            border: '0',
          }}
        >
          <MarketStats
            theme={theme}
            symbol={pair}
            marketType={marketType}
            exchange={activeExchange}
            quantityPrecision={quantityPrecision}
            pricePrecision={pricePrecision}
          />
        </CustomCard>

        {view === 'default' && (
          <KeySelector
            theme={theme}
            exchange={activeExchange}
            selectStyles={{
              ...selectStyles(theme),
              width: marketType === 1 ? '11%' : '15%',
            }}
            isAccountSelect={true}
          />
        )}

        <AutoSuggestSelect
          style={{ width: '15%', minWidth: '0' }}
          value={view === 'default' && pair}
          id={'pairSelector'}
          view={view}
          activeExchange={activeExchange}
          selectStyles={selectStyles(theme)}
          marketType={marketType}
          quantityPrecision={quantityPrecision}
          pricePrecision={pricePrecision}
        />

        <ChangeTerminalButton
          style={{
            border: theme.palette.border.main,
            width: '30rem',
            height: '100%',
          }}
        >
          <DarkTooltip
            title={
              'Our unique terminal with smart orders and advanced trading features.'
            }
          >
            <ChangeTradeButton
              theme={theme}
              style={{
                //textDecoration: 'underline',
                height: 'calc(100% - 1rem)',
                //paddingRight: '6rem',
                cursor: 'pointer',
                borderRight: theme.palette.border.main,
                backgroundColor: theme.palette.white.background,
                color:
                  isSmartOrderMode || isDefaultOnlyTables
                    ? theme.palette.blue.main
                    : theme.palette.grey.light,
                // border: 'solid 1px black',
                // width: '7rem',
              }}
              type={isDefaultTerminalViewMode ? 'buy' : 'sell'}
              id="smartTradingButton"
              onClick={() => {
                // for guest mode
                if (!authenticated) {
                  history.push(`/login?callbackURL=${pathname}`)
                  return
                }

                updateTerminalViewMode('onlyTables')
              }}
            >
              <span
                style={{
                  borderBottom: `dashed 0.1rem ${theme.palette.grey.border}`,
                }}
              >
                {'Smart'}
              </span>
              <span
                style={{
                  backgroundColor: theme.palette.red.main,
                  marginLeft: '0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '1.5rem',
                  width: '3.3rem',
                  height: '1.6rem',
                  alignItems: 'center',
                  color: theme.palette.white.main,
                }}
              >
                {activeTradesLength}
              </span>
            </ChangeTradeButton>
          </DarkTooltip>

          <DarkTooltip title={'Terminal with traditional order types.'}>
            <ChangeTradeButton
              theme={theme}
              style={{
                cursor: 'pointer',
                height: '100%',
                backgroundColor: theme.palette.white.background,
                color:
                  isDefaultTerminalViewMode && !isDefaultOnlyTables
                    ? theme.palette.blue.main
                    : theme.palette.grey.light,
              }}
              //type={isDefaultTerminalViewMode ? 'buy' : 'sell'}
              id="basicTradingButton"
              onClick={() => {
                // for guest mode
                if (!authenticated) {
                  history.push(`/login?callbackURL=${pathname}`)
                  return
                }

                updateTerminalViewMode('default')
              }}
            >
              <span
                style={{
                  borderBottom: `dashed 0.1rem ${theme.palette.grey.border}`,
                }}
              >
                {'Basic'}
              </span>
            </ChangeTradeButton>
          </DarkTooltip>
        </ChangeTerminalButton>

        {/* <SmartTradeButton
          theme={theme}
          style={{
            height: '100%',
            maxWidth:
              marketType === 0 ? 'calc(35% - 28.8rem)' : 'calc(30% - 28.8rem)',
          }}
          type={isDefaultTerminalViewMode ? 'buy' : 'sell'}
          id="smartTradingButton"
          onClick={() => {
            // for guest mode
            if (!authenticated) {
              history.push(`/login?callbackURL=${pathname}`)
              return
            }

            updateTerminalViewMode(
              isDefaultTerminalViewMode ? 'smartOrderMode' : 'default'
            )

            const joyrideStep = document.getElementById('react-joyride-step-7')
            const joyrideOverlay = document.getElementById(
              'react-joyride-portal'
            )

            if (joyrideStep && joyrideOverlay) {
              joyrideStep.style.display = 'none'
              joyrideOverlay.style.display = 'none'
            }
          }}
        >
          {isDefaultTerminalViewMode
            ? 'go to smart terminal'
            : 'back to basic terminal'}
        </SmartTradeButton> */}
        <PreferencesSelect
          theme={theme}
          style={{ width: '15%', minWidth: '0', marginLeft: '.8rem' }}
          id={'preferencesSelector'}
          value={'preferences'}
          selectStyles={selectStyles(theme)}
          hedgeMode={hedgeMode}
          changePositionModeWithStatus={changePositionModeWithStatus}
          themeMode={themeMode}
          toggleThemeMode={async () => {
            if (!authenticated) {
              return
            }

            theme.updateMode(themeMode === 'dark' ? 'light' : 'dark')
            await writeQueryData(
              getThemeMode,
              {},
              {
                getAccountSettings: {
                  themeMode: themeMode === 'dark' ? 'light' : 'dark',
                  __typename: 'getAccountSettings',
                },
              }
            )
            await persistorInstance.persist()
            await updateThemeModeMutation({
              variables: {
                input: {
                  themeMode: themeMode === 'dark' ? 'light' : 'dark',
                },
              },
            })
          }}
          hideDepthChart={hideDepthChart}
          hideOrderbook={hideOrderbook}
          hideTradeHistory={hideTradeHistory}
          hideTradingViewChart={hideTradingViewChart}
          changeChartLayout={changeChartLayout}
          persistorInstance={persistorInstance}
        />
        {/* <div style={{ width: '15.5%', margin: '0 .4rem 0 .6rem' }}>
          <PillowButton
            firstHalfText={'light'}
            secondHalfText={'dark'}
            secondHalfTooltip={
              'You can open a long and short at the same time. Just turn on hedge mode and open opposite positions.'
            }
            activeHalf={hedgeMode ? 'second' : 'first'}
            buttonAdditionalStyle={{
              width: '50%',
            }}
            containerStyle={{ height: '100%', margin: 0 }}
            changeHalf={async () => {
              // for guest mode
              if (!authenticated) {
                return
              }

              await toggleThemeMode()
              // persistorInstance.persist()
            }}
          />
        </div> */}
        {/* {marketType === 1 && (
          <div style={{ width: '15.5%', margin: '0 .4rem 0 .6rem' }}>
            <PillowButton
              firstHalfText={'one-way'}
              secondHalfText={'hedge'}
              secondHalfTooltip={
                'You can open a long and short at the same time. Just turn on hedge mode and open opposite positions.'
              }
              activeHalf={hedgeMode ? 'second' : 'first'}
              buttonAdditionalStyle={{
                width: '50%',
              }}
              containerStyle={{ height: '100%', margin: 0 }}
              changeHalf={() => {
                // for guest mode
                if (!authenticated) {
                  return
                }

                changePositionModeWithStatus(hedgeMode ? false : true)
              }}
            />
          </div>
        )} */}
      </PanelWrapper>
    </>
  )
}

export default compose(
  withApolloPersist,
  graphql(TOGGLE_THEME_MODE, {
    name: 'toggleThemeMode',
  }),
  queryRendererHoc({
    query: getActiveStrategies,
    name: 'getActiveStrategiesQuery',
    fetchPolicy: 'cache-only',
    variables: (props: INextQueryProps) => ({
      activeStrategiesInput: {
        page: 0,
        perPage: 30,
        activeExchangeKey: props.selectedKey.keyId,
        marketType: props.marketType,
        allKeys: true,
      },
    }),
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true,
    showLoadingWhenQueryParamsChange: false,
  }),
  graphql(changePositionMode, { name: 'changePositionModeMutation' }),
  graphql(updateThemeMode, { name: 'updateThemeModeMutation' })
)(CardsPanel)
