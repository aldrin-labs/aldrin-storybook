import React, { useState } from 'react'
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

const BasicTPSL = (props) => {
  const [stopLossPercentage, setStopLossPercentage] = useState('')
  const [stopLossPrice, setStopLossPrice] = useState('')
  const [takeProfitPercentage, setTakeProfitPercentage] = useState('')
  const [takeProfitPrice, setTakeProfitPrice] = useState('')
  const [isStopLossOn, setStopLossOn] = useState('')
  const [isTakeProfitOn, setTakeProfitOn] = useState('')

  const { pair, theme } = props
  return (
    <div style={{}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <a
          style={{
            textDecoration: 'underline',
            textTransform: 'uppercase',
            fontSize: '1.3rem',
            marginRight: '1rem',
            whiteSpace: 'nowrap',
          }}
        >
          stop loss
        </a>
        <hr
          style={{ height: '0.1rem' }}
          size={'3px'}
          width={'500px'}
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
          width={'calc(32.5%)'}
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
          width={'calc(17.5%)'}
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
        <a
          style={{
            textDecoration: 'underline',
            textTransform: 'uppercase',
            fontSize: '1.3rem',
            marginRight: '1rem',
            whiteSpace: 'nowrap',
          }}
        >
          take profit
        </a>
        <hr
          style={{ height: '0.1rem' }}
          size={'3px'}
          width={'500px'}
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
          width={'calc(32.5%)'}
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
          width={'calc(17.5%)'}
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
  )
}

export default compose(withTheme())(BasicTPSL)
