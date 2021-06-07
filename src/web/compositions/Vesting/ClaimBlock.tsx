import React, { useState, useEffect } from 'react'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { useConnection } from '@sb/dexUtils/connection'
import { getOwnedVestingAccounts, withdrawVested } from '@sb/dexUtils/vesting'
import { BlockTemplate } from '../Pools/index.styles'
import { useWallet } from '@sb/dexUtils/wallet'

export const ClaimBlock = ({ theme }: { theme: any }) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [isInvestor, setIsInvestor] = useState<boolean | null>(null)

  useEffect(() => {
    const getIsInvestor = async () => {
      const vestingAccountPubkey = await getOwnedVestingAccounts(
        connection,
        wallet.publicKey
      )

      console.log('result', vestingAccountPubkey)
      if (vestingAccountPubkey.length === 0) {
        console.log('not owner of ccai tokens')
        setIsInvestor(false)
      } else {
        setIsInvestor(true)
      }
    }
  }, [setIsInvestor, connection, wallet.publicKey])

  return (
    <BlockTemplate width={'50rem'} height={'50rem'} theme={theme}>
      {isInvestor ? (
        <BtnCustom
          backgroundColor={'pink'}
          onClick={() => {
            withdrawVested({
              connection,
              wallet,
              allTokensData: [],
            })
          }}
        >
          нажми на меня
        </BtnCustom>
      ) : isInvestor === false ? null : null}
    </BlockTemplate>
  )
}
