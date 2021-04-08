import React from 'react'
import styled from 'styled-components'

import { Paper } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import {
  MainTitle,
  WhiteText,
} from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import Warning from '@icons/newWarning.svg'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 50rem;
  height: auto;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
`
const Title = styled(MainTitle)`
  text-transform: none;
  font-size: 2.5rem;
  margin-bottom: 0;
`
export const BlueButton = styled((theme) => (
  <BtnCustom
    btnWidth={'calc(50% - .5rem)'}
    fontSize={'1.4rem'}
    height={'4.5rem'}
    textTransform={'capitalize'}
    backgroundColor={'#366CE5'}
    color={'#F8FAFF'}
    borderRadius={'1rem'}
    borderColor={'none'}
  />
))`
  outline: none;
`

export const WarningPopup = (theme) => {
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={() => {}}
      maxWidth={'md'}
      open={true}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify={'space-between'}>
        <Title>Warning!</Title>
        <SvgIcon src={Warning} width={'10%'} height={'auto'} />
      </RowContainer>
      <RowContainer>
        <WhiteText theme={theme}>
          On Cryptocurrencies.Ai DEX anyone can create their own market. This
          market is one of those unofficial custom markets. Use at your own
          risk.
        </WhiteText>
      </RowContainer>
      <RowContainer>
        <BlueButton style={{ color: '#F8FAFF' }}>Ok</BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
