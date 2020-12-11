import React, { useState } from 'react'
import copy from 'clipboard-copy'
import styled from 'styled-components'

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
  updateState,
  marketPrice,
  publicKey,
  maxAmount: maxAmountArray,
  quantityPrecision,
}) => {
  const [showPopup, changeShowPopup] = useState(false)

  const [sidePlot, updateSidePlot] = useState('')
  const [sidePlotEnabled, changeSidePlotEnabled] = useState(false)

  const [orderType, changeOrderType] = useState('market')

  const [price, updatePrice] = useState(marketPrice)
  const [pricePlot, updatePricePlot] = useState('')
  const [pricePlotEnabled, changePricePlotEnabled] = useState(false)

  const [amount, changeAmount] = useState(0)
  const [total, changeTotal] = useState(0)
  const [amountPlot, updateAmountPlot] = useState('')
  const [amountPlotEnabled, changeAmountPlotEnabled] = useState(false)

  const maxAmount = side === 'buy' ? maxAmountArray[1] : maxAmountArray[0]

  const startTradingViewBot = () => {
    changeShowPopup(true)
    updateState('token', generateToken())
    window.onbeforeunload = function() {
      return 'Are you sure you want to leave?'
    }
  }

  const getEntryAlertJson = () => {
    // const typeJson =
    //   typePlotEnabled
    //     ? `\\"orderType\\": {{plot_${typePlot}}}`
    //     : `\\"orderType\\": \\"${type}\\"`

    const sideJson =
      sidePlotEnabled
        ? `\\"side\\": {{plot_${sidePlot}}}`
        : `\\"side\\": \\"${side}\\"`

    const priceJson = pricePlotEnabled
        ? `\\"price\\": {{plot_${pricePlot}}}`
        : `\\"price\\": ${price}`

    const amountJson =
      amountPlotEnabled
        ? `\\"amount\\": {{plot_${amountPlot}}}`
        : `\\"amount\\": ${amount}`

    return `{\\"token\\": \\"${token}\\", ${sideJson}, ${priceJson}, ${amountJson}, \\"publicKey\\": \\"${publicKey}\\"}`
  }
  // subscribe to updates

  return (
    <TerminalBlock style={{ display: 'flex' }} theme={theme} width={'100%'} data-tut={'step1'}>
      <TradingViewConfirmPopup
        theme={theme}
        open={showPopup}
        handleClose={() => changeShowPopup(false)}
      />
      <div style={{ margin: 'auto 0'}}>
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

              updateState('side', getSecondValueFromFirst(side))
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
            needTitleBlock
            header={'plot_'}
            theme={theme}
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
              header={'price'}
              type={'text'}
              needTitleBlock={true}
              disabled={pricePlotEnabled || orderType === 'market'}
              onChange={(e) => {
                updatePrice(e.target.value)
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
            needTitleBlock
            header={'plot_'}
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
            changeAmount(e.target.value)
          }}
          onTotalChange={(e) => {
            changeTotal(e.target.value)
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
            tooltipText={
              <img
                style={{ width: '35rem', height: '50rem' }}
                src={WebHookImg}
              />
            }
            title={
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
            }
          >
            <BtnCustom
              needMinWidth={false}
              btnWidth="100%"
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
            tooltipText={
              <img
                style={{ width: '40rem', height: '42rem' }}
                src={MessageImg}
              />
            }
            title={
              <span>
                Paste it into alert{' '}
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
            }
          >
            <BtnCustom
              needMinWidth={false}
              btnWidth="100%"
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
            <SendButton type={'buy'}>Start</SendButton>
          </InputRowContainer>
        </InputRowContainer>
      </div>
    </TerminalBlock>
  )
}

export const TradingViewBotTerminalMemo = React.memo(TradingViewBotTerminal)
