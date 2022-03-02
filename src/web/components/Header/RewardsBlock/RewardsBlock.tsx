import React, { useState } from 'react'

import { RewardsModal } from './RewardsModal'
import { RewardsButton } from './styles'

export const RewardsBlock = () => {
  const [modalOpened, setModalOpened] = useState(false)
  return (
    <>
      <RewardsButton onClick={() => setModalOpened(true)}>
        Rewards
      </RewardsButton>
      {modalOpened && <RewardsModal onClose={() => setModalOpened(false)} />}
    </>
  )
}
