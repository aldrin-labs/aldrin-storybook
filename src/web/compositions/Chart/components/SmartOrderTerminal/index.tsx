import React from 'react'

import { IProps, IState } from './types'
import {
  getSecondValueFromFirst,
  GreenSwitcherStyles,
  RedSwitcherStyles,
  BlueSwitcherStyles,
} from './utils'

import { CustomCard } from '../../Chart.styles'
import {
  TradeInput,
  Coin,
  SendButton,
} from '@sb/components/TraidingTerminal/styles'
import { StyledZoomIcon } from '@sb/components/TradingWrapper/styles'
import GreenSwitcher from '@sb/components/SwitchOnOff/GreenSwitcher'
import SmallSlider from '@sb/components/Slider/SmallSlider'

import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import {
  TerminalBlocksContainer,
  TerminalHeaders,
  TerminalBlock,
  TerminalHeader,
  HeaderTitle,
  CloseHeader,
  SwitcherHalf,
  InputTitle,
  FieldsContainer,
  SubBlocksContainer,
  InputRowContainer,
  SubBlockHeader,
} from './styles'

const SwitcherType = ({
  firstHalfIsActive,
  changeHalf,
  firstHalfText,
  firstHalfStyleProperties,
  secondHalfText,
  secondHalfStyleProperties,
  buttonHeight,
  containerStyles,
}) => {
  return (
    <div style={{ display: 'inline-block', ...containerStyles }}>
      <SwitcherHalf
        isFirstHalf
        isDisabled={!firstHalfIsActive}
        onClick={() => !firstHalfIsActive && changeHalf()}
        height={buttonHeight}
        width={'50%'}
        {...firstHalfStyleProperties}
      >
        {firstHalfText}
      </SwitcherHalf>
      <SwitcherHalf
        isDisabled={firstHalfIsActive}
        onClick={() => firstHalfIsActive && changeHalf()}
        height={buttonHeight}
        width={'50%'}
        {...secondHalfStyleProperties}
      >
        {secondHalfText}
      </SwitcherHalf>
    </div>
  )
}

const Input = ({
  symbol,
  value,
  width = '70%',
  padding = '0',
  pattern = '',
  type = 'number',
  onChange,
  isDisabled,
}) => {
  return (
    <div
      style={{ width, padding, position: 'relative', display: 'inline-block' }}
    >
      <TradeInput
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        pattern={pattern}
        type={type}
      />
      <Coin right={type !== 'number' && '12px'}>{symbol}</Coin>
    </div>
  )
}

const FormInputContainer = ({ title, children }) => {
  return (
    <>
      <div style={{ width: '30%', textAlign: 'right' }}>
        <InputTitle>{title}</InputTitle>
      </div>
      {children}
    </>
  )
}

const BlueSlider = ({
  value = 0,
  valueSymbol = '',
  disabled = false,
  sliderContainerStyles,
  onChange,
}) => {
  return (
    <SmallSlider
      defaultValue={0}
      min={0}
      max={100}
      disabled={disabled}
      // amount / (max amount / 100 )
      value={value}
      valueSymbol={valueSymbol || '%'}
      marks={{
        0: {},
        25: {},
        50: {},
        75: {},
        100: {},
      }}
      onChange={onChange}
      sliderContainerStyles={{
        width: 'calc(70% - .8rem)',
        margin: '0 .8rem 0 auto',
        ...sliderContainerStyles,
      }}
      handleStyles={{
        width: '1.2rem',
        height: '1.2rem',
        border: 'none',
        backgroundColor: '#0B1FD1',
        marginTop: '-.45rem',
      }}
      dotStyles={{
        border: 'none',
        backgroundColor: '#ABBAD1',
      }}
      activeDotStyles={{
        backgroundColor: '#5C8CEA',
      }}
      markTextSlyles={{
        color: '#7284A0;',
        fontSize: '1rem',
      }}
    />
  )
}

export class SmartOrderTerminal extends React.Component<IProps, IState> {
  state: IState = {
    entryPoint: {
      order: {
        type: 'limit',
        side: 'buy',
        price: 0,
        amount: 0,
        total: 0,
        isHedgeOn: false,
        hedgePercentage: 0,
        // X20,
        hedgeIncrease: 20,
        hedgeSide: 'short',
      },
      trailing: {
        isTrailingOn: false,
        price: 0,
        deviationPercentage: 0,
        isHedgeOn: false,
        hedgePercentage: 0,
        // X20,
        hedgeIncrease: 0,
        hedgeSide: 'short',
      },
    },
    takeProfit: {
      isTakeProfitOn: false,
      type: 'market',
      splitTarget: {
        pricePercentage: 0,
        volumePercentage: 0,
        targets: [],
      },
      timeout: {
        isTimeoutOn: false,
        whenProfitOn: false,
        whenProfitSec: 0,
        whenProfitableOn: false,
        whenProfitableSec: 0,
      },
      trailing: {
        isTrailingOn: false,
        deviationPercentage: 0,
      },
      opposite: {
        percentage: 0,
        side: 'buy',
      },
    },
    stopLoss: {
      isStopLossOn: false,
      type: 'market',
      pricePercentage: 0,
      timeout: {
        isTimeoutOn: false,
        whenProfitOn: false,
        whenProfitSec: 0,
        whenProfitableOn: false,
        whenProfitableSec: 0,
      },
      forcedStop: {
        pricePercentage: 0,
      },
      trailing: {
        isTrailingOn: false,
        deviationPercentage: 0,
      },
    },
  }

  toggleBlock = (blockName: string, booleanName: string) => {
    this.setState((prev: IState) => ({
      [blockName]: {
        ...prev[blockName],
        [booleanName]: !prev[blockName][booleanName],
      },
    }))
  }

  updateBlockValue = (
    blockName: string,
    valueName: string,
    newValue: string | number
  ) => {
    this.setState((prev) => ({
      [blockName]: { ...prev[blockName], [valueName]: newValue },
    }))
  }

  updateSubBlockValue = (
    blockName: string,
    subBlockName: string,
    valueName: string,
    newValue: string | number | boolean
  ) => {
    this.setState((prev) => ({
      [blockName]: {
        ...prev[blockName],
        [subBlockName]: {
          ...prev[blockName][subBlockName],
          [valueName]: newValue,
        },
      },
    }))
  }

  render() {
    const { updateTerminalViewMode } = this.props
    const { entryPoint, takeProfit, stopLoss } = this.state

    return (
      <CustomCard>
        <TerminalHeaders>
          <TerminalHeader width={'33%'}>
            <HeaderTitle>entry point</HeaderTitle>
          </TerminalHeader>
          <TerminalHeader
            width={'31%'}
            margin={'0 1%'}
            padding={'0rem 1.5rem'}
            justify={'space-between'}
          >
            <HeaderTitle>take a profit</HeaderTitle>
            <GreenSwitcher
              checked={takeProfit.isTakeProfitOn}
              handleToggle={() =>
                this.toggleBlock('takeProfit', 'isTakeProfitOn')
              }
            />
          </TerminalHeader>
          <TerminalHeader
            width={'31%'}
            padding={'0rem 1.5rem'}
            justify={'space-between'}
          >
            <HeaderTitle>stop loss</HeaderTitle>
            <GreenSwitcher
              checked={stopLoss.isStopLossOn}
              handleToggle={() => this.toggleBlock('stopLoss', 'isStopLossOn')}
            />
          </TerminalHeader>
          <CloseHeader
            padding={'.3rem .5rem'}
            onClick={() => updateTerminalViewMode('default')}
          >
            <StyledZoomIcon />
          </CloseHeader>
        </TerminalHeaders>
        <TerminalBlocksContainer xs={12} container item>
          <TerminalBlock
            width={'calc(33% + 0.5%)'}
            padding={'0rem 1rem 0rem 1.2rem'}
          >
            <SwitcherType
              firstHalfText={'buy'}
              secondHalfText={'sell'}
              buttonHeight={'2.5rem'}
              containerStyles={{ width: '50%', paddingRight: '1%' }}
              firstHalfStyleProperties={GreenSwitcherStyles}
              secondHalfStyleProperties={RedSwitcherStyles}
              firstHalfIsActive={entryPoint.order.side === 'buy'}
              changeHalf={() =>
                this.updateSubBlockValue(
                  'entryPoint',
                  'order',
                  'side',
                  getSecondValueFromFirst(entryPoint.order.side)
                )
              }
            />

            <SwitcherType
              firstHalfText={'limit'}
              secondHalfText={'market'}
              buttonHeight={'2.5rem'}
              containerStyles={{ width: '50%', paddingLeft: '1%' }}
              firstHalfStyleProperties={BlueSwitcherStyles}
              secondHalfStyleProperties={BlueSwitcherStyles}
              firstHalfIsActive={entryPoint.order.type === 'limit'}
              changeHalf={() =>
                this.updateSubBlockValue(
                  'entryPoint',
                  'order',
                  'type',
                  getSecondValueFromFirst(entryPoint.order.type)
                )
              }
            />

            <FieldsContainer>
              {/* first half of entry point */}
              <SubBlocksContainer needBorder>
                <div style={{ paddingBottom: '.8rem' }}>
                  <HeaderTitle>{entryPoint.order.side} coin</HeaderTitle>
                </div>

                <InputRowContainer>
                  <FormInputContainer title={'price'}>
                    <Input
                      symbol={'USDT'}
                      value={entryPoint.order.price}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'price',
                          e.target.value
                        )

                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'total',
                          e.target.value * entryPoint.order.amount
                        )
                      }}
                      isDisabled={entryPoint.order.type === 'market'}
                    />
                  </FormInputContainer>
                </InputRowContainer>

                <InputRowContainer>
                  <FormInputContainer title={'amount'}>
                    <Input
                      symbol={'BTC'}
                      value={entryPoint.order.amount}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'amount',
                          e.target.value
                        )

                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'total',
                          e.target.value * entryPoint.order.price
                        )
                      }}
                    />
                  </FormInputContainer>
                </InputRowContainer>

                <InputRowContainer>
                  <BlueSlider
                    // amount / (max amount / 100 )
                    value={entryPoint.order.amount}
                    onChange={(value) => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'amount',
                        // (max amount / 100) * value
                        value
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'total',
                        value * entryPoint.order.price
                      )
                    }}
                  />
                </InputRowContainer>

                <InputRowContainer>
                  <FormInputContainer title={'total'}>
                    <Input
                      symbol={'USDT'}
                      value={entryPoint.order.total}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'total',
                          e.target.value
                        )

                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'amount',
                          e.target.value / entryPoint.order.price
                        )
                      }}
                    />
                  </FormInputContainer>
                </InputRowContainer>

                <InputRowContainer>
                  <FormInputContainer title={'hedge'}>
                    <Input
                      padding="0 .6rem 0 0"
                      width={'calc(35% - .8rem)'}
                      symbol={'%'}
                      value={entryPoint.order.hedgePercentage}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'hedgePercentage',
                          e.target.value
                        )
                      }}
                      isDisabled={!entryPoint.order.isHedgeOn}
                    />
                    <Input
                      width={'25%'}
                      symbol={'X'}
                      type="text"
                      pattern="[0-9]{3}"
                      value={entryPoint.order.hedgeIncrease}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'hedgeIncrease',
                          e.target.value
                        )
                      }}
                      isDisabled={!entryPoint.order.isHedgeOn}
                    />
                    <SCheckbox
                      checked={entryPoint.order.isHedgeOn}
                      onChange={() => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'isHedgeOn',
                          !entryPoint.order.isHedgeOn
                        )
                      }}
                      style={{ padding: '0 0 0 .4rem' }}
                    />
                  </FormInputContainer>
                </InputRowContainer>
                <SwitcherType
                  firstHalfText={'long'}
                  secondHalfText={'short'}
                  buttonHeight={'2.5rem'}
                  containerStyles={{
                    width: '100%',
                    padding: '0 10% .6rem 30%',
                    whiteSpace: 'nowrap',
                  }}
                  firstHalfStyleProperties={GreenSwitcherStyles}
                  secondHalfStyleProperties={RedSwitcherStyles}
                  firstHalfIsActive={entryPoint.order.hedgeSide === 'long'}
                  changeHalf={() =>
                    this.updateSubBlockValue(
                      'entryPoint',
                      'order',
                      'hedgeSide',
                      getSecondValueFromFirst(entryPoint.order.hedgeSide)
                    )
                  }
                />
              </SubBlocksContainer>

              {/* second half of entry point */}
              <SubBlocksContainer>
                <SubBlockHeader>
                  <HeaderTitle>trailing {entryPoint.order.side}</HeaderTitle>
                  <GreenSwitcher
                    checked={entryPoint.trailing.isTrailingOn}
                    handleToggle={() =>
                      this.updateSubBlockValue(
                        'entryPoint',
                        'trailing',
                        'isTrailingOn',
                        !entryPoint.trailing.isTrailingOn
                      )
                    }
                  />
                </SubBlockHeader>

                <InputRowContainer>
                  <FormInputContainer title={'price'}>
                    <Input
                      symbol={'USDT'}
                      value={entryPoint.trailing.price}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'price',
                          e.target.value
                        )
                      }}
                      isDisabled={
                        !entryPoint.trailing.isTrailingOn ||
                        entryPoint.order.type === 'market'
                      }
                    />
                  </FormInputContainer>
                </InputRowContainer>

                <InputRowContainer>
                  <FormInputContainer title={'deviation'}>
                    <Input
                      symbol={'%'}
                      value={entryPoint.trailing.deviationPercentage}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'deviationPercentage',
                          e.target.value
                        )
                      }}
                      isDisabled={!entryPoint.trailing.isTrailingOn}
                    />
                  </FormInputContainer>
                </InputRowContainer>

                <InputRowContainer>
                  <BlueSlider
                    disabled={!entryPoint.trailing.isTrailingOn}
                    value={entryPoint.trailing.deviationPercentage}
                    onChange={(value) => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'trailing',
                        'deviationPercentage',
                        value
                      )
                    }}
                  />
                </InputRowContainer>

                {/* entry point trailing hedge */}
                <InputRowContainer>
                  <FormInputContainer title={'hedge'}>
                    <Input
                      padding="0 .6rem 0 0"
                      width={'calc(35% - .8rem)'}
                      symbol={'%'}
                      value={entryPoint.trailing.hedgePercentage}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'hedgePercentage',
                          e.target.value
                        )
                      }}
                      isDisabled={
                        !entryPoint.trailing.isHedgeOn ||
                        !entryPoint.trailing.isTrailingOn
                      }
                    />
                    <Input
                      width={'25%'}
                      symbol={'X'}
                      type="text"
                      pattern="[0-9]{3}"
                      value={entryPoint.trailing.hedgeIncrease}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'hedgeIncrease',
                          e.target.value
                        )
                      }}
                      isDisabled={
                        !entryPoint.trailing.isHedgeOn ||
                        !entryPoint.trailing.isTrailingOn
                      }
                    />
                    <SCheckbox
                      checked={entryPoint.trailing.isHedgeOn}
                      onChange={() => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'isHedgeOn',
                          !entryPoint.trailing.isHedgeOn
                        )
                      }}
                      disabled={!entryPoint.trailing.isTrailingOn}
                      style={{ padding: '0 0 0 .4rem' }}
                    />
                  </FormInputContainer>
                </InputRowContainer>
                <SwitcherType
                  firstHalfText={'long'}
                  secondHalfText={'short'}
                  buttonHeight={'2.5rem'}
                  containerStyles={{
                    width: '100%',
                    padding: '0 10% .6rem 30%',
                    whiteSpace: 'nowrap',
                  }}
                  firstHalfStyleProperties={GreenSwitcherStyles}
                  secondHalfStyleProperties={RedSwitcherStyles}
                  firstHalfIsActive={entryPoint.trailing.hedgeSide === 'long'}
                  changeHalf={() =>
                    this.updateSubBlockValue(
                      'entryPoint',
                      'trailing',
                      'hedgeSide',
                      getSecondValueFromFirst(entryPoint.trailing.hedgeSide)
                    )
                  }
                />
              </SubBlocksContainer>
            </FieldsContainer>
            <InputRowContainer
              style={{ width: '50%', margin: '0 auto', paddingTop: '.8rem' }}
            >
              <SendButton type={entryPoint.order.side ? 'buy' : 'sell'}>
                create trade
              </SendButton>
            </InputRowContainer>
          </TerminalBlock>
          <TerminalBlock
            width={'calc(31% + 1%)'}
            padding={'0rem 1rem 0rem 1.2rem'}
          >
            <InputRowContainer justify="center">
              <SwitcherType
                firstHalfText={'limit'}
                secondHalfText={'market'}
                buttonHeight={'2.5rem'}
                containerStyles={{ width: '50%' }}
                firstHalfStyleProperties={BlueSwitcherStyles}
                secondHalfStyleProperties={BlueSwitcherStyles}
                firstHalfIsActive={takeProfit.type === 'limit'}
                changeHalf={() =>
                  this.updateBlockValue(
                    'takeProfit',
                    'type',
                    getSecondValueFromFirst(takeProfit.type)
                  )
                }
              />
            </InputRowContainer>
            <FieldsContainer>
              <SubBlocksContainer needBorder>
                <SubBlockHeader>
                  <HeaderTitle>split target</HeaderTitle>
                  <GreenSwitcher
                    checked={entryPoint.trailing.isTrailingOn}
                    handleToggle={() =>
                      this.updateSubBlockValue(
                        'entryPoint',
                        'trailing',
                        'isTrailingOn',
                        !entryPoint.trailing.isTrailingOn
                      )
                    }
                  />
                </SubBlockHeader>

                <InputRowContainer>
                  <FormInputContainer title={'price'}>
                    <BlueSlider
                      disabled={!entryPoint.trailing.isTrailingOn}
                      value={entryPoint.trailing.deviationPercentage}
                      sliderContainerStyles={{
                        width: '40%',
                        margin: '0 1.6rem 0 .8rem',
                      }}
                      onChange={(value) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'deviationPercentage',
                          value
                        )
                      }}
                    />
                    <Input
                      padding="0 .6rem 0 0"
                      width={'calc(30% - .8rem)'}
                      symbol={'%'}
                      value={entryPoint.trailing.hedgePercentage}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'hedgePercentage',
                          e.target.value
                        )
                      }}
                      isDisabled={
                        !entryPoint.trailing.isHedgeOn ||
                        !entryPoint.trailing.isTrailingOn
                      }
                    />
                  </FormInputContainer>
                </InputRowContainer>

                <InputRowContainer>
                  <FormInputContainer title={'volume'}>
                    <BlueSlider
                      disabled={!entryPoint.trailing.isTrailingOn}
                      value={entryPoint.trailing.deviationPercentage}
                      sliderContainerStyles={{
                        width: '40%',
                        margin: '0 1.6rem 0 .8rem',
                      }}
                      onChange={(value) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'deviationPercentage',
                          value
                        )
                      }}
                    />
                    <Input
                      padding="0 .6rem 0 0"
                      width={'calc(30% - .8rem)'}
                      symbol={'%'}
                      value={entryPoint.trailing.hedgePercentage}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'hedgePercentage',
                          e.target.value
                        )
                      }}
                      isDisabled={
                        !entryPoint.trailing.isHedgeOn ||
                        !entryPoint.trailing.isTrailingOn
                      }
                    />
                  </FormInputContainer>
                </InputRowContainer>
                <InputRowContainer />
              </SubBlocksContainer>

              <SubBlocksContainer>
                <SubBlockHeader>
                  <HeaderTitle>timeout</HeaderTitle>
                  <GreenSwitcher
                    checked={entryPoint.trailing.isTrailingOn}
                    handleToggle={() =>
                      this.updateSubBlockValue(
                        'entryPoint',
                        'trailing',
                        'isTrailingOn',
                        !entryPoint.trailing.isTrailingOn
                      )
                    }
                  />
                </SubBlockHeader>

                <InputRowContainer>
                  <FieldsContainer padding={'.4rem 0 0 .8rem'}>
                    <SubBlocksContainer>
                      <InputRowContainer>When profit</InputRowContainer>
                      <InputRowContainer>
                        <SCheckbox
                          checked={entryPoint.trailing.isHedgeOn}
                          onChange={() => {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'trailing',
                              'isHedgeOn',
                              !entryPoint.trailing.isHedgeOn
                            )
                          }}
                          disabled={!entryPoint.trailing.isTrailingOn}
                          style={{ padding: '0 .4rem 0 0' }}
                        />
                        <Input
                          width={'calc(70% - .4rem)'}
                          symbol={'%'}
                          value={entryPoint.trailing.hedgePercentage}
                          onChange={(e) => {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'trailing',
                              'hedgePercentage',
                              e.target.value
                            )
                          }}
                          isDisabled={
                            !entryPoint.trailing.isHedgeOn ||
                            !entryPoint.trailing.isTrailingOn
                          }
                        />
                      </InputRowContainer>
                    </SubBlocksContainer>

                    <SubBlocksContainer>
                      <InputRowContainer>When profit</InputRowContainer>
                      <InputRowContainer>
                        <SCheckbox
                          checked={entryPoint.trailing.isHedgeOn}
                          onChange={() => {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'trailing',
                              'isHedgeOn',
                              !entryPoint.trailing.isHedgeOn
                            )
                          }}
                          disabled={!entryPoint.trailing.isTrailingOn}
                          style={{ padding: '0 .4rem 0 0' }}
                        />
                        <Input
                          width={'calc(70% - .4rem)'}
                          symbol={'%'}
                          value={entryPoint.trailing.hedgePercentage}
                          onChange={(e) => {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'trailing',
                              'hedgePercentage',
                              e.target.value
                            )
                          }}
                          isDisabled={
                            !entryPoint.trailing.isHedgeOn ||
                            !entryPoint.trailing.isTrailingOn
                          }
                        />
                      </InputRowContainer>
                    </SubBlocksContainer>
                  </FieldsContainer>
                </InputRowContainer>
              </SubBlocksContainer>
            </FieldsContainer>
          </TerminalBlock>
          <TerminalBlock width={'calc(31% + 1%)'}>block3</TerminalBlock>
        </TerminalBlocksContainer>
      </CustomCard>
    )
  }
}
