import React from 'react'

import { Loader } from '@sb/components/Loader/Loader'
import { Modal, ModalTitleBlock } from '@sb/components/Modal'
import { usePools } from '@sb/dexUtils/pools/hooks/userPools'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useWallet } from '@sb/dexUtils/wallet'

import { CreatePoolForm } from './CreatePoolForm'
import { Body, Title } from './styles'
import { CreatePoolProps } from './types'

const PoolModal: React.FC<CreatePoolProps> = (props) => {
  const { onClose, refetchPools, dexTokensPricesMap } = props
  const { connected } = useWallet()
  const [userTokens] = useUserTokenAccounts()
  const [pools] = usePools()

  const isTokensLoaded = connected ? userTokens.length > 0 : true

  return isTokensLoaded && pools.length ? (
    <CreatePoolForm
      pools={pools}
      userTokens={userTokens}
      onClose={onClose}
      refetchPools={refetchPools}
      dexTokensPricesMap={dexTokensPricesMap}
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

const nop = () => {}

export const CreatePoolModal: React.FC<CreatePoolProps> = (props) => {
  const { onClose, refetchPools, dexTokensPricesMap } = props
  return (
    <Modal open onClose={nop}>
      {/* <ConnectWalletWrapper> */}
      <PoolModal
        onClose={onClose}
        refetchPools={refetchPools}
        dexTokensPricesMap={dexTokensPricesMap}
      />
      {/* </ConnectWalletWrapper> */}
    </Modal>
  )
}
