import React from 'react'
import styled from 'styled-components'

import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Paper, Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import copy from 'clipboard-copy'

import SvgIcon from '@sb/components/SvgIcon'
import Close from '@icons/closeIcon.svg'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { TokenIcon } from '@sb/components/TokenIcon'
import { notify } from '@sb/dexUtils/notifications'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem 0;
  width: 50rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
  overflow: hidden;
  padding: 2rem;
`

export const TokenAddressesPopup = ({
  theme,
  close,
  open,
  baseTokenMintAddress,
  quoteTokenMintAddress,
}: {
  theme: Theme
  close: () => void
  open: boolean
  baseTokenMintAddress: string
  quoteTokenMintAddress: string
}) => {
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify={'space-between'}>
        <Text>Selected tokens:</Text>
        <SvgIcon
          src={Close}
          style={{ cursor: 'pointer' }}
          onClick={() => close()}
        />
      </RowContainer>
      <RowContainer margin={'2rem 0 1rem 0'} justify={'space-between'}>
        <Row>
          {' '}
          <TokenIcon
            mint={baseTokenMintAddress}
            width={'2rem'}
            height={'2rem'}
            margin={'0 1rem 0 0'}
          />{' '}
          <Text>{getTokenNameByMintAddress(baseTokenMintAddress)}</Text>
        </Row>
        <Row>
          <Text
            onClick={() => {
              copy(baseTokenMintAddress)
              notify({
                message: 'Copied!',
                type: 'success',
              })
            }}
            style={{ cursor: 'pointer' }}
            color={'#366CE5'}
          >
            Copy address
          </Text>
        </Row>
      </RowContainer>
      <RowContainer margin={'1rem 0'} justify={'space-between'}>
        <Row>
          {' '}
          <TokenIcon
            mint={quoteTokenMintAddress}
            width={'2rem'}
            height={'2rem'}
            margin={'0 1rem 0 0'}
          />{' '}
          <Text>{getTokenNameByMintAddress(quoteTokenMintAddress)}</Text>
        </Row>{' '}
        <Row>
          <Text
            onClick={() => {
              copy(quoteTokenMintAddress)
              notify({
                message: 'Copied!',
                type: 'success',
              })
            }}
            style={{ cursor: 'pointer' }}
            color={'#366CE5'}
          >
            Copy address
          </Text>
        </Row>
      </RowContainer>
    </DialogWrapper>
  )
}
