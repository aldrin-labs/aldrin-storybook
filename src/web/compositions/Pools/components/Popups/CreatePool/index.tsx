import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Loader } from '@sb/components/Loader/Loader'
import { Modal, ModalTitleBlock } from '@sb/components/Modal'
import { usePools } from '@sb/dexUtils/pools/hooks/userPools'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { ApolloQueryResult } from 'apollo-client'
import React from 'react'
import { PoolInfo } from '../../../index.types'
import { CreatePoolForm } from './CreatePoolForm'
import { Body, Title } from './styles'

interface CreatePoolProps {
  onClose: () => void
  refetchPools: () => Promise<ApolloQueryResult<{ getPoolsInfo: PoolInfo[] }>>
}

const PoolModal: React.FC<CreatePoolProps> = (props) => {
  const { onClose, refetchPools } = props
  const [userTokens] = useUserTokenAccounts()
  const [pools] = usePools()

  if (!userTokens.length) {
    return <Loader />
  }

  return userTokens.length && pools.length ? (
    <CreatePoolForm
      pools={pools}
      userTokens={userTokens}
      onClose={onClose}
      refetchPools={refetchPools}
    />
  ) : (
    <>
      <ModalTitleBlock
        title={<Title>Please wait...</Title>}
        onClose={onClose}
      />
      <Body>
        <Loader />
      </Body>
    </>
  )
}

export const CreatePoolModal: React.FC<CreatePoolProps> = (props) => {
  const { onClose, refetchPools } = props
  return (
    <Modal open onClose={onClose}>
      <ConnectWalletWrapper>
        <PoolModal onClose={onClose} refetchPools={refetchPools} />
      </ConnectWalletWrapper>
    </Modal>
  )
}
