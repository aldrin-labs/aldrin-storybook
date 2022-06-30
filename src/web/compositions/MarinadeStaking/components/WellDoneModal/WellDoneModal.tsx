import React from 'react'
import { Link } from 'react-router-dom'

import { BlockContent } from '@sb/components/Block'
import { Modal, ModalTitleBlock } from '@sb/components/Modal'
import { Text, InlineText } from '@sb/components/Typography'
import { useAssociatedTokenAccount } from '@sb/dexUtils/token/hooks'
import { MSOL_MINT } from '@sb/dexUtils/utils'

import { stripByAmount } from '@core/utils/chartPageUtils'

import MarinadeBg from '../../bg.png'
import { Container, PoolsBtn } from './styles'
import { WellDoneModalProps } from './types'

export const WellDoneModal: React.FC<WellDoneModalProps> = (props) => {
  const { onClose } = props

  const mSolWallet = useAssociatedTokenAccount(MSOL_MINT)

  return (
    <Modal open onClose={onClose}>
      <Container>
        <img src={MarinadeBg} width="400" height="auto" alt="marinade" />
        <ModalTitleBlock title="Well Done" onClose={onClose} />
        <BlockContent>
          <Text>You’re now staking with Marinade!</Text>
          <Text>
            You can deposit your{' '}
            <InlineText color="green3">
              {stripByAmount(mSolWallet?.amount || 0)} mSOL
            </InlineText>{' '}
            into one of Aldrin liquidity pools to earn more rewards.
          </Text>
          <br />
          <PoolsBtn as={Link} to="/pools" $width="xl">
            View Pools
          </PoolsBtn>
        </BlockContent>
      </Container>
    </Modal>
  )
}
