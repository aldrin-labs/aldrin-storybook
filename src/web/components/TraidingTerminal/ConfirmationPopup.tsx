import React, { useState } from 'react'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'

import Info from '@icons/inform.svg'
import Attention from '@icons/attention.svg'
import SvgIcon from '@sb/components/SvgIcon'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import useMobileSize from '@webhooks/useMobileSize'
import { autoLogin } from 'src/storybook/src/utils/autoLogin'
import { ButtonsWithAmountFieldRowForBasic } from './AmountButtons'
import { TradeInputContent } from './index'
import { SendButton } from './styles'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'

import {
  SCheckbox,
  StyledDialogTitle,
} from '../SharePortfolioDialog/SharePortfolioDialog.styles'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
  height: auto;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
  @media (max-width: 600px) {
    border-radius: o;
    width: 100%;
    height: 100%;
    max-height: 100%;
    margin: 0;
    border: 0;
    padding: 43rem 3rem;
  }
`
export const MainTitle = styled.span`
  font-family: Avenir Next Bold;
  font-size: 3rem;
  line-height: 4rem;
  text-align: center;
  letter-spacing: 0.01rem;
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
    fontSize="1.4rem"
    height="4.5rem"
    textTransform="capitalize"
    backgroundColor={props.background || 'transparent'}
    borderColor={props.background || props.theme.palette.white.main}
    btnColor={props.color || props.theme.palette.white.main}
    borderRadius="1rem"
    border={props.border || 'none'}
    {...props}
  />
))`
  outline: none;

  @media (max-width: 600px) {
    height: 7.5rem;
    border-radius: 2rem;
    font-size: 2rem;
  }
`
export const WhiteText = styled.span`
  font-family: Avenir Next;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  letter-spacing: 0.01rem;
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
  const isMobile = useMobileSize()
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer direction="column">
        <MainTitle>
          {pair[0]}/{pair[1]}
        </MainTitle>
        <RowContainer justify="center" style={{ flexWrap: 'nowrap' }}>
          <Line sideType={sideType} width="31%" />
          <Title sideType={sideType}>
            <span style={{ textTransform: 'capitalize' }}>{priceType}</span>
            &nbsp;
            <span style={{ textTransform: 'capitalize' }}>{sideType}</span>
            &nbsp;
            {pair[0]}
          </Title>
          <Line sideType={sideType} width="31%" />
        </RowContainer>
      </RowContainer>
      <RowContainer margin="2rem 0 0 0">
        {priceType === 'market' ? (
          <RowContainer justify="space-between" margin="0 0 2rem 0">
            <WhiteText>Spread Percentage:</WhiteText>
            <WhiteText style={{ fontFamily: 'Avenir Next Demi' }}>
              <span style={{ color: isSlippageHigh ? '#F2ABB1' : '#a5e898' }}>
                {spread.toFixed(2)}
              </span>
              %
            </WhiteText>
          </RowContainer>
        ) : null}
        <RowContainer>
          {priceType !== 'market' &&
          priceType !== 'stop-market' &&
          priceType !== 'maker-only' ? (
            <InputRowContainer
              key="limit-price"
              padding=".6rem 0"
              direction="column"
            >
              <TradeInputContent
                theme={theme}
                needTitle
                type="text"
                title="price"
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
              amount,
              total,
              leverage,
              isBuyType,
            }}
          />
        </RowContainer>
        <RowContainer justify="space-between" margin="2rem 0 0 0">
          <WhiteText>Est. Fee:</WhiteText>
          <WhiteText style={{ fontFamily: 'Avenir Next Demi' }}>
            <span style={{ color: '#a5e898', fontFamily: 'Avenir Next Demi' }}>
              ≈&nbsp;
              {needCreateOpenOrdersAccount
                ? costsOfTheFirstTrade
                : SOLFeeForTrade}
            </span>
            &nbsp; SOL
            {!needCreateOpenOrdersAccount ? (
              <DarkTooltip
                title={
                  <>
                    <p>
                      The fee size for each trade on the DEX is ≈0.00001 SOL.
                    </p>
                  </>
                }
              >
                <span style={{ width: '12%' }}>
                  <SvgIcon
                    src={Info}
                    width="100%"
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
                      ≈0.00001 SOL.
                    </p>
                  </>
                }
              >
                <span style={{ width: '12%' }}>
                  <SvgIcon
                    src={Info}
                    width="100%"
                    style={{ marginLeft: '1rem' }}
                  />
                </span>
              </DarkTooltip>
            )}
          </WhiteText>
        </RowContainer>
        {priceType === 'market' && isSlippageHigh ? (
          <span style={{ width: '100%' }}>
            <WarningBlock>
              <div style={{ width: '6%' }}>
                <SvgIcon width="100%" height="auto" src={Attention} />
              </div>
              <WhiteText style={{ padding: '2rem' }}>
                Spread in this market is extremely high. The price of a trade is
                very unpredictable, we do not recommend to use the market order
                on this market.
              </WhiteText>
            </WarningBlock>
            <RowContainer justify="space-between" margin="2rem 0 0 0">
              <SCheckbox
                id="slippageCheckbox"
                style={{ padding: 0 }}
                onChange={() => {
                  confirmIsAwareOfHighSlippage(!isAwareOfHighSlippage)
                }}
                checked={isAwareOfHighSlippage}
              />
              <label
                htmlFor="slippageCheckbox"
                style={{
                  color: '#F2ABB1',
                  fontSize: '1.12rem',
                  fontFamily: 'Avenir Next Medium',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.01rem',
                  cursor: 'pointer',
                }}
              >
                I am aware of the risks associated with high Spread and still
                want to use market order.
              </label>
            </RowContainer>
          </span>
        ) : null}
      </RowContainer>

      <RowContainer margin="2rem 0 0 0" justify="space-between">
        <WhiteButton width="49%" theme={theme} onClick={() => onClose()}>
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
              height: isMobile ? '7.5rem' : '4rem',
              background: !isAwareOfHighSlippage
                ? theme.palette.grey.title
                : '',
              width: '49%',
              color: theme.palette.grey.terminal,
            }}
            theme={theme}
          >
            <RowContainer
              direction="column"
              style={{
                letterSpacing: '0',
              }}
            >
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
            </RowContainer>
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
            style={{ width: '49%', height: isMobile ? '7.5rem' : '4rem' }}
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
      </RowContainer>
    </DialogWrapper>
  )
}
