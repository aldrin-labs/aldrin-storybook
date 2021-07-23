import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Paper } from '@material-ui/core'

import Link from '@material-ui/core/Link'

import { createTokens } from '@sb/dexUtils/pools'

import { useWallet } from '@sb/dexUtils/wallet'
import { Theme } from '@sb/types/materialUI'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { abbreviateAddress } from '@sb/dexUtils/utils'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { WhiteButton } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import LoadingIndicator from '@sb/compositions/Chart/components/LoadingIndicator'
import { Title } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'
import { StyledTab, StyledTabs, Input, ListCard } from '../../Rebalance.styles'
import { useAsyncData } from '@sb/dexUtils/fetch-loop'
import { useConnection } from '@sb/dexUtils/connection'
import {
  InputWithPaste,
  InputWithSearch,
} from '@sb/compositions/Chart/components/Inputs'
import {
  ALL_TOKENS_MINTS,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { TokenIcon } from '@sb/components/TokenIcon'

const WhiteText = styled(Title)`
  font-size: 1.4rem;
  font-family: Avenir Next Demi;
`
const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
  height: auto;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
`

const GreenText = styled(WhiteText)`
  color: #a5e898;
`

export const feeFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
})

export default function AddTokenDialog({
  open,
  onClose,
  userTokens,
  balanceInfo,
  theme,
  allTokensData,
}) {
  const { wallet } = useWallet()
  let [tokenAccountCost] = useAsyncData(
    wallet.tokenAccountCost,
    wallet.tokenAccountCost
  )

  const [sending, setSending] = useState(false)
  const tokenMap = useTokenInfos()

  const allTokens = ALL_TOKENS_MINTS
  const connection = useConnection()

  const [tab, setTab] = useState(!!allTokens ? 'popular' : 'manual')
  const [searchValue, setSearchValue] = useState('')

  const [selectedTokens, setSelectedTokens] = useState([])

  let valid = true

  valid = selectedTokens.length > 0

  function onSubmit() {
    // implement
  }

  const cost =
    tab === 'popular'
      ? stripDigitPlaces(
          (+feeFormat.format(tokenAccountCost / LAMPORTS_PER_SOL) || 0.002039) *
            selectedTokens.length,
          8
        )
      : stripDigitPlaces(
          +feeFormat.format(tokenAccountCost / LAMPORTS_PER_SOL) || 0.002039,
          8
        )
  const SOLBalance =
    allTokensData?.filter((el) => el.symbol === 'SOL')[0]?.amount || '-'

  const isBalanceLowerCost = SOLBalance < cost
  const isDisabled = !valid || isBalanceLowerCost

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !isDisabled) {
      onSubmit()
    }
  }

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      maxWidth={'md'}
      open={open}
      onClose={onClose}
      onEnter={() => {
        setSelectedTokens([])
        setSearchValue('')
      }}
    >
      <RowContainer direction="column">
        <RowContainer margin="0 0 0 0">
          {cost > 0 && (
            <WhiteText theme={theme}>
              Add a token to your wallet. This will cost{' '}
              <GreenText theme={theme}>
                {stripDigitPlaces(cost, 6)} SOL
              </GreenText>{' '}
              per token.
            </WhiteText>
          )}
        </RowContainer>

        <RowContainer width="90%">
          <RowContainer justify="flex-start" direction="column">
            <WhiteText theme={theme}>
              Select tokens you want to add to your wallet
            </WhiteText>
            <RowContainer margin="2rem 0">
              <InputWithSearch
                type={'text'}
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
                placeholder={'Search'}
              />
            </RowContainer>
            <ListCard>
              {allTokens
                .filter((el) => {
                  const tokenInfo = tokenMap.get(el.address?.toString())
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
                      existingAccount={userTokens.find(
                        (tokenData) => tokenData.mint === tokenInfo?.address
                      )}
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
                color: isBalanceLowerCost ? '#F2ABB1' : '#A5E898',
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
            theme={theme}
            width="calc(50% - .5rem)"
            disabled={isDisabled}
            onClick={async () =>
              await createTokens({
                wallet,
                connection,
                mints: selectedTokens.map((el) => el.mintAddress),
              })
            }
          >
            Add
          </BlueButton>
        </RowContainer>
      </RowContainer>
    </DialogWrapper>
  )
}

export function TokenListItem({
  name: tokenName,
  logoURI,
  symbol: tokenSymbol,
  mintAddress,
  disabled,
  existingAccount,
  selectedTokens,
  setSelectedTokens,
  theme,
}: {
  name: string
  logoURI: string
  symbol: string
  mintAddress: string
  disabled: boolean
  existingAccount: boolean
  selectedTokens: any[]
  setSelectedTokens: any
  theme: Theme
}) {
  const alreadyExists = !!existingAccount

  const selectedTokenIndex = selectedTokens.findIndex(
    (token) => token.mintAddress === mintAddress
  )
  const checked = selectedTokenIndex !== -1
  const isDisabled = disabled || alreadyExists

  const address = new PublicKey(mintAddress)
  return (
    <>
      <RowContainer
        key={`${tokenName}${tokenSymbol}${mintAddress}`}
        justify="space-between"
        style={{
          borderBottom: '0.1rem solid #3a475c',
          cursor: 'pointer',
          minHeight: '4.5rem',
        }}
        onClick={() => {
          if (isDisabled) return

          if (checked) {
            setSelectedTokens([
              ...selectedTokens.slice(0, selectedTokenIndex),
              ...selectedTokens.slice(selectedTokenIndex + 1),
            ])
          } else {
            setSelectedTokens([...selectedTokens, { mintAddress }])
          }
        }}
      >
        <Row>
          <TokenIcon mint={mintAddress} width={'2.5rem'} height={'2.5rem'} />
          <WhiteText theme={theme} style={{ marginLeft: '1rem' }}>
            {tokenName.replace('(Sollet)', '')}
            {tokenSymbol ? ` (${tokenSymbol})` : null}
          </WhiteText>
        </Row>
        <SCheckbox
          theme={theme}
          checked={checked || isDisabled}
          disabled={isDisabled}
        />
      </RowContainer>
    </>
  )
}
