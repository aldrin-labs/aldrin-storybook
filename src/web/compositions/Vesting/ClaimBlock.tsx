import React, { useState, useEffect } from 'react'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { useConnection } from '@sb/dexUtils/connection'
import { getOwnedVestingAccounts, withdrawVested } from '@sb/dexUtils/vesting'
import { BlockTemplate } from '../Pools/index.styles'
import { useWallet } from '@sb/dexUtils/wallet'

import styled from 'styled-components'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '../AnalyticsRoute/index.styles'
import { Loading } from '@sb/components'
import { NotEligibleWalletBlock } from './NotEligibleWalletBlock'
import { getAllTokensData } from '../Rebalance/utils'
import { TokenInfo } from '../Rebalance/Rebalance.types'

const AlignedText = styled(Text)`
  text-align: ${(props) => (props.left ? 'left' : 'right')};
  color: ${(props) => (props.green ? '#A5E898' : '#f8faff')};
  font-family: ${(props) =>
    props.green ? 'Avenir Next Medium' : 'Avenir Next Thin'};
`

export const ClaimBlock = ({ theme }: { theme: any }) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [isInvestor, setIsInvestor] = useState<boolean | null>(null)
  const [allTokensData, setAllTokensData] = useState<TokenInfo[]>([])

  useEffect(() => {
    const getIsInvestor = async () => {
      let vestingAccountPubkey
      try {
        vestingAccountPubkey = await getOwnedVestingAccounts(
          connection,
          wallet.publicKey
        )
      } catch (e) {
        vestingAccountPubkey = await getOwnedVestingAccounts(
          connection,
          wallet.publicKey
        )
      }

      console.log('result', vestingAccountPubkey)
      if (vestingAccountPubkey.length === 0) {
        console.log('not owner of ccai tokens')
        setIsInvestor(false)
      } else {
        setIsInvestor(true)

        const allTokensData = await getAllTokensData(
          wallet.publicKey,
          connection
        )

        setAllTokensData(allTokensData)
      }
    }

    getIsInvestor()
  }, [setIsInvestor, connection, wallet.publicKey])

  return isInvestor ? (
    <BlockTemplate
      padding={'5rem 7rem 2rem'}
      width={'50rem'}
      height={'37rem'}
      theme={theme}
    >
      <RowContainer justify={'space-between'}>
        <AlignedText left>Available to Claim Now: </AlignedText>
        <AlignedText green>100.00 CCAI</AlignedText>
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <AlignedText left>Next unlock:</AlignedText>
        <AlignedText green>Jul 25, 2020</AlignedText>
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <AlignedText left>To be unlocked:</AlignedText>
        <AlignedText green>100.00 CCAI</AlignedText>
      </RowContainer>
      <BtnCustom
        theme={theme}
        onClick={wallet.connect}
        needMinWidth={false}
        btnWidth="100%"
        height="auto"
        fontSize="1.4rem"
        padding="1.4rem 10rem"
        borderRadius="1.1rem"
        borderColor={theme.palette.blue.serum}
        btnColor={'#fff'}
        backgroundColor={theme.palette.blue.serum}
        textTransform={'none'}
        margin={'4rem 0 0 0'}
        transition={'all .4s ease-out'}
        style={{ whiteSpace: 'nowrap' }}
        disabled={!allTokensData.length}
      >
        Claim CCAI
      </BtnCustom>
    </BlockTemplate>
  ) : isInvestor === false ? (
    <NotEligibleWalletBlock theme={theme} />
  ) : (
    <RowContainer>
      <Loading />
    </RowContainer>
  )
}
