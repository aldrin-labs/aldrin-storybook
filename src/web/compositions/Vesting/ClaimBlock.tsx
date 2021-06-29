import React, { useState, useEffect } from 'react'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { useConnection } from '@sb/dexUtils/connection'
import {
  getMaxWithdrawBalance,
  getOwnedVestingAccounts,
  getVestingProgramAccountFromAccount,
  withdrawVested,
  CCAI_TOKEN_DECIMALS,
} from '@sb/dexUtils/vesting'
import { BlockTemplate } from '../Pools/index.styles'
import { useWallet } from '@sb/dexUtils/wallet'

import styled from 'styled-components'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '../AnalyticsRoute/index.styles'
import { Loading } from '@sb/components'
import { NotEligibleWalletBlock } from './NotEligibleWalletBlock'
import { getAllTokensData } from '../Rebalance/utils'
import { TokenInfo } from '../Rebalance/Rebalance.types'
import { Program } from '@project-serum/anchor/ts/dist/esm/index'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import dayjs from 'dayjs'

type TextProps = { left?: boolean; green?: boolean }

const AlignedText = styled(({ left, green, ...props }) => <Text {...props} />)`
  text-align: ${(props: TextProps) => (props.left ? 'left' : 'right')};
  color: ${(props: TextProps) => (props.green ? '#A5E898' : '#f8faff')};
  font-family: ${(props: TextProps) =>
    props.green ? 'Avenir Next Medium' : 'Avenir Next Thin'};
`

export const ClaimBlock = ({ theme }: { theme: any }) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [refreshDataCounter, refreshData] = useState(0)
  const [isInvestor, setIsInvestor] = useState<boolean | null>(null)
  const [allTokensData, setAllTokensData] = useState<TokenInfo[]>([])
  const [maxWithdrawBalance, setMaxWithdrawBalance] = useState(0)
  const [vestingProgramAccount, setVestingProgramAccount] = useState<Program>(
    {}
  )

  useEffect(() => {
    const getIsInvestor = async () => {
      let vestingAccountPubkey
      try {
        vestingAccountPubkey = await getOwnedVestingAccounts(
          connection,
          wallet.publicKey
        )
      } catch (e) {
        console.log('error', e)
      }

      if (vestingAccountPubkey.length === 0) {
        console.log('not owner of ccai tokens')
        setIsInvestor(false)
      } else {
        vestingAccountPubkey = vestingAccountPubkey[0].publicKey

        setIsInvestor(true)

        const [
          allTokensData,
          maxWithdraw,
          vestingProgramAccount,
        ] = await Promise.all([
          getAllTokensData(wallet.publicKey, connection),
          getMaxWithdrawBalance({
            wallet,
            connection,
            vestingAccountPubkey: vestingAccountPubkey,
          }),
          getVestingProgramAccountFromAccount({
            wallet,
            connection,
            vestingAccount: vestingAccountPubkey,
          }),
        ])

        setAllTokensData(allTokensData)
        setMaxWithdrawBalance(maxWithdraw)
        setVestingProgramAccount({
          endTs: vestingProgramAccount.endTs.toString(),
          startTs: vestingProgramAccount.startTs.toString(),
          startBalance: vestingProgramAccount.startBalance.toString(),
          periodCount: vestingProgramAccount.periodCount.toString(),
          outstanding: vestingProgramAccount.outstanding.toString(),
        })
      }
    }

    getIsInvestor()
  }, [setIsInvestor, connection, wallet.publicKey, refreshDataCounter])

  if (isInvestor === false) {
    return <NotEligibleWalletBlock theme={theme} />
  }

  if (!vestingProgramAccount?.startBalance || isInvestor === null) {
    return <Loading />
  }

  let toBeUnlockedCCAI: string | number = formatNumberToUSFormat(
    stripDigitPlaces(
      vestingProgramAccount.startBalance /
        vestingProgramAccount.periodCount /
        10 ** CCAI_TOKEN_DECIMALS,
      8
    )
  )

  const timeToNextUnlock =
    (vestingProgramAccount.endTs - vestingProgramAccount.startTs) /
    vestingProgramAccount.periodCount

  let nextUnlockDate: string | number = +vestingProgramAccount.startTs

  const now = Date.now() / 1000

  if (vestingProgramAccount.startTs) {
    while (now > nextUnlockDate) {
      nextUnlockDate += timeToNextUnlock
    }

    if (
      nextUnlockDate > +vestingProgramAccount.endTs ||
      +vestingProgramAccount.outstanding === 0
    ) {
      nextUnlockDate = 'All CCAI unlocked!'
      toBeUnlockedCCAI = 0
    } else {
      nextUnlockDate = dayjs
        .unix(Math.floor(nextUnlockDate))
        .format('HH:mm MMM DD, YYYY')
    }
  }

  return (
    <BlockTemplate
      padding={'5rem 7rem 2rem'}
      width={'50rem'}
      height={'37rem'}
      theme={theme}
    >
      <RowContainer justify={'space-between'}>
        <AlignedText left>Available to Claim Now: </AlignedText>
        <AlignedText green>
          {stripDigitPlaces(maxWithdrawBalance / 10 ** 9, 6)} CCAI
        </AlignedText>
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <AlignedText left>Next unlock:</AlignedText>
        <AlignedText green>
          {nextUnlockDate ? nextUnlockDate : '--'}
        </AlignedText>
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <AlignedText left>To be unlocked:</AlignedText>
        <AlignedText green>{toBeUnlockedCCAI} CCAI</AlignedText>
      </RowContainer>

      {allTokensData[0].amount < 0.01 && (
        <RowContainer>
          <AlignedText left style={{ color: theme.palette.red.main }}>
            Deposit at least 0.01 SOL for paying fees for the claim.
          </AlignedText>
        </RowContainer>
      )}

      <BtnCustom
        theme={theme}
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
        disabled={!allTokensData.length || +maxWithdrawBalance === 0}
        onClick={async () => {
          await withdrawVested({ wallet, connection, allTokensData })
          await refreshData(refreshDataCounter + 1)
        }}
      >
        Claim CCAI
      </BtnCustom>
    </BlockTemplate>
  )
}
