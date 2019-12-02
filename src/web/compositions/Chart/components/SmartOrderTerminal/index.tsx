import React from 'react'

import { IProps, IState } from './types'
import {
  getSecondValueFromFirst,
  GreenSwitcherStyles,
  RedSwitcherStyles,
  BlueSwitcherStyles,
} from './utils'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { CustomCard } from '../../Chart.styles'
import { SendButton } from '@sb/components/TraidingTerminal/styles'

import { StyledZoomIcon } from '@sb/components/TradingWrapper/styles'
import GreenSwitcher from '@sb/components/SwitchOnOff/GreenSwitcher'
import CloseIcon from '@material-ui/icons/Close'

import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { FormInputContainer, Input } from './InputComponents'
import CustomSwitcher from '@sb/components/SwitchOnOff/CustomSwitcher'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import {
  TerminalBlocksContainer,
  TerminalHeaders,
  TerminalBlock,
  TerminalHeader,
  HeaderTitle,
  CloseHeader,
  SubBlocksContainer,
  InputRowContainer,
  TimeoutTitle,
  TargetTitle,
  TargetValue,
  BluredBackground,
} from './styles'

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
        hedgePrice: 0,
        // X20,
        hedgeIncrease: '',
        hedgeSide: 'short',
      },
      trailing: {
        isTrailingOn: false,
        deviationPercentage: 0,
      },
    },
    takeProfit: {
      isTakeProfitOn: false,
      type: 'market',
      pricePercentage: 0,
      splitTargets: {
        isSplitTargetsOn: false,
        volumePercentage: 100,
        targets: [],
      },
      timeout: {
        isTimeoutOn: false,
        whenProfitOn: false,
        whenProfitSec: 0,
        whenProfitableOn: false,
        whenProfitableSec: 0,
      },
      trailingTAP: {
        isTrailingOn: false,
        deviationPercentage: 0,
      },
    },
    stopLoss: {
      isStopLossOn: false,
      type: 'market',
      pricePercentage: 0,
      timeout: {
        isTimeoutOn: false,
        whenLossOn: false,
        whenLossSec: 0,
        whenLossableOn: false,
        whenLossableSec: 0,
      },
      forcedStop: {
        isForcedStopOn: false,
        pricePercentage: 0,
      },
    },
  }

  static getDerivedStateFromProps(props, state) {
    if (state.entryPoint.order.price === 0) {
      return {
        ...state,
        entryPoint: {
          ...state.entryPoint,
          order: {
            ...state.entryPoint.order,
            price: props.price,
          },
        },
      }
    }
  }

  addTarget = () => {
    const {
      pricePercentage,
      splitTargets: { volumePercentage, targets },
    } = this.state.takeProfit

    if (pricePercentage !== 0 && volumePercentage !== 0) {
      this.setState((prev) => ({
        takeProfit: {
          ...prev.takeProfit,
          pricePercentage: 0,
          splitTargets: {
            ...prev.takeProfit.splitTargets,
            volumePercentage: 0,
            targets: [
              ...targets,
              { price: pricePercentage, quantity: volumePercentage },
            ],
          },
        },
      }))
    }
  }

  deleteTarget = (index: number) => {
    const {
      splitTargets: { targets },
    } = this.state.takeProfit

    this.setState({
      takeProfit: {
        ...this.state.takeProfit,
        splitTargets: {
          ...this.state.takeProfit.splitTargets,
          targets: [...targets.slice(0, index), ...targets.slice(index + 1)],
        },
      },
    })
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
    const { updateTerminalViewMode, pair, funds } = this.props
    const { entryPoint, takeProfit, stopLoss } = this.state
    const maxAmount =
      entryPoint.order.side === 'buy' ? funds[1].quantity : funds[0].quantity

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
            <GreenSwitcher
              checked={takeProfit.isTakeProfitOn}
              handleToggle={() =>
                this.toggleBlock('takeProfit', 'isTakeProfitOn')
              }
            />
            <HeaderTitle>take a profit</HeaderTitle>
          </TerminalHeader>
          <TerminalHeader
            width={'31%'}
            padding={'0rem 1.5rem'}
            justify={'space-between'}
          >
            <GreenSwitcher
              checked={stopLoss.isStopLossOn}
              handleToggle={() => this.toggleBlock('stopLoss', 'isStopLossOn')}
            />
            <HeaderTitle>stop loss</HeaderTitle>
          </TerminalHeader>
          <CloseHeader
            padding={'.3rem .5rem'}
            onClick={() => updateTerminalViewMode('default')}
          >
            <StyledZoomIcon />
          </CloseHeader>
        </TerminalHeaders>

        <TerminalBlocksContainer xs={12} container item>
          {/* ENTRY POINT */}

          <TerminalBlock width={'calc(33% + 0.5%)'}>
            <CustomSwitcher
              firstHalfText={'buy'}
              secondHalfText={'sell'}
              buttonHeight={'2.5rem'}
              containerStyles={{ width: '100%', paddingBottom: '.4rem' }}
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

            <CustomSwitcher
              firstHalfText={'limit'}
              secondHalfText={'market'}
              buttonHeight={'2.5rem'}
              containerStyles={{ width: '100%' }}
              firstHalfStyleProperties={BlueSwitcherStyles}
              secondHalfStyleProperties={BlueSwitcherStyles}
              firstHalfIsActive={entryPoint.order.type === 'limit'}
              changeHalf={() => {
                this.updateSubBlockValue(
                  'entryPoint',
                  'order',
                  'type',
                  getSecondValueFromFirst(entryPoint.order.type)
                )

                if (entryPoint.trailing.isTrailingOn) {
                  this.updateSubBlockValue(
                    'entryPoint',
                    'trailing',
                    'isTrailingOn',
                    getSecondValueFromFirst(entryPoint.order.type) !== 'limit'
                  )
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
                    checked={entryPoint.trailing.isTrailingOn}
                    handleToggle={() => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'trailing',
                        'isTrailingOn',
                        !entryPoint.trailing.isTrailingOn
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'type',
                        !entryPoint.trailing.isTrailingOn ? 'market' : 'false'
                      )
                    }}
                  />
                  <HeaderTitle>
                    trailing{' '}
                    <span
                      style={{
                        color:
                          entryPoint.order.side === 'buy'
                            ? '#29AC80'
                            : '#DD6956',
                      }}
                    >
                      {entryPoint.order.side}
                    </span>
                  </HeaderTitle>
                </div>
                <div>
                  <GreenSwitcher
                    checked={entryPoint.order.isHedgeOn}
                    handleToggle={() =>
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'isHedgeOn',
                        !entryPoint.order.isHedgeOn
                      )
                    }
                  />
                  <HeaderTitle>hedge</HeaderTitle>
                </div>
              </InputRowContainer>

              <InputRowContainer>
                <FormInputContainer title={'price'}>
                  <Input
                    symbol={pair[1]}
                    type={
                      entryPoint.order.type === 'limit'
                        ? 'number'
                        : entryPoint.trailing.isTrailingOn
                        ? 'number'
                        : 'text'
                    }
                    value={
                      entryPoint.order.type === 'limit'
                        ? entryPoint.order.price
                        : entryPoint.trailing.isTrailingOn
                        ? entryPoint.order.price
                        : 'MARKET'
                    }
                    onChange={(e) => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'price',
                        Number(stripDigitPlaces(e.target.value, 8))
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'total',
                        Number(
                          stripDigitPlaces(
                            e.target.value * entryPoint.order.amount,
                            8
                          )
                        )
                      )
                    }}
                    isDisabled={
                      entryPoint.order.type === 'market' &&
                      !entryPoint.trailing.isTrailingOn
                    }
                  />
                </FormInputContainer>
              </InputRowContainer>

              {entryPoint.trailing.isTrailingOn && (
                <InputRowContainer>
                  <FormInputContainer title={'deviation'}>
                    <Input
                      padding={'0 .8rem 0 0'}
                      width={'calc(35%)'}
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
                    />

                    <BlueSlider
                      disabled={!entryPoint.trailing.isTrailingOn}
                      value={entryPoint.trailing.deviationPercentage}
                      sliderContainerStyles={{
                        width: '50%',
                        margin: '0 .8rem 0 .8rem',
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
                  </FormInputContainer>
                </InputRowContainer>
              )}

              <InputRowContainer>
                <FormInputContainer title={'amount'}>
                  <Input
                    type={'text'}
                    pattern="[0-9]+([\.][0-9]+)?"
                    symbol={pair[0]}
                    value={entryPoint.order.amount}
                    onChange={(e) => {
                      const newTotal = e.target.value * entryPoint.order.price

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'amount',
                        Number(stripDigitPlaces(e.target.value, 8))
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'total',
                        Number(stripDigitPlaces(newTotal, 8))
                      )
                    }}
                  />
                </FormInputContainer>
              </InputRowContainer>

              <InputRowContainer>
                <BlueSlider
                  // amount / (max amount / 100 )
                  value={entryPoint.order.total / (maxAmount / 100)}
                  sliderContainerStyles={{
                    width: 'calc(85% - .8rem)',
                    margin: '0 .8rem 0 auto',
                  }}
                  onChange={(value) => {
                    const newTotal = maxAmount * (value / 100)
                    const newAmount =
                      entryPoint.order.side === 'buy'
                        ? newTotal / entryPoint.order.price
                        : newTotal * entryPoint.order.price

                    this.updateSubBlockValue(
                      'entryPoint',
                      'order',
                      'amount',
                      // (max amount / 100) * value
                      Number(stripDigitPlaces(newAmount, 8))
                    )

                    this.updateSubBlockValue(
                      'entryPoint',
                      'order',
                      'total',
                      Number(stripDigitPlaces(newTotal, 8))
                    )
                  }}
                />
              </InputRowContainer>

              <InputRowContainer>
                <FormInputContainer title={'total'}>
                  <Input
                    symbol={pair[1]}
                    value={entryPoint.order.total}
                    onChange={(e) => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'total',
                        Number(stripDigitPlaces(e.target.value, 8))
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'amount',
                        Number(
                          stripDigitPlaces(
                            e.target.value / entryPoint.order.price,
                            8
                          )
                        )
                      )
                    }}
                  />
                </FormInputContainer>
              </InputRowContainer>

              {entryPoint.order.isHedgeOn && (
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
                    <Input
                      padding="0 .8rem 0 .8rem"
                      width={'calc(40% - 1.6rem)'}
                      symbol={pair[1]}
                      value={entryPoint.order.hedgePrice}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'hedgePrice',
                          e.target.value
                        )
                      }}
                    />
                    <Input
                      width={'18%'}
                      symbol={'X   '}
                      type="text"
                      pattern="[0-9]+([\.,][0-9]+)?"
                      list="leverageOptions"
                      value={entryPoint.order.hedgeIncrease}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'hedgeIncrease',
                          e.target.value
                        )
                      }}
                    />

                    <datalist id="leverageOptions">
                      <option value="1" />
                      <option value="25" />
                      <option value="50" />
                      <option value="75" />
                      <option value="100" />
                      <option value="125" />
                    </datalist>
                  </FormInputContainer>
                </InputRowContainer>
              )}
            </div>
            <InputRowContainer
              style={{
                width: 'calc(100% - 2.2rem)',
                margin: '0 auto',
                position: 'absolute',
                bottom: '0',
              }}
            >
              <SendButton
                type={entryPoint.order.side ? 'buy' : 'sell'}
                onClick={() =>
                  this.props.placeOrder(
                    entryPoint.order.side,
                    entryPoint.order.type,
                    {},
                    'smart',
                    this.state
                  )
                }
              >
                create trade
              </SendButton>
            </InputRowContainer>
          </TerminalBlock>

          {/* TAKE A PROFIT */}

          <TerminalBlock width={'calc(31% + 1%)'}>
            <InputRowContainer justify="center">
              <CustomSwitcher
                firstHalfText={'limit'}
                secondHalfText={'market'}
                buttonHeight={'2.5rem'}
                containerStyles={{ width: '100%' }}
                firstHalfStyleProperties={BlueSwitcherStyles}
                secondHalfStyleProperties={BlueSwitcherStyles}
                firstHalfIsActive={takeProfit.type === 'limit'}
                changeHalf={() => {
                  this.updateBlockValue(
                    'takeProfit',
                    'type',
                    getSecondValueFromFirst(takeProfit.type)
                  )

                  this.updateSubBlockValue(
                    'takeProfit',
                    'trailingTAP',
                    'isTrailingOn',
                    false
                  )
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
                    checked={takeProfit.trailingTAP.isTrailingOn}
                    handleToggle={() => {
                      this.updateSubBlockValue(
                        'takeProfit',
                        'trailingTAP',
                        'isTrailingOn',
                        !takeProfit.trailingTAP.isTrailingOn
                      )

                      this.updateSubBlockValue(
                        'takeProfit',
                        'splitTargets',
                        'isSplitTargetsOn',
                        false
                      )

                      this.updateBlockValue('takeProfit', 'type', 'market')
                    }}
                  />
                  <HeaderTitle>
                    trailing <span style={{ color: '#29AC80' }}>t-a-p</span>
                  </HeaderTitle>
                </div>
                <div>
                  <GreenSwitcher
                    checked={takeProfit.splitTargets.isSplitTargetsOn}
                    handleToggle={() => {
                      this.updateSubBlockValue(
                        'takeProfit',
                        'splitTargets',
                        'isSplitTargetsOn',
                        !takeProfit.splitTargets.isSplitTargetsOn
                      )

                      this.updateSubBlockValue(
                        'takeProfit',
                        'trailingTAP',
                        'isTrailingOn',
                        false
                      )
                    }}
                  />
                  <HeaderTitle>split targets</HeaderTitle>
                </div>
                <div>
                  <GreenSwitcher
                    checked={takeProfit.timeout.isTimeoutOn}
                    handleToggle={() =>
                      this.updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'isTimeoutOn',
                        !takeProfit.timeout.isTimeoutOn
                      )
                    }
                  />
                  <HeaderTitle>timeout</HeaderTitle>
                </div>
              </InputRowContainer>

              <InputRowContainer>
                <FormInputContainer title={'price'}>
                  <Input
                    needCharacter
                    beforeSymbol={'+'}
                    padding={'0 .8rem 0 0'}
                    width={'calc(35%)'}
                    symbol={'%'}
                    value={takeProfit.pricePercentage}
                    onChange={(e) => {
                      this.updateBlockValue(
                        'takeProfit',
                        'pricePercentage',
                        e.target.value
                      )
                    }}
                  />

                  <BlueSlider
                    value={takeProfit.pricePercentage}
                    sliderContainerStyles={{
                      width: '50%',
                      margin: '0 .8rem 0 .8rem',
                    }}
                    onChange={(value) => {
                      this.updateBlockValue(
                        'takeProfit',
                        'pricePercentage',
                        value
                      )
                    }}
                  />
                </FormInputContainer>
              </InputRowContainer>

              {takeProfit.trailingTAP.isTrailingOn && (
                <InputRowContainer>
                  <FormInputContainer title={'deviation'}>
                    <Input
                      padding={'0 .8rem 0 0'}
                      width={'calc(35%)'}
                      symbol={'%'}
                      value={takeProfit.trailingTAP.deviationPercentage}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'takeProfit',
                          'trailingTAP',
                          'deviationPercentage',
                          e.target.value
                        )
                      }}
                    />

                    <BlueSlider
                      value={takeProfit.trailingTAP.deviationPercentage}
                      sliderContainerStyles={{
                        width: '50%',
                        margin: '0 .8rem 0 .8rem',
                      }}
                      onChange={(value) => {
                        this.updateSubBlockValue(
                          'takeProfit',
                          'trailingTAP',
                          'deviationPercentage',
                          value
                        )
                      }}
                    />
                  </FormInputContainer>
                </InputRowContainer>
              )}

              {takeProfit.splitTargets.isSplitTargetsOn && (
                <>
                  <InputRowContainer>
                    <FormInputContainer title={'volume'}>
                      <Input
                        padding={'0 .8rem 0 0'}
                        width={'calc(35%)'}
                        symbol={'%'}
                        value={takeProfit.splitTargets.volumePercentage}
                        onChange={(e) => {
                          this.updateSubBlockValue(
                            'takeProfit',
                            'splitTargets',
                            'volumePercentage',
                            e.target.value
                          )
                        }}
                      />

                      <BlueSlider
                        value={takeProfit.splitTargets.volumePercentage}
                        sliderContainerStyles={{
                          width: '50%',
                          margin: '0 .8rem 0 .8rem',
                        }}
                        onChange={(value) => {
                          this.updateSubBlockValue(
                            'takeProfit',
                            'splitTargets',
                            'volumePercentage',
                            value
                          )
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
                      onClick={this.addTarget}
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
                      <TargetTitle style={{ width: '50%' }}>
                        quantity
                      </TargetTitle>
                    </InputRowContainer>
                    <div
                      style={{
                        maxHeight: '5rem',
                        width: '100%',
                        overflow: 'hidden scroll',
                      }}
                    >
                      {takeProfit.splitTargets.targets.map((target, i) => (
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
                            onClick={() => this.deleteTarget(i)}
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

              {takeProfit.timeout.isTimeoutOn && (
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
                          checked={takeProfit.timeout.whenProfitOn}
                          onChange={() => {
                            this.updateSubBlockValue(
                              'takeProfit',
                              'timeout',
                              'whenProfitOn',
                              !takeProfit.timeout.whenProfitOn
                            )
                          }}
                          style={{ padding: '0 .4rem 0 0' }}
                        />
                        <Input
                          width={'calc(85% - .4rem)'}
                          symbol={'SEC'}
                          value={takeProfit.timeout.whenProfitSec}
                          onChange={(e) => {
                            this.updateSubBlockValue(
                              'takeProfit',
                              'timeout',
                              'whenProfitSec',
                              e.target.value
                            )
                          }}
                          isDisabled={!takeProfit.timeout.whenProfitOn}
                        />
                      </InputRowContainer>
                    </SubBlocksContainer>

                    <SubBlocksContainer>
                      <InputRowContainer>
                        <TimeoutTitle>When profitable</TimeoutTitle>
                      </InputRowContainer>
                      <InputRowContainer>
                        <SCheckbox
                          checked={takeProfit.timeout.whenProfitableOn}
                          onChange={() => {
                            this.updateSubBlockValue(
                              'takeProfit',
                              'timeout',
                              'whenProfitableOn',
                              !takeProfit.timeout.whenProfitableOn
                            )
                          }}
                          style={{ padding: '0 .4rem 0 0' }}
                        />
                        <Input
                          width={'calc(85% - .4rem)'}
                          symbol={'SEC'}
                          value={takeProfit.timeout.whenProfitableSec}
                          onChange={(e) => {
                            this.updateSubBlockValue(
                              'takeProfit',
                              'timeout',
                              'whenProfitableSec',
                              e.target.value
                            )
                          }}
                          isDisabled={!takeProfit.timeout.whenProfitableOn}
                        />
                      </InputRowContainer>
                    </SubBlocksContainer>
                  </InputRowContainer>
                </>
              )}
            </div>

            {!takeProfit.isTakeProfitOn && (
              <BluredBackground>
                <div
                  style={{
                    width: '50%',
                  }}
                >
                  <SendButton
                    type={'buy'}
                    onClick={() =>
                      this.toggleBlock('takeProfit', 'isTakeProfitOn')
                    }
                  >
                    Enable take a profit
                  </SendButton>
                </div>
              </BluredBackground>
            )}
          </TerminalBlock>
          {/* STOP LOSS */}
          <TerminalBlock width={'calc(31% + 1%)'} borderRight="0">
            <InputRowContainer justify="center">
              <CustomSwitcher
                firstHalfText={'limit'}
                secondHalfText={'market'}
                buttonHeight={'2.5rem'}
                containerStyles={{ width: '100%' }}
                firstHalfStyleProperties={BlueSwitcherStyles}
                secondHalfStyleProperties={BlueSwitcherStyles}
                firstHalfIsActive={stopLoss.type === 'limit'}
                changeHalf={() =>
                  this.updateBlockValue(
                    'stopLoss',
                    'type',
                    getSecondValueFromFirst(stopLoss.type)
                  )
                }
              />
            </InputRowContainer>
            <div>
              <InputRowContainer
                justify="flex-start"
                padding={'.8rem 0 1.2rem 0'}
              >
                <div>
                  <GreenSwitcher
                    checked={stopLoss.timeout.isTimeoutOn}
                    handleToggle={() =>
                      this.updateSubBlockValue(
                        'stopLoss',
                        'timeout',
                        'isTimeoutOn',
                        !stopLoss.timeout.isTimeoutOn
                      )
                    }
                  />
                  <HeaderTitle>timeout</HeaderTitle>
                </div>
                <div>
                  <GreenSwitcher
                    checked={stopLoss.forcedStop.isForcedStopOn}
                    handleToggle={() =>
                      this.updateSubBlockValue(
                        'stopLoss',
                        'forcedStop',
                        'isForcedStopOn',
                        !stopLoss.forcedStop.isForcedStopOn
                      )
                    }
                  />
                  <HeaderTitle>
                    forced <span style={{ color: '#DD6956' }}>stop</span>
                  </HeaderTitle>
                </div>
              </InputRowContainer>

              <InputRowContainer padding={'0 0 1.6rem 0'}>
                <FormInputContainer title={'price'}>
                  <Input
                    needCharacter
                    beforeSymbol={'-'}
                    padding={'0 .8rem 0 0'}
                    width={'calc(35%)'}
                    symbol={'%'}
                    value={stopLoss.pricePercentage}
                    onChange={(e) => {
                      this.updateBlockValue(
                        'stopLoss',
                        'pricePercentage',
                        e.target.value
                      )
                    }}
                  />

                  <BlueSlider
                    value={stopLoss.pricePercentage}
                    sliderContainerStyles={{
                      width: '50%',
                      margin: '0 .8rem 0 .8rem',
                    }}
                    onChange={(value) => {
                      this.updateBlockValue(
                        'stopLoss',
                        'pricePercentage',
                        value
                      )
                    }}
                  />
                </FormInputContainer>
              </InputRowContainer>

              {stopLoss.timeout.isTimeoutOn && (
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
                          checked={stopLoss.timeout.whenProfitOn}
                          onChange={() => {
                            this.updateSubBlockValue(
                              'stopLoss',
                              'timeout',
                              'whenLossOn',
                              !stopLoss.timeout.whenLossOn
                            )
                          }}
                          style={{ padding: '0 .4rem 0 0' }}
                        />
                        <Input
                          width={'calc(85% - .4rem)'}
                          symbol={'SEC'}
                          value={stopLoss.timeout.whenLossSec}
                          onChange={(e) => {
                            this.updateSubBlockValue(
                              'stopLoss',
                              'timeout',
                              'whenLossSec',
                              e.target.value
                            )
                          }}
                          isDisabled={!stopLoss.timeout.whenLossOn}
                        />
                      </InputRowContainer>
                    </SubBlocksContainer>

                    <SubBlocksContainer>
                      <InputRowContainer>
                        <TimeoutTitle>When lossable</TimeoutTitle>
                      </InputRowContainer>
                      <InputRowContainer>
                        <SCheckbox
                          checked={stopLoss.timeout.whenLossableOn}
                          onChange={() => {
                            this.updateSubBlockValue(
                              'stopLoss',
                              'timeout',
                              'whenLossableOn',
                              !stopLoss.timeout.whenLossableOn
                            )
                          }}
                          style={{ padding: '0 .4rem 0 0' }}
                        />
                        <Input
                          width={'calc(85% - .4rem)'}
                          symbol={'SEC'}
                          value={stopLoss.timeout.whenLossableSec}
                          onChange={(e) => {
                            this.updateSubBlockValue(
                              'stopLoss',
                              'timeout',
                              'whenLossableSec',
                              e.target.value
                            )
                          }}
                          isDisabled={!stopLoss.timeout.whenLossableOn}
                        />
                      </InputRowContainer>
                    </SubBlocksContainer>
                  </InputRowContainer>
                </>
              )}

              {stopLoss.forcedStop.isForcedStopOn && (
                <InputRowContainer>
                  <FormInputContainer title={'volume'}>
                    <Input
                      needCharacter
                      beforeSymbol={'-'}
                      padding={'0 .8rem 0 0'}
                      width={'calc(35%)'}
                      symbol={'%'}
                      value={stopLoss.forcedStop.pricePercentage}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'stopLoss',
                          'forcedStop',
                          'pricePercentage',
                          e.target.value
                        )
                      }}
                    />

                    <BlueSlider
                      value={stopLoss.forcedStop.pricePercentage}
                      sliderContainerStyles={{
                        width: '50%',
                        margin: '0 .8rem 0 .8rem',
                      }}
                      onChange={(value) => {
                        this.updateSubBlockValue(
                          'stopLoss',
                          'forcedStop',
                          'pricePercentage',
                          value
                        )
                      }}
                    />
                  </FormInputContainer>
                </InputRowContainer>
              )}
            </div>

            {!stopLoss.isStopLossOn && (
              <BluredBackground>
                <div
                  style={{
                    width: '50%',
                  }}
                >
                  <SendButton
                    type={'buy'}
                    onClick={() => this.toggleBlock('stopLoss', 'isStopLossOn')}
                  >
                    Enable stop loss
                  </SendButton>
                </div>
              </BluredBackground>
            )}
          </TerminalBlock>
        </TerminalBlocksContainer>
      </CustomCard>
    )
  }
}
