import React from 'react'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { TokenIcon } from '@sb/components/TokenIcon'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { WhiteText } from './AddTokensPopup.styles'

import { Theme } from '@material-ui/core'

export function TokenListItem({
  name: tokenName,
  symbol: tokenSymbol,
  mintAddress,
  disabled,
  existingAccount,
  selectedTokens,
  setSelectedTokens,
  theme,
}: {
  name: string
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
          checked={checked || alreadyExists}
          disabled={isDisabled}
        />
      </RowContainer>
    </>
  )
}
