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

import GreenSwitcher from '@sb/components/SwitchOnOff/GreenSwitcher'
import CloseIcon from '@material-ui/icons/Close'

import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { FormInputContainer, Input, Select } from './InputComponents'

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
  open: boolean
  pair?: [string, string]
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
  isTrailingOn: boolean
  deviationPercentage: number
}

export class EditTakeProfitPopup extends React.Component<IProps, ITAPState> {
  state = {
    type: '',
    pricePercentage: 0,
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
  }

  static getDerivedStateFromProps(props, state) {
    // get values from state if empty

    if (state.type === '') {
      return {
        ...props.derivedState,
      }
    }

    return null
  }

  render() {
    const {
      open,
      handleClose,
      updateState,
      validate,
      transformProperties,
    } = this.props

    return (
      <Dialog
        PaperComponent={StyledPaper}
        style={{ width: '85rem', margin: 'auto' }}
        fullScreen={false}
        onClose={handleClose}
        maxWidth={'md'}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <StyledDialogTitle disableTypography id="responsive-dialog-title">
          <TypographyTitle>{`Edit take a profit`}</TypographyTitle>
          <ClearButton>
            <Clear
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={handleClose}
            />
          </ClearButton>
        </StyledDialogTitle>
        <StyledDialogContent id="share-dialog-content">
          <InputRowContainer justify="center" padding={'1rem 0 .6rem 0'}>
            <CustomSwitcher
              firstHalfText={'limit'}
              secondHalfText={'market'}
              buttonHeight={'2.5rem'}
              containerStyles={{ width: '100%' }}
              firstHalfStyleProperties={BlueSwitcherStyles}
              secondHalfStyleProperties={BlueSwitcherStyles}
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
              <div>
                <GreenSwitcher
                  id="takeProfitTrailingOnDialog"
                  checked={this.state.isTrailingOn}
                  handleToggle={() => {
                    this.setState((prev) => ({
                      type: 'market',
                      isSplitTargetsOn: false,
                      isTrailingOn: !prev.isTrailingOn,
                    }))
                  }}
                />
                <HeaderLabel htmlFor="takeProfitTrailingOnDialog">
                  trailing <span style={{ color: '#29AC80' }}>t-a-p</span>
                </HeaderLabel>
              </div>
              <div>
                <GreenSwitcher
                  id="isSplitTargetsOnDialog"
                  checked={this.state.isSplitTargetsOn}
                  handleToggle={() => {
                    this.setState((prev) => ({
                      isSplitTargetsOn: !prev.isSplitTargetsOn,
                      isTrailingOn: false,
                    }))
                  }}
                />
                <HeaderLabel htmlFor="isSplitTargetsOnDialog">
                  split targets
                </HeaderLabel>
              </div>
              <div>
                <GreenSwitcher
                  id="takeProfitTimeoutDialog"
                  checked={this.state.isTimeoutOn}
                  handleToggle={() => {
                    this.setState((prev) => ({
                      isTimeoutOn: !prev.isTimeoutOn,
                    }))
                  }}
                />
                <HeaderLabel htmlFor="takeProfitTimeoutDialog">
                  timeout
                </HeaderLabel>
              </div>
            </InputRowContainer>

            {!this.state.isTrailingOn && (
              <InputRowContainer>
                <FormInputContainer title={'profit'}>
                  <Input
                    needCharacter
                    beforeSymbol={'+'}
                    padding={'0 .8rem 0 0'}
                    width={'calc(35%)'}
                    symbol={'%'}
                    showErrors={
                      !this.state.isSplitTargetsOn && !this.state.isTrailingOn
                    }
                    value={this.state.pricePercentage}
                    isValid={this.props.validateField(
                      true,
                      this.state.pricePercentage
                    )}
                    onChange={(e) => {
                      this.setState({ pricePercentage: e.target.value })
                    }}
                  />

                  <BlueSlider
                    value={this.state.pricePercentage}
                    sliderContainerStyles={{
                      width: '50%',
                      margin: '0 .8rem 0 .8rem',
                    }}
                    onChange={(value) => {
                      this.setState({ pricePercentage: value })
                    }}
                  />
                </FormInputContainer>
              </InputRowContainer>
            )}

            {this.state.isTrailingOn && (
              <InputRowContainer>
                <FormInputContainer title={'deviation'}>
                  <Input
                    padding={'0 .8rem 0 0'}
                    width={'calc(35%)'}
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
                    value={this.state.deviationPercentage}
                    sliderContainerStyles={{
                      width: '50%',
                      margin: '0 .8rem 0 .8rem',
                    }}
                    onChange={(value) => {
                      this.setState({ deviationPercentage: value })
                    }}
                  />
                </FormInputContainer>
              </InputRowContainer>
            )}

            {this.state.isSplitTargetsOn && (
              <>
                <InputRowContainer>
                  <FormInputContainer title={'volume'}>
                    <Input
                      padding={'0 .8rem 0 0'}
                      width={'calc(35%)'}
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
                  </FormInputContainer>
                </InputRowContainer>

                <InputRowContainer
                  padding="0 0 .4rem 0"
                  style={{
                    borderBottom: '.1rem solid #e0e5ec',
                  }}
                >
                  <BtnCustom
                    btnColor={'#0B1FD1'}
                    btnWidth={'100%'}
                    height={'auto'}
                    borderRadius={'1rem'}
                    margin={'0'}
                    padding={'.1rem 0'}
                    fontSize={'1rem'}
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
                  padding=".4rem 1rem 1.2rem .4rem"
                  direction="column"
                >
                  <InputRowContainer padding=".2rem .5rem">
                    <TargetTitle style={{ width: '50%' }}>price</TargetTitle>
                    <TargetTitle style={{ width: '50%' }}>quantity</TargetTitle>
                  </InputRowContainer>
                  <div
                    style={{
                      width: '100%',
                    }}
                  >
                    {this.state.targets.map((target, i) => (
                      <InputRowContainer
                        key={`${target.price}${target.quantity}${i}`}
                        padding=".2rem .5rem"
                        style={{ borderBottom: '.1rem solid #e0e5ec' }}
                      >
                        <TargetValue style={{ width: '50%' }}>
                          +{target.price}%
                        </TargetValue>
                        <TargetValue style={{ width: '40%' }}>
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
                            color: '#DD6956',
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
                <InputRowContainer>
                  <HeaderTitle>timeout</HeaderTitle>
                </InputRowContainer>
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
                        }}
                        style={{ padding: '0 .4rem 0 0' }}
                      />
                      <Input
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
                        isDisabled={!this.state.whenProfitOn}
                      />
                      <Select
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
                        }}
                        style={{ padding: '0 .4rem 0 0' }}
                      />
                      <Input
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
                        isDisabled={!this.state.whenProfitableOn}
                      />
                      <Select
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
  }

  static getDerivedStateFromProps(props, state) {
    // get values from state if empty
    if (state.type === '') {
      return {
        ...props.derivedState,
      }
    }
    return null
  }

  render() {
    const {
      open,
      handleClose,
      updateState,
      transformProperties,
      validate,
    } = this.props

    return (
      <Dialog
        PaperComponent={StyledPaper}
        style={{ width: '85rem', margin: 'auto' }}
        fullScreen={false}
        onClose={handleClose}
        maxWidth={'md'}
        open={open}
        aria-labelledby="responsive-edit-stop-loss-dialog-title"
      >
        <StyledDialogTitle
          disableTypography
          id="responsive-edit-stop-loss-dialog-title"
        >
          <TypographyTitle>{`Edit stop loss`}</TypographyTitle>
          <ClearButton>
            <Clear
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={handleClose}
            />
          </ClearButton>
        </StyledDialogTitle>
        <StyledDialogContent id="edit-stop-loss-dialog-content">
          <InputRowContainer justify="center" padding={'1rem 0 .6rem 0'}>
            <CustomSwitcher
              firstHalfText={'limit'}
              secondHalfText={'market'}
              buttonHeight={'2.5rem'}
              containerStyles={{ width: '100%' }}
              firstHalfStyleProperties={BlueSwitcherStyles}
              secondHalfStyleProperties={BlueSwitcherStyles}
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
              <div>
                <GreenSwitcher
                  id="forcedStopDialog"
                  checked={this.state.isForcedStopOn}
                  handleToggle={() => {
                    this.setState((prev) => ({
                      isForcedStopOn: !prev.isForcedStopOn,
                    }))
                  }}
                />
                <HeaderLabel htmlFor="forcedStopDialog">
                  forced <span style={{ color: '#DD6956' }}>stop</span>
                </HeaderLabel>
              </div>
              <div>
                <GreenSwitcher
                  id="stopLossTimeout"
                  checked={this.state.isTimeoutOn}
                  handleToggle={() => {
                    this.setState((prev) => ({
                      isTimeoutOn: !prev.isTimeoutOn,
                    }))
                  }}
                />
                <HeaderLabel htmlFor="stopLossTimeout">timeout</HeaderLabel>
              </div>
            </InputRowContainer>

            <InputRowContainer>
              <FormInputContainer title={'loss'}>
                <Input
                  needCharacter
                  beforeSymbol={'-'}
                  padding={'0 .8rem 0 0'}
                  width={'calc(35%)'}
                  symbol={'%'}
                  showErrors={true}
                  value={this.state.pricePercentage}
                  isValid={this.props.validateField(
                    true,
                    this.state.pricePercentage
                  )}
                  onChange={(e) => {
                    this.setState({ pricePercentage: e.target.value })
                  }}
                />

                <BlueSlider
                  value={this.state.pricePercentage}
                  sliderContainerStyles={{
                    width: '50%',
                    margin: '0 .8rem 0 .8rem',
                  }}
                  onChange={(value) => {
                    this.setState({ pricePercentage: value })
                  }}
                />
              </FormInputContainer>
            </InputRowContainer>

            {this.state.isTimeoutOn && (
              <>
                <InputRowContainer>
                  <HeaderTitle>timeout</HeaderTitle>
                </InputRowContainer>
                <InputRowContainer>
                  <SubBlocksContainer>
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
                        isDisabled={!this.state.whenLossOn}
                      />
                      <Select
                        width={'calc(30% - .4rem)'}
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
                  </SubBlocksContainer>

                  <SubBlocksContainer>
                    <InputRowContainer>
                      <TimeoutTitle>When lossable</TimeoutTitle>
                    </InputRowContainer>
                    <InputRowContainer>
                      <SCheckbox
                        checked={this.state.whenLossableOn}
                        onChange={() => {
                          this.setState((prev) => ({
                            whenLossableOn: !prev.whenLossableOn,
                          }))
                        }}
                        style={{ padding: '0 .4rem 0 0' }}
                      />
                      <Input
                        width={'calc(55% - .4rem)'}
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
                        isDisabled={!this.state.whenLossableOn}
                      />
                      <Select
                        width={'calc(30% - .4rem)'}
                        value={this.state.whenLossableMode}
                        inputStyles={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                        onChange={(e) => {
                          this.setState({ whenLossableMode: e.target.value })
                        }}
                        isDisabled={!this.state.whenLossableOn}
                      >
                        <option>sec</option>
                        <option>min</option>
                      </Select>
                    </InputRowContainer>
                  </SubBlocksContainer>
                </InputRowContainer>
              </>
            )}

            {this.state.isForcedStopOn && (
              <>
                <InputRowContainer>
                  <HeaderTitle>forced stop</HeaderTitle>
                </InputRowContainer>
                <InputRowContainer>
                  <FormInputContainer title={'price'}>
                    <Input
                      needCharacter
                      showErrors={true}
                      isValid={this.props.validateField(
                        this.state.isForcedStopOn,
                        this.state.forcedPercentage
                      )}
                      beforeSymbol={'-'}
                      padding={'0 .8rem 0 0'}
                      width={'calc(35%)'}
                      symbol={'%'}
                      value={this.state.forcedPercentage}
                      onChange={(e) => {
                        this.setState({ forcedPercentage: e.target.value })
                      }}
                    />

                    <BlueSlider
                      value={this.state.forcedPercentage}
                      sliderContainerStyles={{
                        width: '50%',
                        margin: '0 .8rem 0 .8rem',
                      }}
                      onChange={(value) => {
                        this.setState({ forcedPercentage: value })
                      }}
                    />
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
    const { open, pair, handleClose, updateState, validate } = this.props

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
              <HeaderLabel htmlFor="isHedgeDialogOn">hedge</HeaderLabel>
            </div>
          </InputRowContainer>
          <InputRowContainer>
            <FormInputContainer title={'hedge'}>
              <CustomSwitcher
                firstHalfText={'long'}
                secondHalfText={'short'}
                buttonHeight={'2.5rem'}
                containerStyles={{
                  width: '30%',
                  padding: '0 .4rem 0 0',
                  whiteSpace: 'nowrap',
                }}
                firstHalfStyleProperties={GreenSwitcherStyles}
                secondHalfStyleProperties={RedSwitcherStyles}
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
    isTrailingOn: false,
    deviationPercentage: 0,
  }

  static getDerivedStateFromProps(props, state) {
    // get values from state if empty
    if (state.side === '') {
      return {
        ...props.derivedState,
      }
    }
    return null
  }

  render() {
    const {
      open,
      pair,
      funds,
      leverage,
      transformProperties,
      handleClose,
      updateState,
      validate,
      marketType,
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

    if (marketType === 0) {
      maxAmount = side === 'buy' ? funds[1].quantity : funds[0].quantity
    } else if (marketType === 1) {
      maxAmount = funds[1].quantity * leverage
    }

    return (
      <Dialog
        PaperComponent={StyledPaper}
        style={{ width: '85rem', margin: 'auto' }}
        fullScreen={false}
        onClose={handleClose}
        maxWidth={'md'}
        open={open}
        aria-labelledby="responsive-edit-entry-order-dialog-title"
      >
        <StyledDialogTitle
          disableTypography
          id="responsive-edit-entry-order-dialog-title"
        >
          <TypographyTitle>{`Edit entry point`}</TypographyTitle>
          <ClearButton>
            <Clear
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={handleClose}
            />
          </ClearButton>
        </StyledDialogTitle>
        <StyledDialogContent id="edit-entry-order-dialog-content">
          <CustomSwitcher
            firstHalfText={'buy'}
            secondHalfText={'sell'}
            buttonHeight={'2.5rem'}
            containerStyles={{ width: '100%', paddingBottom: '.4rem' }}
            firstHalfStyleProperties={GreenSwitcherStyles}
            secondHalfStyleProperties={RedSwitcherStyles}
            firstHalfIsActive={side === 'buy'}
            changeHalf={() => {
              if (marketType === 0) {
                const newSide = getSecondValueFromFirst(side)
                const amountPercentage =
                  side === 'buy' || marketType === 1
                    ? total / (maxAmount / 100)
                    : amount / (maxAmount / 100)

                const newMaxAmount =
                  newSide === 'buy' ? funds[1].quantity : funds[0].quantity

                const newAmount =
                  newSide === 'buy'
                    ? (
                        ((amountPercentage / 100) * newMaxAmount) /
                        price
                      ).toFixed(8)
                    : ((amountPercentage / 100) * newMaxAmount).toFixed(8)

                const newTotal = newAmount * price

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
            firstHalfText={'limit'}
            secondHalfText={'market'}
            buttonHeight={'2.5rem'}
            containerStyles={{ width: '100%' }}
            firstHalfStyleProperties={BlueSwitcherStyles}
            secondHalfStyleProperties={BlueSwitcherStyles}
            firstHalfIsActive={type === 'limit'}
            changeHalf={() => {
              this.setState((prev) => ({
                type: getSecondValueFromFirst(prev.type),
              }))

              if (getSecondValueFromFirst(type) === 'limit') {
                this.setState({
                  isTrailingOn: false,
                })
              }
            }}
          />

          <div>
            <InputRowContainer
              justify="flex-start"
              padding={'.8rem 0 1.2rem 0'}
            >
              <div>
                <GreenSwitcher
                  id="entryPointTrailingOn"
                  checked={isTrailingOn}
                  handleToggle={() => {
                    this.setState((prev) => ({
                      isTrailingOn: !prev.isTrailingOn,
                      type: 'market',
                    }))
                  }}
                />
                <HeaderLabel htmlFor="entryPointTrailingOn">
                  trailing{' '}
                  <span
                    style={{
                      color: side === 'buy' ? '#29AC80' : '#DD6956',
                    }}
                  >
                    {side}
                  </span>
                </HeaderLabel>
              </div>
            </InputRowContainer>

            <InputRowContainer>
              <FormInputContainer title={'price'}>
                <Input
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
                  isDisabled={type === 'market' && !isTrailingOn}
                  onChange={(e) => {
                    this.setState({
                      price: e.target.value,
                      total: Number(
                        stripDigitPlaces(e.target.value * amount, 8)
                      ),
                    })
                  }}
                />
              </FormInputContainer>
            </InputRowContainer>

            {isTrailingOn && (
              <InputRowContainer>
                <FormInputContainer title={'deviation'}>
                  <Input
                    padding={'0 .8rem 0 0'}
                    width={'calc(35%)'}
                    symbol={'%'}
                    value={deviationPercentage}
                    showErrors={true}
                    isValid={this.props.validateField(
                      isTrailingOn,
                      deviationPercentage
                    )}
                    onChange={(e) => {
                      this.setState({ deviationPercentage: e.target.value })
                    }}
                  />

                  <BlueSlider
                    disabled={!isTrailingOn}
                    value={deviationPercentage}
                    sliderContainerStyles={{
                      width: '50%',
                      margin: '0 .8rem 0 .8rem',
                    }}
                    onChange={(value) => {
                      this.setState({ deviationPercentage: value })
                    }}
                  />
                </FormInputContainer>
              </InputRowContainer>
            )}

            <InputRowContainer>
              <FormInputContainer title={'amount'}>
                <Input
                  type={'text'}
                  pattern={
                    marketType === 0 ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'
                  }
                  symbol={pair[0]}
                  value={amount}
                  showErrors={true}
                  isValid={this.props.validateField(true, +amount)}
                  onChange={(e) => {
                    const newTotal = e.target.value * price

                    this.setState({
                      total: newTotal ? newTotal.toFixed(8) : 0,
                      amount: e.target.value,
                    })
                  }}
                />
              </FormInputContainer>
            </InputRowContainer>

            <InputRowContainer>
              <BlueSlider
                value={
                  side === 'buy' || marketType === 1
                    ? total / (maxAmount / 100)
                    : amount / (maxAmount / 100)
                }
                sliderContainerStyles={{
                  width: 'calc(85% - .8rem)',
                  margin: '0 .8rem 0 auto',
                }}
                onChange={(value) => {
                  const newValue = (maxAmount / 100) * value

                  const newAmount =
                    side === 'buy' || marketType === 1
                      ? newValue / price
                      : newValue

                  const newTotal =
                    side === 'buy' || marketType === 1
                      ? newValue
                      : newValue * price

                  const fixedAmount =
                    marketType === 0
                      ? newAmount.toFixed(8)
                      : newAmount.toFixed(3)

                  this.setState({
                    total: +newTotal.toFixed(8),
                    amount: +fixedAmount,
                  })
                }}
              />
            </InputRowContainer>

            <InputRowContainer>
              <FormInputContainer title={'total'}>
                <Input
                  symbol={pair[1]}
                  value={total}
                  onChange={(e) => {
                    this.setState({
                      total: stripDigitPlaces(e.target.value, 8),
                      amount: (+(e.target.value / price)).toFixed(8),
                    })
                  }}
                />
              </FormInputContainer>
            </InputRowContainer>
            <InputRowContainer padding={'2rem 0 0 0'}>
              <SendButton
                type={'buy'}
                onClick={() => {
                  const transformedState = transformProperties(this.state)
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
