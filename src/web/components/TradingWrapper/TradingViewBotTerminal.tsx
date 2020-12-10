import React from 'react'
import copy from 'clipboard-copy'

import {
  getSecondValueFromFirst,
  GreenSwitcherStyles,
  RedSwitcherStyles,
  DisabledSwitcherStyles,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/utils'

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
import { FormInputContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'

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
} from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { SliderWithPriceAndPercentageFieldRow, SliderWithAmountFieldRow } from '@sb/compositions/Chart/components/SmartOrderTerminal/SliderComponents'

const generateToken = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15)


export const TradingViewBotTerminal = ({
  // pair,
  // funds,
  theme,
  // maxAmount,
  // entryPoint,
  // showErrors,
  // marketType,
  // getMaxValues,
  // setMaxAmount,
  // isMarketType,
  // initialMargin,
  // validateField,
  // pricePrecision,
  // addAverageTarget,
  // updateBlockValue,
  // priceForCalculate,
  // quantityPrecision,
  // getEntryAlertJson,
  // updatePriceToMarket,
  // deleteAverageTarget,
  // updateSubBlockValue,
  // isCloseOrderExternal,
  // isAveragingAfterFirstTarget,
}) => {
  return (
    <TerminalBlock theme={theme} width={'100%'} data-tut={'step1'}>
      {/* {entryPoint.TVAlert.plotEnabled && (
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
      )} */}

      <div>
        <InputRowContainer>
              {/* <CustomSwitcher
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

                  updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'side',
                    getSecondValueFromFirst(entryPoint.order.side)
                  )
                }}
              /> */}
        </InputRowContainer>
        <InputRowContainer>
        {/* <ChangeOrderTypeBtn
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
          </ChangeOrderTypeBtn> */}
          </InputRowContainer>

          {/* price */}
        
            {/* {entryPoint.TVAlert.plotEnabled && (
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
            )} */}

        {/* <SliderWithAmountFieldRow
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
        /> */}

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
                  // value={getEntryAlertJson()}
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
                    // copy(getEntryAlertJson())
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
      </div>
    </TerminalBlock>
  )
}

export const TradingViewBotTerminalMemo = React.memo(TradingViewBotTerminal)