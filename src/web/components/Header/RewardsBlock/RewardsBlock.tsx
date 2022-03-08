import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { RewardsModal } from './RewardsModal'
import { RewardsButton } from './styles'

export const RewardsBlock = () => {
  const [modalOpened, setModalOpened] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setModalOpened(false)
  }, [location])
  return (
    <>
      <RewardsButton onClick={() => setModalOpened(true)}>
        Rewards
      </RewardsButton>
      {modalOpened && <RewardsModal onClose={() => setModalOpened(false)} />}
    </>
  )
}
