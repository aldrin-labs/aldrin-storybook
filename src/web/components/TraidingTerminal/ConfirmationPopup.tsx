import React, { useState } from 'react'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'

import Info from '@icons/inform.svg'
import Attention from '@icons/attention.svg'
import SvgIcon from '@sb/components/SvgIcon'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import {
  SCheckbox,
  StyledDialogTitle,
} from '../SharePortfolioDialog/SharePortfolioDialog.styles'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { ButtonsWithAmountFieldRowForBasic } from './AmountButtons'
import { TradeInputContent } from './index'
import { SendButton } from './styles'
import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
  height: 50rem;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
`
const MainTitle = styled.span`
  font-family: Avenir Next Bold;
  font-size: 3rem;
  line-height: 4rem;
  text-align: center;
  letter-spacing: -1.04615px;
  color: #f8faff;
  margin-bottom: 2rem;
`
export const Line = styled.div`
  content: '';
  width: ${(props) => props.width || '100%'};
  background-color: ${(props) =>
    props.sideType === 'buy' ? '#a5e898' : '#F69894'};
  margin: 0 0 0 0rem;
  height: 0.1rem;
`
const Title = styled.span`
  font-family: Avenir Next Medium;
  font-size: 2rem;
  text-align: center;
  letter-spacing: -0.653846px;
  color: ${(props) => (props.sideType === 'buy' ? '#a5e898' : '#F69894')};
  margin: 0 2rem;
`
export const WhiteButton = styled((props) => (
  <BtnCustom
    btnWidth={props.width || 'calc(50% - .5rem)'}
    fontSize={'1.4rem'}
    height={'4.5rem'}
    textTransform={'capitalize'}
    backgroundColor={props.background || 'transparent'}
    borderColor={props.background || props.theme.palette.white.main}
    btnColor={props.color || props.theme.palette.white.main}
    borderRadius={'1rem'}
    border={props.border || 'none'}
    {...props}
  />
))`
  outline: none;
`
const WhiteText = styled.span`
  font-family: Avenir Next;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  letter-spacing: -0.523077px;
  color: #f8faff;
`
const WarningBlock = styled.div`
  background: rgba(242, 156, 56, 0.5);
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  width: 100%;
  height: 9rem;
  margin-top: 2rem;
  border-radius: 1rem;
`

export const ConfirmationPopup = ({
  pair,
  theme,
  maxAmount,
  minOrderSize,
  priceType,
  onAmountChange,
  onTotalChange,
  isSPOTMarket,
  quantityPrecision,
  priceForCalculate,
  onMarginChange,
  initialMargin,
  amount,
  total,
  leverage,
  isBuyType,
  open,
  onPriceChange,
  values,
  sideType,
  onClose,
  costsOfTheFirstTrade,
  SOLFeeForTrade,
  needCreateOpenOrdersAccount,
  validateForm,
  handleSubmit,
  spread,
}) => {
  const isSlippageHigh = spread > 2
  const [isAwareOfHighSlippage, confirmIsAwareOfHighSlippage] = useState(false)

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <span
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <MainTitle>
          {pair[0]}/{pair[1]}
        </MainTitle>
        <Row
          justify={'row'}
          width={'100%'}
          justify={'center'}
          style={{ flexWrap: 'nowrap' }}
        >
          <Line sideType={sideType} width={'31%'} />
          <Title sideType={sideType}>
            <span style={{ textTransform: 'capitalize' }}>{priceType}</span>
            &nbsp;
            <span style={{ textTransform: 'capitalize' }}>{sideType}</span>
            &nbsp;
            {pair[0]}
          </Title>
          <Line sideType={sideType} width={'31%'} />
        </Row>
      </span>
      <span style={{ width: '100%' }}>
        {priceType === 'market' ? (
          <span
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: '2rem',
            }}
          >
            <WhiteText>Spread Percentage:</WhiteText>
            <WhiteText style={{ fontFamily: 'Avenir Next Demi' }}>
              <span style={{ color: isSlippageHigh ? '#F2ABB1' : '#a5e898' }}>
                {spread.toFixed(2)}
              </span>
              %
            </WhiteText>
          </span>
        ) : null}
        <Row width={'100%'} style={{}}>
          {priceType !== 'market' &&
          priceType !== 'stop-market' &&
          priceType !== 'maker-only' ? (
            <InputRowContainer
              key={'limit-price'}
              padding={'.6rem 0'}
              direction={'column'}
            >
              <TradeInputContent
                theme={theme}
                needTitle
                type={'text'}
                title={`price`}
                value={values.price || ''}
                onChange={onPriceChange}
                symbol={pair[1]}
              />
            </InputRowContainer>
          ) : null}
          <ButtonsWithAmountFieldRowForBasic
            {...{
              pair,
              needButtons: false,
              theme,
              maxAmount,
              minOrderSize,
              priceType,
              onAmountChange,
              onTotalChange,
              isSPOTMarket,
              quantityPrecision,
              priceForCalculate,
              onMarginChange,
              initialMargin,
              amount,
              total,
              leverage,
              isBuyType,
            }}
          />{' '}
        </Row>
        <span
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '2rem',
          }}
        >
          <WhiteText>Est. Fee:</WhiteText>
          <WhiteText style={{ fontFamily: 'Avenir Next Demi' }}>
            {' '}
            <span style={{ color: '#a5e898', fontFamily: 'Avenir Next Demi' }}>
              ≈&nbsp;
              {needCreateOpenOrdersAccount
                ? costsOfTheFirstTrade
                : SOLFeeForTrade}{' '}
            </span>{' '}
            &nbsp; SOL
            {!needCreateOpenOrdersAccount ? (
              <DarkTooltip
                title={
                  <>
                    <p>
                      The fee size for each trade on the DEX is ≈0.00001 SOL.{' '}
                    </p>
                  </>
                }
              >
                <span style={{ width: '12%' }}>
                  <SvgIcon
                    src={Info}
                    width={'100%'}
                    style={{ marginLeft: '1rem' }}
                  />
                </span>
              </DarkTooltip>
            ) : (
              <DarkTooltip
                title={
                  <>
                    <p>
                      Due to Serum design there is need to open a trading
                      account for this pair to trade it.
                    </p>
                    <p>So, the “first trade” fee is ≈0.023 SOL.</p>
                    <p>
                      The fee for all further trades on this pair will be
                      ≈0.00001 SOL.{' '}
                    </p>
                  </>
                }
              >
                <span style={{ width: '12%' }}>
                  <SvgIcon
                    src={Info}
                    width={'100%'}
                    style={{ marginLeft: '1rem' }}
                  />
                </span>
              </DarkTooltip>
            )}
          </WhiteText>
        </span>
        {priceType === 'market' && isSlippageHigh ? (
          <span style={{ width: '100%' }}>
            {' '}
            <WarningBlock>
              <div style={{ width: '6%' }}>
                {' '}
                <SvgIcon width="100%" height="auto" src={Attention} />
              </div>
              <WhiteText style={{ padding: '2rem' }}>
                Spread in this market is extremely high. The price of a trade is
                very unpredictable, we do not recommend to use the market order
                on this market.
              </WhiteText>
            </WarningBlock>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}
            >
              <SCheckbox
                style={{ padding: 0 }}
                onChange={() => {
                  confirmIsAwareOfHighSlippage(!isAwareOfHighSlippage)
                }}
                checked={isAwareOfHighSlippage}
              />
              <WhiteText
                style={{
                  color: '#F2ABB1',
                  fontSize: '1.12rem',
                  fontFamily: 'Avenir Next Medium',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.01rem',
                }}
              >
                I am aware of the risks associated with high Spread and still
                want to use market order.
              </WhiteText>
            </div>
          </span>
        ) : null}
      </span>

      <Row width={'100%'} justify={'space-between'}>
        <WhiteButton width={'49%'} theme={theme} onClick={() => onClose()}>
          Cancel
        </WhiteButton>
        {priceType === 'market' && isSlippageHigh ? (
          <SendButton
            type={sideType}
            disabled={!isAwareOfHighSlippage}
            onClick={async () => {
              const result = await validateForm()
              console.log('result', result)
              if (Object.keys(result).length === 0 || !isSPOTMarket) {
                handleSubmit(values)
              }
              await onClose()
            }}
            style={{
              background: !isAwareOfHighSlippage ? '#93A0B2' : '',
              width: '49%',
              height: '4.5rem',
              color: theme.palette.grey.terminal,
            }}
            theme={theme}
          >
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                letterSpacing: '0',
              }}
            >
              {' '}
              <span style={{ height: '2rem' }}>
                {isSPOTMarket
                  ? sideType === 'buy'
                    ? `buy ${pair[0]} anyway`
                    : `sell ${pair[0]} anyway`
                  : sideType === 'buy'
                  ? 'long'
                  : 'short'}
              </span>
              <span style={{ fontSize: '1.2rem', textTransform: 'lowercase' }}>
                (it may cause a loss of funds)
              </span>
            </span>
          </SendButton>
        ) : (
          <SendButton
            onClick={async () => {
              const result = await validateForm()
              console.log('result', result)
              if (Object.keys(result).length === 0 || !isSPOTMarket) {
                handleSubmit(values)
              }
              await onClose()
            }}
            type={sideType}
            style={{ width: '49%', height: '4.5rem' }}
            theme={theme}
          >
            {isSPOTMarket
              ? sideType === 'buy'
                ? `buy ${pair[0]}`
                : `sell ${pair[0]}`
              : sideType === 'buy'
              ? 'long'
              : 'short'}
          </SendButton>
        )}
      </Row>
    </DialogWrapper>
  )
}
