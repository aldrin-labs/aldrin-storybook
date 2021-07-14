import React from 'react'
import styled from 'styled-components'
import { Grid, Theme, Paper } from '@material-ui/core'
import Clear from '@material-ui/icons/Clear'

import { SendButton } from '@sb/components/TraidingTerminal/styles'
import { Typography } from '@material-ui/core'

import {
  TypographyCustomHeading,
  DialogWrapper,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import { InputRowContainer, TargetTitle, TargetValue } from '../styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { getArrowSymbol } from '@sb/components/AddArrowIcon/AddArrowIcon'
import { DialogContent } from '@sb/styles/Dialog.styles'

import { EntryPointType, StopLossType, TakeProfitType } from '../types'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  Line,
  MainTitle,
  Title,
} from '@sb/components/TraidingTerminal/ConfirmationPopup'
import AttentionComponent from '@sb/components/AttentionBlock'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
  max-height: 100%;
`

const EditButton = ({ children, ...props }) => (
  <BtnCustom
    btnWidth={'6rem'}
    padding={'0'}
    borderRadius={'.4rem'}
    backgroundColor={props.theme.palette.blue.main}
    btnColor={props.theme.palette.white.main}
    borderWidth={'.1rem'}
    borderColor={props.theme.palette.blue.main}
    fontWeight={'bold'}
    fontSize={'1.2rem'}
    height={'2.2rem'}
    {...props}
  >
    {children}
  </BtnCustom>
)

export const StyledTypography = styled(({ color, ...rest }) => (
  <Typography {...rest} />
))`
  text-transform: capitalize;
  font-size: 1.3rem;
  font-weight: bold;
  color: ${(props) =>
    props.color ||
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.grey &&
      props.theme.palette.grey.light) ||
    '#7284a0'};
`

const TitleTypography = ({ children, theme, ...props }) => (
  <StyledTypography
    {...props}
    style={{
      fontSize: '1.4rem',
      color: theme.palette.white.primary,
      letterSpacing: '.01rem',
      whiteSpace: 'nowrap',
      paddingRight: '1rem',
      ...props.style,
    }}
  >
    {children}
  </StyledTypography>
)

const ItemTypography = ({ children, ...props }) => (
  <StyledTypography
    {...props}
    style={{
      fontSize: '1.4rem',
      letterSpacing: '.1rem',
      ...props.style,
    }}
  >
    {children}
  </StyledTypography>
)

interface IProps {
  quantityPrecision: number
  open: boolean
  handleClose: () => void
  confirmTrade: () => void
  handleOpenEditPopup: (popupName: string) => void
  entryPoint: EntryPointType
  stopLoss: StopLossType
  takeProfit: TakeProfitType
  pair: [string, string]
  theme: Theme
}

const getColor = (value: boolean, theme: Theme) =>
  value ? theme.palette.green.main : theme.palette.red.main
const getOnOffText = (value: boolean) => (value ? 'ON' : 'OFF')

export default ({
  open,
  handleClose,
  confirmTrade,
  handleOpenEditPopup,
  entryPoint,
  stopLoss,
  takeProfit,
  pair,
  theme,
  quantityPrecision,
}: IProps) => {
  const { order, trailing, averaging } = entryPoint
  const averagingAmount = averaging.enabled
    ? +averaging.entryLevels
        .reduce((acc, cur) => acc + cur.amount, 0)
        .toFixed(quantityPrecision)
    : 0

  const [base, quote] = pair

  const sideType = entryPoint.order.side
  const priceType = entryPoint.order.type

  return (
    <>
      <DialogWrapper
        theme={theme}
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={open}
        style={{
          borderRadius: '50%',
          // paddingTop: 0,
        }}
        PaperComponent={StyledPaper}
      >
        <RowContainer padding="2rem 0 0 0" direction="column">
          <MainTitle>
            {pair[0]}/{pair[1]}
          </MainTitle>
          <RowContainer justify={'center'} wrap={'nowrap'}>
            <Line sideType={sideType} width={'31%'} />
            <Title sideType={sideType}>
              <span style={{ textTransform: 'capitalize' }}>{priceType}</span>{' '}
              <span style={{ textTransform: 'capitalize' }}>{sideType}</span>{' '}
              {pair[0]}
            </Title>
            <Line sideType={sideType} width={'31%'} />
          </RowContainer>
        </RowContainer>
        <DialogContent
          theme={theme}
          justify="center"
          style={{
            padding: '3rem',
          }}
        >
          <RowContainer>
            <RowContainer id="entry">
              <RowContainer
                justify="space-between"
                align="center"
                wrap={'nowrap'}
                style={{ padding: '1rem 0' }}
              >
                <TitleTypography theme={theme}>1. Enter</TitleTypography>
                <Line sideType={sideType} theme={theme} />
                {/* <EditButton
                  theme={theme}
                  onClick={() => handleOpenEditPopup('entryOrder')}
                >
                  edit
                </EditButton> */}
              </RowContainer>
              <RowContainer padding={'1rem 0rem 0 0'}>
                <RowContainer justify="space-between">
                  <ItemTypography theme={theme}>Price:</ItemTypography>
                  <ItemTypography theme={theme}>
                    {`${order.price} ${quote}`}
                  </ItemTypography>
                </RowContainer>
                <RowContainer padding={'1rem 0 0 0'} justify="space-between">
                  <Row
                    width={'calc(50%)'}
                    padding={'0 1rem 0 0'}
                    justify="space-between"
                  >
                    <ItemTypography theme={theme}>Total:</ItemTypography>
                    <ItemTypography theme={theme}>
                      {`${order.total} ${quote}`}
                    </ItemTypography>
                  </Row>
                  <Row
                    width={'calc(50%)'}
                    justify="space-between"
                    padding={'0 0 0 1rem'}
                    style={{ borderLeft: theme.palette.border.new }}
                  >
                    <ItemTypography theme={theme}>Size:</ItemTypography>
                    <ItemTypography theme={theme}>
                      {`${order.amount} ${base}`}
                    </ItemTypography>
                  </Row>
                </RowContainer>
              </RowContainer>
            </RowContainer>

            <RowContainer id="stoploss">
              <RowContainer
                justify="space-between"
                alignItems="center"
                padding="3rem 0 0 0"
                wrap={'nowrap'}
              >
                <TitleTypography theme={theme}>2. Stop Loss:</TitleTypography>
                <Line sideType={sideType} theme={theme} />
                {/* <EditButton
                  theme={theme}
                  onClick={() => handleOpenEditPopup('stopLoss')}
                >
                  edit
                </EditButton> */}
              </RowContainer>
              <RowContainer container style={{ padding: '1rem 0 0rem 0rem' }}>
                <RowContainer justify="space-between">
                  <Row
                    width={'calc(30%)'}
                    padding={'0 1rem 0 0'}
                    justify="space-between"
                  >
                    <ItemTypography theme={theme}>Loss:</ItemTypography>
                    <ItemTypography theme={theme}>
                      {`${stopLoss.pricePercentage}%`}
                    </ItemTypography>
                  </Row>
                  <Row
                    width={'calc(70%)'}
                    justify="space-between"
                    padding={'0 0 0 1rem'}
                    style={{ borderLeft: theme.palette.border.new }}
                  >
                    <ItemTypography theme={theme}>Price:</ItemTypography>
                    <ItemTypography theme={theme}>
                      {`${stopLoss.stopLossPrice} ${quote}`}
                    </ItemTypography>
                  </Row>
                </RowContainer>
              </RowContainer>
            </RowContainer>
            <RowContainer id="takeaprofit">
              <RowContainer
                justify="space-between"
                alignItems="center"
                padding="3rem 0 0 0"
                wrap={'nowrap'}
              >
                <TitleTypography theme={theme}>3. Take Profit:</TitleTypography>
                <Line sideType={sideType} theme={theme} />
                {/* <EditButton
                  theme={theme}
                  onClick={() => handleOpenEditPopup('takeProfit')}
                >
                  edit
                </EditButton> */}
              </RowContainer>
              <RowContainer container style={{ padding: '1rem 0 0rem 0rem' }}>
                <RowContainer justify="space-between">
                  <Row
                    width={'calc(30%)'}
                    padding={'0 1rem 0 0'}
                    justify="space-between"
                  >
                    <ItemTypography theme={theme}>Profit:</ItemTypography>
                    <ItemTypography theme={theme}>
                      {`${takeProfit.pricePercentage}%`}
                    </ItemTypography>
                  </Row>
                  <Row
                    width={'calc(70%)'}
                    justify="space-between"
                    padding={'0 0 0 1rem'}
                    style={{ borderLeft: theme.palette.border.new }}
                  >
                    <ItemTypography theme={theme}>Price:</ItemTypography>
                    <ItemTypography theme={theme}>
                      {`${takeProfit.takeProfitPrice} ${quote}`}
                    </ItemTypography>
                  </Row>
                </RowContainer>
              </RowContainer>
              <RowContainer padding={'3rem 0 0 0'} justify="space-between">
                <Row width={'calc(50% - .5rem)'}>
                  <AttentionComponent
                    text={
                      <span style={{ fontSize: '1.6rem' }}>
                        <span style={{ fontFamily: 'Avenir Next Demi' }}>
                          0.03 SOL
                        </span>{' '}
                        will be reserved from your wallet to pay for all
                        possible transactions.
                      </span>
                    }
                  />
                </Row>
                <Row width={'calc(50% - .5rem)'}>
                  <AttentionComponent
                    text={
                      <span style={{ fontSize: '1.6rem' }}>
                        Don't forget to confirm all transactions in your wallet.
                      </span>
                    }
                  />
                </Row>
              </RowContainer>
            </RowContainer>
            <RowContainer justify="space-between" padding="3rem 0 0 0">
              <SendButton
                theme={theme}
                style={{
                  background: 'transparent',
                  border: `0.1rem solid  ${theme.palette.white.main}`,
                  color: theme.palette.white.main,
                  boxShadow: 'none',
                  width: 'calc(50% - .5rem)',
                  height: '5rem',
                }}
                type={'sell'}
                onClick={() => {
                  handleClose()
                }}
              >
                cancel
              </SendButton>
              <SendButton
                theme={theme}
                type={'buy'}
                style={{ width: 'calc(50% - .5rem)', height: '5rem' }}
                onClick={() => confirmTrade()}
              >
                confirm
              </SendButton>
            </RowContainer>
          </RowContainer>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}
