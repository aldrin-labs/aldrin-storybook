import React, { useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Paper, Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'
import MockedToken from '@icons/ccaiToken.svg'
import { SearchInputWithLoop } from '../../Tables/components/index'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { ALL_TOKENS_MINTS } from '@sb/dexUtils/markets'
import { TokenIcon } from '@sb/components/TokenIcon'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 45rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
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
  close,
  selectTokenAddress,
}: {
  theme: Theme
  open: boolean
  close: () => void
  selectTokenAddress: (address: string) => void
}) => {
  const [searchValue, onChangeSearch] = useState('')

  const filteredData = ALL_TOKENS_MINTS.filter((el) =>
    el.name.toLowerCase().includes(searchValue)
  )
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
        {filteredData.map((tokenData) => {
          return (
            <SelectorRow
              justify={'space-between'}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                selectTokenAddress(tokenData.address.toString())
              }}
            >
              <Row wrap={'nowrap'}>
                <TokenIcon
                  mint={tokenData.address.toString()}
                  width={'2rem'}
                  height={'2rem'}
                />
                <StyledText>{tokenData.name}</StyledText>
              </Row>
              <Row wrap={'nowrap'}>
                <StyledText>--</StyledText>
              </Row>
            </SelectorRow>
          )
        })}
      </RowContainer>
    </DialogWrapper>
  )
}
