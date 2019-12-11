import React from 'react'
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'

import { StyledTypography } from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock.styles'

import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { getArrowSymbol } from '@sb/components/AddArrowIcon/AddArrowIcon'

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

const EditButton = ({ children, ...props }) => (
  <BtnCustom
    btnWidth={'6rem'}
    padding={'0'}
    borderRadius={'8px'}
    backgroundColor={'#5C8CEA'}
    btnColor={'#fff'}
    borderWidth={'2px'}
    borderColor={'#0B1FD1'}
    fontWeight={'bold'}
    fontSize={'1.2rem'}
    height={'2.2rem'}
    {...props}
  >
    {children}
  </BtnCustom>
)

const TitleTypography = ({ children, ...props }) => (
  <StyledTypography
    {...props}
    style={{ fontSize: '1.2rem', color: '#16253D', letterSpacing: '1px' }}
  >
    {children}
  </StyledTypography>
)

const ItemTypography = ({ children, ...props }) => (
  <StyledTypography
    {...props}
    style={{
      fontSize: '1.2rem',
      padding: '0 0 0.65rem 0',
      letterSpacing: '1px',
    }}
  >
    {children}
  </StyledTypography>
)

interface IProps {
  open: boolean
  handleClose: () => void
  confirmTrade: () => void
  editEntryPointHandle: () => void
}

export default ({
  open,
  handleClose,
  confirmTrade,
  editEntryPointHandle,
  entryPoint,
  stopLoss,
  takeProfit,
  pair,
}: IProps) => {
  const { order, trailing } = entryPoint

  const {
    side,
    price,
    priceSymbol,
    amountTo,
    amountFrom,
    amountToSymbol,
    amountFromSymbol,
    trailingStatus,
    deviationValue,
    hedgeSide,
    hedgeAmount,
    hedgeAmountSymbol,
    leverage,
    splitTargetStatus,
    takeaprofitTrailing,
    takeaprofitTimeout,
    takeaprofitDeviation,
    takeaprofitWhenProfit,
    takeaprofitWhenInProfit,
    stopLossPrice,
    stopLossTimeout,
    whenLoss,
    whenInLoss,
    forcedStop,
  } = {
    side: 'BUY',
    price: 100,
    priceSymbol: 'BTC',
    amountTo: '100',
    amountFrom: '200',
    amountToSymbol: 'BTC',
    amountFromSymbol: 'USDT',
    trailingStatus: 'ON',
    deviationValue: 200,
    hedgeSide: 'sell short',
    hedgeAmount: '100',
    hedgeAmountSymbol: 'BTC',
    leverage: 'X125',
    splitTargetStatus: 'OFF',
    takeaprofitTrailing: 'ON',
    takeaprofitTimeout: 'ON',
    takeaprofitDeviation: 5,
    takeaprofitWhenProfit: '20sec',
    takeaprofitWhenInProfit: '10min',
    stopLossPrice: '-23%',
    stopLossTimeout: 'on',
    whenLoss: '20sec',
    whenInLoss: '-',
    forcedStop: 'off',
  }

  return (
    <>
      <DialogWrapper
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={true}
        style={{
          borderRadius: '50%',
          // paddingTop: 0,
        }}
      >
        <DialogTitleCustom
          id="customized-dialog-title"
          //   style={{
          // backgroundColor: '#fff',
          //   }}
        >
          <TypographyCustomHeading
            fontWeight={'700'}
            style={{
              textAlign: 'center',
              fontSize: '1.4rem',
              letterSpacing: '1.5px',
              color: '#16253D',
            }}
          >
            Confirm trade
          </TypographyCustomHeading>
        </DialogTitleCustom>
        <DialogContent
          justify="center"
          style={{
            minWidth: '440px',
            padding: '3rem',
          }}
        >
          <Grid>
            <Grid id="entry">
              <Grid container justify="space-between">
                <TitleTypography>Entry point</TitleTypography>
                <EditButton>edit</EditButton>
              </Grid>
              <Grid container style={{ padding: '2rem 4.5rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography>Side:</ItemTypography>
                  <ItemTypography>price:</ItemTypography>
                  <ItemTypography>amount:</ItemTypography>
                  <ItemTypography>Trailing:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem' }}>
                  <ItemTypography color="#29AC80">{order.side}</ItemTypography>
                  <ItemTypography color="#16253D">
                    {`${
                      entryPoint.order.type === 'limit'
                        ? entryPoint.order.price
                        : entryPoint.trailing.isTrailingOn
                        ? entryPoint.order.price
                        : 'MARKET'
                    } ${pair[1]}`}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {getArrowSymbol(
                      `${entryPoint.order.amount} ${pair[0]}`,
                      `${entryPoint.order.total} ${pair[1]}`,
                      true
                    )}
                  </ItemTypography>
                  <Grid container justify="space-between">
                    <ItemTypography color="#29AC80">
                      {trailing.isTrailingOn ? 'ON' : 'OFF'}
                    </ItemTypography>
                    <ItemTypography>Deviation:</ItemTypography>
                    <ItemTypography color="#16253D">
                      {trailing.deviationPercentage} %
                    </ItemTypography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid id="hedge">
              <Grid container justify="space-between">
                    <TitleTypography>Hedge {entryPoint.order.isHedgeOn ? 'ON': 'OFF'}</TitleTypography>
                <EditButton>edit</EditButton>
              </Grid>
              <Grid container style={{ padding: '2rem 3.5rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography>Side:</ItemTypography>
                  <ItemTypography>amount:</ItemTypography>
                  <ItemTypography>leverage:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem' }}>
                  <ItemTypography color="#29AC80">{entryPoint.order.hedgeSide}</ItemTypography>
                  <ItemTypography color="#16253D">
                    {`-`}
                  </ItemTypography>
                  <ItemTypography color="#16253D">{entryPoint.leverage}</ItemTypography>
                </Grid>
              </Grid>
            </Grid>
            <Grid id="takeaprofit">
              <Grid container justify="space-between">
                <TitleTypography>take a profit</TitleTypography>
                <EditButton>edit</EditButton>
              </Grid>
              <Grid container style={{ padding: '2rem 0.5rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography>split target:</ItemTypography>
                  <ItemTypography>Trailing:</ItemTypography>
                  <ItemTypography>timeout:</ItemTypography>
                  <ItemTypography>deviation:</ItemTypography>
                  <ItemTypography>when profit:</ItemTypography>
                  <ItemTypography>when in profit:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem' }}>
                  <ItemTypography color="#29AC80">
                    {splitTargetStatus}
                  </ItemTypography>
                  <ItemTypography color="#29AC80">
                    {takeaprofitTrailing}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {takeaprofitTimeout}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {takeaprofitDeviation}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {takeaprofitWhenProfit}
                  </ItemTypography>
                  <ItemTypography color="#16253D">
                    {takeaprofitWhenInProfit}
                  </ItemTypography>
                </Grid>
              </Grid>
            </Grid>
            <Grid id="stoploss">
              <Grid container justify="space-between">
                <TitleTypography>stop loss</TitleTypography>
                <EditButton>edit</EditButton>
              </Grid>
              <Grid container style={{ padding: '2rem 1rem' }}>
                <Grid style={{ textAlign: 'right' }}>
                  <ItemTypography>price:</ItemTypography>
                  <ItemTypography>timeout:</ItemTypography>
                  <ItemTypography>when loss:</ItemTypography>
                  <ItemTypography>when in loss:</ItemTypography>
                  <ItemTypography>forced stop:</ItemTypography>
                </Grid>
                <Grid style={{ paddingLeft: '4rem' }}>
                  <ItemTypography color="#29AC80">
                    {stopLossPrice}
                  </ItemTypography>
                  <ItemTypography color="#29AC80">
                    {stopLossTimeout}
                  </ItemTypography>
                  <ItemTypography color="#16253D">{whenLoss}</ItemTypography>
                  <ItemTypography color="#16253D">{whenInLoss}</ItemTypography>
                  <ItemTypography color="#16253D">{forcedStop}</ItemTypography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center">
              <BtnCustom
                btnWidth={'100%'}
                borderRadius={'8px'}
                backgroundColor={'#29AC80'}
                btnColor={'#fff'}
                borderWidth={'0px'}
                fontWeight={'bold'}
                fontSize={'1.6rem'}
                height={'4rem'}
                onClick={confirmTrade}
              >
                Confirm
              </BtnCustom>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}
