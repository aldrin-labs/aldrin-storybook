import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Loader } from '@sb/components/Loader/Loader'
import { Modal, ModalTitleBlock } from '@sb/components/Modal'
import { usePools } from '@sb/dexUtils/pools/hooks/userPools'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import React from 'react'
import { CreatePoolForm } from './CreatePoolForm'
import { Body, Title } from './styles'

interface CreatePoolProps {
  onClose: () => void
}

const steps = [
  'Set up a Pool',
  'Add Initial Liquidity',
  'Set Up Farming',
  'Confirm Pool Creation',
]

const PoolModal: React.FC<CreatePoolProps> = (props) => {
  const { onClose } = props
  const [userTokens, refreshUserTokens] = useUserTokenAccounts()
  const [pools, refreshPools] = usePools()

  if (!userTokens.length) {
    return <Loader />
  }


  return (userTokens.length && pools.length) ?
    <CreatePoolForm
      pools={pools}
      userTokens={userTokens}
      onClose={onClose}
    /> :
    <>
      <ModalTitleBlock
        title={

          <Title>
            Please wait...
          </Title>
        }
        onClose={onClose}
      />
      <Body>
        <Loader />
      </Body>
    </>

}

export const CreatePoolModal: React.FC<CreatePoolProps> = (props) => {
  return (
    <Modal
      open
      onClose={props.onClose}
    >
      <ConnectWalletWrapper>
        <PoolModal onClose={props.onClose} />
      </ConnectWalletWrapper>
    </Modal>
  )
}