import { keyBy } from 'lodash-es'
import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { EscapeButton } from '@sb/components/EscapeButton'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { SelectSeveralAddressesPopup } from '@sb/compositions/Pools/components/Popups/SelectorForSeveralAddresses'
import { SearchInputWithLoop } from '@sb/compositions/Pools/components/Tables/components'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

import { stripByAmount } from '@core/utils/chartPageUtils'
import { formatNumberToUSFormat } from '@core/utils/PortfolioTableUtils'

import {
  Container,
  SelectorRow,
  StyledText,
  TokenButton,
  TokenButtonText,
  TokensContainer,
  UpdatedPaper,
  BalanceLabel,
  SearchRow,
} from './styles'

export const SelectCoinPopup = ({
  open,
  mints,
  topTradingMints,
  pricesMap,
  isBaseTokenSelecting,
  close,
  selectTokenMintAddress,
  setBaseTokenAddressFromSeveral,
  setQuoteTokenAddressFromSeveral,
}: {
  open: boolean
  mints: string[]
  topTradingMints: string[]
  isBaseTokenSelecting: boolean
  pricesMap: Map<string, number>
  close: () => void
  selectTokenMintAddress: (address: string) => void
  setBaseTokenAddressFromSeveral: (address: string) => void
  setQuoteTokenAddressFromSeveral: (address: string) => void
}) => {
  const tokenInfos = useTokenInfos()

  const { connected } = useWallet()
  const [userTokensData, refreshUserTokensData] = useUserTokenAccounts()

  const [searchValue, onChangeSearch] = useState<string>('')
  const [selectedMint, setSelectedMint] = useState<string>('')
  const [
    isSelectorForSeveralAddressesOpen,
    setIsSelectorForSeveralAddressesOpen,
  ] = useState(false)

  const userTokensDataMap = keyBy(userTokensData, 'mint')

  const filteredMints = searchValue
    ? mints.filter((mint) => {
        const { symbol, name } = tokenInfos.get(mint) || {
          symbol: getTokenNameByMintAddress(mint),
          name: '',
        }

        const searchValueLowerCase = searchValue.toLowerCase()

        return (
          symbol.toLowerCase().includes(searchValueLowerCase) ||
          name.toLowerCase().includes(searchValueLowerCase) ||
          mint.includes(searchValueLowerCase)
        )
      })
    : mints

  const sortedMints = filteredMints.map((mint) => {
    const { name, symbol } = tokenInfos.get(mint) || {
      name: '',
      symbol: getTokenNameByMintAddress(mint),
    }

    const userToken = userTokensDataMap[mint]
    const price = pricesMap.get(getTokenNameByMintAddress(mint)) || 0

    const topMint = topTradingMints.indexOf(mint)

    return {
      mint,
      name,
      symbol,
      amount: userToken ? userToken.amount : 0,
      price,
      total: userToken ? userToken.amount * price : 0,
      topMint: topMint > -1 ? topMint : topTradingMints.length,
    }
  })

  const selectMint = (mint: string) => {
    const isSeveralCoinsWithSameAddress =
      userTokensData.filter((el) => el.mint === mint).length > 1

    if (isSeveralCoinsWithSameAddress) {
      setSelectedMint(mint)
      setIsSelectorForSeveralAddressesOpen(true)
    } else {
      selectTokenMintAddress(mint)
    }
  }

  return (
    <DialogWrapper
      PaperComponent={UpdatedPaper}
      fullScreen={false}
      onClose={close}
      maxWidth="md"
      open={open}
      onEnter={() => {
        onChangeSearch('')
        setSelectedMint('')
        setIsSelectorForSeveralAddressesOpen(false)
        refreshUserTokensData()
      }}
      aria-labelledby="responsive-dialog-title"
    >
      <Container>
        <RowContainer direction="column">
          <SearchRow padding="1.5em 0 0 0">
            <SearchInputWithLoop
              searchValue={searchValue}
              onChangeSearch={onChangeSearch}
              placeholder="Search token or paste address"
            />
            <EscapeButton onClose={close} />
          </SearchRow>

          <RowContainer justify="flex-start" padding="0.8em 0">
            {topTradingMints.slice(0, 8).map((mint) => (
              <TokenButton onClick={() => selectMint(mint)}>
                <TokenIcon mint={mint} size={16} margin="0 0.5em 0 0" />
                <TokenButtonText>
                  {tokenInfos.get(mint)?.symbol}
                </TokenButtonText>
              </TokenButton>
            ))}
          </RowContainer>
        </RowContainer>

        <TokensContainer justify="flex-start" direction="column" wrap="nowrap">
          {sortedMints.map(({ mint, amount, name, symbol, total }) => (
            <SelectorRow
              key={mint}
              justify="space-between"
              wrap="nowrap"
              style={{ cursor: 'pointer' }}
              onClick={() => selectMint(mint)}
            >
              <Row wrap="nowrap">
                <TokenIcon mint={mint} size={32} />
                <Row margin="0 0 0 0.5em" align="flex-start" direction="column">
                  <StyledText>{symbol}</StyledText>
                  {name && (
                    <Row margin="0.5em 0 0 0">
                      <InlineText size="esm">{name}</InlineText>
                    </Row>
                  )}
                </Row>
              </Row>
              {connected && (
                <Row direction="column" align="flex-end" wrap="nowrap">
                  <InlineText size="esm" color="white" weight={600}>
                    {/* ${formatNumberToUSFormat(stripDigitPlaces(total, 2))} */}
                  </InlineText>
                  <Row margin="0.5em 0 0 0">
                    <BalanceLabel size="esm" color="white1">
                      {formatNumberToUSFormat(stripByAmount(amount))}&nbsp;
                      {symbol}
                    </BalanceLabel>
                  </Row>
                </Row>
              )}
            </SelectorRow>
          ))}
          {mints.length === 0 && (
            <RowContainer>
              <StyledText>Loading...</StyledText>
            </RowContainer>
          )}
          <SelectSeveralAddressesPopup
            tokens={userTokensData.filter((el) => el.mint === selectedMint)}
            open={isSelectorForSeveralAddressesOpen}
            close={() => setIsSelectorForSeveralAddressesOpen(false)}
            selectTokenMintAddress={selectTokenMintAddress}
            selectTokenAddressFromSeveral={
              isBaseTokenSelecting
                ? setBaseTokenAddressFromSeveral
                : setQuoteTokenAddressFromSeveral
            }
          />
        </TokensContainer>
      </Container>
    </DialogWrapper>
  )
}
