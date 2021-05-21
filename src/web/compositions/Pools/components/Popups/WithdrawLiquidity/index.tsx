import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line, StyledPaper } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { SimpleInput, InputWithTotal } from '../components'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { withdrawAllTokenTypes } from '@sb/dexUtils/pools'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { PoolInfo } from '@sb/compositions/Pools/index.types'

export const WithdrawalPopup = ({
  theme,
  open,
  selectedPool,
  close,
}: {
  theme: Theme
  open: boolean
  selectedPool: PoolInfo,
  close: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const [quoteAmount, setQuoteAmount] = useState<string | number>('')

  const [operationLoading, setOperationLoading] = useState(false)

  const isDisabled =
    +baseAmount <= 0 || +quoteAmount <= 0 || operationLoading

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
          disabled={isDisabled}
          isUserConfident={true}
          theme={theme}
          onClick={async () => {
            await setOperationLoading(true)
            await withdrawAllTokenTypes({
              wallet,
              connection,
              swapTokenPublicKey: new PublicKey(
                '57XV3PZWT75ftJy1jXW3uu8jgwYzgCjdhtSXLxP6rXbt' // from pool
              ),
              userTokenAccountA: new PublicKey(
                'C5qDUKtsQmUZ6QPDojp5pygoEwmaKg3XGuPCSbCswVM4' // all tokens
              ),
              userTokenAccountB: new PublicKey(
                '6CLDZwFGXRxwAdjG9hvmPGfUKMQKy3EjQBt4YitGSaq1' // all tokens
              ),
              poolTokenAccount: new PublicKey(
                'HJdPiSX52fVjnuKWxoBV1PWuDpmuU5xS4EL79Nem1rbM' // from all tokens, using info from pool
              ),
              poolTokenAmount: 10000, // calc from base/quote and pool supply
            })
            await setOperationLoading(false)
          }}
        >
          Withdraw
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
