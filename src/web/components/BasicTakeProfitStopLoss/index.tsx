import React, { useState } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { SendButton } from '../TraidingTerminal/styles'
import TradeInputContent from '@sb/components/TraidingTerminal/index'
import {
  StyledCheckox,
  StyledLabel,
} from '@sb/components/TradingTable/TradingTablePagination'
import {
  TradeInputContent as Input,
  TradeInputHeader,
} from '@sb/components/TraidingTerminal/index'

import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { withTheme } from '@material-ui/styles'
import {
  Container,
  GridContainer,
  Coin,
  UpdatedCoin,
  InputTitle,
  InputWrapper,
  TradeInputBlock,
  TradeInput,
  BlueInputTitle,
  SeparateInputTitle,
  AbsoluteInputTitle,
} from '@sb/components/TraidingTerminal/styles'
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
  const [stopLossPercentage, setStopLossPercentage] = useState('')
  const [stopLossPrice, setStopLossPrice] = useState('')
  const [takeProfitPercentage, setTakeProfitPercentage] = useState('')
  const [takeProfitPrice, setTakeProfitPrice] = useState('')
  const [isStopLossOn, setStopLossOn] = useState('')
  const [isTakeProfitOn, setTakeProfitOn] = useState('')

  const { pair, theme } = props
  return (
    <div
      style={{
        padding: '2rem 1rem',
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
          }}
        >
          <UnderlinedTitle> stop loss</UnderlinedTitle>

          <hr
            style={{ height: '0.1rem' }}
            size={'3px'}
            width={'200px'}
            align={'left'}
          />
          <div>
            <StyledCheckox
              id="specPair"
              // checked={}
              // onChange={handleToggleSpecificPair}
              style={{ padding: '0  .4rem 0 1.2rem' }}
            />
            <StyledLabel theme={theme} htmlFor="specPair"></StyledLabel>
          </div>
        </div>
        <InputRowContainer>
          <Input
            theme={theme}
            padding={'0'}
            width={'30%'}
            textAlign={'left'}
            symbol={pair[1]}
            value={stopLossPrice}
            // disabled={isMarketType && !entryPoint.trailing.isTrailingOn}
            disabled={false}
            //   showErrors={showErrors && isStopLossOn}
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
            onChange={() => {
              //   updateStopLossAndTakeProfitPrices({
              //     stopLossPercentage: e.target.value,
              //   })
              console.log('fgh')
              //     updateBlockValue('stopLoss', 'pricePercentage', e.target.value)
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
            disabled={false}
            // showErrors={showErrors && isStopLossOn}
            showErrors={undefined}
            inputStyles={{
              paddingRight: '0',
              paddingLeft: '2rem',
            }}
            onChange={() => {
              //   updateStopLossAndTakeProfitPrices({
              //     stopLossPercentage: e.target.value,
              //   })
              console.log('fgh')
              //     updateBlockValue('stopLoss', 'pricePercentage', e.target.value)
            }}
          />

          <BlueSlider
            theme={theme}
            // value={stopLoss.pricePercentage}
            value={2}
            sliderContainerStyles={{
              width: '50%',
              margin: '0 .8rem 0 .8rem',
            }}
            onChange={() => {
              //   updateStopLossAndTakeProfitPrices({
              //     stopLossPercentage: e.target.value,
              //   })
              console.log('fgh')
              //     updateBlockValue('stopLoss', 'pricePercentage', e.target.value)
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
          }}
        >
          <UnderlinedTitle>take profit</UnderlinedTitle>
          <hr
            style={{ height: '0.1rem' }}
            size={'3px'}
            width={'200px'}
            align={'left'}
          />
          <div>
            <StyledCheckox
              id="specPair"
              // checked={}
              // onChange={handleToggleSpecificPair}
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
            width={'30%'}
            symbol={pair[1]}
            value={takeProfitPrice}
            //   disabled={isMarketType && !entryPoint.trailing.isTrailingOn}
            disabled={undefined}
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
            onChange={() => {
              //   updateStopLossAndTakeProfitPrices({
              //     stopLossPercentage: e.target.value,
              //   })
              console.log('fgh')
              //     updateBlockValue('stopLoss', 'pricePercentage', e.target.value)
            }}
          />
          <Input
            theme={theme}
            symbol={'%'}
            padding={'0 .8rem 0 .8rem'}
            width={'30%'}
            preSymbol={'+'}
            textAlign={'left'}
            needPreSymbol={true}
            //   value={takeProfit.trailingTAP.activatePrice}
            value={''}
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
            onChange={() => {
              //   updateStopLossAndTakeProfitPrices({
              //     stopLossPercentage: e.target.value,
              //   })
              console.log('fgh')
              //     updateBlockValue('stopLoss', 'pricePercentage', e.target.value)
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
            // value={takeProfit.trailingTAP.activatePrice}
            sliderContainerStyles={{
              width: '50%',
              margin: '0 .8rem 0 .8rem',
            }}
            value={2}
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
            onChange={() => {
              //   updateStopLossAndTakeProfitPrices({
              //     stopLossPercentage: e.target.value,
              //   })
              console.log('fgh')
              //     updateBlockValue('stopLoss', 'pricePercentage', e.target.value)
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
        }}
      >
        <SendButton
          theme={theme}
          // disabled={orderIsCreating === operationType}
          // type={operationType}
          // onClick={async () => {
          //   const result = await validateForm()
          //   console.log('result', result)
          //   if (Object.keys(result).length === 0 || !isSPOTMarket) {
          //     handleSubmit(values)
          //   }
          // }}
        >
          {/* {isSPOTMarket
          ? operationType === 'buy'
            ? `buy ${pair[0]}`
            : `sell ${pair[0]}`
          : operationType === 'buy'
          ? 'buy long'
          : 'sell short'} */}
          sell short
        </SendButton>
      </div>
    </div>
  )
}

export default compose(withTheme())(BasicTPSL)
