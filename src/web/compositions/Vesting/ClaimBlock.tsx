import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import React from 'react'
import styled from 'styled-components'
import { RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

const AlignedText = styled(Text)`
  text-align: ${(props) => (props.left ? 'left' : 'right')};
  color: ${(props) => (props.green ? '#A5E898' : '#f8faff')};
  font-family: ${(props) =>
    props.green ? 'Avenir Next Medium' : 'Avenir Next Thin'};
`

export const ClaimBlock = ({ theme, wallet }: { theme: any; wallet: any }) => {
  return (
    <BlockTemplate
      padding={'5rem 7rem 2rem'}
      width={'50rem'}
      height={'37rem'}
      theme={theme}
    >
      <RowContainer justify={'space-between'}>
        <AlignedText left>Available to Claim Now: </AlignedText>
        <AlignedText green>100.00 CCAI</AlignedText>
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <AlignedText left>Next unlock:</AlignedText>
        <AlignedText green>Jul 25, 2020</AlignedText>
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <AlignedText left>To be unlocked:</AlignedText>
        <AlignedText green>100.00 CCAI</AlignedText>
      </RowContainer>
      <BtnCustom
        theme={theme}
        onClick={wallet.connect}
        needMinWidth={false}
        btnWidth="100%"
        height="auto"
        fontSize="1.4rem"
        padding="1.4rem 10rem"
        borderRadius="1.1rem"
        borderColor={theme.palette.blue.serum}
        btnColor={'#fff'}
        backgroundColor={theme.palette.blue.serum}
        textTransform={'none'}
        margin={'4rem 0 0 0'}
        transition={'all .4s ease-out'}
        style={{ whiteSpace: 'nowrap' }}
      >
        Claim CCAI
      </BtnCustom>{' '}
    </BlockTemplate>
  )
}
