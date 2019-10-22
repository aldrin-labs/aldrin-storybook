import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin: 0 1rem;
`

const StyledButton = styled.button`
  color: ${(props) => (props.isDisabled ? '#7284A0' : '#0B1FD1')};
  background-color: ${(props) => (props.isDisabled ? '#F2F4F6' : '#fff')};
  border: 0.1rem solid ${(props) => (props.isDisabled ? '#7284A0' : '#0B1FD1')};
  cursor: ${(props) => (props.isDisabled ? 'auto' : 'pointer')};

  font-family: DM Sans;
  font-weight: bold;
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  outline: none;
  padding: 0.5rem 0.8rem 0.3rem 0.8rem;
  transition: 0.3s all;

  &:hover {
    color: ${(props) => props.isDisabled && '#0B1FD1'};
    background-color: ${(props) => props.isDisabled && '#fff'};
    border: 0.1rem solid ${(props) => props.isDisabled && '#0B1FD1'};
    cursor: ${(props) => props.isDisabled && 'pointer'};
    transition: 0.3s all;
  }
`

const FirstHalfButton = styled(StyledButton)`
  border-top-left-radius: 1.3rem;
  border-bottom-left-radius: 1.3rem;
  padding-left: 1.2rem;
`

const SecondHalfButton = styled(StyledButton)`
  border-top-right-radius: 1.3rem;
  border-bottom-right-radius: 1.3rem;
  padding-right: 1rem;
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
