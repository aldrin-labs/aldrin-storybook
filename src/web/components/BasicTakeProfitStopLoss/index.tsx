import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { SendButton } from '../TraidingTerminal/styles'
import {
  StyledCheckox,
  StyledLabel,
} from '@sb/components/TradingTable/TradingTablePagination'
import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'

import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { withTheme } from '@material-ui/styles'
import BlueSlider from '@sb/components/Slider/BlueSlider'

const UnderlinedTitle = styled.a`
text-decoration: underline;
text-transform: uppercase;
letter-spacing: 0.05rem';
font-family: Avenir Next Demi;
font-size: 1.1rem;
font-weight: bold;
margin-right: 1rem;
white-space: nowrap`

const BasicTPSL = (props) => {
  const {
    pair,
    theme,
    updatedPrice,
    leverage,
    operationType,
    takeProfitPercentage,
    stopLossPercentage,
    setStopLossPercentage,
    setTakeProfitPercentage,
    pricePrecision,
    isSLTPOn,
    setSLTPOn,
  } = props

  const [stopLossPrice, setStopLossPrice] = useState(updatedPrice)
  const [takeProfitPrice, setTakeProfitPrice] = useState(updatedPrice)

  useEffect(() => {
    const calcStopLossPrice =
      operationType === 'buy'
        ? stripDigitPlaces(
            updatedPrice * (1 - +stopLossPercentage / 100 / leverage),
            pricePrecision
          )
        : stripDigitPlaces(
            updatedPrice * (1 + +stopLossPercentage / 100 / leverage),
            pricePrecision
          )
    setStopLossPrice(calcStopLossPrice)
  }, [updatedPrice, operationType, leverage])

  useEffect(() => {
    const calcTakeProfitPrice =
      operationType === 'sell'
        ? stripDigitPlaces(
            updatedPrice * (1 - +takeProfitPercentage / 100 / leverage),
            pricePrecision
          )
        : stripDigitPlaces(
            updatedPrice * (1 + +takeProfitPercentage / 100 / leverage),
            pricePrecision
          )
    setTakeProfitPrice(calcTakeProfitPrice)
  }, [updatedPrice, operationType, leverage])

  console.log('isSLTPOnB', isSLTPOn)
  return (
    <div
      style={{
        padding: '1rem 0',
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          height: '66.6667%',
          width: '100%',
          padding: '1rem 2rem',
          borderLeft: '0.1rem solid rgb(226, 224, 229)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            margin: '0 auto 1.5rem auto',
          }}
        >
          <UnderlinedTitle>stop loss</UnderlinedTitle>

          <hr
            style={{ height: '0.1rem' }}
            size={'3px'}
            width={'70%'}
            align={'left'}
          />
          <div>
            <StyledCheckox
              id="specPair"
              checked={isSLTPOn}
              onChange={() => {
                setSLTPOn(!isSLTPOn)
              }}
              style={{ padding: '0  .4rem 0 1.2rem' }}
            />
            <StyledLabel theme={theme} htmlFor="specPair"></StyledLabel>
          </div>
        </div>
        <InputRowContainer>
          <Input
            theme={theme}
            padding={'0'}
            width={'35%'}
            textAlign={'left'}
            symbol={pair[1]}
            disabled={!isSLTPOn}
            value={stopLossPrice}
            // disabled={isMarketType && !entryPoint.trailing.isTrailingOn}
            //showErrors={showErrors && isStopLossOn}
            showErrors={undefined}
            inputStyles={{
              paddingLeft: '1rem',
            }}
            //   onChange={(e) => {
            //     const percentage =
            //       entryPoint.order.side === 'buy'
            //         ? (1 - e.target.value / priceForCalculate) *
            //           100 *
            //           entryPoint.order.leverage
            //         : -(1 - e.target.value / priceForCalculate) *
            //           100 *
            //           entryPoint.order.leverage

            //     this.updateBlockValue(
            //       'stopLoss',
            //       'pricePercentage',
            //       stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
            // )

            // this.updateBlockValue('stopLoss', 'stopLossPrice', e.target.value)
            //   }}
            onChange={(e) => {
              const percentage =
                operationType === 'buy'
                  ? (1 - e.target.value / updatedPrice) * 100 * leverage
                  : -(1 - e.target.value / updatedPrice) * 100 * leverage

              setStopLossPrice(e.target.value)
              setStopLossPercentage(
                stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
              )
            }}
          />

          <Input
            theme={theme}
            padding={'0 .8rem 0 .8rem'}
            width={'30%'}
            symbol={'%'}
            preSymbol={'-'}
            textAlign={'left'}
            needPreSymbol={true}
            value={+stopLossPercentage > 100 ? 100 : stopLossPercentage}
            disabled={!isSLTPOn}
            // showErrors={showErrors && isStopLossOn}
            showErrors={undefined}
            inputStyles={{
              paddingRight: '0',
              paddingLeft: '2rem',
            }}
            onChange={(e) => {
              const calcStopLossPrice =
                operationType === 'buy'
                  ? stripDigitPlaces(
                      updatedPrice * (1 - +e.target.value / 100 / leverage),
                      pricePrecision
                    )
                  : stripDigitPlaces(
                      updatedPrice * (1 + +e.target.value / 100 / leverage),
                      pricePrecision
                    )
              setStopLossPrice(calcStopLossPrice)
              setStopLossPercentage(e.target.value)
            }}
          />

          <BlueSlider
            theme={theme}
            value={stopLossPercentage}
            min={0}
            max={100}
            disabled={!isSLTPOn}
            sliderContainerStyles={{
              width: '35%',
              margin: '0 .8rem 0 .8rem',
            }}
            onChange={(value) => {
              const calcStopLossPrice =
                operationType === 'buy'
                  ? stripDigitPlaces(
                      updatedPrice * (1 - +value / 100 / leverage),
                      pricePrecision
                    )
                  : stripDigitPlaces(
                      updatedPrice * (1 + +value / 100 / leverage),
                      pricePrecision
                    )
              setStopLossPrice(calcStopLossPrice)
              setStopLossPercentage(value)
            }}
            //   onChange={(value) => {
            //     if (stopLoss.pricePercentage > 100 && value === 100) {
            //       return
            //     }

            //     updateStopLossAndTakeProfitPrices({
            //       stopLossPercentage: value,
            //     })

            //     updateBlockValue('stopLoss', 'pricePercentage', value)
            //   }}
          />
        </InputRowContainer>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            margin: '1.5rem auto',
          }}
        >
          <UnderlinedTitle>take profit</UnderlinedTitle>
          <hr
            style={{ height: '0.1rem' }}
            size={'3px'}
            width={'70%'}
            align={'left'}
          />
          <div>
            <StyledCheckox
              id="specPair"
              checked={isSLTPOn}
              onChange={() => {
                setSLTPOn(!isSLTPOn)
              }}
              style={{ padding: '0  .4rem 0 1.2rem' }}
            />
            <StyledLabel theme={theme} htmlFor="specPair"></StyledLabel>
          </div>
        </div>
        <InputRowContainer>
          <Input
            theme={theme}
            textAlign={'left'}
            padding={'0'}
            width={'35%'}
            symbol={pair[1]}
            value={takeProfitPrice}
            disabled={!isSLTPOn}
            //   showErrors={
            //     false &&
            //     showErrors &&
            //     takeProfit.isTakeProfitOn &&
            //     !takeProfit.splitTargets.isSplitTargetsOn &&
            //     !takeProfit.external
            //   }
            showErrors={false}
            //isValid={this.validateField(true, takeProfit.takeProfitPrice)}
            isValid={true}
            inputStyles={{
              paddingRight: '0',
              paddingLeft: '1rem',
            }}
            // onChange={(e) => {
            //   const percentage =
            //     entryPoint.order.side === 'sell'
            //       ? (1 - e.target.value / priceForCalculate) *
            //       100 *
            //       entryPoint.order.leverage
            //       : -(1 - e.target.value / priceForCalculate) *
            //       100 *
            //       entryPoint.order.leverage

            //   this.updateSubBlockValue(
            //     'takeProfit',
            //     'trailingTAP',
            //     'activatePrice',
            //     stripDigitPlaces(
            //       percentage < 0 ? 0 : percentage,
            //       2
            //     )
            //   )

            //   this.updateBlockValue(
            //     'takeProfit',
            //     'takeProfitPrice',
            //     e.target.value
            //   )
            // }}
            onChange={(e) => {
              const percentage =
                operationType === 'sell'
                  ? (1 - e.target.value / updatedPrice) * 100 * leverage
                  : -(1 - e.target.value / updatedPrice) * 100 * leverage

              setTakeProfitPrice(e.target.value)
              setTakeProfitPercentage(
                stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
              )
            }}
          />
          <Input
            theme={theme}
            symbol={'%'}
            disabled={!isSLTPOn}
            padding={'0 .8rem 0 .8rem'}
            width={'30%'}
            preSymbol={'+'}
            textAlign={'left'}
            needPreSymbol={true}
            value={+takeProfitPercentage > 100 ? 100 : takeProfitPercentage}
            // showErrors={
            //   showErrors &&
            //   isTakeProfitOn &&
            //   !takeProfit.external
            // }
            // isValid={this.validateField(
            //   takeProfit.trailingTAP.isTrailingOn,
            //   takeProfit.trailingTAP.activatePrice
            // )}
            inputStyles={{
              paddingRight: '0',
              paddingLeft: '2rem',
            }}
            onChange={(e) => {
              const calcTakeProfitPrice =
                operationType === 'sell'
                  ? stripDigitPlaces(
                      updatedPrice * (1 - +e.target.value / 100 / leverage),
                      pricePrecision
                    )
                  : stripDigitPlaces(
                      updatedPrice * (1 + +e.target.value / 100 / leverage),
                      pricePrecision
                    )
              setTakeProfitPrice(calcTakeProfitPrice)
              setTakeProfitPercentage(e.target.value)
            }}
            // onChange={(e) => {
            //   this.updateSubBlockValue(
            //     'takeProfit',
            //     'trailingTAP',
            //     'activatePrice',
            //     e.target.value
            //   )

            //   this.updateStopLossAndTakeProfitPrices({
            //     takeProfitPercentage: e.target.value,
            //   })
            // }}
          />
          <BlueSlider
            theme={theme}
            disabled={!isSLTPOn}
            value={takeProfitPercentage}
            sliderContainerStyles={{
              width: '35%',
              margin: '0 .8rem 0 .8rem',
            }}
            // onChange={(value) => {
            //   if (
            //     takeProfit.trailingTAP.activatePrice > 100 &&
            //     value === 100
            //   ) {
            //     return
            //   }

            //   this.updateSubBlockValue(
            //     'takeProfit',
            //     'trailingTAP',
            //     'activatePrice',
            //     value
            //   )

            //   this.updateStopLossAndTakeProfitPrices({
            //     takeProfitPercentage: value,
            //   })
            // }}
            onChange={(value) => {
              const calcTakeProfitPrice =
                operationType === 'sell'
                  ? stripDigitPlaces(
                      updatedPrice * (1 - +value / 100 / leverage),
                      pricePrecision
                    )
                  : stripDigitPlaces(
                      updatedPrice * (1 + +value / 100 / leverage),
                      pricePrecision
                    )
              setTakeProfitPrice(calcTakeProfitPrice)
              setTakeProfitPercentage(value)
            }}
          />
        </InputRowContainer>
      </div>
      <div
        style={{
          height: '33.3%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '1rem',
        }}
      >
        {/* <SendButton */}
        {/* style={{
            position: 'absolute',
            width: '94%',
            right: '2rem',
            bottom: '3rem',
          }} */}
        {/* theme={theme}
          // disabled={orderIsCreating === operationType}
          type={operationType}
          // onClick={async () => { */}
        {/* //   const result = await validateForm()
          //   console.log('result', result)
          //   if (Object.keys(result).length === 0 || !isSPOTMarket) { */}
        {/* //     handleSubmit(values)
          //   }
          // }}
        > */}
        {/* {isSPOTMarket
          ? operationType === 'buy'
            ? `buy ${pair[0]}`
            : `sell ${pair[0]}`
          : operationType === 'buy'
          ? 'buy long'
          : 'sell short'} */}
        {/* {operationType === 'buy' ? 'buy long' : 'sell short'}
        </SendButton> */}
      </div>
    </div>
  )
}

export default compose(withTheme())(BasicTPSL)
