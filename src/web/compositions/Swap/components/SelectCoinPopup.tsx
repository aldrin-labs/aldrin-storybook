import { Theme } from '@material-ui/core'
import React, { useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { StyledPaper } from '@sb/compositions/Pools/components/Popups/index.styles'
import { SearchInputWithLoop } from '@sb/compositions/Pools/components/Tables/components'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import {
  ALL_TOKENS_MINTS_MAP,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import Close from '@icons/closeIcon.svg'

import { SelectSeveralAddressesPopup } from '../../Pools/components/Popups/SelectorForSeveralAddresses'

const UpdatedPaper = styled(({ ...props }) => <StyledPaper {...props} />)`
  width: 55rem;
`

export const SelectorRow = styled(({ ...props }) => (
  <RowContainer {...props} />
))`
  border-bottom: 0.1rem solid #383b45;
  height: 5rem;
`

export const StyledText = styled(({ ...props }) => <Text {...props} />)`
  margin: 0 0.5rem;
  font-size: 2em;
  font-family: Avenir Next Demi;
`

export const SelectCoinPopup = ({
  theme,
  open,
  mints,
  allTokensData,
  poolsInfo,
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
  poolsInfo: PoolInfo[]
  close: () => void
  selectTokenMintAddress: (address: string) => void
  quoteTokenMintAddress: string
  baseTokenMintAddress: string
  setBaseTokenAddressFromSeveral: (address: string) => void
  setQuoteTokenAddressFromSeveral: (address: string) => void
}) => {
  const tokenInfos = useTokenInfos()

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

  const poolsTokensA = poolsInfo.map((el) => el.tokenA)
  const poolsTokensB = poolsInfo.map((el) => el.tokenB)

  const choosenMint =
    baseTokenMintAddress && quoteTokenMintAddress
      ? isBaseTokenSelecting
        ? quoteTokenMintAddress
        : baseTokenMintAddress
      : baseTokenMintAddress || quoteTokenMintAddress

  const availablePools = poolsInfo
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
          width="100%"
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
            const { symbol } = tokenInfos.get(mint) || {
              symbol: getTokenNameByMintAddress(mint),
            }

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
                  <StyledText>{symbol}</StyledText>
                  {/* {!isPoolExist ? (
                    <TokenLabel>Insufficient Liquidity</TokenLabel>
                  ) : null} */}
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
