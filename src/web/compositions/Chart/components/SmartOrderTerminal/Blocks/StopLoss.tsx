import React from 'react'
import copy from 'clipboard-copy'

import {
  getSecondValueFromFirst,
  BlueSwitcherStyles,
} from '../utils'

import { StopLossBlockProps } from '../types'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { API_URL } from '@core/utils/config'

import WebHookImg from '@sb/images/WebHookImg.png'
import MessageImg from '@sb/images/MessageImg.png'

import { SendButton } from '@sb/components/TraidingTerminal/styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { FormInputContainer, Select } from '../InputComponents'

import CustomSwitcher from '@sb/components/SwitchOnOff/CustomSwitcher'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'

import {
  TerminalBlock,
  InputRowContainer,
  AdditionalSettingsButton,
  SubBlocksContainer,
} from '../styles'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { SliderWithPriceAndPercentageFieldRow, SliderWithTimeoutFieldRow } from './SliderComponents'

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
  updateSubBlockValue,
  showConfirmationPopup,
  updateTerminalViewMode,
  updateStopLossAndTakeProfitPrices,
}: StopLossBlockProps) => {
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
        <InputRowContainer justify="center">
          <CustomSwitcher
            theme={theme}
            firstHalfText={'limit'}
            secondHalfText={'market'}
            buttonHeight={'3rem'}
            containerStyles={{ width: '100%' }}
            firstHalfStyleProperties={BlueSwitcherStyles(theme)}
            secondHalfStyleProperties={BlueSwitcherStyles(theme)}
            firstHalfIsActive={stopLoss.type === 'limit'}
            changeHalf={() =>
              updateBlockValue(
                'stopLoss',
                'type',
                getSecondValueFromFirst(stopLoss.type)
              )
            }
          />
        </InputRowContainer>
        <div>
          <InputRowContainer justify="flex-start" padding={'.6rem 0 1.2rem 0'}>
            <DarkTooltip
              maxWidth={'30rem'}
              title={
                <>
                  <p>Waiting after unrealized P&L will reach set target.</p>
                  <p>
                    <b>For example:</b> you set 10% stop loss and 1 minute
                    timeout. When your unrealized loss is 10% timeout will give
                    a minute for a chance to reverse trend and loss to go below
                    10% before stop loss order executes.
                  </p>
                </>
              }
            >
              <AdditionalSettingsButton
                theme={theme}
                isActive={stopLoss.timeout.isTimeoutOn}
                onClick={() => {
                  if (!stopLoss.external) {
                    updateBlockValue('stopLoss', 'external', false)
                    updateSubBlockValue(
                      'stopLoss',
                      'forcedStop',
                      'mandatoryForcedLoss',
                      false
                    )
                  }
                  updateSubBlockValue(
                    'stopLoss',
                    'timeout',
                    'isTimeoutOn',
                    !stopLoss.timeout.isTimeoutOn
                  )

                  updateSubBlockValue(
                    'stopLoss',
                    'timeout',
                    'whenLossableOn',
                    !stopLoss.timeout.whenLossableOn
                  )

                  updateSubBlockValue(
                    'stopLoss',
                    'forcedStop',
                    'isForcedStopOn',
                    !stopLoss.forcedStop.isForcedStopOn
                  )
                }}
              >
                Timeout
              </AdditionalSettingsButton>
            </DarkTooltip>
            <DarkTooltip
              maxWidth={'30rem'}
              title={
                'Your stop loss order will be placed once when there is a Trading View alert with params that you sent.'
              }
            >
              <AdditionalSettingsButton
                theme={theme}
                isActive={stopLoss.external}
                onClick={() => {
                  updateBlockValue('stopLoss', 'external', !stopLoss.external)

                  if (!stopLoss.external) {
                    updateSubBlockValue(
                      'stopLoss',
                      'timeout',
                      'isTimeoutOn',
                      false
                    )
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
                SL by TV Alert
              </AdditionalSettingsButton>
            </DarkTooltip>
          </InputRowContainer>

          {((stopLoss.external &&
            !stopLoss.forcedStopByAlert &&
            !stopLoss.plotEnabled) ||
            !stopLoss.external) && (
              <FormInputContainer
                theme={theme}
                haveTooltip
                tooltipText={
                  <>
                    <p>The unrealized loss/ROE for closing trade.</p>
                    <p>
                      <b>For example:</b> you bought 1 BTC and set 10% stop loss.
                            Your unrealized loss should be 0.1 BTC and order will be
                            executed.
                          </p>
                  </>
                }
                title={'stop price'}
              >
                <InputRowContainer>
                  <SliderWithPriceAndPercentageFieldRow
                    {...{
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
                      percentagePreSymbol: '-',
                      approximatePrice: stopLoss.stopLossPrice,
                      pricePercentage: stopLoss.pricePercentage,
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
                        updateStopLossAndTakeProfitPrices({
                          stopLossPercentage: value,
                        })

                        updateBlockValue('stopLoss', 'pricePercentage', value)
                      },
                      onApproximatePriceChange: (e: React.ChangeEvent<HTMLInputElement>, updateValue: (v: any) => void) => {
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

                        updateValue(stripDigitPlaces(percentage < 0 ? 0 : percentage, 2))

                        updateBlockValue(
                          'stopLoss',
                          'stopLossPrice',
                          e.target.value
                        )
                      },
                      onPricePercentageChange: (e: React.ChangeEvent<HTMLInputElement>) => {
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
                </InputRowContainer>
              </FormInputContainer>
            )}

          {(stopLoss.timeout.isTimeoutOn ||
            (stopLoss.forcedStop.isForcedStopOn &&
              stopLoss.forcedStop.mandatoryForcedLoss)) &&
            (!stopLoss.external ||
              (stopLoss.external &&
                stopLoss.forcedStop.mandatoryForcedLoss)) && (
              <>
                <InputRowContainer>
                  {stopLoss.timeout.isTimeoutOn && (
                    <SubBlocksContainer>
                      <FormInputContainer
                        theme={theme}
                        haveTooltip
                        tooltipText={
                          <>
                            <p>
                              Waiting after unrealized P&L will reach set
                              target.
                            </p>
                            <p>
                              <b>For example:</b> you set 10% stop loss and 1
                              minute timeout. When your unrealized loss is 10%
                              timeout will give a minute for a chance to reverse
                              trend and loss to go below 10% before stop loss
                              order executes.
                            </p>
                          </>
                        }
                        title={'timeout'}
                        lineMargin={'0 1.2rem 0 1rem'}
                      >
                        <InputRowContainer wrap={'wrap'}>
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
                            onTimeoutChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
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
                      </FormInputContainer>
                    </SubBlocksContainer>
                  )}
                  <SubBlocksContainer
                    width={
                      stopLoss.forcedStop.mandatoryForcedLoss ? '100%' : '50%'
                    }
                  >
                    <FormInputContainer
                      theme={theme}
                      haveTooltip
                      tooltipText={
                        <>
                          <p>
                            How much should the price change to ignore timeout.
                          </p>

                          <p>
                            <b>For example:</b> You bought BTC and set 10% stop
                            loss with 1 minute timeout and 15% forced stop. But
                            the price continued to fall during the timeout. Your
                            trade will be closed when loss will be 15%
                            regardless of timeout.
                          </p>
                        </>
                      }
                      title={'forced stop price'}
                    >
                      <InputRowContainer wrap={!stopLoss.forcedStop.mandatoryForcedLoss ? 'wrap' : 'nowrap'}>
                        <SliderWithPriceAndPercentageFieldRow
                          {...{
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
                            percentagePreSymbol: '-',
                            sliderInTheBottom: !stopLoss.forcedStop.mandatoryForcedLoss,
                            approximatePrice: stopLoss.forcedStop.forcedStopPrice,
                            pricePercentage: stopLoss.forcedStop.pricePercentage,
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
                            onApproximatePriceChange: (e: React.ChangeEvent<HTMLInputElement>, updateValue: (v: any) => void) => {
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
                                stripDigitPlaces(
                                  percentage < 0 ? 0 : percentage,
                                  2
                                )
                              )

                              updateSubBlockValue(
                                'stopLoss',
                                'forcedStop',
                                'forcedStopPrice',
                                e.target.value
                              )
                              updateValue(stripDigitPlaces(percentage < 0 ? 0 : percentage, 2))
                            },
                            onPricePercentageChange: (e: React.ChangeEvent<HTMLInputElement>) => {
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
                      </InputRowContainer>
                    </FormInputContainer>
                  </SubBlocksContainer>
                </InputRowContainer>
              </>
            )}
          {stopLoss.external && (
            <>
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
                    fontSize={'1rem'}
                    isActive={stopLoss.forcedStopByAlert}
                    onClick={() => {
                      updateBlockValue(
                        'stopLoss',
                        'forcedStopByAlert',
                        !stopLoss.forcedStopByAlert
                      )
                      updateBlockValue('stopLoss', 'plotEnabled', false)

                      updateBlockValue('stopLoss', 'type', 'market')
                    }}
                  >
                    Forced Stop by Alert
                  </AdditionalSettingsButton>
                  <AdditionalSettingsButton
                    theme={theme}
                    fontSize={'1rem'}
                    isActive={stopLoss.forcedStop.mandatoryForcedLoss}
                    onClick={() => {
                      updateSubBlockValue(
                        'stopLoss',
                        'forcedStop',
                        'isForcedStopOn',
                        !stopLoss.forcedStop.mandatoryForcedLoss
                      )

                      updateSubBlockValue(
                        'stopLoss',
                        'forcedStop',
                        'mandatoryForcedLoss',
                        !stopLoss.forcedStop.mandatoryForcedLoss
                      )
                    }}
                  >
                    Settings Forced stop
                  </AdditionalSettingsButton>
                  <AdditionalSettingsButton
                    theme={theme}
                    isActive={stopLoss.plotEnabled}
                    onClick={() => {
                      updateBlockValue('stopLoss', 'forcedStopByAlert', false)

                      updateBlockValue(
                        'stopLoss',
                        'plotEnabled',
                        !stopLoss.plotEnabled
                      )
                    }}
                  >
                    Plot
                  </AdditionalSettingsButton>
                </InputRowContainer>
              </FormInputContainer>

              {stopLoss.plotEnabled && (
                <InputRowContainer padding={'0 0 .8rem 0'}>
                  <Input
                    theme={theme}
                    type={'number'}
                    needTitle
                    title={`plot_`}
                    textAlign="left"
                    inputStyles={{
                      paddingLeft: '4rem',
                    }}
                    value={stopLoss.plot}
                    showErrors={showErrors}
                    isValid={validateField(true, stopLoss.plot)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateBlockValue('stopLoss', 'plot', e.target.value)
                    }}
                  />
                </InputRowContainer>
              )}

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
                    onChange={() => { }}
                    value={`https://${API_URL}/editStopLossByAlert`}
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
                      copy(`https://${API_URL}/editStopLossByAlert`)
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
                    onChange={() => { }}
                    value={`{\\"token\\": \\"${entryPoint.TVAlert.templateToken
                      }\\", \\"orderType\\": ${stopLoss.forcedStopByAlert
                        ? `\\"market\\"`
                        : `\\"${stopLoss.type}\\"`
                      } ${stopLoss.plotEnabled
                        ? `, \\"stopLossPrice\\": {{plot_${stopLoss.plot}}}`
                        : !stopLoss.forcedStopByAlert
                          ? `, \\"stopLossPrice\\": ${stopLoss.stopLossPrice}`
                          : ''
                      }}`}
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
                      copy(
                        `{\\"token\\": \\"${entryPoint.TVAlert.templateToken
                        }\\", \\"orderType\\": ${stopLoss.forcedStopByAlert
                          ? `\\"market\\"`
                          : `\\"${stopLoss.type}\\"`
                        } ${stopLoss.plotEnabled
                          ? `, \\"stopLossPrice\\": {{plot_${stopLoss.plot}}}`
                          : !stopLoss.forcedStopByAlert
                            ? `, \\"stopLossPrice\\": ${stopLoss.stopLossPrice}`
                            : ''
                        }}`
                      )
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
      </div>
      <InputRowContainer
        style={{
          width: 'calc(100%)',
          height: '4rem',
          margin: '0 auto',
          position: 'absolute',
          bottom: '1rem',
          padding: '0rem 1rem 0rem 1.2rem',
        }}
      >
        {' '}
        <SendButton
          theme={theme}
          type={'sell'}
          onClick={() => {
            updateTerminalViewMode('onlyTables')
          }}
        >
          cancel
        </SendButton>
        <SendButton
          data-tut={'createBtn'}
          theme={theme}
          type={'buy'}
          onClick={showConfirmationPopup}
        >
          create trade
        </SendButton>
      </InputRowContainer>
    </TerminalBlock>
  )
}

export const StopLossBlockMemo = React.memo(StopLossBlock)
