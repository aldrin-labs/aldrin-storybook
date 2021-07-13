import React from 'react'
import copy from 'clipboard-copy'

import SvgIcon from '@sb/components/SvgIcon'

import Chain from '@icons/chain.svg'

import { getSecondValueFromFirst, BlueSwitcherStyles } from '../utils'

import { StopLossBlockProps } from '../types'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { API_URL } from '@core/utils/config'

import WebHookImg from '@sb/images/WebHookImg.png'
import MessageImg from '@sb/images/MessageImg.png'

import { SendButton } from '@sb/components/TraidingTerminal/styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { FormInputContainer, Select } from '../InputComponents'

import CustomSwitcher, {
  SwitcherHalf,
} from '@sb/components/SwitchOnOff/CustomSwitcher'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'

import {
  TerminalBlock,
  InputRowContainer,
  AdditionalSettingsButton,
  SubBlocksContainer,
  Switcher,
} from '../styles'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import {
  SliderWithPriceAndPercentageFieldRow,
  SliderWithTimeoutFieldRow,
} from '../SliderComponents'
import { BorderBottom } from '@material-ui/icons'

export const StopLossBlock = ({
  pair,
  theme,
  entryPoint,
  stopLoss,
  showErrors,
  isMarketType,
  validateField,
  pricePrecision,
  updateBlockValue,
  priceForCalculate,
  marketType,
  updateSubBlockValue,
  showConfirmationPopup,
  updateTerminalViewMode,
  updateStopLossAndTakeProfitPrices,
  togglePlaceWithoutLoss,
  enqueueSnackbar,
}: StopLossBlockProps) => {
  console.log('entryPoint', entryPoint)
  let avgPrice =
    entryPoint.averaging.entryLevels &&
    entryPoint.averaging.entryLevels.length !== 0
      ? entryPoint.averaging.entryLevels[0].price
      : 0
  console.log('entryPoint', entryPoint)
  let estPrice = 0
  let sumAmount = 0
  let margin = 0
  return (
    <TerminalBlock
      data-tut={'step2'}
      theme={theme}
      width={'calc(32.5% + 1%)'}
      style={{ overflow: 'hidden', padding: 0 }}
    >
      <div
        style={{
          overflow: 'hidden scroll',
          height: 'calc(100% - 6rem)',
          padding: '0rem 1rem 0rem 1.2rem',
        }}
      >
        {/* tabs */}
        {/* <InputRowContainer
          style={{ margin: '0 auto 0 auto' }}
          justify="flex-start"
          padding={'0rem 0 1.2rem 0'}
        >
          {entryPoint.averaging.enabled && (
            <DarkTooltip
              title={
                'Place order at Break-Even Point for $0 net loss after fees'
              }
              maxWidth={'30rem'}
            >
              <AdditionalSettingsButton
                theme={theme}
                style={{ textDecoration: 'underline' }}
                width={'22.75%'}
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
                Break-Even Point
              </AdditionalSettingsButton>
            </DarkTooltip>
          )}
          {entryPoint.averaging.enabled ? null : stopLoss.external ? null : (
            <DarkTooltip
              maxWidth={'30rem'}
              title={
                'Waiting before executing a stop order with the expectation that the trend will reverse.'
              }
            >
              <AdditionalSettingsButton
                theme={theme}
                isActive={stopLoss.timeout.isTimeoutOn}
                style={{
                  textDecoration: 'underline',
                  marginRight: stopLoss.timeout.isTimeoutOn ? '0' : '3%',
                }}
                onClick={() => {
                  if (stopLoss.external) {
                    return
                  }
                  updateSubBlockValue(
                    'stopLoss',
                    'timeout',
                    'isTimeoutOn',
                    !stopLoss.timeout.isTimeoutOn
                  )
                  if (stopLoss.timeout.isTimeoutOn) {
                    updateSubBlockValue(
                      'stopLoss',
                      'forcedStop',
                      'isForcedStopOn',
                      false
                    )
                  }
                  updateSubBlockValue(
                    'stopLoss',
                    'timeout',
                    'whenLossableOn',
                    !stopLoss.timeout.whenLossableOn
                  )
                }}
              >
                Timeout
              </AdditionalSettingsButton>
            </DarkTooltip>
          )}
          {stopLoss.timeout.isTimeoutOn && (
            <SvgIcon
              src={Chain}
              style={{ margin: 'auto 0.5rem' }}
              width="1.6rem"
              height="1.6rem"
            />
          )}
          {stopLoss.timeout.isTimeoutOn && (
            <AdditionalSettingsButton
              theme={theme}
              isActive={stopLoss.forcedStop.isForcedStopOn}
              onClick={() => {
                updateSubBlockValue(
                  'stopLoss',
                  'forcedStop',
                  'isForcedStopOn',
                  !stopLoss.forcedStop.isForcedStopOn
                )

                if (stopLoss.external) {
                  updateSubBlockValue(
                    'stopLoss',
                    'forcedStop',
                    'mandatoryForcedLoss',
                    !stopLoss.forcedStop.mandatoryForcedLoss
                  )
                }
              }}
            >
              Forced stop
            </AdditionalSettingsButton>
          )}

          <DarkTooltip
            maxWidth={'30rem'}
            title={'Advanced Stop Loss using your Alerts from TradingView.com.'}
          >
            <AdditionalSettingsButton
              style={{ textDecoration: 'underline' }}
              theme={theme}
              isActive={stopLoss.external}
              onClick={() => {
                updateBlockValue('stopLoss', 'external', !stopLoss.external)
                updateSubBlockValue('stopLoss', 'timeout', 'isTimeoutOn', false)
                updateBlockValue('stopLoss', 'plotEnabled', false)
                if (!stopLoss.external) {
                  updateSubBlockValue(
                    'stopLoss',
                    'timeout',
                    'isTimeoutOn',
                    false
                  )
                  if (stopLoss.forcedStop.isForcedStopOn) {
                    updateSubBlockValue(
                      'stopLoss',
                      'forcedStop',
                      'mandatoryForcedLoss',
                      true
                    )
                  }
                } else {
                  updateSubBlockValue(
                    'stopLoss',
                    'forcedStop',
                    'mandatoryForcedLoss',
                    false
                  )
                }

                if (
                  !stopLoss.external &&
                  entryPoint.TVAlert.templateMode === 'always'
                ) {
                  updateSubBlockValue(
                    'entryPoint',
                    'TVAlert',
                    'templateMode',
                    'ifNoActive'
                  )
                }
              }}
            >
              Use TV Alert
            </AdditionalSettingsButton>
          </DarkTooltip>
          {stopLoss.external && (
            <AdditionalSettingsButton
              theme={theme}
              style={{
                lineHeight: 'inherit',
                fontSize: '1rem',
              }}
              width={'22.75%'}
              isActive={stopLoss.forcedStopByAlert}
              onClick={() => {
                updateBlockValue(
                  'stopLoss',
                  'forcedStopByAlert',
                  !stopLoss.forcedStopByAlert
                )
                if (!stopLoss.forcedStopByAlert) {
                  updateBlockValue('stopLoss', 'plotEnabled', false)
                  updateSubBlockValue(
                    'stopLoss',
                    'forcedStop',
                    'mandatoryForcedLoss',
                    false
                  )
                } else {
                  updateSubBlockValue(
                    'stopLoss',
                    'forcedStop',
                    'mandatoryForcedLoss',
                    true
                  )
                }

                updateBlockValue('stopLoss', 'plotEnabled', false)

                updateBlockValue('stopLoss', 'type', 'market')
              }}
            >
              Immediately when alert
            </AdditionalSettingsButton>
          )}
        </InputRowContainer> */}
        <div>
          <InputRowContainer
            style={{ margin: '1rem auto 1.7rem 0' }}
            justify="center"
          >
            {/* <CustomSwitcher
              theme={theme}
              firstHalfText={'limit'}
              secondHalfText={'market'}
              buttonHeight={'3rem'}
              containerStyles={{ width: '100%' }}
              firstHalfStyleProperties={BlueSwitcherStyles(theme)}
              secondHalfStyleProperties={BlueSwitcherStyles(theme)}
              firstHalfIsActive={stopLoss.type === 'limit'}
              changeHalf={() => {
                updateBlockValue(
                  'stopLoss',
                  'type',
                  getSecondValueFromFirst(stopLoss.type)
                )
                if (getSecondValueFromFirst(stopLoss.type) === 'limit') {
                  updateBlockValue('stopLoss', 'forcedStopByAlert', false)
                }
              }}
            /> */}

            <SwitcherHalf
              theme={theme}
              width={'calc(100%)'}
              height={'4rem'}
              style={{
                backgroundColor: theme.palette.dark.background,
                borderRadius: '0.6rem',
                border: `.6rem solid ${theme.palette.grey.terminal}`,
                color: theme.palette.blue.serum,
              }}
              onClick={() => {
                updateBlockValue(
                  'stopLoss',
                  'type',
                  getSecondValueFromFirst(stopLoss.type)
                )

                if (getSecondValueFromFirst(stopLoss.type) === 'limit') {
                  updateBlockValue('stopLoss', 'forcedStopByAlert', false)
                }
              }}
            >
              Limit
            </SwitcherHalf>
          </InputRowContainer>

          {((stopLoss.external &&
            !stopLoss.forcedStopByAlert &&
            !stopLoss.plotEnabled) ||
            !stopLoss.external ||
            (stopLoss.external && stopLoss.plotEnabled)) && (
            <InputRowContainer
              justify={'space-between'}
              wrap={'wrap'}
              style={{ margin: '.5rem auto 1rem auto' }}
            >
              <SliderWithPriceAndPercentageFieldRow
                {...{
                  pair,
                  theme,
                  entryPoint,
                  tvAlertsEnable: stopLoss.external,
                  needChain: !stopLoss.external,
                  stopLoss,
                  isPlotActive: stopLoss.plotEnabled,
                  showErrors,
                  isMarketType,
                  header: 'price',
                  levelFieldTitle: 'stop',
                  validateField,
                  pricePrecision,
                  updateBlockValue,
                  priceForCalculate,
                  percentagePreSymbol: '-',
                  sliderInTheBottom: true,
                  needPercentageTitle: true,
                  percentageTitle: 'Loss',
                  priceTitle: 'SL Price',
                  percentageTextAlign: 'right',
                  priceTextAlign: 'right',
                  approximatePrice: stopLoss.stopLossPrice,
                  pricePercentage: stopLoss.pricePercentage,
                  getApproximatePrice: (value: number) => {
                    return value === 0
                      ? priceForCalculate
                      : entryPoint.order.side === 'buy'
                      ? stripDigitPlaces(
                          priceForCalculate *
                            (1 - value / 100 / entryPoint.order.leverage),
                          pricePrecision
                        )
                      : stripDigitPlaces(
                          priceForCalculate *
                            (1 + value / 100 / entryPoint.order.leverage),
                          pricePrecision
                        )
                  },
                  onAfterSliderChange: (value: number) => {
                    updateStopLossAndTakeProfitPrices({
                      stopLossPercentage: value,
                    })

                    updateBlockValue('stopLoss', 'pricePercentage', value)
                  },
                  onApproximatePriceChange: (
                    e: React.ChangeEvent<HTMLInputElement>,
                    updateValue: (v: any) => void
                  ) => {
                    const percentage =
                      entryPoint.order.side === 'buy'
                        ? (1 - +e.target.value / priceForCalculate) *
                          100 *
                          entryPoint.order.leverage
                        : -(1 - +e.target.value / priceForCalculate) *
                          100 *
                          entryPoint.order.leverage

                    updateBlockValue(
                      'stopLoss',
                      'pricePercentage',
                      stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                    )

                    updateValue(
                      stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                    )

                    updateBlockValue(
                      'stopLoss',
                      'stopLossPrice',
                      e.target.value
                    )
                  },
                  onPricePercentageChange: (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    updateStopLossAndTakeProfitPrices({
                      stopLossPercentage: +e.target.value,
                    })

                    updateBlockValue(
                      'stopLoss',
                      'pricePercentage',
                      e.target.value
                    )
                  },
                  updateSubBlockValue,
                  showConfirmationPopup,
                  updateTerminalViewMode,
                  updateStopLossAndTakeProfitPrices,
                }}
              />
              {stopLoss.external && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '10%',
                      margin: 'auto 0.8rem auto 0.3rem',
                    }}
                  >
                    <Switcher
                      theme={theme}
                      checked={stopLoss.plotEnabled}
                      onChange={() => {
                        updateBlockValue('stopLoss', 'forcedStopByAlert', false)

                        updateBlockValue(
                          'stopLoss',
                          'plotEnabled',
                          !stopLoss.plotEnabled
                        )
                      }}
                    />
                  </div>

                  <Input
                    theme={theme}
                    type={'number'}
                    needTitleBlock
                    header={'plot_'}
                    textAlign="left"
                    width={'35%'}
                    disabled={!stopLoss.plotEnabled}
                    value={stopLoss.plot}
                    showErrors={showErrors}
                    isValid={validateField(true, stopLoss.plot)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateBlockValue('stopLoss', 'plot', e.target.value)
                    }}
                  />
                </>
              )}
            </InputRowContainer>
            // </FormInputContainer>
          )}

          {stopLoss.timeout.isTimeoutOn && !stopLoss.external && (
            <InputRowContainer>
              <InputRowContainer
                wrap={'nowrap'}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                }}
              >
                <SliderWithTimeoutFieldRow
                  theme={theme}
                  showErrors={showErrors}
                  validateField={validateField}
                  timeoutMode={stopLoss.timeout.whenLossableMode}
                  timeoutValue={stopLoss.timeout.whenLossableSec}
                  onAfterSliderChange={(value) => {
                    updateSubBlockValue(
                      'stopLoss',
                      'timeout',
                      'whenLossableSec',
                      value
                    )
                  }}
                  onTimeoutChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateSubBlockValue(
                      'stopLoss',
                      'timeout',
                      'whenLossableSec',
                      e.target.value
                    )
                  }}
                  onChangeTimeoutMode={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    updateSubBlockValue(
                      'stopLoss',
                      'timeout',
                      'whenLossableMode',
                      e.target.value
                    )
                  }}
                />
              </InputRowContainer>
            </InputRowContainer>
          )}

          {(stopLoss.forcedStop.isForcedStopOn ||
            stopLoss.forcedStop.mandatoryForcedLoss) && (
            <InputRowContainer>
              <FormInputContainer
                theme={theme}
                haveTooltip
                tooltipText={
                  <>
                    <p>How much should the price change to ignore timeout.</p>

                    <p>
                      <b>For example:</b> You bought BTC and set 10% stop loss
                      with 1 minute timeout and 15% forced stop. But the price
                      continued to fall during the timeout. Your trade will be
                      closed when loss will be 15% regardless of timeout.
                    </p>
                  </>
                }
                title={'forced stop'}
              >
                <InputRowContainer wrap={'nowrap'}>
                  <SliderWithPriceAndPercentageFieldRow
                    {...{
                      pair,
                      theme,
                      entryPoint,
                      stopLoss,
                      header: 'price',
                      tvAlertsEnable: stopLoss.external,
                      showErrors,
                      needChain: !stopLoss.external,
                      isMarketType,
                      isPlotActive: stopLoss.forcedStopByAlert,
                      validateField,
                      pricePrecision,
                      updateBlockValue,
                      priceForCalculate,
                      percentagePreSymbol: '%',
                      sliderInTheBottom: false,
                      approximatePrice: stopLoss.forcedStop.forcedStopPrice,
                      pricePercentage: stopLoss.forcedStop.pricePercentage,
                      getApproximatePrice: (value: number) => {
                        return value === 0
                          ? priceForCalculate
                          : entryPoint.order.side === 'buy'
                          ? stripDigitPlaces(
                              priceForCalculate *
                                (1 - value / 100 / entryPoint.order.leverage),
                              pricePrecision
                            )
                          : stripDigitPlaces(
                              priceForCalculate *
                                (1 + value / 100 / entryPoint.order.leverage),
                              pricePrecision
                            )
                      },
                      onAfterSliderChange: (value: number) => {
                        updateSubBlockValue(
                          'stopLoss',
                          'forcedStop',
                          'pricePercentage',
                          value
                        )

                        updateStopLossAndTakeProfitPrices({
                          forcedStopPercentage: value,
                        })
                      },
                      onApproximatePriceChange: (
                        e: React.ChangeEvent<HTMLInputElement>,
                        updateValue: (v: any) => void
                      ) => {
                        const percentage =
                          entryPoint.order.side === 'buy'
                            ? (1 - +e.target.value / priceForCalculate) *
                              100 *
                              entryPoint.order.leverage
                            : -(1 - +e.target.value / priceForCalculate) *
                              100 *
                              entryPoint.order.leverage

                        updateSubBlockValue(
                          'stopLoss',
                          'forcedStop',
                          'pricePercentage',
                          stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                        )

                        updateSubBlockValue(
                          'stopLoss',
                          'forcedStop',
                          'forcedStopPrice',
                          e.target.value
                        )
                        updateValue(
                          stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                        )
                      },
                      onPricePercentageChange: (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        updateSubBlockValue(
                          'stopLoss',
                          'forcedStop',
                          'pricePercentage',
                          e.target.value
                        )

                        updateStopLossAndTakeProfitPrices({
                          forcedStopPercentage: +e.target.value,
                        })
                      },
                      updateSubBlockValue,
                      showConfirmationPopup,
                      updateTerminalViewMode,
                      updateStopLossAndTakeProfitPrices,
                    }}
                  />
                  {stopLoss.external && (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '10%',
                          margin: 'auto 0.8rem auto 0.3rem',
                        }}
                      >
                        <Switcher
                          theme={theme}
                          checked={stopLoss.forcedStopByAlert}
                          onChange={() => {
                            updateBlockValue(
                              'stopLoss',
                              'forcedStopByAlert',
                              !stopLoss.forcedStopByAlert
                            )

                            if (!stopLoss.forcedStopByAlert) {
                              updateBlockValue('stopLoss', 'plotEnabled', false)
                              updateSubBlockValue(
                                'stopLoss',
                                'forcedStop',
                                'mandatoryForcedLoss',
                                false
                              )
                            } else {
                              updateSubBlockValue(
                                'stopLoss',
                                'forcedStop',
                                'mandatoryForcedLoss',
                                true
                              )
                            }

                            updateBlockValue('stopLoss', 'type', 'market')
                          }}
                        />
                      </div>

                      <BtnCustom
                        needMinWidth={false}
                        btnWidth="35%"
                        height="3rem"
                        fontWeight={'500'}
                        fontSize="1.1rem"
                        fontFamily="Avenir Next Medium"
                        padding="0 0"
                        borderRadius=".3rem"
                        style={{
                          border: stopLoss.forcedStopByAlert
                            ? `0.1rem solid ${theme.palette.blue.main}`
                            : theme.palette.border.main,
                          lineHeight: 'inherit',
                          color: stopLoss.forcedStopByAlert
                            ? theme.palette.blue.main
                            : theme.palette.border.main,
                        }}
                        btnColor={theme.palette.grey.text}
                        backgroundColor={theme.palette.grey.titleForInput}
                        textTransform={'none'}
                        margin={'0 0 0 0'}
                        transition={'all .4s ease-out'}
                        onClick={() => {
                          updateBlockValue(
                            'stopLoss',
                            'forcedStopByAlert',
                            !stopLoss.forcedStopByAlert
                          )
                          if (!stopLoss.forcedStopByAlert) {
                            updateBlockValue('stopLoss', 'plotEnabled', false)
                            updateSubBlockValue(
                              'stopLoss',
                              'forcedStop',
                              'mandatoryForcedLoss',
                              false
                            )
                          } else {
                            updateSubBlockValue(
                              'stopLoss',
                              'forcedStop',
                              'mandatoryForcedLoss',
                              true
                            )
                          }

                          updateBlockValue('stopLoss', 'plotEnabled', false)

                          updateBlockValue('stopLoss', 'type', 'market')
                        }}
                      >
                        After Alert
                      </BtnCustom>
                    </>
                  )}
                </InputRowContainer>
              </FormInputContainer>
            </InputRowContainer>
          )}

          {entryPoint.averaging.enabled &&
            entryPoint.averaging.placeWithoutLoss && (
              <FormInputContainer
                theme={theme}
                title={'Place break-even point for next entries:'}
              >
                <div style={{ width: '100%' }}>
                  {entryPoint.averaging.entryLevels.map((el, index) => {
                    const currentPrice =
                      index === 0
                        ? avgPrice
                        : entryPoint.order.side === 'sell'
                        ? (avgPrice *
                            (100 + el.price / entryPoint.order.leverage)) /
                          100
                        : (avgPrice *
                            (100 - el.price / entryPoint.order.leverage)) /
                          100
                    if (index === 0) {
                      estPrice = el.price
                      sumAmount = el.amount
                      margin =
                        (estPrice * sumAmount +
                          currentPrice * ((el.amount / 100) * el.amount)) /
                        entryPoint.order.leverage
                    } else {
                      const exactAmount = (el.amount / 100) * el.amount

                      const total =
                        estPrice * sumAmount + currentPrice * exactAmount

                      estPrice = total / (sumAmount + exactAmount)
                      sumAmount += exactAmount
                      margin = total / entryPoint.order.leverage
                    }

                    return (
                      <AdditionalSettingsButton
                        theme={theme}
                        style={{
                          textDecoration: 'underline',
                          marginBottom: '1rem',
                        }}
                        width={'30%'}
                        isActive={
                          entryPoint.averaging.entryLevels[index]
                            .placeWithoutLoss
                        }
                        onClick={() => {
                          togglePlaceWithoutLoss(index)
                        }}
                      >
                        {currentPrice.toFixed(pricePrecision)}
                      </AdditionalSettingsButton>
                    )
                  })}
                </div>
              </FormInputContainer>
            )}
          {stopLoss.external && (
            <>
              <InputRowContainer style={{ marginTop: '0rem' }}>
                {' '}
                <FormInputContainer
                  style={{
                    width: 'calc(50% - 1rem)',
                    margin: '0 1rem 0 0',
                    alignItems: 'flex-start',
                  }}
                  theme={theme}
                  padding={'0 0 0 0'}
                  title={
                    <DarkTooltip
                      title={
                        <img
                          style={{ width: '35rem', height: '50rem' }}
                          src={WebHookImg}
                        />
                      }
                    >
                      <span>
                        paste it into alert{' '}
                        <span
                          style={{
                            color: '#7380EB',
                            textDecoration: 'underline',
                          }}
                        >
                          web-hook
                        </span>{' '}
                        URL field
                      </span>
                    </DarkTooltip>
                  }
                >
                  <BtnCustom
                    needMinWidth={false}
                    btnWidth="calc(100%)"
                    height="3rem"
                    fontSize="1.4rem"
                    padding="1rem 2rem"
                    borderRadius=".8rem"
                    borderColor={'#7380EB'}
                    btnColor={'#fff'}
                    backgroundColor={'#7380EB'}
                    textTransform={'none'}
                    margin={'1rem 0 0 0'}
                    transition={'all .4s ease-out'}
                    onClick={() => {
                      enqueueSnackbar('Copied!', {
                        variant: 'success',
                      })
                      copy(`https://${API_URL}/editStopLossByAlert`)
                    }}
                  >
                    Copy web-hook URL
                  </BtnCustom>
                </FormInputContainer>
                <FormInputContainer
                  style={{
                    width: 'calc(50% - 1rem)',
                    margin: '0 0 0 1rem',
                    alignItems: 'flex-start',
                  }}
                  theme={theme}
                  padding={'0 0 0 0'}
                  title={
                    <DarkTooltip
                      title={
                        <img
                          style={{ width: '40rem', height: '42rem' }}
                          src={MessageImg}
                        />
                      }
                    >
                      <span>
                        paste it into alert{' '}
                        <span
                          style={{
                            color: '#7380EB',
                            textDecoration: 'underline',
                          }}
                        >
                          message
                        </span>{' '}
                        URL field
                      </span>
                    </DarkTooltip>
                  }
                >
                  <BtnCustom
                    needMinWidth={false}
                    btnWidth="calc(100%)"
                    height="3rem"
                    fontSize="1.4rem"
                    padding="1rem 2rem"
                    borderRadius=".8rem"
                    borderColor={'#7380EB'}
                    btnColor={'#fff'}
                    backgroundColor={'#7380EB'}
                    textTransform={'none'}
                    margin={'1rem 0 0 0'}
                    transition={'all .4s ease-out'}
                    onClick={() => {
                      enqueueSnackbar('Copied!', {
                        variant: 'success',
                      })
                      copy(
                        `{\\"token\\": \\"${
                          entryPoint.TVAlert.templateToken
                        }\\", \\"orderType\\": ${
                          stopLoss.forcedStopByAlert
                            ? `\\"market\\"`
                            : `\\"${stopLoss.type}\\"`
                        } ${
                          stopLoss.plotEnabled
                            ? `, \\"stopLossPrice\\": {{plot_${stopLoss.plot}}}`
                            : !stopLoss.forcedStopByAlert
                            ? `, \\"stopLossPrice\\": ${stopLoss.stopLossPrice}`
                            : ''
                        }}`
                      )
                    }}
                  >
                    Copy message
                  </BtnCustom>
                </FormInputContainer>
              </InputRowContainer>
            </>
          )}
        </div>
      </div>
      <InputRowContainer
        justify={'center'}
        style={{
          width: 'calc(100%)',
          height: '5rem',
          margin: '0 auto',
          position: 'absolute',
          bottom: '2rem',
          padding: '0rem 1rem 0rem 1.2rem',
        }}
      >
        <SendButton
          theme={theme}
          style={{
            background: 'transparent',
            border: `0.1rem solid  ${theme.palette.white.main}`,
            color: theme.palette.white.main,
            boxShadow: 'none',
            width: '100%',
            height: '5rem',
          }}
          type={'sell'}
          onClick={() => {
            updateTerminalViewMode('onlyTables')
          }}
        >
          cancel
        </SendButton>
      </InputRowContainer>
    </TerminalBlock>
  )
}

export const StopLossBlockMemo = React.memo(StopLossBlock)
