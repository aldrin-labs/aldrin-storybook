import React from 'react'

import { Button, Container } from '../styles'

export const Switcher = ({
  isStakeModeOn,
  setIsStakeModeOn,
}: {
  isStakeModeOn: boolean
  setIsStakeModeOn: (arg: boolean) => voild
}) => {
  return (
    <Container>
      <Button onClick={() => setIsStakeModeOn(true)} isActive={isStakeModeOn}>
        Stake
      </Button>
      <Button onClick={() => setIsStakeModeOn(false)} isActive={!isStakeModeOn}>
        Unstake
      </Button>
    </Container>
  )
}
