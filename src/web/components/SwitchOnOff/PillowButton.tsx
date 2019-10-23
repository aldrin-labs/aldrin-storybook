import React from 'react'
import styled from 'styled-components'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const Container = styled.div`
  margin: 0 1rem;
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

const FirstHalfButton = styled(StyledButton)`
  border-top-left-radius: 1.3rem;
  border-bottom-left-radius: 1.3rem;
  padding-left: 0.8rem;
`

const SecondHalfButton = styled(StyledButton)`
  border-top-right-radius: 1.3rem;
  border-bottom-right-radius: 1.3rem;
  padding-right: 0.5rem;
`

const PillowButton = ({
  firstHalfText,
  secondHalfText,
  activeHalf,
  changeHalf,
}: {
  firstHalfText: string
  secondHalfText: string
  activeHalf: string
  changeHalf: () => void
}) => {
  const firstHalfIsActive = activeHalf === 'first'

  return (
    <Container>
      <FirstHalfButton
        isDisabled={!firstHalfIsActive}
        onClick={() => !firstHalfIsActive && changeHalf()}
      >
        {firstHalfText}
      </FirstHalfButton>
      <SecondHalfButton
        isDisabled={firstHalfIsActive}
        onClick={() => firstHalfIsActive && changeHalf()}
      >
        {secondHalfText}
      </SecondHalfButton>
    </Container>
  )
}

export default PillowButton
