import { Paper } from '@material-ui/core'
import { FONT_SIZES } from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { SolExplorerLink } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { CloseIconContainer } from '@sb/styles/StyledComponents/IconContainers'

const StyledPaper = styled(Paper)`
  font-size: 20px;
  height: auto;
  padding: 2rem 0;
  width: auto;
  min-width: 65rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: ${(props) => props.theme.colors.gray5};
  border-radius: 0.8rem;
  overflow: hidden;
  padding: 3rem 2rem;
  overflow: visible;
`

const Container = styled.div`
  padding: 10px 0;
`

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
        <Text>Selected tokens:</Text>
        <CloseIconContainer onClick={() => close()}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 18L9.5 9.5M18 1L9.5 9.5M9.5 9.5L18 18L1 1"
              stroke="#F5F5FB"
              strokeWidth="2"
            />
          </svg>
        </CloseIconContainer>
      </RowContainer>
      <RowContainer
        wrap="nowrap"
        margin="2rem 0 1rem 0"
        justify="space-between"
      >
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
          <SolExplorerLink mint={quoteTokenMintAddress} />
        </Row>
      </RowContainer>
    </DialogWrapper>
  )
}
