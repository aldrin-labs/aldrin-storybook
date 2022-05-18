import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { WhiteButton } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { InputWithSearch } from '@sb/compositions/Chart/components/Inputs/Inputs'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { useConnection } from '@sb/dexUtils/connection'
import { createTokens } from '@sb/dexUtils/createTokens'
import {
  ALL_TOKENS_MINTS,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { abbreviateAddress } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import { Theme } from '@sb/types/materialUI'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import { ListCard } from '../../Rebalance.styles'
import { StyledPaper, WhiteText, GreenText } from './AddTokensPopup.styles'
import { TokenListItem } from './TokenListItem'

export const feeFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
})

export default function TokenDialog({
  open,
  onClose,
  userTokens,
  theme,
  softRefresh,
}: {
  open: boolean
  onClose: () => void
  userTokens: any[]
  theme: Theme
  softRefresh: () => void
}) {
  const { wallet } = useWallet()

  const [sending, setSending] = useState(false)
  const tokenMap = useTokenInfos()

  const allTokens = ALL_TOKENS_MINTS
  const connection = useConnection()

  const [searchValue, setSearchValue] = useState('')
  const [selectedTokens, setSelectedTokens] = useState([])

  const valid = selectedTokens.length > 0

  const cost = stripDigitPlaces(
    +feeFormat.format(0.002039) * selectedTokens.length,
    8
  )

  const SOLBalance = userTokens?.find((el) => el.symbol === 'SOL')?.amount || 0

  const userTokensMap = userTokens.reduce((acc, current) => {
    acc.set(current.mint, current)
    return acc
  }, new Map())

  const isBalanceLowerCost = SOLBalance < cost
  const isDisabled = !valid || isBalanceLowerCost || sending

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      maxWidth="md"
      open={open}
      onClose={onClose}
      onEnter={() => {
        setSelectedTokens([])
        setSearchValue('')
      }}
    >
      <RowContainer direction="column">
        <RowContainer margin="0 0 0 0">
          <WhiteText theme={theme}>
            Add a token to your wallet. This will cost{' '}
            <GreenText theme={theme}>0.002039 SOL</GreenText> per token.
          </WhiteText>
        </RowContainer>

        <RowContainer width="90%">
          <RowContainer justify="flex-start" direction="column">
            <WhiteText theme={theme}>
              Select tokens you want to add to your wallet
            </WhiteText>
            <RowContainer margin="2rem 0">
              <InputWithSearch
                theme={theme}
                type="text"
                value={searchValue}
                onChange={(e) => {
                  if (
                    !`${e.target.value}`.match(/[a-zA-Z1-9]/) &&
                    e.target.value !== ''
                  ) {
                    return
                  }

                  setSearchValue(e.target.value)
                }}
                onSearchClick={() => {}}
                placeholder="Search"
              />
            </RowContainer>
            <ListCard>
              {allTokens
                .filter((el) => {
                  const tokenInfo = tokenMap.has(el.address?.toString())
                    ? tokenMap.get(el.address?.toString())
                    : {
                        address: el.address?.toString(),
                        name: getTokenNameByMintAddress(el.address?.toString()),
                        symbol: '',
                      }

                  return searchValue !== ''
                    ? (tokenInfo.name ?? abbreviateAddress(el.address))
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                        tokenInfo.symbol
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                    : true
                })
                .map((el) => {
                  const tokenInfo = tokenMap.has(el.address?.toString())
                    ? tokenMap.get(el.address?.toString())
                    : {
                        address: el.address?.toString(),
                        name: getTokenNameByMintAddress(el.address?.toString()),
                        symbol: '',
                      }

                  return (
                    <TokenListItem
                      theme={theme}
                      key={tokenInfo?.address}
                      {...tokenInfo}
                      mintAddress={
                        tokenInfo ? tokenInfo?.address : el.address?.toString()
                      }
                      existingAccount={userTokensMap.has(tokenInfo?.address)}
                      disabled={sending}
                      selectedTokens={selectedTokens}
                      setSelectedTokens={setSelectedTokens}
                    />
                  )
                })}
            </ListCard>
          </RowContainer>
        </RowContainer>

        <RowContainer width="90%" justify="space-between" margin="2rem 0 0 0">
          <WhiteText theme={theme}>
            Your SOL Balance:{' '}
            <WhiteText
              theme={theme}
              style={{
                color: isBalanceLowerCost ? '#F2ABB1' : '#53DF11',
              }}
            >
              {formatNumberToUSFormat(stripDigitPlaces(SOLBalance, 8))} SOL
            </WhiteText>
          </WhiteText>
          <WhiteText theme={theme}>
            Cost: <GreenText theme={theme}>{cost} SOL</GreenText>
          </WhiteText>
        </RowContainer>
        <RowContainer width="90%" justify="space-between" margin="2rem 0 0 0">
          <WhiteButton
            width="calc(50% - .5rem)"
            theme={theme}
            onClick={onClose}
          >
            Cancel
          </WhiteButton>
          <BlueButton
            isUserConfident={!isDisabled}
            width="calc(50% - .5rem)"
            disabled={isDisabled}
            onClick={async () => {
              await setSending(true)
              try {
                await createTokens({
                  wallet,
                  connection,
                  mints: selectedTokens.map((el) => el.mintAddress),
                })
              } catch (e) {
                console.log('adding tokens error:', e)
              }
              await softRefresh()
              await setSending(false)
              await onClose()
            }}
          >
            Add
          </BlueButton>
        </RowContainer>
      </RowContainer>
    </DialogWrapper>
  )
}
