import { Paper } from '@material-ui/core'
import { FONT_SIZES } from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { EscapeButton } from '@sb/components/EscapeButton'
import { SolExplorerLink } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'

const StyledPaper = styled(Paper)`
  font-size: 16px;
  height: auto;
  padding: 2em 1.5em;
  width: auto;
  min-width: 24em;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: ${(props) => props.theme.colors.gray8};
  border: 1px solid ${(props) => props.theme.colors.gray7};
  border-radius: 0.8rem;
  overflow: hidden;
  overflow: visible;
`

const TokenInfoContainer = styled(RowContainer)`
  background: ${(props) => props.theme.colors.gray7};
  border-radius: 0.5em;
`

interface TokenInfoParams {
  mint: string
}

const TokenInfo = (params: TokenInfoParams) => {
  const { mint } = params

  return (
    <TokenInfoContainer direction="column">
      <RowContainer>d</RowContainer>
      <RowContainer>f</RowContainer>
    </TokenInfoContainer>
  )
}

export const TokenAddressesPopup = ({
  close,
  open,
  baseTokenMintAddress,
  quoteTokenMintAddress,
}: {
  close: () => void
  open: boolean
  baseTokenMintAddress: string
  quoteTokenMintAddress: string
}) => {
  return (
    <DialogWrapper
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between">
        <InlineText color="gray0" size="md" weight={500}>
          Swap Info
        </InlineText>
        <EscapeButton close={close} />
      </RowContainer>
      <RowContainer
        direction="column"
        wrap="nowrap"
        margin="1.5em 0 0 0"
        justify="space-between"
      >
        <RowContainer justify="flex-start">
          <InlineText color="gray3" size="esm">
            Tokens
          </InlineText>
        </RowContainer>
        <Row>
          <TokenIcon mint={baseTokenMintAddress} margin="0 1rem 0 0" />
          <Text fontSize={FONT_SIZES.xs}>{baseTokenMintAddress}</Text>
        </Row>
        <Row>
          <SolExplorerLink mint={baseTokenMintAddress} />
        </Row>
      </RowContainer>
      <RowContainer wrap="nowrap" margin="1rem 0" justify="space-between">
        <Row>
          <TokenIcon mint={quoteTokenMintAddress} margin="0 1rem 0 0" />
          <Text fontSize={FONT_SIZES.xs}>{quoteTokenMintAddress}</Text>
        </Row>
        <Row>
          <SolExplorerLink mint={baseTokenMintAddress} />
        </Row>
      </RowContainer>
    </DialogWrapper>
  )
}
