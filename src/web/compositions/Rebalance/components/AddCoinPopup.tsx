import React from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Paper } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader } from '@sb/compositions/Pools/components/Popups/index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'

import { Stroke, BlockForCoins } from './styles'
import { TextColumnContainer } from '@sb/compositions/Pools/components/Tables/index.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components'
import GreenCheckMark from '@icons/greenDoneMark.svg'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem 2rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
  overflow: hidden;
`

export const AddCoinPopup = ({ theme, open, close }) => {
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
      <RowContainer justify={'space-between'} style={{ padding: '1rem 0' }}>
        <BoldHeader>Add Coins</BoldHeader>
        <SvgIcon
          style={{ cursor: 'pointer' }}
          onClick={() => close()}
          src={Close}
        />
      </RowContainer>
      <RowContainer>
        <Text>
          To buy token you do not have in wallet yet you have to{' '}
          <span style={{ color: '#A5E898' }}>add it to your wallet.</span>
        </Text>
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <BtnCustom
          theme={theme}
          onClick={() => close()}
          needMinWidth={false}
          btnWidth="calc(50% - 1rem)"
          height="auto"
          fontSize="1.4rem"
          padding="1.5rem 8rem"
          borderRadius="1.1rem"
          borderColor={'#f2fbfb'}
          btnColor={'#fff'}
          backgroundColor={'none'}
          textTransform={'none'}
          margin={'4rem 0 0 0'}
          transition={'all .4s ease-out'}
          style={{ whiteSpace: 'nowrap' }}
        >
          Cancel{' '}
        </BtnCustom>
        <a
          href={'https://wallet.aldrin.com/wallet#add_token_to_rebalance'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', width: 'calc(50% - 1rem)' }}
        >
          <BtnCustom
            theme={theme}
            needMinWidth={false}
            btnWidth="100%"
            height="auto"
            fontSize="1.4rem"
            padding="1.5rem 8rem"
            borderRadius="1.1rem"
            borderColor={theme.palette.blue.serum}
            btnColor={'#fff'}
            backgroundColor={theme.palette.blue.serum}
            textTransform={'none'}
            margin={'4rem 0 0 0'}
            transition={'all .4s ease-out'}
            style={{ whiteSpace: 'nowrap' }}
          >
            Open Wallet
          </BtnCustom>
        </a>
      </RowContainer>
    </DialogWrapper>
  )
}
