import marketsList from 'aldrin-registry/src/markets.json'
import tokensList from 'aldrin-registry/src/tokens.json'
import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { WhiteButton } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { InputWithSearch } from '@sb/compositions/Chart/components/Inputs/Inputs'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { useConnection } from '@sb/dexUtils/connection'
import { createTokens } from '@sb/dexUtils/createTokens'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

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
  softRefresh,
}: {
  open: boolean
  onClose: () => void
  userTokens: any[]
  softRefresh: () => void
}) {
  const { wallet } = useWallet()
  const tokensInfo = useTokenInfos()

  const [sending, setSending] = useState(false)

  const connection = useConnection()

  const [searchValue, setSearchValue] = useState('')
  const [selectedTokens, setSelectedTokens] = useState([])

  const valid = selectedTokens.length > 0

  const cost =
    stripDigitPlaces(+feeFormat.format(0.002039) * selectedTokens.length, 8) ||
    0

  const SOLBalance = userTokens?.find((el) => el.symbol === 'SOL')?.amount || 0

  const userTokensMap = userTokens.reduce((acc, current) => {
    acc.set(current.mint, current)
    return acc
  }, new Map())

  const isBalanceLowerCost = SOLBalance < cost
  const isDisabled = !valid || isBalanceLowerCost || sending

  const uniqueTokensFromMarkets = [
    ...new Set([
      ...marketsList
        .map((el) => {
          const [tokenA, tokenB] = el.name.split('/')
          return [tokenA, tokenB]
        })
        .flat(),
    ]),
  ]

  const filteredTokens = searchValue
    ? tokensList.filter((el) => {
        const searchValueLowerCase = searchValue.toLowerCase()

        return (
          el.name?.toLowerCase().includes(searchValueLowerCase) ||
          el.symbol.toLowerCase().includes(searchValueLowerCase) ||
          el.address.includes(searchValueLowerCase)
        )
      })
    : tokensList

  return (
    <DialogWrapper
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
          <WhiteText>
            Add a token to your wallet. This will cost{' '}
            <GreenText>0.002039 SOL</GreenText> per token.
          </WhiteText>
        </RowContainer>

        <RowContainer width="90%">
          <RowContainer justify="flex-start" direction="column">
            <WhiteText>Select tokens you want to add to your wallet</WhiteText>
            <RowContainer margin="2rem 0">
              <InputWithSearch
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
              {filteredTokens
                .filter((el) =>
                  uniqueTokensFromMarkets.find((token) => token === el.name)
                )
                .map((el) => {
                  return (
                    <TokenListItem
                      name={el.name || ''}
                      symbol={el.symbol}
                      key={el?.address}
                      mintAddress={el?.address}
                      existingAccount={userTokensMap.has(el?.address)}
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
          <WhiteText>
            Your SOL Balance:{' '}
            <WhiteText
              style={{
                color: isBalanceLowerCost ? '#F2ABB1' : '#53DF11',
              }}
            >
              {formatNumberToUSFormat(stripDigitPlaces(SOLBalance, 8))} SOL
            </WhiteText>
          </WhiteText>
          <WhiteText>
            Cost: <GreenText>{cost} SOL</GreenText>
          </WhiteText>
        </RowContainer>
        <RowContainer width="90%" justify="space-between" margin="2rem 0 0 0">
          <WhiteButton width="calc(50% - .5rem)" onClick={onClose}>
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
