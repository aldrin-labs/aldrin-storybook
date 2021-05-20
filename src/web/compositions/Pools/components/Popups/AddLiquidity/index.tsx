import React, { useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Paper, Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { InputWithCoins, InputWithTotal } from '../components'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { depositAllTokenTypes } from '@sb/dexUtils/pools'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { PublicKey } from '@solana/web3.js'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
`

export const AddLiquidityPopup = ({
  theme,
  open,
  selectedPool,
  close,
}: {
  theme: Theme
  open: boolean
  selectedPool: PoolInfo
  close: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const [quoteAmount, setQuoteAmount] = useState<string | number>('')

  const [warningChecked, setWarningChecked] = useState(false)

  const [operationLoading, setOperationLoading] = useState(false)

  const isDisabled =
    !warningChecked || +baseAmount <= 0 || +quoteAmount <= 0 || operationLoading

  const total = +baseAmount + +quoteAmount

  // we should select pool first
  if (!open) return null

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
        <BoldHeader>Add Liquidity</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </Row>
      <RowContainer>
        <InputWithCoins
          theme={theme}
          value={baseAmount}
          onChange={setBaseAmount}
          symbol={getTokenNameByMintAddress(selectedPool.tokenA)}
          alreadyInPool={200}
          maxBalance={2000}
        />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <InputWithCoins
          theme={theme}
          value={quoteAmount}
          onChange={setQuoteAmount}
          symbol={getTokenNameByMintAddress(selectedPool.tokenB)}
          alreadyInPool={200}
          maxBalance={2000}
        />
        <Line />
        <InputWithTotal theme={theme} value={2000} />
      </RowContainer>
      <Row margin={'2rem 0 1rem 0'} justify={'space-between'}>
        <Row direction={'column'} align={'start'}>
          <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
            Projected fee earnings based on the past 24h
          </Text>
          <Row>
            <Text
              fontSize={'2rem'}
              color={'#A5E898'}
              fontFamily={'Avenir Next Demi'}
            >
              ${stripDigitPlaces(total * (1 + selectedPool.apy24h / 100), 2)}
              &nbsp;
            </Text>
            <Text fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>
              / 24h
            </Text>
          </Row>
        </Row>
        <Row direction={'column'}>
          <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
            APY (24h)
          </Text>
          <Row>
            <Text
              fontSize={'2rem'}
              color={'#A5E898'}
              fontFamily={'Avenir Next Demi'}
            >
              {selectedPool.apy24h}%
            </Text>
          </Row>
        </Row>
      </Row>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Row
          width={'60%'}
          justify="space-between"
          wrap={'nowrap'}
          padding={'0 2rem 0 0'}
        >
          <SCheckbox
            id={'warning_checkbox'}
            style={{ padding: 0, marginRight: '1rem' }}
            onChange={() => setWarningChecked(!warningChecked)}
            checked={warningChecked}
          />
          <label htmlFor={'warning_checkbox'}>
            <WhiteText
              style={{
                cursor: 'pointer',
                color: '#F2ABB1',
                fontSize: '1.12rem',
                fontFamily: 'Avenir Next Medium',
                letterSpacing: '0.01rem',
              }}
            >
              I understand the risks of providing liquidity, and that I could
              lose money to impermanent loss.
            </WhiteText>
          </label>
        </Row>
        <BlueButton
          style={{ width: '40%', fontFamily: 'Avenir Next Medium' }}
          disabled={isDisabled}
          isUserConfident={true}
          theme={theme}
          onClick={async () => {
            await setOperationLoading(true)
            await depositAllTokenTypes({
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
              userAmountTokenA: 10000,
              userAmountTokenB: 10000,
            })
            await setOperationLoading(true)
          }}
        >
          Add liquidity
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
