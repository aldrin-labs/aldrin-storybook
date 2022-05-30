import { Theme } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenName } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import Close from '@icons/closeIcon.svg'

import { StyledPaper } from '../index.styles'

const UpdatedPaper = styled(({ ...props }) => <StyledPaper {...props} />)`
  width: 45rem;
  font-size: 16px;
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

export const SelectSeveralAddressesPopup = ({
  theme,
  open,
  tokens,
  close,
  selectTokenMintAddress,
  selectTokenAddressFromSeveral,
}: {
  theme: Theme
  open: boolean
  tokens: TokenInfo[]
  close: () => void
  selectTokenMintAddress: (address: string) => void
  selectTokenAddressFromSeveral: (address: string) => void
}) => {
  const tokensMap = useTokenInfos()
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={UpdatedPaper}
      fullScreen={false}
      onClose={close}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between">
        <Text fontSize="2rem">Select Token</Text>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start" margin="3rem 0">
        <Text>You have several SOL addresses. Choose one of them.</Text>
      </RowContainer>
      <RowContainer>
        {tokens.map((token: TokenInfo) => {
          return (
            <SelectorRow
              justify="space-between"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                selectTokenMintAddress(token.mint)
                selectTokenAddressFromSeveral(token.address)
                close()
              }}
            >
              <Row wrap="nowrap">
                <TokenIcon mint={token.mint} width="2rem" height="2rem" />
                <StyledText>
                  {getTokenName({
                    address: token.mint,
                    tokensInfoMap: tokensMap,
                  })}
                </StyledText>
              </Row>
              <Row wrap="nowrap">
                <StyledText>
                  {token.amount}{' '}
                  {getTokenName({
                    address: token.mint,
                    tokensInfoMap: tokensMap,
                  })}
                </StyledText>
              </Row>
            </SelectorRow>
          )
        })}
      </RowContainer>
    </DialogWrapper>
  )
}
