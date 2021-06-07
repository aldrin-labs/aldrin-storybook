import React, { useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { SearchInputWithLoop } from '../../Tables/components/index'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { TokenIcon } from '@sb/components/TokenIcon'
import {
  ALL_TOKENS_MINTS_MAP,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { StyledPaper } from '../index.styles'
import { SelectSeveralAddressesPopup } from '../SelectorForSeveralAddresses'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { PoolsPrices } from '@sb/compositions/Pools/index.types'
import { formatNumberToUSFormat, stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

const UpdatedPaper = styled(({ ...props }) => <StyledPaper {...props} />)`
  width: 45rem;
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
  poolsPrices,
  isBaseTokenSelecting,
  close,
  selectTokenMintAddress,
  setBaseTokenAddressFromSeveral,
  setQuoteTokenAddressFromSeveral,
}: {
  theme: Theme
  open: boolean
  mints: string[]
  isBaseTokenSelecting: boolean
  allTokensData: TokenInfo[]
  poolsPrices: PoolsPrices[]
  close: () => void
  selectTokenMintAddress: (address: string) => void
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

  const filteredMints = searchValue
    ? usersMints.filter((mint) =>
        getTokenNameByMintAddress(mint)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
    : usersMints

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={UpdatedPaper}
      fullScreen={false}
      onClose={close}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify={'space-between'}>
        <Text fontSize={'2rem'}>Select Token</Text>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer padding={'3rem 0'}>
        <SearchInputWithLoop
          searchValue={searchValue}
          onChangeSearch={onChangeSearch}
          placeholder={'Search'}
        />
      </RowContainer>
      <RowContainer>
        {filteredMints.map((mint: string) => {
          return (
            <SelectorRow
              justify={'space-between'}
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
              <Row wrap={'nowrap'}>
                <TokenIcon mint={mint} width={'2rem'} height={'2rem'} />
                <StyledText>{getTokenNameByMintAddress(mint)}</StyledText>
              </Row>
              <Row wrap={'nowrap'}>
                <StyledText>
                  {formatNumberToUSFormat(
                    stripDigitPlaces(
                      poolsPrices.find(
                        (tokenInfo) =>
                          tokenInfo.symbol === getTokenNameByMintAddress(mint)
                      )?.price || 0,
                      8
                    )
                  )}
                </StyledText>
              </Row>
            </SelectorRow>
          )
        })}
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
