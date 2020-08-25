import React from 'react'
import styled from 'styled-components'
import { Dialog, Paper } from '@material-ui/core'
import Clear from '@material-ui/icons/Clear'

import {
  getSecondValueFromFirst,
  BlueSwitcherStyles,
  GreenSwitcherStyles,
  RedSwitcherStyles,
} from './utils'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { SendButton } from '@sb/components/TraidingTerminal/styles'
import SmallSlider from '@sb/components/Slider/SmallSlider'

import GreenSwitcher from '@sb/components/SwitchOnOff/GreenSwitcher'
import CloseIcon from '@material-ui/icons/Close'
import HeightIcon from '@material-ui/icons/Height'

import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { FormInputContainer, Select } from './InputComponents'

import {
  TradeInputContent as Input,
  TradeInputHeader,
} from '@sb/components/TraidingTerminal/index'

import { LeverageLabel } from '@sb/components/TradingWrapper/styles'

import { maxLeverage } from '@sb/compositions/Chart/mocks'

import CustomSwitcher from '@sb/components/SwitchOnOff/CustomSwitcher'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import {
  HeaderTitle,
  HeaderLabel,
  SubBlocksContainer,
  InputRowContainer,
  TimeoutTitle,
  TargetTitle,
  TargetValue,
  AdditionalSettingsButton,
} from './styles'

import {
  TypographyTitle,
  StyledDialogContent,
  ClearButton,
  StyledDialogTitle,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
`

type IProps = {
  price?: number
  open: boolean
  pair?: string
  maxAmount?: number
  validateField: (a: boolean, b: number | string) => boolean
  handleClose: () => void
  updateState: (obj: any) => void
  validate: (obj: any, isValid: boolean) => boolean
  transformProperties: (obj: any) => any
  derivedState: any
}

type ITAPState = {
  type: string
  pricePercentage: number
  activatePrice: number
  isSplitTargetsOn: boolean
  volumePercentage: number
  targets: {
    price: number
    quantity: number
  }[]
  isTimeoutOn: boolean
  whenProfitOn: boolean
  whenProfitMode: string
  whenProfitSec: number
  whenProfitableOn: boolean
  whenProfitableMode: string
  whenProfitableSec: number
  isTrailingOn: boolean
  deviationPercentage: number
}

type ISLState = {
  type: string
  pricePercentage: number
  isTimeoutOn: boolean
  whenLossOn: boolean
  whenLossMode: string
  whenLossSec: number
  whenLossableOn: boolean
  whenLossableMode: string
  whenLossableSec: number
  isForcedStopOn: boolean
  forcedPercentage: number
}

type HedgeState = {
  isHedgeOn: boolean
  hedgeSide: string
  hedgePrice: number
  hedgeIncrease: number
}

type EntryOrderState = {
  type: string
  side: string
  price: number
  amount: number
  total: number
  initialMargin: number
  isTrailingOn: boolean
  deviationPercentage: number
}

export class EditTakeProfitPopup extends React.Component<IProps, ITAPState> {
  state = {
    type: '',
    pricePercentage: 0,
    activatePrice: 0,
    isSplitTargetsOn: false,
    volumePercentage: 0,
    targets: [],
    isTimeoutOn: false,
    whenProfitOn: false,
    whenProfitMode: 'sec',
    whenProfitSec: 0,
    whenProfitableOn: false,
    whenProfitableMode: 'sec',
    whenProfitableSec: 0,
    isTrailingOn: false,
    deviationPercentage: 0,
    takeProfitPrice: 0,
  }

  static getDerivedStateFromProps(props, state) {
    // get values from state if empty

    if (state.type === '') {
      const { side, price, pricePrecision, leverage } = props
      const percentage = props.derivedState.isTrailingOn
        ? props.derivedState.activatePrice
        : props.derivedState.pricePercentage
      const takeProfitPrice =
        side === 'sell'
          ? stripDigitPlaces(
              price * (1 - percentage / 100 / leverage),
              pricePrecision
            )
          : stripDigitPlaces(
              price * (1 + percentage / 100 / leverage),
              pricePrecision
            )

      return {
        takeProfitPrice,
        ...props.derivedState,
      }
    }

    return null
  }

  componentDidUpdate(prevProps) {
    if (prevProps.price !== this.props.price) {
      this.updateTakeProfit(
        this.state.isTrailingOn
          ? this.state.activatePrice
          : this.state.pricePercentage
      )
    }
  }

  updateTakeProfit = (percentage) => {
    const { side, price, pricePrecision, leverage } = this.props
    const takeProfitPrice =
      side === 'sell'
        ? stripDigitPlaces(
            price * (1 - percentage / 100 / leverage),
            pricePrecision
          )
        : stripDigitPlaces(
            price * (1 + percentage / 100 / leverage),
            pricePrecision
          )

    this.setState({ takeProfitPrice })
  }

  render() {
    const {
      open,
      handleClose,
      updateState,
      validate,
      transformProperties,
      pair,
      side,
      price,
      leverage,
      theme,
    } = this.props

    return (
      <Dialog
        theme={theme}
        PaperComponent={StyledPaper}
        style={{ width: '85rem', margin: 'auto' }}
        fullScreen={false}
        onClose={handleClose}
        maxWidth={'md'}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <StyledDialogTitle
          theme={theme}
          disableTypography
          id="responsive-dialog-title"
        >
          <TypographyTitle
            theme={theme}
          >{`Edit take a profit`}</TypographyTitle>
          <ClearButton>
            <Clear
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={handleClose}
            />
          </ClearButton>
        </StyledDialogTitle>
        <StyledDialogContent theme={theme} id="share-dialog-content">
          <InputRowContainer justify="center" padding={'1rem 0 .6rem 0'}>
            <CustomSwitcher
              theme={theme}
              firstHalfText={'limit'}
              secondHalfText={'market'}
              buttonHeight={'2.5rem'}
              containerStyles={{ width: '100%' }}
              firstHalfStyleProperties={BlueSwitcherStyles(theme)}
              secondHalfStyleProperties={BlueSwitcherStyles(theme)}
              firstHalfIsActive={this.state.type === 'limit'}
              changeHalf={() => {
                this.setState((prev) => ({
                  type: getSecondValueFromFirst(prev.type),
                  isTrailingOn: false,
                }))
              }}
            />
          </InputRowContainer>
          <div>
            <InputRowContainer
              justify="flex-start"
              padding={'.8rem 0 1.2rem 0'}
            >
              <AdditionalSettingsButton
                theme={theme}
                style={{ fontSize: '1rem' }}
                isActive={this.state.isTrailingOn}
                onClick={() => {
                  this.setState((prev) => ({
                    isSplitTargetsOn: false,
                    isTrailingOn: !prev.isTrailingOn,
                  }))

                  this.setState((prev) => ({
                    isTimeoutOn: false,
                  }))

                  this.updateTakeProfit(
                    this.state.isTrailingOn
                      ? this.state.pricePercentage
                      : this.state.activatePrice
                  )
                }}
              >
                Trailing take a profit
              </AdditionalSettingsButton>

              <AdditionalSettingsButton
                theme={theme}
                isActive={this.state.isSplitTargetsOn}
                onClick={() => {
                  this.setState((prev) => ({
                    isSplitTargetsOn: !prev.isSplitTargetsOn,
                    isTrailingOn: false,
                  }))

                  this.setState((prev) => ({
                    isTimeoutOn: false,
                  }))
                }}
              >
                Split targets
              </AdditionalSettingsButton>

              {/* <AdditionalSettingsButton theme={theme}
                isActive={this.state.isTimeoutOn}
                onClick={() => {
                  this.setState((prev) => ({
                    isTimeoutOn: !prev.isTimeoutOn,
                  }))

                  this.setState((prev) => ({
                    isSplitTargetsOn: false,
                    isTrailingOn: false,
                  }))
                }}
              >
                Timeout
              </AdditionalSettingsButton> */}
            </InputRowContainer>

            {!this.state.isTrailingOn && (
              <InputRowContainer>
                <FormInputContainer theme={theme} title={'stop price'}>
                  <InputRowContainer>
                    <Input
                      theme={theme}
                      textAlign={'left'}
                      padding={'0'}
                      width={'calc(32.5%)'}
                      symbol={pair[1]}
                      value={this.state.takeProfitPrice}
                      inputStyles={{
                        paddingRight: '0',
                        paddingLeft: '1rem',
                      }}
                      showErrors={true}
                      isValid={this.props.validateField(
                        true,
                        this.state.takeProfitPrice
                      )}
                      onChange={(e) => {
                        const percentage =
                          side === 'sell'
                            ? (1 - e.target.value / price) * 100 * leverage
                            : -(1 - e.target.value / price) * 100 * leverage

                        this.setState({
                          pricePercentage: stripDigitPlaces(
                            percentage < 0 ? 0 : percentage,
                            2
                          ),
                          takeProfitPrice: e.target.value,
                        })
                      }}
                    />
                    <Input
                      theme={theme}
                      padding={'0 .8rem 0 .8rem'}
                      width={'calc(17.5%)'}
                      preSymbol={'+'}
                      textAlign={'left'}
                      needPreSymbol={true}
                      inputStyles={{
                        paddingRight: '0',
                        paddingLeft: '2rem',
                      }}
                      showErrors={
                        !this.state.isSplitTargetsOn && !this.state.isTrailingOn
                      }
                      value={
                        this.state.pricePercentage > 100
                          ? 100
                          : this.state.pricePercentage
                      }
                      isValid={this.props.validateField(
                        true,
                        this.state.pricePercentage
                      )}
                      onChange={(e) => {
                        this.setState({ pricePercentage: e.target.value })
                        this.updateTakeProfit(e.target.value)
                      }}
                    />

                    <BlueSlider
                      theme={theme}
                      value={this.state.pricePercentage}
                      sliderContainerStyles={{
                        width: '50%',
                        margin: '0 .8rem 0 .8rem',
                      }}
                      onChange={(value) => {
                        this.setState({ pricePercentage: value })
                        this.updateTakeProfit(value)
                      }}
                    />
                  </InputRowContainer>
                </FormInputContainer>
              </InputRowContainer>
            )}

            {this.state.isTrailingOn && (
              <>
                <FormInputContainer theme={theme} title={`activate price`}>
                  <InputRowContainer>
                    <Input
                      theme={theme}
                      textAlign={'left'}
                      padding={'0'}
                      width={'calc(32.5%)'}
                      symbol={pair[1]}
                      value={this.state.takeProfitPrice}
                      inputStyles={{
                        paddingRight: '0',
                        paddingLeft: '1rem',
                      }}
                      onChange={(e) => {
                        const percentage =
                          side === 'sell'
                            ? (1 - e.target.value / price) * 100 * leverage
                            : -(1 - e.target.value / price) * 100 * leverage

                        this.setState({
                          activatePrice: stripDigitPlaces(
                            percentage < 0 ? 0 : percentage,
                            2
                          ),
                          takeProfitPrice: e.target.value,
                        })
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
                      inputStyles={{
                        paddingRight: '0',
                        paddingLeft: '2rem',
                      }}
                      value={this.state.activatePrice}
                      onChange={(e) => {
                        this.setState({ activatePrice: e.target.value })
                        this.updateTakeProfit(e.target.value)
                      }}
                    />
                    <BlueSlider
                      theme={theme}
                      value={this.state.activatePrice}
                      sliderContainerStyles={{
                        width: '50%',
                        margin: '0 .8rem 0 .8rem',
                      }}
                      onChange={(value) => {
                        this.setState({ activatePrice: value })
                        this.updateTakeProfit(value)
                      }}
                    />
                  </InputRowContainer>
                </FormInputContainer>
                <InputRowContainer>
                  <FormInputContainer theme={theme} title={'deviation'}>
                    <InputRowContainer>
                      <Input
                        theme={theme}
                        padding={'0 .8rem 0 0'}
                        width={'calc(50%)'}
                        symbol={'%'}
                        value={this.state.deviationPercentage}
                        showErrors={true}
                        isValid={this.props.validateField(
                          this.state.isTrailingOn,
                          this.state.deviationPercentage
                        )}
                        onChange={(e) => {
                          this.setState({ deviationPercentage: e.target.value })
                        }}
                      />

                      <BlueSlider
                        theme={theme}
                        value={this.state.deviationPercentage}
                        sliderContainerStyles={{
                          width: '50%',
                          margin: '0 .8rem 0 .8rem',
                        }}
                        onChange={(value) => {
                          this.setState({ deviationPercentage: value })
                        }}
                      />
                    </InputRowContainer>
                  </FormInputContainer>
                </InputRowContainer>
              </>
            )}

            {this.state.isSplitTargetsOn && (
              <>
                <InputRowContainer>
                  <FormInputContainer theme={theme} title={'volume'}>
                    <InputRowContainer>
                      <Input
                        theme={theme}
                        padding={'0 .8rem 0 0'}
                        width={'calc(55%)'}
                        symbol={'%'}
                        value={this.state.volumePercentage}
                        onChange={(e) => {
                          const occupiedVolume = this.state.targets.reduce(
                            (prev, curr) => prev + curr.quantity,
                            0
                          )

                          this.setState({
                            volumePercentage:
                              occupiedVolume + e.target.value < 100
                                ? e.target.value
                                : 100 - occupiedVolume,
                          })
                        }}
                      />

                      <BlueSlider
                        theme={theme}
                        value={this.state.volumePercentage}
                        sliderContainerStyles={{
                          width: '50%',
                          margin: '0 .8rem 0 .8rem',
                        }}
                        onChange={(value) => {
                          const occupiedVolume = this.state.targets.reduce(
                            (prev, curr) => prev + curr.quantity,
                            0
                          )

                          this.setState({
                            volumePercentage:
                              occupiedVolume + value < 100
                                ? value
                                : 100 - occupiedVolume,
                          })
                        }}
                      />
                    </InputRowContainer>
                  </FormInputContainer>
                </InputRowContainer>

                <InputRowContainer
                  padding="0 0 .4rem 0"
                  style={{
                    borderBottom: theme.palette.border.main,
                  }}
                >
                  <BtnCustom
                    btnColor={'#fff'}
                    backgroundColor={'#F29C38'}
                    borderColor={'#F29C38'}
                    btnWidth={'100%'}
                    height={'auto'}
                    borderRadius={'1rem'}
                    margin={'0'}
                    padding={'.1rem 0'}
                    fontSize={'1rem'}
                    boxShadow={'0px .2rem .3rem rgba(8, 22, 58, 0.15)'}
                    letterSpacing={'.05rem'}
                    onClick={() => {
                      this.setState((prev) => ({
                        volumePercentage: 0,
                        pricePercentage: 0,
                        targets: [
                          ...prev.targets,
                          {
                            price: prev.pricePercentage,
                            quantity: prev.volumePercentage,
                            type: prev.type,
                          },
                        ],
                      }))
                    }}
                  >
                    add target
                  </BtnCustom>
                </InputRowContainer>

                <InputRowContainer
                  padding=".6rem 1rem 1.2rem .4rem"
                  direction="column"
                >
                  <InputRowContainer padding=".2rem .5rem">
                    <TargetTitle
                      theme={theme}
                      style={{ width: '50%', paddingLeft: '2rem' }}
                    >
                      profit
                    </TargetTitle>
                    <TargetTitle theme={theme} style={{ width: '50%' }}>
                      quantity
                    </TargetTitle>
                  </InputRowContainer>
                  <div
                    style={{
                      width: '100%',
                      background: theme.palette.grey.main,
                      borderRadius: '.8rem',
                      border: theme.palette.border.main,
                    }}
                  >
                    {this.state.targets.map((target, i) => (
                      <InputRowContainer
                        key={`${target.price}${target.quantity}${i}`}
                        padding=".2rem .5rem"
                        style={
                          this.state.targets.length - 1 !== i
                            ? {
                                borderBottom: theme.palette.border.main,
                              }
                            : {}
                        }
                      >
                        <TargetValue
                          theme={theme}
                          style={{ width: '50%', paddingLeft: '2rem' }}
                        >
                          +{target.price}%
                        </TargetValue>
                        <TargetValue theme={theme} style={{ width: '40%' }}>
                          {target.quantity}%
                        </TargetValue>
                        <CloseIcon
                          onClick={() =>
                            this.setState((prev) => ({
                              targets: [
                                ...prev.targets.slice(0, i),
                                ...prev.targets.slice(i + 1),
                              ],
                            }))
                          }
                          style={{
                            color: theme.palette.red.main,
                            fontSize: '1.8rem',
                            cursor: 'pointer',
                          }}
                        />
                      </InputRowContainer>
                    ))}
                  </div>
                </InputRowContainer>
              </>
            )}

            {this.state.isTimeoutOn && (
              <>
                <TradeInputHeader
                  theme={theme}
                  title={`timeout`}
                  needLine={true}
                />
                <InputRowContainer>
                  <SubBlocksContainer>
                    <InputRowContainer>
                      <TimeoutTitle> When profit</TimeoutTitle>
                    </InputRowContainer>
                    <InputRowContainer>
                      <SCheckbox
                        checked={this.state.whenProfitOn}
                        onChange={() => {
                          this.setState((prev) => ({
                            whenProfitOn: !prev.whenProfitOn,
                          }))

                          this.setState((prev) => ({
                            whenProfitableOn: false,
                          }))
                        }}
                        style={{ padding: '0 .4rem 0 0' }}
                      />
                      <Input
                        theme={theme}
                        width={'calc(55% - .4rem)'}
                        value={this.state.whenProfitSec}
                        showErrors={this.state.whenProfitOn}
                        isValid={this.props.validateField(
                          this.state.whenProfitOn,
                          this.state.whenProfitSec
                        )}
                        onChange={(e) => {
                          this.setState({ whenProfitSec: e.target.value })
                        }}
                        inputStyles={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                        disabled={!this.state.whenProfitOn}
                      />
                      <Select
                        theme={theme}
                        width={'calc(30% - .4rem)'}
                        value={this.state.whenProfitMode}
                        inputStyles={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                        onChange={(e) => {
                          this.setState({ whenProfitMode: e.target.value })
                        }}
                        isDisabled={!this.state.whenProfitOn}
                      >
                        <option>sec</option>
                        <option>min</option>
                      </Select>
                    </InputRowContainer>
                  </SubBlocksContainer>

                  <SubBlocksContainer>
                    <InputRowContainer>
                      <TimeoutTitle>When profitable</TimeoutTitle>
                    </InputRowContainer>
                    <InputRowContainer>
                      <SCheckbox
                        checked={this.state.whenProfitableOn}
                        onChange={() => {
                          this.setState((prev) => ({
                            whenProfitableOn: !prev.whenProfitableOn,
                          }))

                          this.setState((prev) => ({
                            whenProfitOn: false,
                          }))
                        }}
                        style={{ padding: '0 .4rem 0 0' }}
                      />
                      <Input
                        theme={theme}
                        width={'calc(55% - .4rem)'}
                        value={this.state.whenProfitableSec}
                        showErrors={this.state.whenProfitableOn}
                        isValid={this.props.validateField(
                          this.state.whenProfitableOn,
                          this.state.whenProfitableSec
                        )}
                        onChange={(e) => {
                          this.setState({ whenProfitableSec: e.target.value })
                        }}
                        inputStyles={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                        disabled={!this.state.whenProfitableOn}
                      />
                      <Select
                        theme={theme}
                        width={'calc(30% - .4rem)'}
                        value={this.state.whenProfitableMode}
                        inputStyles={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                        onChange={(e) => {
                          this.setState({ whenProfitableMode: e.target.value })
                        }}
                        isDisabled={!this.state.whenProfitableOn}
                      >
                        <option>sec</option>
                        <option>min</option>
                      </Select>
                    </InputRowContainer>
                  </SubBlocksContainer>
                </InputRowContainer>
              </>
            )}
            <InputRowContainer padding={'2rem 0 0 0'}>
              <SendButton
                type={'buy'}
                onClick={() => {
                  const transformedState = transformProperties(this.state)
                  const isValid = validate(transformedState, true)

                  if (isValid) {
                    updateState(this.state)
                    handleClose()
                  }
                }}
              >
                confirm
              </SendButton>
            </InputRowContainer>
          </div>
        </StyledDialogContent>
      </Dialog>
    )
  }
}

export class EditStopLossPopup extends React.Component<IProps, ISLState> {
  state = {
    type: '',
    pricePercentage: 0,
    isTimeoutOn: false,
    whenLossOn: false,
    whenLossMode: 'sec',
    whenLossSec: 0,
    whenLossableOn: false,
    whenLossableMode: 'sec',
    whenLossableSec: 0,
    isForcedStopOn: false,
    forcedPercentage: 0,
    stopLossPrice: 0,
    forcedLossPrice: 0,
  }

  static getDerivedStateFromProps(props, state) {
    // get values from state if empty
    if (state.type === '') {
      const { side, price, pricePrecision, leverage } = props
      const percentage = props.derivedState.isTrailingOn
        ? props.derivedState.activatePrice
        : props.derivedState.pricePercentage

      const stopLossPrice =
        side === 'buy'
          ? stripDigitPlaces(
              price * (1 - percentage / 100 / leverage),
              pricePrecision
            )
          : stripDigitPlaces(
              price * (1 + percentage / 100 / leverage),
              pricePrecision
            )

      const forcedLossPrice =
        side === 'buy'
          ? stripDigitPlaces(
              price *
                (1 - props.derivedState.forcedPercentage / 100 / leverage),
              pricePrecision
            )
          : stripDigitPlaces(
              price *
                (1 + props.derivedState.forcedPercentage / 100 / leverage),
              pricePrecision
            )

      return {
        stopLossPrice,
        forcedLossPrice,
        ...props.derivedState,
      }
    }
    return null
  }

  componentDidUpdate(prevProps) {
    if (prevProps.price !== this.props.price) {
      this.updateStopLoss(this.state.pricePercentage)
      this.updateStopLoss(this.state.forcedPercentage, 'forcedLossPrice')
    }
  }

  updateStopLoss = (percentage, field = 'stopLossPrice') => {
    const { side, price, pricePrecision, leverage } = this.props
    const fieldPrice =
      side === 'buy'
        ? stripDigitPlaces(
            price * (1 - percentage / 100 / leverage),
            pricePrecision
          )
        : stripDigitPlaces(
            price * (1 + percentage / 100 / leverage),
            pricePrecision
          )

    this.setState({ [field]: fieldPrice })
  }

  render() {
    const {
      open,
      theme,
      handleClose,
      updateState,
      transformProperties,
      validate,
      leverage,
      side,
      pair,
      price,
    } = this.props

    return (
      <Dialog
        theme={theme}
        PaperComponent={StyledPaper}
        style={{ width: '85rem', margin: 'auto' }}
        fullScreen={false}
        onClose={handleClose}
        maxWidth={'md'}
        open={open}
        aria-labelledby="responsive-edit-stop-loss-dialog-title"
      >
        <StyledDialogTitle
          theme={theme}
          disableTypography
          id="responsive-edit-stop-loss-dialog-title"
        >
          <TypographyTitle theme={theme}>{`Edit stop loss`}</TypographyTitle>
          <ClearButton>
            <Clear
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={handleClose}
            />
          </ClearButton>
        </StyledDialogTitle>
        <StyledDialogContent theme={theme} id="edit-stop-loss-dialog-content">
          <InputRowContainer justify="center" padding={'1rem 0 .6rem 0'}>
            <CustomSwitcher
              theme={theme}
              firstHalfText={'limit'}
              secondHalfText={'market'}
              buttonHeight={'2.5rem'}
              containerStyles={{ width: '100%' }}
              firstHalfStyleProperties={BlueSwitcherStyles(theme)}
              secondHalfStyleProperties={BlueSwitcherStyles(theme)}
              firstHalfIsActive={this.state.type === 'limit'}
              changeHalf={() => {
                this.setState((prev) => ({
                  type: getSecondValueFromFirst(prev.type),
                }))
              }}
            />
          </InputRowContainer>
          <div>
            <InputRowContainer
              justify="flex-start"
              padding={'.8rem 0 1.2rem 0'}
            >
              <AdditionalSettingsButton
                theme={theme}
                isActive={this.state.isTimeoutOn}
                onClick={() =>
                  this.setState((prev) => ({
                    isTimeoutOn: !prev.isTimeoutOn,
                  }))
                }
              >
                Timeout
              </AdditionalSettingsButton>

              {/* <AdditionalSettingsButton theme={theme}
                isActive={this.state.isForcedStopOn}
                onClick={() =>
                  this.setState((prev) => ({
                    isForcedStopOn: !prev.isForcedStopOn,
                  }))
                }
              >
                Forced stop
              </AdditionalSettingsButton> */}
            </InputRowContainer>

            <InputRowContainer>
              <FormInputContainer theme={theme} title={'stop price'}>
                <InputRowContainer>
                  <Input
                    theme={theme}
                    padding={'0'}
                    width={'calc(32.5%)'}
                    textAlign={'left'}
                    symbol={pair[1]}
                    value={this.state.stopLossPrice}
                    showErrors={true}
                    isValid={this.props.validateField(
                      true,
                      this.state.pricePercentage
                    )}
                    inputStyles={{
                      paddingLeft: '1rem',
                    }}
                    onChange={(e) => {
                      const percentage =
                        side === 'buy'
                          ? (1 - e.target.value / price) * 100 * leverage
                          : -(1 - e.target.value / price) * 100 * leverage

                      this.setState({
                        pricePercentage: stripDigitPlaces(
                          percentage < 0 ? 0 : percentage,
                          2
                        ),
                        stopLossPrice: e.target.value,
                      })
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
                    showErrors={true}
                    value={this.state.pricePercentage}
                    isValid={this.props.validateField(
                      true,
                      this.state.pricePercentage
                    )}
                    inputStyles={{
                      paddingLeft: '2rem',
                      paddingRight: 0,
                    }}
                    onChange={(e) => {
                      this.setState({ pricePercentage: e.target.value })
                      this.updateStopLoss(e.target.value)
                    }}
                  />

                  <BlueSlider
                    theme={theme}
                    value={this.state.pricePercentage}
                    sliderContainerStyles={{
                      width: '50%',
                      margin: '0 .8rem 0 .8rem',
                    }}
                    onChange={(value) => {
                      this.setState({ pricePercentage: value })
                      this.updateStopLoss(value)
                    }}
                  />
                </InputRowContainer>
              </FormInputContainer>
            </InputRowContainer>

            {this.state.isTimeoutOn && (
              <>
                <TradeInputHeader
                  theme={theme}
                  title={`timeout`}
                  needLine={true}
                />
                <InputRowContainer>
                  {/* <SubBlocksContainer>
                    <InputRowContainer>
                      <TimeoutTitle> When loss</TimeoutTitle>
                    </InputRowContainer>
                    <InputRowContainer>
                      <SCheckbox
                        checked={this.state.whenLossOn}
                        onChange={() => {
                          this.setState((prev) => ({
                            whenLossOn: !prev.whenLossOn,
                          }))

                          this.setState((prev) => ({
                            whenLossableOn: false,
                          }))
                        }}
                        style={{ padding: '0 .4rem 0 0' }}
                      />
                      <Input
                        width={'calc(55% - .4rem)'}
                        value={this.state.whenLossSec}
                        showErrors={this.state.whenLossOn}
                        isValid={this.props.validateField(
                          this.state.whenLossOn,
                          this.state.whenLossSec
                        )}
                        onChange={(e) => {
                          this.setState({ whenLossSec: e.target.value })
                        }}
                        inputStyles={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                        disabled={!this.state.whenLossOn}
                      />
                      <Select theme={theme}                        width={'calc(30% - .4rem)'}
                        value={this.state.whenLossMode}
                        inputStyles={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                        onChange={(e) => {
                          this.setState({ whenLossMode: e.target.value })
                        }}
                        isDisabled={!this.state.whenLossOn}
                      >
                        <option>sec</option>
                        <option>min</option>
                      </Select>
                    </InputRowContainer>
                  </SubBlocksContainer> */}

                  <SubBlocksContainer>
                    {/* <InputRowContainer>
                      <TimeoutTitle>When in loss</TimeoutTitle>
                    </InputRowContainer> */}
                    <InputRowContainer>
                      {/* <SCheckbox
                        checked={this.state.whenLossableOn}
                        onChange={() => {
                          this.setState((prev) => ({
                            whenLossableOn: !prev.whenLossableOn,
                          }))

                          this.setState((prev) => ({
                            whenLossOn: false,
                          }))
                        }}
                        style={{ padding: '0 .4rem 0 0' }}
                      /> */}
                      <Input
                        theme={theme}
                        width={'calc(75% - .4rem)'}
                        value={this.state.whenLossableSec}
                        showErrors={this.state.whenLossableOn}
                        isValid={this.props.validateField(
                          this.state.whenLossableOn,
                          this.state.whenLossableSec
                        )}
                        onChange={(e) => {
                          this.setState({ whenLossableSec: e.target.value })
                        }}
                        inputStyles={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                        // disabled={!this.state.whenLossableOn}
                      />
                      <Select
                        theme={theme}
                        width={'calc(25% - .4rem)'}
                        value={this.state.whenLossableMode}
                        inputStyles={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                        onChange={(e) => {
                          this.setState({ whenLossableMode: e.target.value })
                        }}
                        // isDisabled={!this.state.whenLossableOn}
                      >
                        <option>sec</option>
                        <option>min</option>
                      </Select>
                    </InputRowContainer>
                  </SubBlocksContainer>
                  <SubBlocksContainer>
                    <InputRowContainer>
                      <BlueSlider
                        theme={theme}
                        max={60}
                        value={this.state.whenLossableSec}
                        sliderContainerStyles={{
                          width: '100%',
                          margin: '0 0rem 0 0',
                        }}
                        onChange={(value) => {
                          this.setState({ whenLossableSec: value })
                        }}
                      />
                    </InputRowContainer>
                  </SubBlocksContainer>
                </InputRowContainer>
              </>
            )}

            {this.state.isTimeoutOn && (
              <>
                <InputRowContainer>
                  <FormInputContainer
                    theme={theme}
                    title={'forced stop (loss %)'}
                  >
                    <InputRowContainer>
                      <Input
                        theme={theme}
                        padding={'0'}
                        width={'calc(32.5%)'}
                        textAlign={'left'}
                        symbol={pair[1]}
                        value={this.state.forcedLossPrice}
                        showErrors={true}
                        isValid={this.props.validateField(
                          true,
                          this.state.forcedLossPrice
                        )}
                        inputStyles={{
                          paddingLeft: '1rem',
                        }}
                        onChange={(e) => {
                          const percentage =
                            side === 'buy'
                              ? (1 - e.target.value / price) * 100 * leverage
                              : -(1 - e.target.value / price) * 100 * leverage

                          this.setState({
                            forcedPercentage: stripDigitPlaces(
                              percentage < 0 ? 0 : percentage,
                              2
                            ),
                            forcedLossPrice: e.target.value,
                          })
                        }}
                      />

                      <Input
                        theme={theme}
                        showErrors={true}
                        isValid={this.props.validateField(
                          this.state.isForcedStopOn,
                          this.state.forcedPercentage
                        )}
                        preSymbol={'-'}
                        textAlign={'left'}
                        needPreSymbol={true}
                        inputStyles={{
                          paddingLeft: '2rem',
                          paddingRight: 0,
                        }}
                        padding={'0 .8rem 0 .8rem'}
                        width={'calc(17.5%)'}
                        symbol={'%'}
                        value={this.state.forcedPercentage}
                        onChange={(e) => {
                          this.setState({ forcedPercentage: e.target.value })
                          this.updateStopLoss(e.target.value, 'forcedLossPrice')
                        }}
                      />

                      <BlueSlider
                        theme={theme}
                        value={this.state.forcedPercentage}
                        sliderContainerStyles={{
                          width: '50%',
                          margin: '0 .8rem 0 .8rem',
                        }}
                        onChange={(value) => {
                          this.setState({ forcedPercentage: value })
                          this.updateStopLoss(value, 'forcedLossPrice')
                        }}
                      />
                    </InputRowContainer>
                  </FormInputContainer>
                </InputRowContainer>
              </>
            )}

            <InputRowContainer padding={'2rem 0 0 0'}>
              <SendButton
                type={'buy'}
                onClick={() => {
                  const transformedState = transformProperties(this.state)
                  const isValid = validate(transformedState, true)

                  if (isValid) {
                    updateState(this.state)
                    handleClose()
                  }
                }}
              >
                confirm
              </SendButton>
            </InputRowContainer>
          </div>
        </StyledDialogContent>
      </Dialog>
    )
  }
}

export class EditHedgePopup extends React.Component<IProps, HedgeState> {
  state = {
    isHedgeOn: true,
    hedgeSide: '',
    hedgePrice: 0,
    hedgeIncrease: 1,
  }

  static getDerivedStateFromProps(props, state) {
    // get values from state if empty
    if (state.hedgeSide === '') {
      return {
        ...props.derivedState,
      }
    }
    return null
  }

  render() {
    const { open, pair, handleClose, updateState, validate, theme } = this.props

    return (
      <Dialog
        PaperComponent={StyledPaper}
        style={{ width: '85rem', margin: 'auto' }}
        fullScreen={false}
        onClose={handleClose}
        maxWidth={'md'}
        open={open}
        aria-labelledby="responsive-edit-hedge-dialog-title"
      >
        <StyledDialogTitle
          disableTypography
          id="responsive-edit-hedge-dialog-title"
        >
          <TypographyTitle>{`Edit hedge`}</TypographyTitle>
          <ClearButton>
            <Clear
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={handleClose}
            />
          </ClearButton>
        </StyledDialogTitle>
        <StyledDialogContent id="edit-hedge-dialog-content">
          <InputRowContainer padding={'1rem 0 .6rem 0'}>
            <div>
              <GreenSwitcher
                id="isHedgeDialogOn"
                checked={this.state.isHedgeOn}
                handleToggle={() =>
                  this.setState((prev) => ({ isHedgeOn: !prev.isHedgeOn }))
                }
              />
              <HeaderLabel theme={theme} htmlFor="isHedgeDialogOn">
                hedge
              </HeaderLabel>
            </div>
          </InputRowContainer>
          <InputRowContainer>
            <FormInputContainer title={'hedge'}>
              <CustomSwitcher
                theme={theme}
                firstHalfText={'long'}
                secondHalfText={'short'}
                buttonHeight={'2.5rem'}
                containerStyles={{
                  width: '30%',
                  padding: '0 .4rem 0 0',
                  whiteSpace: 'nowrap',
                }}
                firstHalfStyleProperties={GreenSwitcherStyles(theme)}
                secondHalfStyleProperties={RedSwitcherStyles(theme)}
                firstHalfIsActive={this.state.hedgeSide === 'long'}
                changeHalf={() =>
                  this.setState((prev) => ({
                    hedgeSide: getSecondValueFromFirst(prev.hedgeSide),
                  }))
                }
              />
              <Input
                padding="0 .8rem 0 .8rem"
                width={'calc(40% - 1.6rem)'}
                symbol={pair[1]}
                isDisabled={!this.state.isHedgeOn}
                value={this.state.hedgePrice}
                showErrors={this.state.isHedgeOn}
                isValid={this.props.validateField(
                  this.state.isHedgeOn,
                  this.state.hedgePrice
                )}
                onChange={(e) => {
                  this.setState({ hedgePrice: e.target.value })
                }}
              />
              <Select
                theme={theme}
                width={'18%'}
                symbol={'LVRG.'}
                isDisabled={!this.state.isHedgeOn}
                value={this.state.hedgeIncrease}
                showErrors={this.state.isHedgeOn}
                isValid={this.props.validateField(
                  this.state.isHedgeOn,
                  this.state.hedgeIncrease
                )}
                onChange={(e) => {
                  this.setState({ hedgeIncrease: e.target.value })
                }}
              >
                <option>1</option>
                <option>25</option>
                <option>50</option>
                <option>75</option>
                <option>100</option>
                <option>125</option>
              </Select>
            </FormInputContainer>
          </InputRowContainer>
          <InputRowContainer padding={'2rem 0 0 0'}>
            <SendButton
              type={'buy'}
              onClick={() => {
                const transformedState = this.state
                const isValid = validate(transformedState, true)

                if (isValid) {
                  updateState(this.state)
                  handleClose()
                }
              }}
            >
              confirm
            </SendButton>
          </InputRowContainer>
        </StyledDialogContent>
      </Dialog>
    )
  }
}

export class EditEntryOrderPopup extends React.Component<
  IProps,
  EntryOrderState
> {
  state = {
    type: '',
    side: '',
    price: 0,
    amount: 0,
    total: 0,
    initialMargin: 0,
    isTrailingOn: false,
    deviationPercentage: 0,
    leverage: 0,
    trailingDeviationPrice: 0,
  }

  static getDerivedStateFromProps(props, state) {
    // get values from state if empty
    if (state.side === '') {
      const { side, price, pricePrecision, leverage } = props

      let priceForCalculate =
        props.derivedState.type === 'market' && !props.derivedState.isTrailingOn
          ? props.price
          : price

      const deviationPercentage = props.openFromTerminal
        ? props.derivedState.deviationPercentage
        : (props.derivedState.deviationPercentage / props.leverage).toFixed(3)

      const trailingDeviationPrice =
        side === 'buy'
          ? stripDigitPlaces(
              priceForCalculate * (1 + deviationPercentage / 100),
              pricePrecision
            )
          : stripDigitPlaces(
              priceForCalculate * (1 - deviationPercentage / 100),
              pricePrecision
            )

      return {
        ...props.derivedState,
        price: props.derivedState.isTrailingOn
          ? props.derivedState.activatePrice
          : props.derivedState.price,
        trailingDeviationPrice,
        deviationPercentage,
        leverage,
        initialMargin: (
          (props.derivedState.amount * props.derivedState.price) /
          props.leverage
        ).toFixed(2),
      }
    }
    return null
  }
  updateTrailingPrice = (deviationPercentage) => {
    const { type, isTrailingOn } = this.state
    const { side, price, pricePrecision } = this.props

    let priceForCalculate =
      type === 'market' && !isTrailingOn ? this.props.price : price

    const trailingDeviationPrice =
      side === 'buy'
        ? stripDigitPlaces(
            priceForCalculate * (1 + deviationPercentage / 100),
            pricePrecision
          )
        : stripDigitPlaces(
            priceForCalculate * (1 - deviationPercentage / 100),
            pricePrecision
          )

    this.setState({ trailingDeviationPrice })
  }

  getMaxValues = () => {
    const { side, type, price, amount, total, isTrailingOn } = this.state
    const { funds, marketType, leverage } = this.props

    let maxAmount = 0

    let priceForCalculate =
      type === 'market' && !isTrailingOn ? this.props.price : price

    if (marketType === 0) {
      maxAmount = side === 'buy' ? funds[1].quantity : funds[0].quantity
    } else if (marketType === 1) {
      maxAmount = funds[1].quantity * leverage
    }

    const [newAmount, newTotal] =
      side === 'buy' || marketType === 1
        ? [maxAmount / priceForCalculate, maxAmount]
        : [maxAmount, maxAmount / priceForCalculate]

    return [newAmount, newTotal]
  }

  setMaxAmount = () => {
    const { funds, marketType, quantityPrecision } = this.props

    const [amount, total] = this.getMaxValues()

    this.setState({
      amount: stripDigitPlaces(
        amount,
        marketType === 1 ? quantityPrecision : 8
      ),
      total: stripDigitPlaces(total, marketType === 1 ? 2 : 8),
      initialMargin: stripDigitPlaces(funds[1].quantity, 2),
    })
  }

  render() {
    const {
      theme,
      open,
      pair,
      funds,
      leverage,
      transformProperties,
      handleClose,
      updateState,
      validate,
      marketType,
      quantityPrecision,
      maxLeverage,
    } = this.props

    const {
      type,
      side,
      price,
      amount,
      total,
      isTrailingOn,
      deviationPercentage,
    } = this.state

    let maxAmount = 0
    let priceForCalculate =
      type === 'market' && !isTrailingOn ? this.props.price : price

    if (marketType === 0) {
      maxAmount = side === 'buy' ? funds[1].quantity : funds[0].quantity
    } else if (marketType === 1) {
      maxAmount = funds[1].quantity * leverage
    }

    return (
      <Dialog
        theme={theme}
        PaperComponent={StyledPaper}
        style={{ width: '85rem', margin: 'auto' }}
        fullScreen={false}
        onClose={handleClose}
        maxWidth={'md'}
        open={open}
        aria-labelledby="responsive-edit-entry-order-dialog-title"
      >
        <StyledDialogTitle
          theme={theme}
          disableTypography
          id="responsive-edit-entry-order-dialog-title"
        >
          <TypographyTitle theme={theme}>{`Edit entry point`}</TypographyTitle>
          <div style={{ display: 'flex', alignItems: 'center', width: '60%' }}>
            <SmallSlider
              theme={theme}
              min={1}
              max={maxLeverage}
              defaultValue={this.state.leverage}
              value={this.state.leverage}
              valueSymbol={'X'}
              marks={
                maxLeverage === 125
                  ? {
                      1: {},
                      25: {},
                      50: {},
                      75: {},
                      100: {},
                      125: {},
                    }
                  : maxLeverage === 75
                  ? {
                      1: {},
                      15: {},
                      30: {},
                      45: {},
                      60: {},
                      75: {},
                    }
                  : {
                      1: {},
                      10: {},
                      20: {},
                      30: {},
                      40: {},
                      50: {},
                    }
              }
              onChange={(leverage: number) => {
                this.setState({ leverage })
              }}
              sliderContainerStyles={{
                width: '80%',
                margin: '0 auto',
              }}
              trackBeforeBackground={theme.palette.green.main}
              handleStyles={{
                width: '1.2rem',
                height: '1.2rem',
                border: 'none',
                backgroundColor: '#036141',
                marginTop: '-.28rem',
                boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
                transform: 'translate(-50%, -15%) !important',
              }}
              dotStyles={{
                border: 'none',
                backgroundColor: theme.palette.slider.dots,
              }}
              activeDotStyles={{
                backgroundColor: theme.palette.green.main,
              }}
              markTextSlyles={{
                color: theme.palette.grey.light,
                fontSize: '1rem',
              }}
              railStyle={{
                backgroundColor: theme.palette.slider.rail,
              }}
            />
            <LeverageLabel theme={theme} style={{ fontFamily: 'DM Sans' }}>
              {this.state.leverage}X
            </LeverageLabel>
          </div>
          <ClearButton>
            <Clear
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={handleClose}
            />
          </ClearButton>
        </StyledDialogTitle>
        <StyledDialogContent theme={theme} id="edit-entry-order-dialog-content">
          <CustomSwitcher
            theme={theme}
            firstHalfText={'buy'}
            secondHalfText={'sell'}
            buttonHeight={'2.5rem'}
            containerStyles={{ width: '100%', padding: '1.2rem 0 .6rem 0' }}
            firstHalfStyleProperties={GreenSwitcherStyles(theme)}
            secondHalfStyleProperties={RedSwitcherStyles(theme)}
            firstHalfIsActive={side === 'buy'}
            changeHalf={() => {
              if (marketType === 0) {
                const newSide = getSecondValueFromFirst(side)

                if (newSide === 'sell') {
                  return
                }

                const amountPercentage =
                  side === 'buy' || marketType === 1
                    ? total / (maxAmount / 100)
                    : amount / (maxAmount / 100)

                const newMaxAmount =
                  newSide === 'buy' ? funds[1].quantity : funds[0].quantity

                let newAmount =
                  newSide === 'buy'
                    ? (
                        ((amountPercentage / 100) * newMaxAmount) /
                        price
                      ).toFixed(marketType === 1 ? quantityPrecision : 8)
                    : ((amountPercentage / 100) * newMaxAmount).toFixed(
                        marketType === 1 ? quantityPrecision : 8
                      )

                if (!+newAmount || +newAmount === NaN) {
                  newAmount = 0
                }

                const newTotal = (newAmount * price).toFixed(
                  marketType === 1 ? 2 : 8
                )

                this.setState({
                  amount: newAmount,
                  total: newTotal,
                })
              }

              this.setState((prev) => ({
                side: getSecondValueFromFirst(prev.side),
              }))
            }}
          />

          <CustomSwitcher
            theme={theme}
            firstHalfText={'limit'}
            secondHalfText={'market'}
            buttonHeight={'2.5rem'}
            containerStyles={{
              width: '100%',
              paddingBottom: marketType === 1 ? '0' : '.6rem',
            }}
            firstHalfStyleProperties={BlueSwitcherStyles(theme)}
            secondHalfStyleProperties={BlueSwitcherStyles(theme)}
            firstHalfIsActive={type === 'limit'}
            changeHalf={() => {
              this.setState((prev) => ({
                type: getSecondValueFromFirst(prev.type),
              }))

              if (getSecondValueFromFirst(type) === 'market' && !isTrailingOn) {
                const total = this.props.price * amount
                this.setState({
                  total: stripDigitPlaces(total, marketType === 1 ? 2 : 8),
                  initialMargin: stripDigitPlaces(total / leverage, 2),
                })
              }
            }}
          />

          <div>
            {marketType === 1 && (
              <InputRowContainer
                justify="flex-start"
                padding={'.6rem 0 1.2rem 0'}
              >
                <AdditionalSettingsButton
                  theme={theme}
                  isActive={isTrailingOn}
                  onClick={() => {
                    this.setState((prev) => ({
                      isTrailingOn: !prev.isTrailingOn,
                    }))
                  }}
                >
                  Trailing {side}
                </AdditionalSettingsButton>
              </InputRowContainer>
            )}

            <InputRowContainer>
              <FormInputContainer theme={theme} title={'price'}>
                <Input
                  theme={theme}
                  symbol={pair[1]}
                  type={
                    type === 'limit'
                      ? 'number'
                      : isTrailingOn
                      ? 'number'
                      : 'text'
                  }
                  value={
                    type === 'limit' ? price : isTrailingOn ? price : 'MARKET'
                  }
                  showErrors={true}
                  isValid={this.props.validateField(true, price)}
                  disabled={type === 'market' && !isTrailingOn}
                  onChange={(e) => {
                    const total = e.target.value * amount
                    this.setState({
                      price: e.target.value,
                      total: Number(
                        stripDigitPlaces(total, marketType === 1 ? 2 : 8)
                      ),
                      initialMargin: stripDigitPlaces(total, 2),
                    })
                  }}
                />
              </FormInputContainer>
            </InputRowContainer>

            {isTrailingOn && (
              <FormInputContainer theme={theme} title={'price deviation'}>
                <InputRowContainer>
                  <Input
                    theme={theme}
                    padding={'0'}
                    width={'calc(32.5%)'}
                    textAlign={'left'}
                    symbol={pair[1]}
                    value={this.state.trailingDeviationPrice}
                    showErrors={true}
                    isValid={this.props.validateField(
                      true,
                      this.state.trailingDeviationPrice
                    )}
                    inputStyles={{
                      paddingLeft: '1rem',
                    }}
                    onChange={(e) => {
                      const percentage =
                        this.state.side === 'sell'
                          ? (1 - e.target.value / priceForCalculate) * 100
                          : -(1 - e.target.value / priceForCalculate) * 100

                      this.setState({
                        deviationPercentage: stripDigitPlaces(
                          percentage < 0 ? 0 : percentage,
                          2
                        ),
                        trailingDeviationPrice: e.target.value,
                      })
                    }}
                  />

                  <Input
                    theme={theme}
                    padding={'0 .8rem 0 .8rem'}
                    width={'calc(17.5%)'}
                    symbol={'%'}
                    textAlign={'left'}
                    value={deviationPercentage}
                    showErrors={true}
                    isValid={this.props.validateField(
                      isTrailingOn,
                      deviationPercentage
                    )}
                    inputStyles={{
                      paddingLeft: '1rem',
                      paddingRight: 0,
                    }}
                    onChange={(e) => {
                      const value =
                        e.target.value > 100 / leverage
                          ? stripDigitPlaces(100 / leverage, 3)
                          : e.target.value
                      this.setState({ deviationPercentage: value })
                      this.updateTrailingPrice(+value)
                    }}
                  />

                  <BlueSlider
                    theme={theme}
                    disabled={!isTrailingOn}
                    value={stripDigitPlaces(deviationPercentage * leverage, 3)}
                    sliderContainerStyles={{
                      width: '50%',
                      margin: '0 .8rem 0 .8rem',
                    }}
                    onChange={(value) => {
                      this.setState({
                        deviationPercentage: stripDigitPlaces(
                          value / leverage,
                          3
                        ),
                      })
                      this.updateTrailingPrice(
                        +stripDigitPlaces(value / leverage, 3)
                      )
                    }}
                  />
                </InputRowContainer>
              </FormInputContainer>
            )}

            <InputRowContainer>
              <div style={{ width: '47%' }}>
                <FormInputContainer
                  theme={theme}
                  needLine={false}
                  needRightValue={true}
                  rightValue={`${
                    side === 'buy' || marketType === 1
                      ? (maxAmount / priceForCalculate).toFixed(
                          marketType === 1 ? quantityPrecision : 8
                        )
                      : maxAmount.toFixed(
                          marketType === 1 ? quantityPrecision : 8
                        )
                  } ${pair[0]}`}
                  onValueClick={this.setMaxAmount}
                  title={`${marketType === 1 ? 'order quantity' : 'amount'} (${
                    pair[0]
                  })`}
                >
                  <Input
                    theme={theme}
                    type={'text'}
                    pattern={
                      marketType === 0 ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'
                    }
                    symbol={pair[0]}
                    value={amount}
                    showErrors={true}
                    isValid={this.props.validateField(true, +amount)}
                    onChange={(e) => {
                      const [maxAmount] = this.getMaxValues()
                      const isAmountMoreThanMax = e.target.value > maxAmount
                      const amountForUpdate = isAmountMoreThanMax
                        ? maxAmount
                        : e.target.value

                      const newTotal = amountForUpdate * priceForCalculate

                      const strippedAmount = isAmountMoreThanMax
                        ? stripDigitPlaces(
                            amountForUpdate,
                            marketType === 1 ? quantityPrecision : 8
                          )
                        : e.target.value

                      this.setState({
                        amount: strippedAmount,
                        total: stripDigitPlaces(
                          newTotal,
                          marketType === 1 ? 2 : 8
                        ),
                        initialMargin: stripDigitPlaces(
                          (newTotal || 0) / leverage,
                          2
                        ),
                      })
                    }}
                  />
                </FormInputContainer>
              </div>
              <div
                style={{
                  width: '6%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <HeightIcon
                  style={{
                    color: '#7284A0',
                    transform: 'rotate(-90deg) translateX(-30%)',
                  }}
                />
              </div>
              <div style={{ width: '47%' }}>
                <FormInputContainer
                  theme={theme}
                  needLine={false}
                  needRightValue={true}
                  rightValue={`${
                    side === 'buy' || marketType === 1
                      ? stripDigitPlaces(maxAmount, marketType === 1 ? 0 : 2)
                      : stripDigitPlaces(
                          maxAmount * priceForCalculate,
                          marketType === 1 ? 0 : 2
                        )
                  } ${pair[1]}`}
                  onValueClick={this.setMaxAmount}
                  title={`total (${pair[1]})`}
                >
                  <Input
                    theme={theme}
                    symbol={pair[1]}
                    value={total}
                    disabled={isTrailingOn || type === 'market'}
                    onChange={(e) => {
                      this.setState({
                        total: e.target.value,
                        amount: stripDigitPlaces(
                          e.target.value / priceForCalculate,
                          marketType === 1 ? quantityPrecision : 8
                        ),
                        initialMargin: stripDigitPlaces(
                          e.target.value / leverage,
                          2
                        ),
                      })

                      // this.updateBlockValue(
                      //   'temp',
                      //   'initialMargin',
                      //   stripDigitPlaces(e.target.value / leverage, 2)
                      // )
                    }}
                  />
                </FormInputContainer>
              </div>
            </InputRowContainer>

            <InputRowContainer>
              <BlueSlider
                theme={theme}
                showMarks
                value={
                  side === 'buy' || marketType === 1
                    ? total / (maxAmount / 100)
                    : amount / (maxAmount / 100)
                }
                sliderContainerStyles={{
                  width: 'calc(100% - .8rem)',
                  margin: '0 .8rem 0 auto',
                }}
                onChange={(value) => {
                  const newValue = (maxAmount / 100) * value

                  const newAmount =
                    side === 'buy' || marketType === 1
                      ? (newValue / priceForCalculate).toFixed(
                          marketType === 1 ? quantityPrecision : 8
                        )
                      : newValue.toFixed(
                          marketType === 1 ? quantityPrecision : 8
                        )

                  const newTotal =
                    side === 'buy' || marketType === 1
                      ? newValue
                      : newValue * priceForCalculate

                  const newMargin = stripDigitPlaces(
                    (newTotal || 0) / leverage,
                    2
                  )

                  this.setState({
                    amount: newAmount,
                    total: stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8),
                    initialMargin: newMargin,
                  })
                }}
              />
            </InputRowContainer>

            {marketType === 1 && (
              <InputRowContainer>
                <FormInputContainer
                  theme={theme}
                  needLine={false}
                  needRightValue={true}
                  rightValue={`${stripDigitPlaces(funds[1].quantity, 2)} ${
                    pair[1]
                  }`}
                  onValueClick={this.setMaxAmount}
                  title={`cost / initial margin (${pair[1]})`}
                >
                  <Input
                    theme={theme}
                    symbol={pair[1]}
                    value={this.state.initialMargin}
                    disabled={isTrailingOn || type === 'market'}
                    onChange={(e) => {
                      const inputInitialMargin = e.target.value
                      const newTotal = inputInitialMargin * leverage
                      const newAmount = newTotal / priceForCalculate

                      const fixedAmount = stripDigitPlaces(
                        newAmount,
                        marketType === 1 ? quantityPrecision : 8
                      )

                      this.setState({
                        total: stripDigitPlaces(
                          newTotal,
                          marketType === 1 ? 2 : 8
                        ),
                        amount: fixedAmount,
                        initialMargin: inputInitialMargin,
                      })
                    }}
                  />
                </FormInputContainer>
              </InputRowContainer>
            )}

            <InputRowContainer padding={'2rem 0 0 0'}>
              <SendButton
                theme={theme}
                type={'buy'}
                onClick={() => {
                  const percentage = this.props.openFromTerminal
                    ? this.state.deviationPercentage
                    : this.state.deviationPercentage * this.props.leverage

                  const transformedState = transformProperties({
                    ...this.state,
                    deviationPercentage: +(+percentage).toFixed(3),
                  })
                  const isValid = validate(transformedState, true)

                  if (isValid) {
                    updateState(transformedState)
                    handleClose()
                  }
                }}
              >
                confirm
              </SendButton>
            </InputRowContainer>
          </div>
        </StyledDialogContent>
      </Dialog>
    )
  }
}
