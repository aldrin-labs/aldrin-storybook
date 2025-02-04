import { Theme } from '@material-ui/core'
import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { SearchInputWithLoop } from '@sb/compositions/Pools/components/Tables/components'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import {
  ALL_TOKENS_MINTS_MAP,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import Close from '@icons/closeIcon.svg'

import { SelectSeveralAddressesPopup } from '../../../Pools/components/Popups/SelectorForSeveralAddresses'
import { UpdatedPaper, SelectorRow, StyledText } from './styles'

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
  pairSettings,
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
  pairSettings: any
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

  const sortedMints = filteredMints
    .map((mint) => {
      return {
        mint,
        amount: sortedAllTokensData.get(mint) || 0,
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
          ({ mint, amount }: { mint: string; amount: number }) => {
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
                  <TokenIcon mint={mint} size={32} />
                  <StyledText>{getTokenNameByMintAddress(mint)}</StyledText>
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
