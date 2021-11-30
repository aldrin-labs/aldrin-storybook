import { stripByAmount } from '@core/utils/chartPageUtils'
import { DAY, HOUR } from '@core/utils/dateUtils'
import { Button } from '@sb/components/Button'
import { Loader } from '@sb/components/Loader/Loader'
import { Modal } from '@sb/components/Modal'
import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import { useConnection, useMultiEndpointConnection } from '@sb/dexUtils/connection'
import { initializeFarmingTransaction } from '@sb/dexUtils/pools/actions/initializeFarming'
import { TokenInfo } from '@sb/dexUtils/types'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { PoolInfo } from '../../index.types'
import { FarmingForm } from '../Popups/CreatePool/FarmingForm'
import { Body, Footer } from '../Popups/CreatePool/styles'
import { WithFarming } from '../Popups/CreatePool/types'
import { FarmingProcessingModal, TransactionStatus } from './FarmingProcessingModal'
import { sendAndWaitSignedTransaction } from '../../../../dexUtils/send'

interface ExtendFarmingModalProps {
  onClose: () => void
  pool: PoolInfo
  title?: string
}

interface FarmingModalProps extends ExtendFarmingModalProps {
  userTokens: TokenInfo[]
  title: string
}

const FarmingModal: React.FC<FarmingModalProps> = (props) => {
  const { userTokens, onClose, title, pool } = props
  const { wallet } = useWallet()
  const connection = useMultiEndpointConnection()

  const [farmingTransactionStatus, setFarmingTransactionStatus] = useState<TransactionStatus | null>(null)
  const tokens: Token[] = userTokens.map((ut) => ({
    mint: ut.mint,
    account: ut.address,
    balance: ut.amount,
  }))
    .sort((a, b) => a.mint.localeCompare(b.mint))


  const form = useFormik<WithFarming>({
    validateOnMount: true,
    initialValues: {
      farming: {
        token: tokens[0],
        vestingEnabled: true,
        tokenAmount: '0',
        farmingPeriod: '14',
        vestingPeriod: '7',
      }
    },
    onSubmit: async (values) => {

      setFarmingTransactionStatus('processing')
      console.log('Values: ', values)
      const farmingRewardAccount = userTokens.find((ut) => ut.address === values.farming.token.account)

      const tokensMultiplier = 10 ** (farmingRewardAccount?.decimals || 0)
      const tokensPerPeriod = parseFloat(values.farming.tokenAmount) * HOUR / DAY / parseFloat(values.farming.farmingPeriod)

      try {
        const transaction = await initializeFarmingTransaction({
          farmingTokenMint: new PublicKey(values.farming.token.mint),
          farmingTokenAccount: new PublicKey(values.farming.token.account || ''),
          tokenAmount: new BN(parseFloat(values.farming.tokenAmount) * tokensMultiplier),
          periodLength: new BN(HOUR),
          tokensPerPeriod: new BN(tokensPerPeriod * tokensMultiplier),
          noWithdrawPeriodSeconds: new BN(0),
          vestingPeriodSeconds: values.farming.vestingEnabled ?
            new BN((parseFloat(values.farming.vestingPeriod || '0')) * DAY) : new BN(0),
          pool: new PublicKey(pool.swapToken),
          wallet,
          connection: connection.getConnection(),
        })

        await sendAndWaitSignedTransaction(transaction, connection)

        setFarmingTransactionStatus('success')
      } catch (e) {
        setFarmingTransactionStatus('error')
      }

    },
    validate: async (values) => {
      if (values.farming.vestingEnabled && !((values.farming.vestingPeriod || 0) > 0)) {
        return { farming: { vestingPeriod: 'Please enter a valid vesting period.' } }
      }

      return
    },
  })

  const { values: { farming } } = form
  const farmingRewardPerDay = parseFloat(farming.farmingPeriod) > 0 ?
    parseFloat(farming.tokenAmount) / parseFloat(farming.farmingPeriod) : 0
  const farmingRewardFormatted = stripByAmount(farmingRewardPerDay)


  return (
    <>
      <FormikProvider value={form}>

        <form onSubmit={form.handleSubmit}>
          <FarmingForm
            farmingRewardFormatted={farmingRewardFormatted}
            tokens={tokens}
            userTokens={userTokens}
          />

          <Footer>
            <Button $padding="lg" type="button" onClick={onClose} $variant="outline-white">Cancel</Button>
            <Button disabled={!form.isValid} type="submit">{title}</Button>

          </Footer>
        </form>

      </FormikProvider >
      {farmingTransactionStatus &&
        <FarmingProcessingModal
          status={farmingTransactionStatus}
          onClose={() => {
            setFarmingTransactionStatus(null)
            onClose()
          }}
        />
      }
    </>

  )
}

export const ExtendFarmingModal: React.FC<ExtendFarmingModalProps> = (props) => {

  const [userTokens, refreshUserTokens] = useUserTokenAccounts()
  const {
    title = 'Extend Farming'
  } = props

  return (
    <Modal
      open
      onClose={props.onClose}
      title={title}
    >
      <Body>
        {!userTokens.length ?
          <Loader /> :
          <FarmingModal
            userTokens={userTokens}
            onClose={props.onClose}
            pool={props.pool}
            title={title}
          />
        }
      </Body>
    </Modal>
  )

}