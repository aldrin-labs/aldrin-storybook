import React, { useState } from 'react'
import copy from 'clipboard-copy'
import styled from 'styled-components'

import { SERUM_ORDERS_BY_TV_ALERTS } from '@core/graphql/subscriptions/SERUM_ORDERS_BY_TV_ALERTS'

import {
  getSecondValueFromFirst,
  GreenSwitcherStyles,
  RedSwitcherStyles,
  DisabledSwitcherStyles,
  BlueSwitcherStyles,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/utils'

import { SendButton } from '../TraidingTerminal/styles'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { API_URL } from '@core/utils/config'
import WebHookImg from '@sb/images/WebHookImg.png'
import MessageImg from '@sb/images/MessageImg.png'

import { SettingsLabel } from '@sb/components/TradingWrapper/styles'
import CloseIcon from '@material-ui/icons/Close'

import { SRadio } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { FormInputContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'

import HeightIcon from '@material-ui/icons/Height'
import CustomSwitcher, {
  SwitcherHalf,
} from '@sb/components/SwitchOnOff/CustomSwitcher'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'

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
import { SliderWithPriceAndPercentageFieldRow } from '@sb/compositions/Chart/components/SmartOrderTerminal/SliderComponents'

import TradingViewConfirmPopup from './TradingViewConfirmPopup'
import { SliderWithAmountFieldRow } from './AmountSlider'
import { notify } from '@sb/dexUtils/notifications'

const generateToken = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15)

const SwitcherContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 10%;
`

export const TradingViewBotTerminal = ({
  pair,
  theme,
  side,
  token,
  updateWrapperState,
  marketPrice,
  publicKey,
  maxAmount: maxAmountArray,
  quantityPrecision,
  subscribeToTVAlert,
  pricePrecision,
}) => {
  const [showPopup, changeShowPopup] = useState(false)

  const [sidePlot, updateSidePlot] = useState('')
  const [sidePlotEnabled, changeSidePlotEnabled] = useState(false)

  const [orderType, changeOrderType] = useState('market')

  const [price, updatePrice] = useState(
    stripDigitPlaces(marketPrice, pricePrecision)
  )
  const [pricePlot, updatePricePlot] = useState('')
  const [pricePlotEnabled, changePricePlotEnabled] = useState(false)

  const [amount, changeAmount] = useState(0)
  const [total, changeTotal] = useState(0)
  const [amountPlot, updateAmountPlot] = useState('')
  const [amountPlotEnabled, changeAmountPlotEnabled] = useState(false)

  const maxAmount = side === 'sell' ? maxAmountArray[1] : maxAmountArray[0]

  const startTradingViewBot = () => {
    subscribeToTVAlert()
    changeShowPopup(true)
    updateWrapperState({ token: generateToken() })
    window.onbeforeunload = function() {
      return 'Are you sure you want to leave?'
    }
  }

  const getEntryAlertJson = () => {
    const typeJson = false
      ? `\\"type\\": {{plot_}}`
      : `\\"type\\": \\"${orderType}\\"`

    const sideJson = sidePlotEnabled
      ? `\\"side\\": {{plot_${sidePlot}}}`
      : `\\"side\\": \\"${side}\\"`

    const priceJson =
      pricePlotEnabled && orderType === 'limit'
        ? `\\"price\\": {{plot_${pricePlot}}}`
        : `\\"price\\": ${orderType === 'market' ? 0 : price}`

    const amountJson = amountPlotEnabled
      ? `\\"amount\\": {{plot_${amountPlot}}}`
      : `\\"amount\\": ${amount}`

    return `{\\"token\\": \\"${token}\\", ${sideJson}, ${typeJson}, ${priceJson}, ${amountJson}, \\"publicKey\\": \\"${publicKey}\\"}`
  }

  return (
    <TerminalBlock
      style={{ display: 'flex' }}
      theme={theme}
      width={'100%'}
      data-tut={'step1'}
    >
      <TradingViewConfirmPopup
        theme={theme}
        open={showPopup}
        handleClose={() => changeShowPopup(false)}
        updateWrapperState={updateWrapperState}
      />
      <div style={{ margin: 'auto 0', width: '100%' }}>
        <InputRowContainer padding={'1.2rem 0 .6rem 0'}>
          <CustomSwitcher
            theme={theme}
            firstHalfText={'buy'}
            secondHalfText={'sell'}
            buttonHeight={'3rem'}
            containerStyles={{
              width: '70%',
              padding: 0,
            }}
            firstHalfStyleProperties={
              sidePlotEnabled
                ? DisabledSwitcherStyles(theme)
                : GreenSwitcherStyles(theme)
            }
            secondHalfStyleProperties={
              sidePlotEnabled
                ? DisabledSwitcherStyles(theme)
                : RedSwitcherStyles(theme)
            }
            firstHalfIsActive={side === 'buy'}
            changeHalf={() => {
              if (sidePlotEnabled) {
                return
              }

              updateWrapperState({ side: getSecondValueFromFirst(side) })
            }}
          />
          <SwitcherContainer>
            <Switcher
              checked={sidePlotEnabled}
              onChange={() => {
                changeSidePlotEnabled(!sidePlotEnabled)
              }}
            />
          </SwitcherContainer>
          <Input
            theme={theme}
            needTitle
            title={`plot_`}
            type={'number'}
            textAlign="left"
            width={'calc(20% - .8rem)'}
            inputStyles={{
              paddingLeft: '4rem',
            }}
            disabled={!sidePlotEnabled}
            value={sidePlot}
            // showErrors={showErrors}
            // isValid={validateField(true, sidePlot)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateSidePlot(e.target.value)
            }}
          />
        </InputRowContainer>
        <InputRowContainer padding={'.6rem 0 .6rem 0'}>
          <CustomSwitcher
            theme={theme}
            firstHalfText={'limit'}
            secondHalfText={'market'}
            buttonHeight={'3rem'}
            containerStyles={{
              width: '35%',
              padding: 0,
            }}
            firstHalfStyleProperties={
              // pricePlotEnabled
              //   ? DisabledSwitcherStyles(theme)
              BlueSwitcherStyles(theme)
            }
            secondHalfStyleProperties={
              // pricePlotEnabled
              //   ? DisabledSwitcherStyles(theme)
              BlueSwitcherStyles(theme)
            }
            firstHalfIsActive={orderType === 'limit'}
            changeHalf={() => {
              if (pricePlotEnabled) {
                return
              }

              changeOrderType(orderType === 'limit' ? 'market' : 'limit')
            }}
          />
          <div style={{ width: 'calc(35% - 1rem)', marginLeft: '1rem' }}>
            <Input
              theme={theme}
              padding={'0'}
              width={'calc(100%)'}
              textAlign={'right'}
              symbol={pair[1]}
              value={orderType === 'market' ? 'Market' : price}
              needTitle
              title={`price`}
              type={'text'}
              disabled={pricePlotEnabled || orderType === 'market'}
              onChange={(e) => {
                updatePrice(e.target.value)
                changeTotal(amount * e.target.value)
              }}
            />
          </div>
          <SwitcherContainer>
            <Switcher
              checked={pricePlotEnabled}
              onChange={() => {
                changePricePlotEnabled(!pricePlotEnabled)
              }}
            />
          </SwitcherContainer>
          <Input
            needTitle
            title={`plot_`}
            theme={theme}
            type={'number'}
            textAlign="left"
            width={'calc(20% - .8rem)'}
            inputStyles={{
              paddingLeft: '4rem',
            }}
            disabled={!pricePlotEnabled || orderType === 'market'}
            value={pricePlot}
            // showErrors={showErrors}
            // isValid={validateField(true, sidePlot)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updatePricePlot(e.target.value)
            }}
          />
        </InputRowContainer>

        <SliderWithAmountFieldRow
          pair={pair}
          theme={theme}
          side={side}
          amountPlotEnabled={amountPlotEnabled}
          maxAmount={maxAmount}
          showErrors={false}
          validateField={(v) => !!v}
          onAmountChange={(e) => {
            const isAmountMoreThanMax = +e.target.value > maxAmount
            const priceForCalculate =
              orderType === 'market' ? marketPrice : price

            const amountForUpdate = isAmountMoreThanMax
              ? maxAmount
              : e.target.value

            const total = stripDigitPlaces(
              amountForUpdate * priceForCalculate,
              3
            )

            changeAmount(amountForUpdate)
            changeTotal(total)
          }}
          onTotalChange={(e) => {
            const priceForCalculate =
              orderType === 'market' ? marketPrice : price

            const isTotalMoreThanMax =
              +e.target.value > maxAmount * priceForCalculate

            const totalForUpdate = isTotalMoreThanMax
              ? maxAmount * priceForCalculate
              : e.target.value

            changeTotal(totalForUpdate)
            changeAmount(
              stripDigitPlaces(+totalForUpdate / priceForCalculate, 8)
            )
          }}
          marketType={0}
          priceForCalculate={orderType === 'market' ? marketPrice : price}
          quantityPrecision={quantityPrecision}
          onAfterSliderChange={(value) => {
            const newValue = (maxAmount / 100) * value
            const priceForCalculate =
              orderType === 'market' ? marketPrice : price

            const newAmount =
              side === 'buy' ? newValue / priceForCalculate : newValue

            const newTotal = newAmount * priceForCalculate

            changeAmount(stripDigitPlaces(newAmount, 8))

            changeTotal(stripDigitPlaces(newTotal, 3))
          }}
          amount={amount}
          amountPlot={amountPlot}
          total={total}
          togglePlot={() => changeAmountPlotEnabled(!amountPlotEnabled)}
          changePlot={(e) => updateAmountPlot(e.target.value)}
        />

        <InputRowContainer align={'flex-end'}>
          <FormInputContainer
            theme={theme}
            padding={'0 0 0 0'}
            haveTooltip={true}
            style={{ width: 'calc(35% - 1rem)', marginRight: '1rem' }}
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
                      color: theme.palette.blue.serum,
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
              btnWidth="100%"
              height="3rem"
              fontSize="1.4rem"
              padding="1rem 2rem"
              borderRadius=".8rem"
              borderColor={theme.palette.blue.serum}
              btnColor={'#fff'}
              backgroundColor={theme.palette.blue.serum}
              textTransform={'none'}
              margin={'1rem 0 0 0'}
              transition={'all .4s ease-out'}
              onClick={() => {
                copy(`https://${API_URL}/createSerumOrderByTVAlert`)
              }}
            >
              Copy web-hook URL
            </BtnCustom>
            {/* </InputRowContainer> */}
          </FormInputContainer>
          <FormInputContainer
            theme={theme}
            style={{ width: 'calc(35%)' }}
            padding={'0 0 0 0'}
            haveTooltip={true}
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
                      color: theme.palette.blue.serum,
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
              btnWidth="100%"
              height="3rem"
              fontSize="1.4rem"
              padding="1rem 2rem"
              borderRadius=".8rem"
              borderColor={theme.palette.blue.serum}
              btnColor={'#fff'}
              backgroundColor={theme.palette.blue.serum}
              textTransform={'none'}
              margin={'1rem 0 0 0'}
              transition={'all .4s ease-out'}
              onClick={() => {
                copy(getEntryAlertJson())
              }}
            >
              Copy message
            </BtnCustom>
          </FormInputContainer>
          <InputRowContainer
            padding={'0'}
            style={{ marginLeft: '1rem' }}
            width={'30%'}
          >
            {' '}
            <SendButton
              type={'buy'}
              theme={theme}
              onClick={() => {
                // publicKey check
                if (publicKey === '') {
                  notify({
                    type: 'error',
                    message: 'Connect wallet first',
                  })

                  return
                }

                if (amount === 0) {
                  notify({
                    type: 'error',
                    message: 'Your amount is 0',
                  })

                  return
                }
                // amount check

                startTradingViewBot()
                updateWrapperState({ TVAlertsBotIsActive: true })
              }}
            >
              Start
            </SendButton>
          </InputRowContainer>
        </InputRowContainer>
      </div>
    </TerminalBlock>
  )
}

export const TradingViewBotTerminalMemo = React.memo(TradingViewBotTerminal)
