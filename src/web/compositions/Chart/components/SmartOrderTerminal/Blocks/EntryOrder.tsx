import React from 'react'
import copy from 'clipboard-copy'

import {
  getSecondValueFromFirst,
  GreenSwitcherStyles,
  RedSwitcherStyles,
  DisabledSwitcherStyles,
} from '../utils'

import { EntryLevel, EntryOrderBlockProps } from '../types'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { API_URL } from '@core/utils/config'
import WebHookImg from '@sb/images/WebHookImg.png'
import MessageImg from '@sb/images/MessageImg.png'

import {
  SettingsLabel,
} from '@sb/components/TradingWrapper/styles'
import CloseIcon from '@material-ui/icons/Close'

import {
  SRadio,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { FormInputContainer } from '../InputComponents'

import HeightIcon from '@material-ui/icons/Height'
import CustomSwitcher, {
  SwitcherHalf,
} from '@sb/components/SwitchOnOff/CustomSwitcher'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import {
  TradeInputContent as Input,
} from '@sb/components/TraidingTerminal/index'

import {
  TerminalBlock,
  InputRowContainer,
  TargetTitle,
  TargetValue,
  AdditionalSettingsButton,
  ChangeOrderTypeBtn,
  Switcher,
} from '../styles'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { SliderWithPriceAndPercentageFieldRow, SliderWithAmountFieldRow } from './SliderComponents'

export const EntryOrderBlock = ({
  pair,
  funds,
  theme,
  maxAmount,
  entryPoint,
  showErrors,
  marketType,
  getMaxValues,
  setMaxAmount,
  isMarketType,
  initialMargin,
  validateField,
  pricePrecision,
  addAverageTarget,
  updateBlockValue,
  priceForCalculate,
  quantityPrecision,
  getEntryAlertJson,
  updatePriceToMarket,
  deleteAverageTarget,
  updateSubBlockValue,
  isCloseOrderExternal,
  isAveragingAfterFirstTarget,
  updateStopLossAndTakeProfitPrices,
}: EntryOrderBlockProps) => {
  return (
    <TerminalBlock theme={theme} width={'calc(33% + 0.5%)'} data-tut={'step1'}>
      {entryPoint.TVAlert.plotEnabled && (
        <InputRowContainer padding={'0 0 .6rem 0'}>

          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '10%',
              }}
            >
              <Switcher
                checked={entryPoint.TVAlert.sidePlotEnabled}
                onChange={() => {
                  updateSubBlockValue(
                    'entryPoint',
                    'TVAlert',
                    'sidePlotEnabled',
                    !entryPoint.TVAlert.sidePlotEnabled
                  )
                }}
              />
            </div>
            <Input
              theme={theme}
              type={'number'}
              needTitle
              title={`plot_`}
              textAlign="left"
              width={'calc(20% - .8rem)'}
              inputStyles={{
                paddingLeft: '4rem',
              }}
              disabled={!entryPoint.TVAlert.sidePlotEnabled}
              value={entryPoint.TVAlert.sidePlot}
              showErrors={showErrors}
              isValid={validateField(true, entryPoint.TVAlert.sidePlot)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateSubBlockValue(
                  'entryPoint',
                  'TVAlert',
                  'sidePlot',
                  e.target.value
                )
              }}
            />
          </>

        </InputRowContainer>
      )}
      <div>
        <InputRowContainer justify="flex-start" padding={entryPoint.TVAlert.plotEnabled ? '.6rem 0 1.2rem 0' : '0rem 0 1.2rem 0'}>
          {marketType === 1 && (
            <DarkTooltip
              maxWidth={'40rem'}
              title={
                <>
                  <p>
                    The algorithm which will wait for the trend to reverse to
                    place the order.
                  </p>

                  <p>
                    <b>Activation price:</b> The price at which the algorithm is
                    enabled.
                  </p>

                  <p>
                    <b>Deviation:</b> The level of price change after the trend
                    reversal, at which the order will be executed.
                  </p>

                  <p>
                    <b>For example:</b> you set 7500 USDT activation price and
                    1% deviation to buy BTC. Trailing will start when price will
                    be 7500 and then after activation there will be a buy when
                    the price moves upward by 1% from its lowest point. If for
                    instance it drops to $7,300, then the trend will reverse and
                    start to rise, the order will be executed when the price
                    reaches 7373, i.e. by 1% from the moment the trend reversed.
                  </p>
                </>
              }
            >
              <AdditionalSettingsButton
                theme={theme}
                isActive={entryPoint.trailing.isTrailingOn}
                onClick={() => {
                  updateSubBlockValue(
                    'entryPoint',
                    'trailing',
                    'isTrailingOn',
                    !entryPoint.trailing.isTrailingOn
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'TVAlert',
                    'immediateEntry',
                    false
                  )

                  if (!entryPoint.trailing.isTrailingOn) {
                    updateSubBlockValue(
                      'entryPoint',
                      'averaging',
                      'enabled',
                      false
                    )
                  }

                  if (entryPoint.order.type === 'maker-only') {
                    updateSubBlockValue('entryPoint', 'order', 'type', 'limit')
                  }
                }}
              >
                Trailing {entryPoint.order.side}
              </AdditionalSettingsButton>
            </DarkTooltip>
          )}
          <DarkTooltip
            maxWidth={'30rem'}
            title={
              'Your smart order will be placed once when there is a Trading View alert that you connected to smart order.'
            }
          >
            <AdditionalSettingsButton
              theme={theme}
              isActive={entryPoint.TVAlert.isTVAlertOn}
              onClick={() => {
                updateSubBlockValue(
                  'entryPoint',
                  'TVAlert',
                  'isTVAlertOn',
                  !entryPoint.TVAlert.isTVAlertOn
                )

                if (entryPoint.TVAlert.isTVAlertOn) {
                  updateSubBlockValue(
                    'entryPoint',
                    'TVAlert',
                    'plotEnabled',
                    false
                  )
                }
              }}
            >
              Entry by TV Alert
            </AdditionalSettingsButton>
          </DarkTooltip>
          <DarkTooltip
            maxWidth={'30rem'}
            title={'Place multiple entry targets to average your lose'}
          >
            <AdditionalSettingsButton
              theme={theme}
              isActive={entryPoint.averaging.enabled}
              onClick={() => {
                updateSubBlockValue(
                  'entryPoint',
                  'averaging',
                  'enabled',
                  !entryPoint.averaging.enabled
                )

                if (!entryPoint.averaging.enabled) {
                  updateSubBlockValue('entryPoint', 'order', 'type', 'limit')

                  updateSubBlockValue(
                    'entryPoint',
                    'trailing',
                    'isTrailingOn',
                    false
                  )

                  updateSubBlockValue(
                    'takeProfit',
                    'trailingTAP',
                    'isTrailingOn',
                    false
                  )

                  updateSubBlockValue(
                    'takeProfit',
                    'splitTargets',
                    'isSplitTargetsOn',
                    false
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'TVAlert',
                    'plotEnabled',
                    false
                  )
                }
              }}
            >
              Averaging
            </AdditionalSettingsButton>
          </DarkTooltip>
        </InputRowContainer>

        <InputRowContainer>
          {' '}
          <div style={{ width: '50%', marginRight: '2%' }}>
            {' '}
            {marketType === 1 ? (
              <CustomSwitcher
                theme={theme}
                firstHalfText={marketType === 1 ? 'long' : 'buy'}
                secondHalfText={marketType === 1 ? 'short' : 'sell'}
                buttonHeight={'3rem'}
                containerStyles={{
                  width: entryPoint.TVAlert.plotEnabled ? '70%' : '100%',
                  padding: 0,
                }}
                firstHalfStyleProperties={
                  entryPoint.TVAlert.plotEnabled &&
                    entryPoint.TVAlert.sidePlotEnabled
                    ? DisabledSwitcherStyles(theme)
                    : GreenSwitcherStyles(theme)
                }
                secondHalfStyleProperties={
                  entryPoint.TVAlert.plotEnabled &&
                    entryPoint.TVAlert.sidePlotEnabled
                    ? DisabledSwitcherStyles(theme)
                    : RedSwitcherStyles(theme)
                }
                firstHalfIsActive={entryPoint.order.side === 'buy'}
                changeHalf={() => {
                  if (
                    entryPoint.TVAlert.plotEnabled &&
                    entryPoint.TVAlert.sidePlotEnabled
                  ) {
                    return
                  }

                  updateStopLossAndTakeProfitPrices({
                    price: priceForCalculate,
                    side: getSecondValueFromFirst(entryPoint.order.side),
                  })

                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'side',
                    getSecondValueFromFirst(entryPoint.order.side)
                  )
                }}
              />
            ) : (
                <SwitcherHalf
                  isFirstHalf
                  theme={theme}
                  key={'firstHalf'}
                  style={{
                    backgroundColor: theme.palette.green.main,
                    borderRadius: '0rem',
                    border: theme.palette.border.main,
                    color: theme.palette.white.main,
                  }}
                  height={'3rem'}
                  width={'100%'}
                >
                  buy{' '}
                </SwitcherHalf>
              )}
          </div>
          <ChangeOrderTypeBtn
            theme={theme}
            isActive={entryPoint.order.type === 'market'}
            onClick={() => {
              updateSubBlockValue('entryPoint', 'order', 'type', 'market')

              updatePriceToMarket()
            }}
          >
            Market
          </ChangeOrderTypeBtn>
          <ChangeOrderTypeBtn
            theme={theme}
            isActive={entryPoint.order.type === 'limit'}
            onClick={() => {
              updateSubBlockValue('entryPoint', 'order', 'type', 'limit')

              updateSubBlockValue(
                'entryPoint',
                'TVAlert',
                'immediateEntry',
                false
              )
            }}
          >
            Limit
          </ChangeOrderTypeBtn>
          {/* <DarkTooltip
                    maxWidth={'30rem'}
                    title={
                      'Maker-only or post-only market order will place a post-only limit orders as close to the market price as possible until the last one is executed. This way you can enter the position at the market price by paying low maker fees.'
                    }
                  >
                    <ChangeOrderTypeBtn
                      theme={theme}
                      isActive={entryPoint.order.type === 'maker-only'}
                      onClick={() => {
                        updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'type',
                          'maker-only'
                        )

                        updateSubBlockValue(
                          'entryPoint',
                          'averaging',
                          'enabled',
                          false
                        )

                        updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'total',
                          stripDigitPlaces(
                            price * entryPoint.order.amount,
                            marketType === 1 ? 2 : 8
                          )
                        )

                        updateBlockValue(
                          'temp',
                          'initialMargin',
                          stripDigitPlaces(
                            (price * entryPoint.order.amount) /
                            entryPoint.order.leverage,
                            2
                          )
                        )

                        updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'isTrailingOn',
                          false
                        )
                      }}
                    >
                      Maker-only
                    </ChangeOrderTypeBtn>
                  </DarkTooltip> */}
        </InputRowContainer>
        {entryPoint.averaging.enabled && (
          <InputRowContainer padding={'.6rem 0 1.2rem 0'}>
            <DarkTooltip
              maxWidth={'30rem'}
              title={
                'Your smart order will be closed once first TP order was executed.'
              }
            >
              <AdditionalSettingsButton
                theme={theme}
                isActive={entryPoint.averaging.closeStrategyAfterFirstTAP}
                width={'33%'}
                onClick={() => {
                  updateSubBlockValue(
                    'entryPoint',
                    'averaging',
                    'closeStrategyAfterFirstTAP',
                    !entryPoint.averaging.closeStrategyAfterFirstTAP
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'averaging',
                    'placeEntryAfterTAP',
                    false
                  )
                }}
              >
                Close trade After First TP
              </AdditionalSettingsButton>
            </DarkTooltip>
            <DarkTooltip
              maxWidth={'30rem'}
              title={
                'Your smart order will be closed once first TP order was executed.'
              }
            >
              <AdditionalSettingsButton
                theme={theme}
                isActive={entryPoint.averaging.placeEntryAfterTAP}
                width={'33%'}
                onClick={() => {
                  updateSubBlockValue(
                    'entryPoint',
                    'averaging',
                    'placeEntryAfterTAP',
                    !entryPoint.averaging.placeEntryAfterTAP
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'averaging',
                    'closeStrategyAfterFirstTAP',
                    false
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'averaging',
                    'placeWithoutLoss',
                    false
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'averaging',
                    'entryLevels',
                    entryPoint.averaging.entryLevels.map(
                      (level: EntryLevel) => ({
                        ...level,
                        placeWithoutLoss: false,
                      })
                    )
                  )
                }}
              >
                Place Entry After TP
              </AdditionalSettingsButton>
            </DarkTooltip>
            <DarkTooltip
              title={
                'Place order at Break-Even Point for $0 net loss after fees'
              }
              maxWidth={'30rem'}
            >
              <AdditionalSettingsButton
                theme={theme}
                width={'33%'}
                isActive={entryPoint.averaging.placeWithoutLoss}
                onClick={() => {
                  updateSubBlockValue(
                    'entryPoint',
                    'averaging',
                    'placeWithoutLoss',
                    !entryPoint.averaging.placeWithoutLoss
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'averaging',
                    'placeEntryAfterTAP',
                    false
                  )
                }}
              >
                Place Break-even SL
              </AdditionalSettingsButton>
            </DarkTooltip>
          </InputRowContainer>
        )}
        {entryPoint.TVAlert.isTVAlertOn && (
          <>
            <InputRowContainer padding={'.8rem 0 2rem 0'}>
              <InputRowContainer justify="flex-start">
                <DarkTooltip
                  title={'Trade will be placed once when there is an alert.'}
                  maxWidth={'30rem'}
                >
                  <div>
                    <SRadio
                      id="once"
                      checked={entryPoint.TVAlert.templateMode === 'once'}
                      style={{ padding: '0 1rem' }}
                      onChange={() => {
                        updateSubBlockValue(
                          'entryPoint',
                          'TVAlert',
                          'templateMode',
                          'once'
                        )
                      }}
                    />
                    <SettingsLabel
                      style={{
                        color: theme.palette.dark.main,
                        textDecoration: 'underline',
                      }}
                      htmlFor={'once'}
                    >
                      once
                    </SettingsLabel>
                  </div>
                </DarkTooltip>
              </InputRowContainer>

              <InputRowContainer justify={'center'}>
                <DarkTooltip
                  title={
                    'Trade will be placed every time when there is an alert but no open position.'
                  }
                  maxWidth={'30rem'}
                >
                  <div>
                    <SRadio
                      id="ifNoActive"
                      checked={entryPoint.TVAlert.templateMode === 'ifNoActive'}
                      style={{ padding: '0 1rem' }}
                      onChange={() => {
                        updateSubBlockValue(
                          'entryPoint',
                          'TVAlert',
                          'templateMode',
                          'ifNoActive'
                        )
                      }}
                    />
                    <SettingsLabel
                      style={{
                        color: theme.palette.dark.main,
                        textDecoration: 'underline',
                      }}
                      htmlFor={'ifNoActive'}
                    >
                      If no trade exists
                    </SettingsLabel>
                  </div>
                </DarkTooltip>
              </InputRowContainer>

              <InputRowContainer justify="flex-end">
                <DarkTooltip
                  title={'Trade will be placed every time there is an alert.'}
                  maxWidth={'30rem'}
                >
                  <div>
                    <SRadio
                      id="always"
                      checked={entryPoint.TVAlert.templateMode === 'always'}
                      style={{ padding: '0 1rem' }}
                      disabled={isCloseOrderExternal}
                      onChange={() => {
                        updateSubBlockValue(
                          'entryPoint',
                          'TVAlert',
                          'templateMode',
                          'always'
                        )
                      }}
                    />
                    <SettingsLabel
                      style={{
                        color: theme.palette.dark.main,
                        textDecoration: 'underline',
                      }}
                      htmlFor={'always'}
                    >
                      Every time
                    </SettingsLabel>
                  </div>
                </DarkTooltip>
              </InputRowContainer>
            </InputRowContainer>

            {!entryPoint.averaging.enabled && (
              <FormInputContainer
                theme={theme}
                padding={'0 0 .8rem 0'}
                haveTooltip={false}
                tooltipText={''}
                title={'action when alert'}
              >
                <InputRowContainer>
                  <AdditionalSettingsButton
                    theme={theme}
                    isActive={entryPoint.TVAlert.plotEnabled}
                    onClick={() => {
                      updateSubBlockValue(
                        'entryPoint',
                        'TVAlert',
                        'plotEnabled',
                        !entryPoint.TVAlert.plotEnabled
                      )

                      if (!entryPoint.TVAlert.plotEnabled) {
                        updateSubBlockValue(
                          'entryPoint',
                          'averaging',
                          'enabled',
                          false
                        )
                      }
                    }}
                  >
                    Plot
                  </AdditionalSettingsButton>
                </InputRowContainer>
              </FormInputContainer>
            )}
          </>
        )}

        <FormInputContainer
          theme={theme}
          padding={'.6rem 0 1.2rem 0'}
          haveTooltip={entryPoint.trailing.isTrailingOn}
          tooltipText={'The price at which the trailing algorithm is enabled.'}
          title={`price (${pair[1]})`}
        >
          <InputRowContainer>
            {isAveragingAfterFirstTarget ? <>
              {/* slider */}
              <SliderWithPriceAndPercentageFieldRow
                {...{
                  pair,
                  theme,
                  entryPoint,
                  showErrors,
                  isMarketType,
                  validateField,
                  pricePrecision,
                  updateBlockValue,
                  priceForCalculate,
                  percentagePreSymbol: '-',
                  approximatePrice: entryPoint.averaging.price,
                  pricePercentage: entryPoint.averaging.percentage,
                  getApproximatePrice: (value: number) => {
                    return value === 0 ? priceForCalculate : entryPoint.order.side === 'buy'
                      ? stripDigitPlaces(
                        priceForCalculate * (1 - value / 100 / entryPoint.order.leverage),
                        pricePrecision
                      )
                      : stripDigitPlaces(
                        priceForCalculate * (1 + value / 100 / entryPoint.order.leverage),
                        pricePrecision
                      )
                  },
                  onAfterSliderChange: (value: number) => {
                    const price =
                      entryPoint.order.side === 'buy'
                        ? stripDigitPlaces(
                          entryPoint.order.price *
                          (1 - value / 100 / entryPoint.order.leverage),
                          pricePrecision
                        )
                        : stripDigitPlaces(
                          entryPoint.order.price *
                          (1 + value / 100 / entryPoint.order.leverage),
                          pricePrecision
                        )

                    updateSubBlockValue(
                      'entryPoint',
                      'averaging',
                      'percentage',
                      value
                    )

                    updateSubBlockValue(
                      'entryPoint',
                      'averaging',
                      'price',
                      price
                    )
                  },
                  onApproximatePriceChange: (e: React.ChangeEvent<HTMLInputElement>, updateValue: (v: any) => void) => {
                    // calc perc correctly
                    const percentage =
                      entryPoint.order.side === 'buy'
                        ? (1 - +e.target.value / priceForCalculate) *
                        100 *
                        entryPoint.order.leverage
                        : -(1 - +e.target.value / priceForCalculate) *
                        100 *
                        entryPoint.order.leverage

                    updateSubBlockValue(
                      'entryPoint',
                      'averaging',
                      'percentage',
                      stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                    )

                    console.log('new price', e.target.value)
                    updateSubBlockValue(
                      'entryPoint',
                      'averaging',
                      'price',
                      e.target.value
                    )

                    updateValue(stripDigitPlaces(percentage < 0 ? 0 : percentage, 2))
                  },
                  onPricePercentageChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const price =
                      entryPoint.order.side === 'buy'
                        ? stripDigitPlaces(
                          entryPoint.order.price *
                          (1 -
                            +e.target.value /
                            100 /
                            entryPoint.order.leverage),
                          pricePrecision
                        )
                        : stripDigitPlaces(
                          entryPoint.order.price *
                          (1 +
                            +e.target.value /
                            100 /
                            entryPoint.order.leverage),
                          pricePrecision
                        )

                    updateSubBlockValue(
                      'entryPoint',
                      'averaging',
                      'percentage',
                      e.target.value
                    )

                    updateSubBlockValue(
                      'entryPoint',
                      'averaging',
                      'price',
                      price
                    )
                  },
                  updateSubBlockValue,
                  updateStopLossAndTakeProfitPrices,
                }}
              />
              {/* <Input
                theme={theme}
                width={
                  isAveragingAfterFirstTarget
                    ? '32.5%'
                    : entryPoint.TVAlert.plotEnabled
                      ? '70%'
                      : '100%'
                }
                symbol={pair[1]}
                type={
                  entryPoint.order.type === 'limit'
                    ? 'number'
                    : entryPoint.trailing.isTrailingOn
                      ? 'number'
                      : 'text'
                }
                value={
                  entryPoint.order.type === 'limit'
                    ? isAveragingAfterFirstTarget
                      ? entryPoint.averaging.price
                      : priceForCalculate
                    : entryPoint.trailing.isTrailingOn
                      ? priceForCalculate
                      : 'MARKET'
                }
                showErrors={showErrors}
                isValid={
                  entryPoint.TVAlert.pricePlotEnabled || priceForCalculate != 0
                }
                disabled={
                  (isMarketType && !entryPoint.trailing.isTrailingOn) ||
                  (entryPoint.TVAlert.pricePlotEnabled &&
                    entryPoint.TVAlert.plotEnabled)
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'price',
                    e.target.value
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'total',
                    stripDigitPlaces(
                      +e.target.value * entryPoint.order.amount,
                      marketType === 1 ? 2 : 8
                    )
                  )

                  updateBlockValue(
                    'temp',
                    'initialMargin',
                    stripDigitPlaces(
                      (+e.target.value * entryPoint.order.amount) /
                      entryPoint.order.leverage,
                      2
                    )
                  )
                }}
              />
              <Input
                theme={theme}
                padding={'0 .8rem 0 .8rem'}
                width={'calc(17.5%)'}
                symbol={'%'}
                textAlign={'left'}
                pattern={'[0-9]+.[0-9]{3}'}
                type={'text'}
                value={entryPoint.averaging.percentage}
                inputStyles={{
                  paddingLeft: '2rem',
                  paddingRight: '0rem',
                }}
                needPreSymbol={true}
                preSymbol={'-'}
                symbolRightIndent={'1.5rem'}
                onChange={}
              />

              <BlueSlider
                theme={theme}
                value={entryPoint.averaging.percentage}
                sliderContainerStyles={{
                  width: entryPoint.TVAlert.plotEnabled ? '20%' : '50%',
                  margin: '0 .8rem 0 .8rem',
                }}
                onChange={(value) => {
                  if (
                    entryPoint.averaging.percentage > 100 &&
                    value === 100
                  ) {
                    return
                  }

                  const price =
                    entryPoint.order.side === 'buy'
                      ? stripDigitPlaces(
                        entryPoint.order.price *
                        (1 - value / 100 / entryPoint.order.leverage),
                        pricePrecision
                      )
                      : stripDigitPlaces(
                        entryPoint.order.price *
                        (1 + value / 100 / entryPoint.order.leverage),
                        pricePrecision
                      )

                  updateSubBlockValue(
                    'entryPoint',
                    'averaging',
                    'percentage',
                    value
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'averaging',
                    'price',
                    price
                  )
                }}
              />  */}
            </> : <Input
                theme={theme}
                width={
                  isAveragingAfterFirstTarget
                    ? '32.5%'
                    : entryPoint.TVAlert.plotEnabled
                      ? '70%'
                      : '100%'
                }
                symbol={pair[1]}
                type={
                  entryPoint.order.type === 'limit'
                    ? 'number'
                    : entryPoint.trailing.isTrailingOn
                      ? 'number'
                      : 'text'
                }
                value={
                  entryPoint.order.type === 'limit'
                    ? isAveragingAfterFirstTarget
                      ? entryPoint.averaging.price
                      : priceForCalculate
                    : entryPoint.trailing.isTrailingOn
                      ? priceForCalculate
                      : 'MARKET'
                }
                showErrors={showErrors}
                isValid={
                  entryPoint.TVAlert.pricePlotEnabled || priceForCalculate != 0
                }
                disabled={
                  (isMarketType && !entryPoint.trailing.isTrailingOn) ||
                  (entryPoint.TVAlert.pricePlotEnabled &&
                    entryPoint.TVAlert.plotEnabled)
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'price',
                    e.target.value
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'total',
                    stripDigitPlaces(
                      +e.target.value * entryPoint.order.amount,
                      marketType === 1 ? 2 : 8
                    )
                  )

                  updateBlockValue(
                    'temp',
                    'initialMargin',
                    stripDigitPlaces(
                      (+e.target.value * entryPoint.order.amount) /
                      entryPoint.order.leverage,
                      2
                    )
                  )
                }}
              />
            }
            {entryPoint.TVAlert.plotEnabled && (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '10%',
                  }}
                >
                  <Switcher
                    checked={entryPoint.TVAlert.pricePlotEnabled}
                    onChange={() => {
                      updateSubBlockValue(
                        'entryPoint',
                        'TVAlert',
                        'pricePlotEnabled',
                        !entryPoint.TVAlert.pricePlotEnabled
                      )
                    }}
                  />
                </div>
                <Input
                  theme={theme}
                  type={'number'}
                  needTitle
                  title={`plot_`}
                  textAlign="left"
                  width={'calc(20% - .8rem)'}
                  inputStyles={{
                    paddingLeft: '4rem',
                  }}
                  disabled={!entryPoint.TVAlert.pricePlotEnabled}
                  value={entryPoint.TVAlert.pricePlot}
                  showErrors={showErrors}
                  isValid={validateField(true, entryPoint.TVAlert.pricePlot)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateSubBlockValue(
                      'entryPoint',
                      'TVAlert',
                      'pricePlot',
                      e.target.value
                    )
                  }}
                />
              </>
            )}
          </InputRowContainer>
        </FormInputContainer>

        {entryPoint.trailing.isTrailingOn && marketType !== 0 && (
          <FormInputContainer
            theme={theme}
            haveTooltip
            tooltipText={
              'The level of price change after the trend reversal, at which the order will be executed.'
            }
            title={'price deviation (%)'}
          >
            <InputRowContainer>
              <Input
                theme={theme}
                padding={'0'}
                width={'calc(32.5%)'}
                textAlign={'left'}
                symbol={pair[1]}
                value={entryPoint.trailing.trailingDeviationPrice}
                showErrors={showErrors}
                isValid={validateField(
                  true,
                  entryPoint.trailing.trailingDeviationPrice
                )}
                disabled={
                  (isMarketType && !entryPoint.trailing.isTrailingOn) ||
                  (entryPoint.TVAlert.deviationPlotEnabled &&
                    entryPoint.TVAlert.plotEnabled)
                }
                inputStyles={{
                  paddingLeft: '1rem',
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const percentage =
                    entryPoint.order.side === 'sell'
                      ? (1 - +e.target.value / priceForCalculate) * 100
                      : -(1 - +e.target.value / priceForCalculate) * 100

                  updateSubBlockValue(
                    'entryPoint',
                    'trailing',
                    'deviationPercentage',
                    stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'trailing',
                    'trailingDeviationPrice',
                    e.target.value
                  )
                }}
              />

              <Input
                theme={theme}
                padding={'0 .8rem 0 .8rem'}
                width={'calc(17.5%)'}
                symbol={'%'}
                textAlign={'right'}
                pattern={'[0-9]+.[0-9]{3}'}
                type={'text'}
                value={entryPoint.trailing.deviationPercentage}
                // showErrors={showErrors}
                // isValid={validateField(
                //   entryPoint.trailing.isTrailingOn,
                //   entryPoint.trailing.deviationPercentage
                // )}
                inputStyles={{
                  paddingLeft: 0,
                  paddingRight: '2rem',
                }}
                symbolRightIndent={'1.5rem'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value =
                    +e.target.value > 100 / entryPoint.order.leverage
                      ? stripDigitPlaces(100 / entryPoint.order.leverage, 3)
                      : e.target.value
                  updateSubBlockValue(
                    'entryPoint',
                    'trailing',
                    'deviationPercentage',
                    value
                  )

                  updateStopLossAndTakeProfitPrices({
                    deviationPercentage: +value,
                  })
                }}
              />

              <BlueSlider
                theme={theme}
                disabled={!entryPoint.trailing.isTrailingOn}
                value={
                  +stripDigitPlaces(
                    entryPoint.trailing.deviationPercentage *
                    entryPoint.order.leverage,
                    3
                  )
                }
                sliderContainerStyles={{
                  width: entryPoint.TVAlert.plotEnabled ? '20%' : '50%',
                  margin: '0 .8rem 0 .8rem',
                }}
                onChange={(value) => {
                  if (
                    stripDigitPlaces(
                      entryPoint.trailing.deviationPercentage *
                      entryPoint.order.leverage,
                      3
                    ) > 100 &&
                    value === 100
                  ) {
                    return
                  }

                  updateSubBlockValue(
                    'entryPoint',
                    'trailing',
                    'deviationPercentage',
                    stripDigitPlaces(value / entryPoint.order.leverage, 3)
                  )
                  updateStopLossAndTakeProfitPrices({
                    deviationPercentage: +stripDigitPlaces(
                      value / entryPoint.order.leverage,
                      3
                    ),
                  })
                }}
              />
              {entryPoint.TVAlert.plotEnabled && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '10%',
                    }}
                  >
                    <Switcher
                      checked={entryPoint.TVAlert.deviationPlotEnabled}
                      onChange={() => {
                        updateSubBlockValue(
                          'entryPoint',
                          'TVAlert',
                          'deviationPlotEnabled',
                          !entryPoint.TVAlert.deviationPlotEnabled
                        )
                      }}
                    />
                  </div>
                  <Input
                    theme={theme}
                    type={'number'}
                    needTitle
                    title={`plot_`}
                    textAlign="left"
                    width={'calc(20% - .8rem)'}
                    inputStyles={{
                      paddingLeft: '4rem',
                    }}
                    disabled={!entryPoint.TVAlert.deviationPlotEnabled}
                    value={entryPoint.TVAlert.deviationPlot}
                    showErrors={showErrors}
                    isValid={validateField(
                      true,
                      entryPoint.TVAlert.deviationPlot
                    )}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateSubBlockValue(
                        'entryPoint',
                        'TVAlert',
                        'deviationPlot',
                        e.target.value
                      )
                    }}
                  />
                </>
              )}
            </InputRowContainer>
          </FormInputContainer>
        )}

        <SliderWithAmountFieldRow
          onAmountChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const [maxAmount] = getMaxValues()
            const isAmountMoreThanMax = +e.target.value > maxAmount
            const amountForUpdate = isAmountMoreThanMax
              ? maxAmount
              : e.target.value

            const strippedAmount = isAmountMoreThanMax
              ? stripDigitPlaces(
                amountForUpdate,
                marketType === 1 ? quantityPrecision : 8
              )
              : e.target.value

            const newTotal = +strippedAmount * priceForCalculate

            updateSubBlockValue(
              'entryPoint',
              'order',
              'amount',
              strippedAmount
            )

            updateSubBlockValue(
              'entryPoint',
              'order',
              'total',
              stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
            )

            updateBlockValue(
              'temp',
              'initialMargin',
              stripDigitPlaces(
                (newTotal || 0) / entryPoint.order.leverage,
                2
              )
            )
          }}
          onTotalChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateSubBlockValue(
              'entryPoint',
              'order',
              'total',
              e.target.value
            )

            updateSubBlockValue(
              'entryPoint',
              'order',
              'amount',
              stripDigitPlaces(
                +e.target.value / priceForCalculate,
                marketType === 1 ? quantityPrecision : 8
              )
            )

            updateBlockValue(
              'temp',
              'initialMargin',
              stripDigitPlaces(
                +e.target.value / entryPoint.order.leverage,
                2
              )
            )
          }}
          onAfterSliderChange={(value) => {
            const newValue = (maxAmount / 100) * value

            const newAmount =
              entryPoint.order.side === 'buy' || marketType === 1
                ? newValue / priceForCalculate
                : newValue

            const newTotal = newAmount * priceForCalculate

            const newMargin = stripDigitPlaces(
              (newTotal || 0) / entryPoint.order.leverage,
              2
            )

            updateSubBlockValue(
              'entryPoint',
              'order',
              'amount',
              stripDigitPlaces(
                newAmount,
                marketType === 1 ? quantityPrecision : 8
              )
            )

            updateSubBlockValue(
              'entryPoint',
              'order',
              'total',
              stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
            )

            updateBlockValue('temp', 'initialMargin', newMargin)
          }}
          onMarginChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const inputInitialMargin = +e.target.value
            const newTotal =
              inputInitialMargin * entryPoint.order.leverage
            const newAmount = newTotal / priceForCalculate

            const fixedAmount = stripDigitPlaces(
              newAmount,
              marketType === 1 ? quantityPrecision : 8
            )

            updateSubBlockValue(
              'entryPoint',
              'order',
              'total',
              stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
            )

            updateSubBlockValue(
              'entryPoint',
              'order',
              'amount',
              fixedAmount
            )

            updateBlockValue('temp', 'initialMargin', inputInitialMargin)
          }}
          {...{
            pair,
            theme,
            maxAmount,
            entryPoint,
            showErrors,
            setMaxAmount,
            isMarketType,
            validateField,
            marketType,
            priceForCalculate,
            quantityPrecision,
            initialMargin,
            funds,
            amount: entryPoint.order.amount,
            total: entryPoint.order.total
          }}
        />
        {/* <InputRowContainer>
          <div
            style={{
              width: entryPoint.TVAlert.plotEnabled ? '32%' : '47%',
            }}
          >
            <FormInputContainer
              theme={theme}
              needLine={false}
              needRightValue={true}
              rightValue={`${entryPoint.order.side === 'buy' || marketType === 1
                ? stripDigitPlaces(
                  maxAmount / priceForCalculate,
                  marketType === 1 ? quantityPrecision : 8
                )
                : stripDigitPlaces(
                  maxAmount,
                  marketType === 1 ? quantityPrecision : 8
                )
                } ${pair[0]}`}
              onValueClick={setMaxAmount}
              title={`${marketType === 1 ? 'order quantity' : 'amount'} (${pair[0]
                })`}
            >
              <Input
                theme={theme}
                type={'text'}
                pattern={
                  marketType === 0 ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'
                }
                symbol={pair[0]}
                value={entryPoint.order.amount}
                showErrors={showErrors}
                disabled={
                  entryPoint.TVAlert.amountPlotEnabled &&
                  entryPoint.TVAlert.plotEnabled
                }
                isValid={validateField(true, +entryPoint.order.amount)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const [maxAmount] = getMaxValues()
                  const isAmountMoreThanMax = +e.target.value > maxAmount
                  const amountForUpdate = isAmountMoreThanMax
                    ? maxAmount
                    : e.target.value

                  const strippedAmount = isAmountMoreThanMax
                    ? stripDigitPlaces(
                      amountForUpdate,
                      marketType === 1 ? quantityPrecision : 8
                    )
                    : e.target.value

                  const newTotal = +strippedAmount * priceForCalculate

                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'amount',
                    strippedAmount
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'total',
                    stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
                  )

                  updateBlockValue(
                    'temp',
                    'initialMargin',
                    stripDigitPlaces(
                      (newTotal || 0) / entryPoint.order.leverage,
                      2
                    )
                  )
                }}
              />
            </FormInputContainer>
          </div>
          <div
            style={{
              width: '6%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <HeightIcon
              style={{
                color: theme.palette.grey.text,
                transform: 'rotate(-90deg) translateX(-30%)',
              }}
            />
          </div>
          <div
            style={{
              width: entryPoint.TVAlert.plotEnabled ? '32%' : '47%',
            }}
          >
            <FormInputContainer
              theme={theme}
              needLine={false}
              needRightValue={true}
              rightValue={`${entryPoint.order.side === 'buy' || marketType === 1
                ? stripDigitPlaces(maxAmount, marketType === 1 ? 0 : 2)
                : stripDigitPlaces(
                  maxAmount * priceForCalculate,
                  marketType === 1 ? 0 : 2
                )
                } ${pair[1]}`}
              onValueClick={setMaxAmount}
              title={`total (${pair[1]})`}
            >
              <Input
                theme={theme}
                symbol={pair[1]}
                value={entryPoint.order.total}
                disabled={
                  entryPoint.trailing.isTrailingOn ||
                  isMarketType ||
                  (entryPoint.TVAlert.amountPlotEnabled &&
                    entryPoint.TVAlert.plotEnabled)
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'total',
                    e.target.value
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'amount',
                    stripDigitPlaces(
                      +e.target.value / priceForCalculate,
                      marketType === 1 ? quantityPrecision : 8
                    )
                  )

                  updateBlockValue(
                    'temp',
                    'initialMargin',
                    stripDigitPlaces(
                      +e.target.value / entryPoint.order.leverage,
                      2
                    )
                  )
                }}
              />
            </FormInputContainer>
          </div>
          {entryPoint.TVAlert.plotEnabled && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '10%',
                }}
              >
                <Switcher
                  checked={entryPoint.TVAlert.amountPlotEnabled}
                  onChange={() => {
                    updateSubBlockValue(
                      'entryPoint',
                      'TVAlert',
                      'amountPlotEnabled',
                      !entryPoint.TVAlert.amountPlotEnabled
                    )
                  }}
                />
              </div>
              <Input
                theme={theme}
                type={'number'}
                needTitle
                title={`plot_`}
                textAlign="left"
                width={'calc(20% - .8rem)'}
                inputStyles={{
                  paddingLeft: '4rem',
                }}
                disabled={!entryPoint.TVAlert.amountPlotEnabled}
                value={entryPoint.TVAlert.amountPlot}
                showErrors={showErrors}
                isValid={validateField(true, entryPoint.TVAlert.amountPlot)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateSubBlockValue(
                    'entryPoint',
                    'TVAlert',
                    'amountPlot',
                    e.target.value
                  )
                }}
              />
            </>
          )}
        </InputRowContainer>

        <InputRowContainer>
          <BlueSlider
            theme={theme}
            showMarks
            value={
              entryPoint.order.side === 'buy' || marketType === 1
                ? (entryPoint.order.total / maxAmount) * 100
                : entryPoint.order.amount / (maxAmount / 100)
            }
            sliderContainerStyles={{
              width: 'calc(100% - .8rem)',
              margin: '0 .8rem 0 auto',
            }}
            onChange={(value) => {
              const newValue = (maxAmount / 100) * value

              const newAmount =
                entryPoint.order.side === 'buy' || marketType === 1
                  ? newValue / priceForCalculate
                  : newValue

              const newTotal = newAmount * priceForCalculate

              const newMargin = stripDigitPlaces(
                (newTotal || 0) / entryPoint.order.leverage,
                2
              )

              updateSubBlockValue(
                'entryPoint',
                'order',
                'amount',
                stripDigitPlaces(
                  newAmount,
                  marketType === 1 ? quantityPrecision : 8
                )
              )

              updateSubBlockValue(
                'entryPoint',
                'order',
                'total',
                stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
              )

              updateBlockValue('temp', 'initialMargin', newMargin)
            }}
          />
        </InputRowContainer>

        {marketType === 1 && (
          <InputRowContainer padding={'.8rem 0 0 0'}>
            <FormInputContainer
              theme={theme}
              needLine={false}
              needRightValue={true}
              rightValue={`${stripDigitPlaces(funds[1].quantity, 2)} ${pair[1]
                }`}
              onValueClick={setMaxAmount}
              title={`cost / initial margin (${pair[1]})`}
            >
              <Input
                theme={theme}
                symbol={pair[1]}
                value={initialMargin}
                disabled={entryPoint.trailing.isTrailingOn || isMarketType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const inputInitialMargin = +e.target.value
                  const newTotal =
                    inputInitialMargin * entryPoint.order.leverage
                  const newAmount = newTotal / priceForCalculate

                  const fixedAmount = stripDigitPlaces(
                    newAmount,
                    marketType === 1 ? quantityPrecision : 8
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'total',
                    stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
                  )

                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'amount',
                    fixedAmount
                  )

                  updateBlockValue('temp', 'initialMargin', inputInitialMargin)
                }}
              />
            </FormInputContainer>
          </InputRowContainer>
        )} */}

        {entryPoint.averaging.enabled && (
          <>
            <InputRowContainer padding="0 0 .6rem 0">
              <BtnCustom
                btnColor={theme.palette.white.main}
                backgroundColor={theme.palette.orange.main}
                borderColor={theme.palette.orange.main}
                btnWidth={'100%'}
                height={'auto'}
                borderRadius={'0.1rem'}
                margin={'0'}
                padding={'.1rem 0'}
                fontSize={'1rem'}
                boxShadow={'0px .2rem .3rem rgba(8, 22, 58, 0.15)'}
                letterSpacing={'.05rem'}
                onClick={addAverageTarget}
              >
                add point
              </BtnCustom>
            </InputRowContainer>

            <InputRowContainer
              padding=".6rem 1rem 1.2rem .4rem"
              direction="column"
            >
              <InputRowContainer padding=".2rem .5rem">
                <TargetTitle
                  theme={theme}
                  style={{ width: '25%', paddingLeft: '2rem' }}
                >
                  price
                </TargetTitle>
                <TargetTitle theme={theme} style={{ width: '25%' }}>
                  quantity
                </TargetTitle>
                <TargetTitle theme={theme} style={{ width: '40%' }}>
                  place Break-even SLP
                </TargetTitle>
              </InputRowContainer>
              <div
                style={{
                  width: '100%',
                  background: theme.palette.grey.main,
                  borderRadius: '.8rem',
                  border: theme.palette.border.main,
                }}
              >
                {entryPoint.averaging.entryLevels.map(
                  (target: EntryLevel, i: number) => (
                    <InputRowContainer
                      key={`${target.price}${target.amount}${i}`}
                      padding=".2rem .5rem"
                      style={
                        entryPoint.averaging.entryLevels.length - 1 !== i
                          ? {
                            borderBottom: theme.palette.border.main,
                          }
                          : {}
                      }
                    >
                      <TargetValue
                        theme={theme}
                        style={{ width: '25%', paddingLeft: '2rem' }}
                      >
                        {target.price} {i > 0 ? '%' : pair[1]}
                      </TargetValue>
                      <TargetValue theme={theme} style={{ width: '25%' }}>
                        {target.amount} {pair[0]}
                      </TargetValue>
                      <TargetValue theme={theme} style={{ width: '40%' }}>
                        {target.placeWithoutLoss ? '+' : '-'}
                      </TargetValue>
                      <CloseIcon
                        onClick={() => deleteAverageTarget(i)}
                        style={{
                          color: theme.palette.red.main,
                          fontSize: '1.8rem',
                          cursor: 'pointer',
                        }}
                      />
                    </InputRowContainer>
                  )
                )}
              </div>
            </InputRowContainer>
          </>
        )}

        {entryPoint.TVAlert.isTVAlertOn && (
          <>
            {' '}
            <FormInputContainer
              theme={theme}
              padding={'0 0 .8rem 0'}
              haveTooltip={true}
              tooltipText={
                <img
                  style={{ width: '35rem', height: '50rem' }}
                  src={WebHookImg}
                />
              }
              title={
                <span>
                  paste it into{' '}
                  <span style={{ color: theme.palette.blue.background }}>
                    web-hook url
                  </span>{' '}
                  field when creating tv alert
                </span>
              }
            >
              <InputRowContainer>
                <Input
                  theme={theme}
                  width={'85%'}
                  type={'text'}
                  disabled={true}
                  textAlign={'left'}
                  value={`https://${API_URL}/createSmUsingTemplate`}
                  onChange={() => { }}
                />
                <BtnCustom
                  btnWidth="calc(15% - .8rem)"
                  height="auto"
                  margin="0 0 0 .8rem"
                  fontSize="1rem"
                  padding=".5rem 0 .4rem 0"
                  borderRadius=".8rem"
                  btnColor={theme.palette.blue.main}
                  backgroundColor={theme.palette.white.background}
                  hoverColor={theme.palette.white.main}
                  hoverBackground={theme.palette.blue.main}
                  transition={'all .4s ease-out'}
                  onClick={() => {
                    copy(`https://${API_URL}/createSmUsingTemplate`)
                  }}
                >
                  copy
                </BtnCustom>
              </InputRowContainer>
            </FormInputContainer>
            <FormInputContainer
              theme={theme}
              padding={'0 0 .8rem 0'}
              haveTooltip={true}
              tooltipText={
                <img
                  style={{ width: '40rem', height: '42rem' }}
                  src={MessageImg}
                />
              }
              title={
                <span>
                  paste it into{' '}
                  <span style={{ color: theme.palette.blue.background }}>
                    message
                  </span>{' '}
                  field when creating tv alert
                </span>
              }
            >
              <InputRowContainer>
                <Input
                  theme={theme}
                  width={'65%'}
                  type={'text'}
                  disabled={true}
                  textAlign={'left'}
                  value={getEntryAlertJson()}
                  onChange={() => { }}
                />
                {/* entryPoint.TVAlert.templateToken */}
                <BtnCustom
                  btnWidth="calc(15% - .8rem)"
                  height="auto"
                  margin="0 0 0 .8rem"
                  fontSize="1rem"
                  padding=".5rem 0 .4rem 0"
                  borderRadius=".8rem"
                  btnColor={theme.palette.blue.main}
                  backgroundColor={theme.palette.white.background}
                  hoverColor={theme.palette.white.main}
                  hoverBackground={theme.palette.blue.main}
                  transition={'all .4s ease-out'}
                  onClick={() => {
                    copy(getEntryAlertJson())
                  }}
                >
                  copy
                </BtnCustom>
                <BtnCustom
                  btnWidth="calc(20% - .8rem)"
                  height="auto"
                  margin="0 0 0 .8rem"
                  fontSize="1rem"
                  padding=".5rem 0 .4rem 0"
                  borderRadius=".8rem"
                  btnColor={theme.palette.blue.main}
                  backgroundColor={theme.palette.white.background}
                  hoverColor={theme.palette.white.main}
                  hoverBackground={theme.palette.blue.main}
                  transition={'all .4s ease-out'}
                  onClick={() => {
                    // redirect to full example page
                  }}
                >
                  example
                </BtnCustom>
              </InputRowContainer>
            </FormInputContainer>
          </>
        )}
      </div>
    </TerminalBlock>
  )
}

export const EntryOrderBlockMemo = React.memo(EntryOrderBlock)
