import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

const Container = styled(({ containerStyle, ...rest }) => <div {...rest} />)`
  display: flex;
  margin: 0 1rem;

  ${(props) => props.containerStyle}
`

const StyledButton = styled(({ isDisabled, ...rest }) => (
  <BtnCustom
    btnWidth="auto"
    height="auto"
    fontSize="1.3rem"
    padding="0.3rem 0.5rem 0.1rem 0.6rem"
    borderRadius="0"
    btnColor={isDisabled ? '#7284A0' : '#0B1FD1'}
    backgroundColor={isDisabled ? '#F2F4F6' : '#fff'}
    borderColor={isDisabled ? '#e0e5ec' : '#0B1FD1'}
    {...rest}
  />
))`
  white-space: nowrap;
  cursor: ${(props) => (props.isDisabled ? 'unset' : 'pointer')};
  letter-spacing: 0.15rem;

  &:hover {
    color: ${(props) => props.isDisabled && '#0B1FD1'};
    background-color: ${(props) => props.isDisabled && '#fff'};
    border: 0.1rem solid ${(props) => props.isDisabled && '#0B1FD1'};
    cursor: ${(props) => props.isDisabled && 'pointer'};
  }

  @media (min-width: 1921px) {
    font-size: 1.1rem;
    padding-top: 0.2rem;
  }
`

export const FirstHalfButton = styled(
  ({ firstHalfAdditionalStyle, buttonAdditionalStyle, ...rest }) => (
    <StyledButton {...rest} />
  )
)`
  border-top-left-radius: 1.3rem;
  border-bottom-left-radius: 1.3rem;
  padding-left: 0.8rem;
  ${(props) => props.buttonAdditionalStyle}
  ${(props) => props.firstHalfAdditionalStyle}
`

export const SecondHalfButton = styled(
  ({ secondHalfAdditionalStyle, buttonAdditionalStyle, ...rest }) => (
    <StyledButton {...rest} />
  )
)`
  border-top-right-radius: 1.3rem;
  border-bottom-right-radius: 1.3rem;
  padding-right: 0.5rem;
  ${(props) => props.buttonAdditionalStyle}
  ${(props) => props.secondHalfAdditionalStyle}
`

const PillowButton = ({
  firstHalfText,
  secondHalfText,
  activeHalf,
  changeHalf,
  buttonAdditionalStyle,
  containerStyle,
  firstHalfAdditionalStyle,
  secondHalfAdditionalStyle,
  firstHalfComponent,
  secondHalfComponent,
  firstHalfTooltip = '',
  secondHalfTooltip = '',
  firstHalfDisabled = false,
  secondHalfDisabled = false,
}: {
  firstHalfText: string
  secondHalfText: string
  activeHalf: string
  changeHalf: () => void
  containerStyle?: CSSProperties
  buttonAdditionalStyle?: CSSProperties
  firstHalfAdditionalStyle?: CSSProperties
  secondHalfAdditionalStyle?: CSSProperties
  firstHalfComponent?:
    | React.ReactElement<any>
    | ((props: any) => React.ReactElement<any>)
  secondHalfComponent?:
    | React.ReactElement<any>
    | ((props: any) => React.ReactElement<any>)
  firstHalfTooltip?: string
  secondHalfTooltip?: string
  firstHalfDisabled?: boolean
  secondHalfDisabled?: boolean
}) => {
  const firstHalfIsActive = activeHalf === 'first'

  return (
    <Container containerStyle={containerStyle}>
      {firstHalfTooltip ? (
        <DarkTooltip title={firstHalfTooltip}>
          <FirstHalfButton
            component={firstHalfComponent}
            isDisabled={firstHalfDisabled || !firstHalfIsActive}
            onClick={() => !firstHalfIsActive && changeHalf()}
            firstHalfAdditionalStyle={firstHalfAdditionalStyle}
            buttonAdditionalStyle={buttonAdditionalStyle}
          >
            {firstHalfText}
          </FirstHalfButton>
        </DarkTooltip>
      ) : (
        <FirstHalfButton
          component={firstHalfComponent}
          isDisabled={firstHalfDisabled || !firstHalfIsActive}
          onClick={() => !firstHalfIsActive && changeHalf()}
          firstHalfAdditionalStyle={firstHalfAdditionalStyle}
          buttonAdditionalStyle={buttonAdditionalStyle}
        >
          {firstHalfText}
        </FirstHalfButton>
      )}
      {secondHalfTooltip ? (
        <DarkTooltip title={secondHalfTooltip}>
          <SecondHalfButton
            component={secondHalfComponent}
            isDisabled={secondHalfDisabled || firstHalfIsActive}
            onClick={() => firstHalfIsActive && changeHalf()}
            secondHalfAdditionalStyle={secondHalfAdditionalStyle}
            buttonAdditionalStyle={buttonAdditionalStyle}
          >
            {secondHalfText}
          </SecondHalfButton>
        </DarkTooltip>
      ) : (
        <SecondHalfButton
          component={secondHalfComponent}
          isDisabled={secondHalfDisabled || firstHalfIsActive}
          onClick={() => firstHalfIsActive && changeHalf()}
          secondHalfAdditionalStyle={secondHalfAdditionalStyle}
          buttonAdditionalStyle={buttonAdditionalStyle}
        >
          {secondHalfText}
        </SecondHalfButton>
      )}
    </Container>
  )
}

export default PillowButton
