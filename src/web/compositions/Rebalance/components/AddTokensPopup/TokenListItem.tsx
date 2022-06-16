import React from 'react'

import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { WhiteText } from './AddTokensPopup.styles'

export function TokenListItem({
  name: tokenName,
  symbol: tokenSymbol,
  mintAddress,
  disabled,
  existingAccount,
  selectedTokens,
  setSelectedTokens,
}: {
  name: string
  symbol: string
  mintAddress: string
  disabled: boolean
  existingAccount: boolean
  selectedTokens: any[]
  setSelectedTokens: any
}) {
  const alreadyExists = !!existingAccount

  const selectedTokenIndex = selectedTokens.findIndex(
    (token) => token.mintAddress === mintAddress
  )
  const checked = selectedTokenIndex !== -1
  const isDisabled = disabled || alreadyExists

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
          <TokenIcon mint={mintAddress} size={32} />
          <WhiteText style={{ marginLeft: '1rem' }}>
            {tokenName.replace('(Sollet)', '')}
            {tokenSymbol ? ` (${tokenSymbol})` : null}
          </WhiteText>
        </Row>
        <SCheckbox checked={checked || alreadyExists} disabled={isDisabled} />
      </RowContainer>
    </>
  )
}
