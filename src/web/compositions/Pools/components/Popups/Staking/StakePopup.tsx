import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line, StyledPaper } from '../index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'

import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { InputWithCoins } from '../components'
import { HintContainer } from './styles'
import { ExclamationMark } from '@sb/compositions/Chart/components/MarketBlock/MarketBlock.styles'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import AttentionComponent from '@sb/components/AttentionBlock'
import { startFarming } from '@sb/dexUtils/pools/startFarming'
import { PublicKey } from '@solana/web3.js'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import { notify } from '@sb/dexUtils/notifications'
import { dayDuration } from '@sb/compositions/AnalyticsRoute/components/utils'
import dayjs from 'dayjs'
import { estimatedTime } from '@core/utils/dateUtils'

export const StakePopup = ({
  theme,
  open,
  close,
  pool,
  allTokensData,
  refreshAllTokensData,
}: {
  theme: Theme
  open: boolean
  close: () => void
  pool: PoolInfo
  allTokensData: any
  refreshAllTokensData: () => void
}) => {
  const {
    amount: maxPoolTokenAmount,
    address: userPoolTokenAccount,
    decimals: poolTokenDecimals,
  } = getTokenDataByMint(allTokensData, pool.poolTokenMint)
  const [poolTokenAmount, setPoolTokenAmount] = useState(maxPoolTokenAmount)
  const [operationLoading, setOperationLoading] = useState(false)

  const { wallet } = useWallet()
  const connection = useConnection()

  const isNotEnoughPoolTokens = +poolTokenAmount > maxPoolTokenAmount
  const farmingState = pool.farming[0]

  if (!farmingState) return null
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => {
        setOperationLoading(false)
      }}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify={'space-between'} width={'100%'}>
        <BoldHeader>Stake Pool Tokens</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
          Stake your Pool Tokens to start farming RIN.
        </Text>
      </RowContainer>
      <RowContainer>
        <InputWithCoins
          placeholder={'0'}
          theme={theme}
          onChange={setPoolTokenAmount}
          value={poolTokenAmount}
          symbol={'Pool Tokens'}
          // alreadyInPool={0}
          maxBalance={maxPoolTokenAmount}
          needAlreadyInPool={false}
        />
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <Text>Est. rewards:</Text>
        <Text>
          <span style={{ color: '#A5E898' }}>12</span> RIN/Day for each $
          <span style={{ color: '#A5E898' }}>1000</span>
        </Text>
      </RowContainer>
      <HintContainer justify={'flex-start'} margin="2rem 0">
        <Row justify="flex-start" width="20%">
          <ExclamationMark
            theme={theme}
            margin={'0 0 0 2rem'}
            fontSize="5rem"
            color={'#fbf2f2'}
          />
        </Row>
        <Row width="80%" align="flex-start" direction="column">
          <Text style={{ margin: '0 0 1.5rem 0' }}>
            Pool tokens will be locked for{' '}
            <span style={{ color: '#A5E898' }}>
              {estimatedTime(farmingState.periodLength)}.
            </span>{' '}
          </Text>
          <Text>
            Withdrawal will not be available until{' '}
            <span style={{ color: '#A5E898' }}>
              {dayjs
                .unix(Date.now() / 1000 + farmingState.periodLength)
                .format('MMM DD, YYYY')}
            </span>
          </Text>
        </Row>
      </HintContainer>
      {isNotEnoughPoolTokens && (
        <RowContainer margin={'2rem 0 0 0'}>
          <AttentionComponent
            text={`You entered more Pool tokens than you have.`}
            blockHeight={'8rem'}
          />
        </RowContainer>
      )}
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <BlueButton
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={isNotEnoughPoolTokens || !poolTokenAmount}
          isUserConfident={true}
          theme={theme}
          showLoader={operationLoading}
          onClick={async () => {
            await setOperationLoading(true)

            const result = await startFarming({
              wallet,
              connection,
              poolTokenAmount: +poolTokenAmount,
              userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
              poolPublicKey: new PublicKey(pool.swapToken),
              farmingState: new PublicKey(farmingState.farmingState),
            })

            await setOperationLoading(false)

            await notify({
              type: result === 'success' ? 'success' : 'error',
              message:
                result === 'success'
                  ? 'Successfully staked.'
                  : result === 'failed'
                  ? 'Staking failed, please try again later or contact us in telegram.'
                  : 'Staking cancelled.',
            })

            await setTimeout(() => refreshAllTokensData(), 7500)

            await close()
          }}
        >
          Stake
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
