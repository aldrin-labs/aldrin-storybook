import React from 'react'
import copy from 'clipboard-copy'

import { getSecondValueFromFirst, BlueSwitcherStyles } from '../utils'

import { TakeProfitBlockProps } from '../types'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { API_URL } from '@core/utils/config'

import WebHookImg from '@sb/images/WebHookImg.png'
import MessageImg from '@sb/images/MessageImg.png'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { FormInputContainer, Select } from '../InputComponents'
import CloseIcon from '@material-ui/icons/Close'
import CustomSwitcher from '@sb/components/SwitchOnOff/CustomSwitcher'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import {
  TradeInputContent as Input,
  TradeInputHeader,
} from '@sb/components/TraidingTerminal/index'

import {
  TimeoutTitle,
  TargetTitle,
  TargetValue,
  TerminalBlock,
  InputRowContainer,
  AdditionalSettingsButton,
  SubBlocksContainer,
} from '../styles'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { SliderWithPriceAndPercentageFieldRow } from './SliderComponents'

export const TakeProfitBlock = ({
  pair,
  theme,
  entryPoint,
  takeProfit,
  showErrors,
  marketType,
  addTarget,
  isMarketType,
  deleteTarget,
  validateField,
  pricePrecision,
  updateBlockValue,
  priceForCalculate,
  updateSubBlockValue,
  updateStopLossAndTakeProfitPrices,
}: TakeProfitBlockProps) => {
  return (
    <TerminalBlock
      theme={theme}
      width={'calc(33%)'}
      borderRight="0"
      data-tut={'step3'}
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
          firstHalfIsActive={takeProfit.type === 'limit'}
          changeHalf={() => {
            updateBlockValue(
              'takeProfit',
              'type',
              getSecondValueFromFirst(takeProfit.type)
            )
          }}
        />
      </InputRowContainer>
      <div>
        <InputRowContainer
          justify="flex-start"
          padding={'.6rem 0 1.2rem 0'}
          style={{ margin: '1rem auto 0.5rem auto' }}
        >
          {!entryPoint.averaging.enabled && (
            <DarkTooltip
              maxWidth={'40rem'}
              title={
                <>
                  <p>
                    The algorithm, which will wait for the most favorable price
                    for the order until the trend is reversed.
                  </p>
                  <p>
                    For example: you bought BTC by 7500 USDT price and set 1%
                    trailing deviation to take a profit. Trailing will start
                    right after enter and then the price will grow to 7700, then
                    the trend will reverse and start to fall. The order will be
                    executed when the price reaches 7633, i.e. by 1% from the
                    moment the trend reversal.
                  </p>
                </>
              }
            >
              <AdditionalSettingsButton
                theme={theme}
                style={{ fontSize: '1rem', textDecoration: 'underline' }}
                isActive={takeProfit.trailingTAP.isTrailingOn}
                onClick={() => {
                  updateSubBlockValue(
                    'takeProfit',
                    'trailingTAP',
                    'isTrailingOn',
                    !takeProfit.trailingTAP.isTrailingOn
                  )

                  updateSubBlockValue(
                    'takeProfit',
                    'splitTargets',
                    'isSplitTargetsOn',
                    false
                  )

                  updateSubBlockValue(
                    'takeProfit',
                    'timeout',
                    'isTimeoutOn',
                    false
                  )

                  updateStopLossAndTakeProfitPrices({
                    takeProfitPercentage: !takeProfit.trailingTAP.isTrailingOn
                      ? takeProfit.trailingTAP.activatePrice
                      : takeProfit.pricePercentage,
                  })
                }}
              >
                Trailing TAP
              </AdditionalSettingsButton>
            </DarkTooltip>
          )}
          {!takeProfit.external &&
            !entryPoint.averaging.enabled &&
            marketType === 1 && (
              <DarkTooltip
                maxWidth={'40rem'}
                title={
                  <>
                    <p>Take a partial profit on several rising points.</p>
                  </>
                }
              >
                <AdditionalSettingsButton
                  style={{ textDecoration: 'underline' }}
                  theme={theme}
                  isActive={takeProfit.splitTargets.isSplitTargetsOn}
                  onClick={() => {
                    if (takeProfit.splitTargets.isSplitTargetsOn) {
                      updateSubBlockValue(
                        'takeProfit',
                        'splitTargets',
                        'targets',
                        []
                      )
                    }

                    updateSubBlockValue(
                      'takeProfit',
                      'splitTargets',
                      'isSplitTargetsOn',
                      !takeProfit.splitTargets.isSplitTargetsOn
                    )

                    updateSubBlockValue(
                      'takeProfit',
                      'trailingTAP',
                      'isTrailingOn',
                      false
                    )

                    updateSubBlockValue(
                      'takeProfit',
                      'timeout',
                      'isTimeoutOn',
                      false
                    )

                    updateBlockValue('takeProfit', 'external', false)
                  }}
                >
                  Split targets
                </AdditionalSettingsButton>
              </DarkTooltip>
            )}
          <DarkTooltip
            maxWidth={'30rem'}
            title={
              'Advanced Take a Profit using your Alerts from TradingView.com.'
            }
          >
            <AdditionalSettingsButton
              theme={theme}
              style={{ textDecoration: 'underline' }}
              isActive={takeProfit.external}
              onClick={() => {
                updateSubBlockValue(
                  'takeProfit',
                  'splitTargets',
                  'isSplitTargetsOn',
                  false
                )

                updateBlockValue('takeProfit', 'external', !takeProfit.external)

                if (
                  !takeProfit.external &&
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
              TP by TV Alert
            </AdditionalSettingsButton>
          </DarkTooltip>
          {/* <AdditionalSettingsButton theme={theme}
                    isActive={takeProfit.timeout.isTimeoutOn}
                    onClick={() => {
                      updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'isTimeoutOn',
                        !takeProfit.timeout.isTimeoutOn
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
                    }}
                  >
                    Timeout
                  </AdditionalSettingsButton> */}
        </InputRowContainer>
        {!takeProfit.trailingTAP.isTrailingOn &&
          ((takeProfit.external &&
            !takeProfit.forcedStopByAlert &&
            !takeProfit.plotEnabled) ||
            !takeProfit.external) && (
            // <FormInputContainer
            //   theme={theme}
            //   haveTooltip
            //   tooltipText={
            //     <>
            //       <p>The unrealized profit/ROE for closing the trade.</p>
            //       <p>
            //         <b>For example:</b>you bought 1 BTC and set 100% take
            //         profit. Your unrealized profit should be 1 BTC and order
            //         will be executed.
            //       </p>
            //     </>
            //   }
            //   title={'stop price'}
            // >
            <InputRowContainer style={{ marginBottom: '1rem' }}>
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
                  percentagePreSymbol: '+',
                  approximatePrice: takeProfit.takeProfitPrice,
                  pricePercentage: takeProfit.pricePercentage,
                  getApproximatePrice: (value: number) => {
                    return value === 0
                      ? priceForCalculate
                      : entryPoint.order.side === 'sell'
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
                      takeProfitPercentage: value,
                    })

                    updateBlockValue('takeProfit', 'pricePercentage', value)
                  },
                  onApproximatePriceChange: (
                    e: React.ChangeEvent<HTMLInputElement>,
                    updateValue: (v: any) => void
                  ) => {
                    const percentage =
                      entryPoint.order.side === 'sell'
                        ? (1 - +e.target.value / priceForCalculate) *
                          100 *
                          entryPoint.order.leverage
                        : -(1 - +e.target.value / priceForCalculate) *
                          100 *
                          entryPoint.order.leverage

                    updateBlockValue(
                      'takeProfit',
                      'pricePercentage',
                      stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                    )

                    updateValue(
                      stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                    )

                    updateBlockValue(
                      'takeProfit',
                      'takeProfitPrice',
                      e.target.value
                    )
                  },
                  onPricePercentageChange: (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    updateStopLossAndTakeProfitPrices({
                      takeProfitPercentage: +e.target.value,
                    })

                    updateBlockValue(
                      'takeProfit',
                      'pricePercentage',
                      e.target.value
                    )
                  },
                  updateSubBlockValue,
                  updateStopLossAndTakeProfitPrices,
                }}
              />
            </InputRowContainer>
            // </FormInputContainer>
          )}

        {takeProfit.trailingTAP.isTrailingOn &&
          ((takeProfit.external &&
            !takeProfit.forcedStopByAlert &&
            !takeProfit.plotEnabled) ||
            !takeProfit.external) && (
            <>
              {/* <FormInputContainer
                theme={theme}
                haveTooltip
                tooltipText={
                  'The price at which the trailing algorithm is enabled.'
                }
                title={!takeProfit.external ? 'activation price' : 'stop price'}
              > */}
              <InputRowContainer style={{ marginBottom: '1rem' }}>
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
                    percentagePreSymbol: '+',
                    approximatePrice: takeProfit.takeProfitPrice,
                    pricePercentage: takeProfit.trailingTAP.activatePrice,
                    getApproximatePrice: (value: number) => {
                      return value === 0
                        ? priceForCalculate
                        : entryPoint.order.side === 'sell'
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
                        'takeProfit',
                        'trailingTAP',
                        'activatePrice',
                        value
                      )

                      updateStopLossAndTakeProfitPrices({
                        takeProfitPercentage: value,
                      })
                    },
                    onApproximatePriceChange: (
                      e: React.ChangeEvent<HTMLInputElement>,
                      updateValue: (v: any) => void
                    ) => {
                      const percentage =
                        entryPoint.order.side === 'sell'
                          ? (1 - +e.target.value / priceForCalculate) *
                            100 *
                            entryPoint.order.leverage
                          : -(1 - +e.target.value / priceForCalculate) *
                            100 *
                            entryPoint.order.leverage

                      updateSubBlockValue(
                        'takeProfit',
                        'trailingTAP',
                        'activatePrice',
                        stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                      )

                      updateValue(
                        stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                      )

                      updateStopLossAndTakeProfitPrices({
                        takeProfitPercentage: +e.target.value,
                      })
                    },
                    onPricePercentageChange: (
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      updateSubBlockValue(
                        'takeProfit',
                        'trailingTAP',
                        'activatePrice',
                        +e.target.value
                      )

                      updateStopLossAndTakeProfitPrices({
                        takeProfitPercentage: +e.target.value,
                      })
                    },
                    updateSubBlockValue,
                    updateStopLossAndTakeProfitPrices,
                  }}
                />
              </InputRowContainer>
              {/* </FormInputContainer> */}
              {!takeProfit.external && (
                // <FormInputContainer
                //   theme={theme}
                //   haveTooltip
                //   tooltipText={
                //     'The level of price change after the trend reversal, at which the order will be executed.'
                //   }
                //   title={'trailing deviation (%)'}
                // >
                <InputRowContainer>
                  <SliderWithPriceAndPercentageFieldRow
                    {...{
                      pair,
                      needChain: false,
                      theme,
                      header: 'deviation',
                      percentageInputWidth: '61.5%',
                      entryPoint,
                      showErrors,
                      isMarketType,
                      validateField,
                      pricePrecision,
                      updateBlockValue,
                      priceForCalculate,

                      needPriceField: false,
                      percentagePreSymbol: '',
                      percentageTextAlign: 'right',
                      pricePercentage:
                        takeProfit.trailingTAP.deviationPercentage,
                      onAfterSliderChange: (value: number) => {
                        updateSubBlockValue(
                          'takeProfit',
                          'trailingTAP',
                          'deviationPercentage',
                          value
                        )
                      },
                      onPricePercentageChange: (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        updateSubBlockValue(
                          'takeProfit',
                          'trailingTAP',
                          'deviationPercentage',
                          e.target.value
                        )
                      },
                      updateSubBlockValue,
                      updateStopLossAndTakeProfitPrices,
                    }}
                  />
                </InputRowContainer>
                // </FormInputContainer>
              )}
            </>
          )}
        {takeProfit.external && (
          <>
            <FormInputContainer
              theme={theme}
              padding={'0 0 .8rem 0'}
              haveTooltip={false}
              tooltipText={''}
              title={'action when alert'}
            >
              <InputRowContainer style={{ marginTop: '0.5rem' }}>
                {' '}
                <AdditionalSettingsButton
                  theme={theme}
                  btnWidth={'50%'}
                  isActive={takeProfit.forcedStopByAlert}
                  onClick={() => {
                    updateBlockValue(
                      'takeProfit',
                      'forcedStopByAlert',
                      !takeProfit.forcedStopByAlert
                    )
                    updateBlockValue('takeProfit', 'plotEnabled', false)

                    updateBlockValue('takeProfit', 'type', 'market')
                  }}
                >
                  Forced Stop by Alert
                </AdditionalSettingsButton>
                <AdditionalSettingsButton
                  theme={theme}
                  btnWidth={'50%'}
                  isActive={takeProfit.plotEnabled}
                  onClick={() => {
                    updateBlockValue('takeProfit', 'forcedStopByAlert', false)

                    updateBlockValue(
                      'takeProfit',
                      'plotEnabled',
                      !takeProfit.plotEnabled
                    )
                  }}
                >
                  Plot
                </AdditionalSettingsButton>
              </InputRowContainer>
            </FormInputContainer>

            {takeProfit.plotEnabled && (
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
                  value={takeProfit.plot}
                  showErrors={showErrors}
                  isValid={validateField(true, takeProfit.plot)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateBlockValue('takeProfit', 'plot', e.target.value)
                  }}
                />
              </InputRowContainer>
            )}
            <InputRowContainer style={{ marginTop: '0.5rem' }}>
              {' '}
              <FormInputContainer
                style={{
                  width: 'calc(50% - 1rem)',
                  margin: '0 1rem 0 0',
                  alignItems: 'flex-start',
                }}
                theme={theme}
                width={'95%'}
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
                    copy(`https://${API_URL}/editTakeProfitByAlert`)
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
                    copy(
                      `{\\"token\\": \\"${
                        entryPoint.TVAlert.templateToken
                      }\\", \\"orderType\\": ${
                        takeProfit.forcedStopByAlert
                          ? `\\"market\\"`
                          : `\\"${takeProfit.type}\\"`
                      } ${
                        takeProfit.plotEnabled
                          ? takeProfit.trailingTAP.isTrailingOn
                            ? `, \\"trailingExitPrice\\": {{plot_${takeProfit.plot}}}`
                            : `, \\"takeProfitPrice\\": {{plot_${takeProfit.plot}}}`
                          : !takeProfit.forcedStopByAlert
                          ? takeProfit.trailingTAP.isTrailingOn
                            ? `, \\"trailingExitPrice\\": ${takeProfit.takeProfitPrice}`
                            : `, \\"takeProfitPrice\\": ${takeProfit.takeProfitPrice}`
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

        {takeProfit.splitTargets.isSplitTargetsOn && (
          <>
            {/* <FormInputContainer theme={theme} title={'amount (%)'}> */}
            <InputRowContainer style={{ margin: '1rem auto 1rem auto' }}>
              <SliderWithPriceAndPercentageFieldRow
                {...{
                  pair,
                  header: 'quantity',
                  needChain: false,
                  theme,
                  entryPoint,
                  showErrors,
                  isMarketType,
                  percentageInputWidth: '61.5%',
                  validateField,
                  pricePrecision,
                  updateBlockValue,
                  priceForCalculate,
                  needPriceField: false,
                  percentagePreSymbol: '',
                  percentageTextAlign: 'right',
                  pricePercentage: takeProfit.trailingTAP.deviationPercentage,
                  onAfterSliderChange: (value) => {
                    const occupiedVolume = takeProfit.splitTargets.targets.reduce(
                      (prev, curr) => prev + curr.amount,
                      0
                    )

                    updateSubBlockValue(
                      'takeProfit',
                      'splitTargets',
                      'volumePercentage',
                      occupiedVolume + value < 100
                        ? value
                        : 100 - occupiedVolume
                    )
                  },
                  onPricePercentageChange: (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    const occupiedVolume = takeProfit.splitTargets.targets.reduce(
                      (prev, curr) => prev + curr.amount,
                      0
                    )

                    updateSubBlockValue(
                      'takeProfit',
                      'splitTargets',
                      'volumePercentage',
                      occupiedVolume + +e.target.value < 100
                        ? e.target.value
                        : 100 - occupiedVolume
                    )
                  },
                  updateSubBlockValue,
                  updateStopLossAndTakeProfitPrices,
                }}
              />
            </InputRowContainer>
            {/* </FormInputContainer> */}

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
                onClick={addTarget}
              >
                add target
              </BtnCustom>
            </InputRowContainer>

            <InputRowContainer
              padding=".6rem 1rem 1.2rem .4rem"
              direction="column"
            >
              <InputRowContainer padding=".2rem .5rem">
                <TargetTitle
                  theme={theme}
                  style={{ width: '50%', paddingLeft: '2rem' }}
                >
                  profit
                </TargetTitle>
                <TargetTitle theme={theme} style={{ width: '50%' }}>
                  quantity
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
                {takeProfit.splitTargets.targets.map((target, i) => (
                  <InputRowContainer
                    key={`${target.price}${target.amount}${i}`}
                    padding=".2rem .5rem"
                    style={
                      takeProfit.splitTargets.targets.length - 1 !== i
                        ? {
                            borderBottom: theme.palette.border.main,
                          }
                        : {}
                    }
                  >
                    <TargetValue
                      theme={theme}
                      style={{ width: '50%', paddingLeft: '2rem' }}
                    >
                      +{target.price}%
                    </TargetValue>
                    <TargetValue theme={theme} style={{ width: '40%' }}>
                      {target.amount}%
                    </TargetValue>
                    <CloseIcon
                      onClick={() => deleteTarget(i)}
                      style={{
                        color: theme.palette.red.main,
                        fontSize: '1.8rem',
                        cursor: 'pointer',
                      }}
                    />
                  </InputRowContainer>
                ))}
              </div>
            </InputRowContainer>
          </>
        )}

        {takeProfit.timeout.isTimeoutOn && (
          <>
            <TradeInputHeader theme={theme} title={`timeout`} needLine={true} />
            <InputRowContainer>
              <SubBlocksContainer>
                <InputRowContainer>
                  <TimeoutTitle> When profit</TimeoutTitle>
                </InputRowContainer>
                <InputRowContainer>
                  <SCheckbox
                    checked={takeProfit.timeout.whenProfitOn}
                    onChange={() => {
                      updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'whenProfitOn',
                        !takeProfit.timeout.whenProfitOn
                      )

                      updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'whenProfitableOn',
                        false
                      )
                    }}
                    style={{ padding: '0 .4rem 0 0' }}
                  />
                  <Input
                    theme={theme}
                    haveSelector
                    width={'calc(55% - .4rem)'}
                    value={takeProfit.timeout.whenProfitSec}
                    showErrors={showErrors && takeProfit.isTakeProfitOn}
                    isValid={validateField(
                      takeProfit.timeout.whenProfitOn,
                      takeProfit.timeout.whenProfitSec
                    )}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'whenProfitSec',
                        e.target.value
                      )
                    }}
                    inputStyles={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    disabled={!takeProfit.timeout.whenProfitOn}
                  />
                  <Select
                    theme={theme}
                    width={'calc(30% - .4rem)'}
                    value={takeProfit.timeout.whenProfitMode}
                    inputStyles={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'whenProfitMode',
                        e.target.value
                      )
                    }}
                    isDisabled={!takeProfit.timeout.whenProfitOn}
                  >
                    <option>sec</option>
                    <option>min</option>
                  </Select>
                </InputRowContainer>
              </SubBlocksContainer>

              <SubBlocksContainer>
                <InputRowContainer>
                  <TimeoutTitle>When profitable</TimeoutTitle>
                </InputRowContainer>
                <InputRowContainer>
                  <SCheckbox
                    checked={takeProfit.timeout.whenProfitableOn}
                    onChange={() => {
                      updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'whenProfitableOn',
                        !takeProfit.timeout.whenProfitableOn
                      )

                      updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'whenProfitOn',
                        false
                      )
                    }}
                    style={{ padding: '0 .4rem 0 0' }}
                  />
                  <Input
                    theme={theme}
                    haveSelector
                    width={'calc(55% - .4rem)'}
                    value={takeProfit.timeout.whenProfitableSec}
                    showErrors={showErrors && takeProfit.isTakeProfitOn}
                    isValid={validateField(
                      takeProfit.timeout.whenProfitableOn,
                      takeProfit.timeout.whenProfitableSec
                    )}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'whenProfitableSec',
                        e.target.value
                      )
                    }}
                    inputStyles={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    disabled={!takeProfit.timeout.whenProfitableOn}
                  />
                  <Select
                    theme={theme}
                    width={'calc(30% - .4rem)'}
                    value={takeProfit.timeout.whenProfitableMode}
                    inputStyles={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'whenProfitableMode',
                        e.target.value
                      )
                    }}
                    isDisabled={!takeProfit.timeout.whenProfitableOn}
                  >
                    <option>sec</option>
                    <option>min</option>
                  </Select>
                </InputRowContainer>
              </SubBlocksContainer>
            </InputRowContainer>
          </>
        )}
      </div>
    </TerminalBlock>
  )
}

export const TakeProfitBlockMemo = React.memo(TakeProfitBlock)
