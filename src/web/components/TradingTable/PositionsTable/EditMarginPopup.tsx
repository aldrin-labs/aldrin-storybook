import React from 'react'
import styled from 'styled-components'
import { Dialog, Paper, Theme } from '@material-ui/core'
import { StyledDialogContent } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'
import { BlueSwitcherStyles } from '@sb/compositions/Chart/components/SmartOrderTerminal/utils'
import CustomSwitcher from '@sb/components/SwitchOnOff/CustomSwitcher'
import { FormInputContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'
import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const SwitcherStyles = (theme: Theme) => ({
  ...BlueSwitcherStyles(theme),
  activeBackgroundColor: '#0B1FD1',
  fontWeight: 'bold',
  textTransform: 'uppercase',
})

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 65rem;
`

export class EditMarginPopup extends React.Component {
  state = {
    // 1 for increasing
    // 2 for decresing
    type: 1,
    amount: 0,
  }

  toggleType = () => {
    this.setState((prev) => ({ type: prev.type === 1 ? 2 : 1 }))
  }

  render() {
    const {
      open,
      theme,
      handleClose,
      USDTFuturesFund,
      editMarginPosition,
      modifyIsolatedMarginWithStatus,
    } = this.props
    const { type, amount } = this.state
    const max =
      type === 1
        ? stripDigitPlaces(USDTFuturesFund.value, 2)
        : stripDigitPlaces(
            editMarginPosition.isolatedMargin -
              (editMarginPosition.positionAmt / editMarginPosition.leverage) *
                editMarginPosition.entryPrice
          )

    return (
      <Dialog
        PaperComponent={StyledPaper}
        style={{
          width: '85rem',
          margin: 'auto',
          textTransform: 'uppercase',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          letterSpacing: '.05rem',
        }}
        fullScreen={false}
        onClose={handleClose}
        maxWidth={'md'}
        open={open}
        aria-labelledby="responsive-edit-margin-dialog-title"
      >
        <StyledDialogContent id="edit-margin-dialog-content">
          <CustomSwitcher
            theme={theme}
            firstHalfText={'Add margin'}
            secondHalfText={'remove margin '}
            buttonHeight={'4rem'}
            containerStyles={{
              width: '100%',
              padding: '0 0 .6rem 0',
            }}
            firstHalfStyleProperties={SwitcherStyles(theme)}
            secondHalfStyleProperties={SwitcherStyles(theme)}
            firstHalfIsActive={type === 1}
            changeHalf={this.toggleType}
          />
          <FormInputContainer padding={'1.2rem 0 1.2rem 0'} title={`amount`}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Input
                needTitle
                textAlign={'left'}
                inputStyles={{ paddingLeft: '13.5rem', minHeight: '4rem' }}
                title={'type the amount:'}
                type={'text'}
                fontSize={'1.2rem'}
                value={this.state.amount}
                onChange={(e) =>
                  this.setState({
                    amount:
                      e.target.value > USDTFuturesFund.value
                        ? USDTFuturesFund.value
                        : e.target.value,
                  })
                }
              />
              <span
                onClick={() =>
                  this.setState({
                    amount: max,
                  })
                }
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '2rem',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem',
                  color: '#ABBAD1',
                  cursor: 'pointer',
                }}
              >
                MAX:{' '}
                <span style={{ color: '#0B1FD1', textDecoration: 'underline' }}>
                  {max} USDT
                </span>
              </span>
            </div>
          </FormInputContainer>
          <InputRowContainer padding={'2rem 0 0 0'} justify="space-between">
            <span style={{ color: '#7284A0' }}>currently assigned margin</span>
            <span style={{ color: '#16253D' }}>
              {stripDigitPlaces(editMarginPosition.isolatedMargin, 2)} USDT
            </span>
          </InputRowContainer>
          <InputRowContainer padding={'2rem 0 0 0'} justify="space-between">
            <span style={{ color: '#7284A0' }}>
              {type === 1 ? 'Available Balance' : 'Max Removeable'}
            </span>
            <span style={{ color: '#16253D' }}>{max} USDT</span>
          </InputRowContainer>
          <InputRowContainer justify="space-between">
            <BtnCustom
              btnWidth="46.5%"
              height="5rem"
              fontSize="1.5rem"
              margin="3.2rem 2.5% .4rem 1%"
              padding=".5rem 0 .4rem 0"
              borderRadius=".8rem"
              btnColor={'#DD6956'}
              backgroundColor={'#fff'}
              hoverColor={'#fff'}
              hoverBackground={'#DD6956'}
              transition={'all .4s ease-out'}
              onClick={() => {
                handleClose()
              }}
            >
              close
            </BtnCustom>
            <BtnCustom
              btnWidth="46.5%"
              height="5rem"
              fontSize="1.5rem"
              margin="3.2rem 2.5% .4rem 1%"
              padding=".5rem 0 .4rem 0"
              borderRadius=".8rem"
              borderColor={'#29AC80'}
              btnColor={'#fff'}
              backgroundColor={'#29AC80'}
              hoverColor={'#fff'}
              hoverBackground={'#29AC80'}
              boxShadow={'0px .4rem .6rem rgba(8, 22, 58, 0.3);'}
              transition={'all .4s ease-out'}
              onClick={() => {
                // add mutation with popup here
                modifyIsolatedMarginWithStatus({
                  keyId: editMarginPosition.keyId,
                  symbol: editMarginPosition.symbol,
                  positionSide: editMarginPosition.positionSide,
                  amount: +amount,
                  type,
                })
                handleClose()
              }}
            >
              confirm
            </BtnCustom>
          </InputRowContainer>
        </StyledDialogContent>
      </Dialog>
    )
  }
}
