import React, { useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Paper, Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { SimpleInput, InputWithTotal } from '../components'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { withdrawAllTokenTypes } from '@sb/dexUtils/pools'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
`

export const WithdrawalPopup = ({
  theme,
  open,
  close,
}: {
  theme: Theme
  open: boolean
  close: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [baseAmount, setBaseAmount] = useState<string>('')
  const [quoteAmount, setQuoteAmount] = useState<string>('')

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
      <Row justify={'space-between'} width={'100%'}>
        <BoldHeader>Withdraw Liquidity</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </Row>
      <RowContainer>
        <SimpleInput
          theme={theme}
          symbol={'SOL'}
          value={baseAmount}
          onChange={setBaseAmount}
          maxBalance={2000}
        />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <SimpleInput
          theme={theme}
          symbol={'CCAI'}
          value={quoteAmount}
          onChange={setQuoteAmount}
          maxBalance={2000}
        />
        <Line />
        <InputWithTotal theme={theme} value={2000} />
      </RowContainer>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <BlueButton
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          onClick={async () => {
            await withdrawAllTokenTypes({
              wallet,
              connection,
              swapTokenPublicKey: new PublicKey(
                '57XV3PZWT75ftJy1jXW3uu8jgwYzgCjdhtSXLxP6rXbt'
              ),
              userTokenAccountA: new PublicKey(
                'C5qDUKtsQmUZ6QPDojp5pygoEwmaKg3XGuPCSbCswVM4'
              ),
              userTokenAccountB: new PublicKey(
                '6CLDZwFGXRxwAdjG9hvmPGfUKMQKy3EjQBt4YitGSaq1'
              ),
              poolTokenAccount: new PublicKey(
                'HJdPiSX52fVjnuKWxoBV1PWuDpmuU5xS4EL79Nem1rbM'
              ),
              poolTokenAmount: 10000,
            })
          }}
        >
          Withdraw
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
