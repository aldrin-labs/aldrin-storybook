import React, { useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/components/Typography'
import { TokenIcon } from '@sb/components/TokenIcon'
import {
  ALL_TOKENS_MINTS_MAP,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { StyledPaper } from '@sb/compositions/Pools/components/Popups/index.styles'
import { SearchInputWithLoop } from '@sb/compositions/Pools/components/Tables/components'
import { SelectSeveralAddressesPopup } from '../../Pools/components/Popups/SelectorForSeveralAddresses'
import { TokenLabel } from '../styles'

const UpdatedPaper = styled(({ ...props }) => <StyledPaper {...props} />)`
  width: 55rem;
`

const SelectorRow = styled(({ ...props }) => <RowContainer {...props} />)`
  border-bottom: 0.1rem solid #383b45;
  height: 5rem;
`

const StyledText = styled(({ ...props }) => <Text {...props} />)`
  margin: 0 0.5rem;
  font-size: 2rem;
  font-family: Avenir Next Demi;
`

export const SelectCoinPopup = ({
  theme,
  open,
  mints,
  allTokensData,
  dexTokensPrices,
  getPoolsInfoQuery,
  isBaseTokenSelecting,
  close,
  selectTokenMintAddress,
  quoteTokenMintAddress,
  baseTokenMintAddress,
  setBaseTokenAddressFromSeveral,
  setQuoteTokenAddressFromSeveral,
}: {
  theme: Theme
  open: boolean
  mints: string[]
  isBaseTokenSelecting: boolean
  allTokensData: TokenInfo[]
  dexTokensPrices: DexTokensPrices[]
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  close: () => void
  selectTokenMintAddress: (address: string) => void
  quoteTokenMintAddress: string
  baseTokenMintAddress: string
  setBaseTokenAddressFromSeveral: (address: string) => void
  setQuoteTokenAddressFromSeveral: (address: string) => void
}) => {
  const needKnownMints = false
  const [searchValue, onChangeSearch] = useState<string>('')
  const [selectedMint, setSelectedMint] = useState<string>('')
  const [
    isSelectorForSeveralAddressesOpen,
    setIsSelectorForSeveralAddressesOpen,
  ] = useState(false)

  const usersMints = needKnownMints
    ? mints.filter(
        (el) => getTokenNameByMintAddress(el) === ALL_TOKENS_MINTS_MAP[el]
      )
    : mints

  const sortedAllTokensData = new Map()

  allTokensData.forEach((tokensData) => {
    sortedAllTokensData.set(tokensData.mint, tokensData.amount)
  })

  const filteredMints = searchValue
    ? usersMints.filter((mint) =>
        getTokenNameByMintAddress(mint)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
    : usersMints

  const poolsTokensA = getPoolsInfoQuery.getPoolsInfo.map((el) => el.tokenA)
  const poolsTokensB = getPoolsInfoQuery.getPoolsInfo.map((el) => el.tokenB)

  const choosenMint =
    baseTokenMintAddress && quoteTokenMintAddress
      ? isBaseTokenSelecting
        ? quoteTokenMintAddress
        : baseTokenMintAddress
      : baseTokenMintAddress || quoteTokenMintAddress

  const availablePools = getPoolsInfoQuery.getPoolsInfo
    .filter((el) => el.tokenA === choosenMint || el.tokenB === choosenMint)
    .map((el) => (el.tokenA === choosenMint ? el.tokenB : el.tokenA))

  const sortedMints = filteredMints
    .map((mint) => {
      return {
        mint,
        amount: sortedAllTokensData.get(mint) || 0,
        isTokenInPool:
          poolsTokensA.includes(mint) || poolsTokensB.includes(mint),
        isPoolExist: availablePools.includes(mint),
      }
    })
    .sort((a, b) => b.amount - a.amount)

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={UpdatedPaper}
      fullScreen={false}
      onClose={close}
      maxWidth="md"
      open={open}
      onEnter={() => {
        onChangeSearch('')
        setSelectedMint('')
        setIsSelectorForSeveralAddressesOpen(false)
      }}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between">
        <Text fontSize="2rem">Select Token</Text>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer padding="3rem 0">
        <SearchInputWithLoop
          searchValue={searchValue}
          onChangeSearch={onChangeSearch}
          placeholder="Search"
        />
      </RowContainer>
      <RowContainer>
        {sortedMints.map(
          ({
            mint,
            amount,
            isTokenInPool,
            isPoolExist,
          }: {
            mint: string
            amount: number
            isTokenInPool: boolean
            isPoolExist: boolean
          }) => {
            return (
              <SelectorRow
                justify="space-between"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const isSeveralCoinsWithSameAddress =
                    allTokensData.filter((el) => el.mint === mint).length > 1

                  if (isSeveralCoinsWithSameAddress) {
                    setSelectedMint(mint)
                    setIsSelectorForSeveralAddressesOpen(true)
                  } else {
                    selectTokenMintAddress(mint)
                  }
                }}
              >
                <Row wrap="nowrap">
                  <TokenIcon mint={mint} width="2rem" height="2rem" />
                  <StyledText>{getTokenNameByMintAddress(mint)}</StyledText>
                  {!quoteTokenMintAddress && !baseTokenMintAddress ? (
                    !isTokenInPool ? (
                      <TokenLabel>No Pools available</TokenLabel>
                    ) : null
                  ) : !isPoolExist ? (
                    <TokenLabel>Insufficient Liquidity</TokenLabel>
                  ) : null}
                </Row>
                <Row wrap="nowrap">
                  <StyledText>
                    {formatNumberToUSFormat(stripDigitPlaces(amount, 8))}
                  </StyledText>
                </Row>
              </SelectorRow>
            )
          }
        )}
        {mints.length === 0 && (
          <RowContainer>
            <StyledText>Loading...</StyledText>
          </RowContainer>
        )}
        <SelectSeveralAddressesPopup
          theme={theme}
          tokens={allTokensData.filter((el) => el.mint === selectedMint)}
          open={isSelectorForSeveralAddressesOpen}
          close={() => setIsSelectorForSeveralAddressesOpen(false)}
          selectTokenMintAddress={selectTokenMintAddress}
          selectTokenAddressFromSeveral={
            isBaseTokenSelecting
              ? setBaseTokenAddressFromSeveral
              : setQuoteTokenAddressFromSeveral
          }
        />
      </RowContainer>
    </DialogWrapper>
  )
}
