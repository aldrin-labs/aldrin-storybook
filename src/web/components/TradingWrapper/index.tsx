import React from 'react'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { Grid } from '@material-ui/core'
import { compose } from 'recompose'

import { isSPOTMarketType } from '@core/utils/chartPageUtils'

import TraidingTerminal from '../TraidingTerminal'
import SmallSlider from '@sb/components/Slider/SmallSlider'

import {
  SRadio,
  SCheckbox,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import {
  TablesBlockWrapper,
  TerminalContainer,
  TerminalMainGrid,
  FullHeightGrid,
  TerminalHeader,
  TerminalModeButton,
  LeverageLabel,
  LeverageTitle,
  LeverageContainer,
  SettingsContainer,
  SettingsLabel,
  StyledSelect,
  StyledOption,
  StyledZoomIcon,
  SmartOrderModeButton,
} from './styles'

import { CustomCard } from '@sb/compositions/Chart/Chart.styles'

class SimpleTabs extends React.Component {
  state = {
    operation: 'buy',
    mode: 'market',
    percentageBuy: '0',
    percentageSell: '0',
    leverage: 1,
    reduceOnly: true,
    orderMode: 'TIF',
    TIFMode: 'GTC',
    trigger: 'last price',
  }

  handleChangeMode = (mode: string) => {
    this.setState({ mode })
  }

  handleChangeOperation = (operation: string) => {
    this.setState({ operation })
  }

  handleChangePercentage = (percentage: string, mode: string) => {
    this.setState({ [`percentage${mode}`]: percentage })
  }

  render() {
    const {
      mode,
      percentageBuy,
      percentageSell,
      leverage,
      reduceOnly,
      orderMode,
    } = this.state
    const {
      pair,
      funds,
      price,
      placeOrder,
      decimals,
      showOrderResult,
      cancelOrder,
      marketType,
      updateTerminalViewMode,
    } = this.props

    const isSPOTMarket = isSPOTMarketType(marketType)

    return (
      <Grid item xs={12} style={{ height: '100%', padding: '0 0 0 0' }}>
        <CustomCard>
          <TerminalHeader>
            <TerminalModeButton
              isActive={mode === 'limit'}
              onClick={() => this.handleChangeMode('limit')}
            >
              limit
            </TerminalModeButton>
            <TerminalModeButton
              isActive={mode === 'market'}
              onClick={() => this.handleChangeMode('market')}
            >
              market
            </TerminalModeButton>
            <TerminalModeButton
              isActive={mode === 'stop-limit'}
              onClick={() => {
                this.handleChangeMode('stop-limit')
                this.setState({ orderMode: 'TIF' })
              }}
            >
              stop-limit
            </TerminalModeButton>
            <SmartOrderModeButton
              isActive={mode === 'smart'}
              onClick={() => {
                this.handleChangeMode('smart')
                updateTerminalViewMode('smartOrderMode')
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ paddingRight: '1rem' }}>smart order</span>
                <StyledZoomIcon />
              </div>
            </SmartOrderModeButton>
          </TerminalHeader>

          {!isSPOTMarket && (
            <TerminalHeader style={{ display: 'flex' }}>
              <SettingsContainer>
                {mode === 'limit' && (
                  <>
                    <SRadio
                      id="postOnly"
                      checked={orderMode === 'postOnly'}
                      style={{ padding: '0 1rem' }}
                      onChange={() =>
                        this.setState({
                          orderMode: 'postOnly',
                        })
                      }
                    />
                    <SettingsLabel for="postOnly">post only</SettingsLabel>
                  </>
                )}

                {mode !== 'market' && (
                  <>
                    <SRadio
                      id="TIF"
                      checked={orderMode === 'TIF'}
                      style={{ padding: '0 1rem' }}
                      onChange={() =>
                        this.setState({
                          orderMode: 'TIF',
                        })
                      }
                    />
                    <SettingsLabel for="TIF">TIF</SettingsLabel>
                    <StyledSelect
                      disabled={orderMode !== 'TIF'}
                      value={this.state.TIFMode}
                      onChange={(e) =>
                        this.setState({ TIFMode: e.target.value })
                      }
                    >
                      <StyledOption>GTC</StyledOption>
                      <StyledOption>IOK</StyledOption>
                      <StyledOption>FOK</StyledOption>
                    </StyledSelect>
                  </>
                )}

                {mode !== 'stop-limit' && (
                  <>
                    <SCheckbox
                      id="reduceOnly"
                      checked={reduceOnly}
                      style={{ padding: '0 1rem' }}
                      onChange={() =>
                        this.setState((prev) => ({
                          reduceOnly: !prev.reduceOnly,
                        }))
                      }
                    />
                    <SettingsLabel for="reduceOnly">reduce only</SettingsLabel>
                  </>
                )}

                {mode === 'stop-limit' && (
                  <>
                    <SettingsLabel for="trigger">trigger</SettingsLabel>
                    <StyledSelect
                      id="trigger"
                      onChange={(e) =>
                        this.setState({ trigger: e.target.value })
                      }
                    >
                      <StyledOption>last price</StyledOption>
                      <StyledOption>mark price</StyledOption>
                    </StyledSelect>
                  </>
                )}
              </SettingsContainer>
              <LeverageContainer>
                <LeverageTitle>leverage:</LeverageTitle>
                <SmallSlider
                  min={1}
                  max={125}
                  defaultValue={1}
                  value={leverage}
                  valueSymbol={'X'}
                  marks={{
                    1: {},
                    25: {},
                    50: {},
                    75: {},
                    100: {},
                    125: {},
                  }}
                  onChange={(leverage) => {
                    this.setState({ leverage })
                  }}
                  sliderContainerStyles={{
                    width: '65%',
                    margin: '0 auto',
                  }}
                  trackBeforeBackground={'#29AC80;'}
                  handleStyles={{
                    width: '1.2rem',
                    height: '1.2rem',
                    border: 'none',
                    backgroundColor: '#036141',
                    marginTop: '-.45rem',
                  }}
                  dotStyles={{
                    border: 'none',
                    backgroundColor: '#ABBAD1',
                  }}
                  activeDotStyles={{
                    backgroundColor: '#29AC80',
                  }}
                />
                <LeverageLabel style={{ width: '12.5%' }}>
                  {leverage}x
                </LeverageLabel>
              </LeverageContainer>
            </TerminalHeader>
          )}

          <TerminalMainGrid xs={12} container marketType={marketType}>
            <FullHeightGrid xs={6} item needBorderRight>
              <TerminalContainer>
                <TraidingTerminal
                  byType={'buy'}
                  operationType={'buy'}
                  priceType={mode}
                  isSPOTMarket={isSPOTMarket}
                  percentage={percentageBuy}
                  changePercentage={(value) =>
                    this.handleChangePercentage(value, 'Buy')
                  }
                  pair={pair}
                  funds={funds}
                  key={[pair, funds]}
                  walletValue={funds && funds[1]}
                  marketPrice={price}
                  confirmOperation={placeOrder}
                  cancelOrder={cancelOrder}
                  decimals={decimals}
                  showOrderResult={showOrderResult}
                />
              </TerminalContainer>
            </FullHeightGrid>

            <FullHeightGrid xs={6} item>
              <TerminalContainer>
                <TraidingTerminal
                  byType={'sell'}
                  operationType={'sell'}
                  priceType={mode}
                  isSPOTMarket={isSPOTMarket}
                  percentage={percentageSell}
                  changePercentage={(value) =>
                    this.handleChangePercentage(value, 'Sell')
                  }
                  pair={pair}
                  funds={funds}
                  key={[pair, funds]}
                  walletValue={funds && funds[1]}
                  marketPrice={price}
                  confirmOperation={placeOrder}
                  cancelOrder={cancelOrder}
                  decimals={decimals}
                  showOrderResult={showOrderResult}
                />
              </TerminalContainer>
            </FullHeightGrid>
          </TerminalMainGrid>
        </CustomCard>
      </Grid>
    )
  }
}

export default compose(withErrorFallback)(SimpleTabs)
