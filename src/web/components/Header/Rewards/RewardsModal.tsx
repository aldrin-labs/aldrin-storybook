import React from 'react'

import { useWallet } from '@sb/dexUtils/wallet'

import Astronaut from '@icons/astronaut.webp'

import { ConnectWalletWrapper } from '../../ConnectWalletWrapper'
import { FlexBlock } from '../../Layout'
import { Modal } from '../../Modal'
import { Text } from '../../Typography'
import { Rewards } from './Rewards'
import { RewardsContent, Img } from './styles'
import { RewardsModalProps } from './types'

export const RewardsModal: React.FC<RewardsModalProps> = (props) => {
  const { open, onClose } = props
  const { connected } = useWallet()

  return (
    <Modal open={open} title="Rewards" onClose={onClose}>
      <RewardsContent>
        {connected ? (
          <Rewards />
        ) : (
          <FlexBlock
            direction="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Img src={Astronaut} alt="Aldronaut" width="48px" />
            <br />
            <Text align="center">
              Connect your wallet to check if you are eligible for the airdrop
              rewards.
            </Text>
            <br />
            <ConnectWalletWrapper size="button-only" />
          </FlexBlock>
        )}
      </RewardsContent>
    </Modal>
  )
}
