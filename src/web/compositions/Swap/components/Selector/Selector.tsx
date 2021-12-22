import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { filterDataBySymbolForDifferentDeviders } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'
import {
  SearchInputWithLoop,
  TokenIconsContainer,
} from '@sb/compositions/Pools/components/Tables/components'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { COLORS } from '@variables/variables'
import React, { useState } from 'react'
import { StyledText } from '../SelectCoinPopup'
import { SelectorRowsContainer, StyledSelectorRow } from './Selector.styles'

const textStyles: React.CSSProperties = {
  color: COLORS.primary,
  fontFamily: 'Avenir Next Medium',
  fontSize: '1.7rem',
}

export const Selector = ({
  data,
  setBaseTokenMintAddress,
  setQuoteTokenMintAddress,
}: {
  data: PoolInfo[]
  setBaseTokenMintAddress: (mint: string) => void
  setQuoteTokenMintAddress: (mint: string) => void
}) => {
  const [searchValue, onChangeSearch] = useState<string>('')
  const [isListOpen, setIsListOpen] = useState<boolean>(false)

  const filteredPools = data.filter((pool) =>
    filterDataBySymbolForDifferentDeviders({
      searchValue,
      symbol: `${getTokenNameByMintAddress(
        pool.tokenA
      )}_${getTokenNameByMintAddress(pool.tokenB)}`,
    })
  )

  return (
    <RowContainer style={{ position: 'relative' }} direction="column">
      <SearchInputWithLoop
        searchValue={searchValue}
        onChangeSearch={onChangeSearch}
        onFocus={() => setIsListOpen(true)}
        onBlur={() => setTimeout(() => setIsListOpen(false), 300)}
        placeholder="Search (e.g. SOL/RIN)"
        width="100%"
      />
      {isListOpen ? (
        <SelectorRowsContainer>
          {filteredPools.map((el) => (
            <StyledSelectorRow
              onClick={async (e) => {
                setBaseTokenMintAddress(el.tokenA)
                setQuoteTokenMintAddress(el.tokenB)
                await setIsListOpen(false)
              }}
            >
              <Row wrap="nowrap">
                <TokenIconsContainer tokenA={el.tokenA} tokenB={el.tokenB} />
              </Row>
              <Row wrap="nowrap">
                <StyledText style={textStyles}>Go</StyledText>
              </Row>
            </StyledSelectorRow>
          ))}
        </SelectorRowsContainer>
      ) : null}
    </RowContainer>
  )
}
