import React from 'react'

import { useWallet } from '../../../dexUtils/wallet'
import { ConnectWalletWrapper } from '../../ConnectWalletWrapper'
import { FlexBlock } from '../../Layout'
import { Modal } from '../../Modal'
import { Text } from '../../Typography'
import Helmet from './helmet.png'
import { Rewards } from './Rewards'
import { RewardsContent } from './styles'
import { RewardsModalProps } from './types'

export const RewardsModal: React.FC<RewardsModalProps> = (props) => {
  const { onClose } = props
  const { connected } = useWallet()
  return (
    <Modal open title="Rewards" onClose={onClose}>
      <div>
        <RewardsContent>
          {connected ? (
            <Rewards />
          ) : (
            <FlexBlock
              direction="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <img src={Helmet} alt="Aldronaut" width="48px" />
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
      </div>
    </Modal>
  )
}
