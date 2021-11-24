import React, { useState } from 'react'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
    SearchInputWithLoop,
    TokenIconsContainer,
} from '@sb/compositions/Pools/components/Tables/components'
import {
    formatNumberToUSFormat,
    stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { TokenIcon } from '@sb/components/TokenIcon'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { SelectorRow, StyledText } from '../SelectCoinPopup'
import styled from 'styled-components'
import { COLORS } from '@variables/variables'
import { PoolInfo } from '@sb/compositions/Pools/index.types'

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
]

const StyledSelectorRow = styled(SelectorRow)`
  cursor: pointer;
  justify-content: space-between;
  height: 6rem;
`
const SelectorRowsContainer = styled(RowContainer)`
  position: absolute;
  background: #222429;
  border: 0.1rem solid #383b45;
  z-index: 1000;
  padding: 0 2rem;
  border-radius: 1.5rem;
  top: 5rem;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.55);
  max-height: 65rem;
  overflow: scroll;
  div {
    &:last-child {
      border: none;
    }
  }
`

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
    setBaseTokenMintAddress: any
    setQuoteTokenMintAddress: any
}) => {
    const [searchValue, onChangeSearch] = useState<string>('')
    const [isListOpen, setIsListOpen] = useState<boolean>(false)

    return (
        <RowContainer style={{ position: 'relative' }} direction={'column'}>
            <SearchInputWithLoop
                searchValue={searchValue}
                onChangeSearch={onChangeSearch}
                onFocus={() => setIsListOpen(true)}
                onBlur={() => setTimeout(() => setIsListOpen(false), 300)}
                placeholder={'Search (e.g. SOL/RIN)'}
                width="100%"
            />
            {isListOpen ? (
                <SelectorRowsContainer>
                    {data.map((el) => (
                        <StyledSelectorRow
                            onClick={async (e) => {
                                setBaseTokenMintAddress(el.tokenA)
                                setQuoteTokenMintAddress(el.tokenB)
                                await setIsListOpen(false)
                            }}
                        >
                            <Row wrap={'nowrap'}>
                                <TokenIconsContainer tokenA={el.tokenA} tokenB={el.tokenB} />
                            </Row>
                            <Row wrap={'nowrap'}>
                                <StyledText style={textStyles}>Go</StyledText>
                            </Row>
                        </StyledSelectorRow>
                    ))}
                </SelectorRowsContainer>
            ) : null}
        </RowContainer>
    )
}
