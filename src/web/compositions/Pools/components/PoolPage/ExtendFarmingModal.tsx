import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Loader } from '@sb/components/Loader/Loader'
import { Modal } from '@sb/components/Modal'
import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import { initializeFaming } from '@sb/dexUtils/pools/actions/initializeFarming'
import { getPoolsProgramAddress } from '@sb/dexUtils/ProgramsMultiton/utils'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useWallet } from '@sb/dexUtils/wallet'

import { stripByAmount } from '@core/utils/chartPageUtils'
import { DAY, HOUR } from '@core/utils/dateUtils'

import { FarmingForm } from '../Popups/CreatePool/FarmingForm'
import { Body, Footer } from '../Popups/CreatePool/styles'
import { WithFarming } from '../Popups/CreatePool/types'
import { FarmingProcessingModal } from './FarmingProcessingModal'
import {
  ExtendFarmingModalProps,
  FarmingModalProps,
  TransactionStatus,
} from './types'

const FarmingModal: React.FC<FarmingModalProps> = (props) => {
  const { userTokens, onClose, onExtend, title, pool } = props

  const farmingTokens = (pool.farming || []).map((fs) => fs.farmingTokenMint)
  const { wallet } = useWallet()
  const connection = useMultiEndpointConnection()

  const [farmingTransactionStatus, setFarmingTransactionStatus] =
    useState<TransactionStatus | null>(null)
  const tokens: Token[] = userTokens
    .filter(
      (ut) =>
        farmingTokens.length === 0 ? true : farmingTokens.includes(ut.mint) // Limit token select with already existing mints
    )
    .map((ut) => ({
      mint: ut.mint,
      account: ut.address,
      balance: ut.amount,
    }))
    .sort((a, b) => a.mint.localeCompare(b.mint))

  // Because tokens could change & Formik bug, we have to store state somewhere
  // https://github.com/jaredpalmer/formik/issues/3348
  const [initialValues] = useState<WithFarming>({
    farming: {
      token: tokens[0],
      vestingEnabled: true,
      tokenAmount: '0',
      farmingPeriod: '14',
      vestingPeriod: '7',
    },
  })

  const form = useFormik<WithFarming>({
    validateOnMount: true,
    initialValues,
    onSubmit: async (values) => {
      setFarmingTransactionStatus('processing')
      const farmingRewardAccount = userTokens.find(
        (ut) => ut.address === values.farming.token.account
      )

      const tokensMultiplier = 10 ** (farmingRewardAccount?.decimals || 0)
      const tokensPerPeriod =
        (parseFloat(values.farming.tokenAmount) * HOUR) /
        DAY /
        parseFloat(values.farming.farmingPeriod)

      try {
        if (!values.farming.token.account) {
          throw new Error('No token account selected')
        }
        const result = await initializeFaming({
          farmingTokenMint: new PublicKey(values.farming.token.mint),
          farmingTokenAccount: new PublicKey(values.farming.token.account),
          tokenAmount: new BN(
            parseFloat(values.farming.tokenAmount) * tokensMultiplier
          ),
          periodLength: new BN(HOUR),
          tokensPerPeriod: new BN(tokensPerPeriod * tokensMultiplier),
          noWithdrawPeriodSeconds: new BN(0),
          vestingPeriodSeconds:
            values.farming.vestingEnabled && values.farming.vestingPeriod
              ? new BN(parseFloat(values.farming.vestingPeriod) * DAY)
              : new BN(0),
          pool: new PublicKey(pool.swapToken),
          wallet,
          connection,
          programAddress: getPoolsProgramAddress({ curveType: pool.curveType }),
        })

        if (result === 'success') {
          onExtend()
        }

        setFarmingTransactionStatus(result === 'success' ? 'success' : 'error')
      } catch (e) {
        setFarmingTransactionStatus('error')
      }
    },
    validate: async (values) => {
      if (
        values.farming.vestingEnabled &&
        !((values.farming.vestingPeriod || 0) > 0)
      ) {
        return {
          farming: { vestingPeriod: 'Please enter a valid vesting period.' },
        }
      }
      return null
    },
  })

  const {
    values: { farming },
  } = form
  const farmingRewardPerDay =
    parseFloat(farming.farmingPeriod) > 0
      ? parseFloat(farming.tokenAmount) / parseFloat(farming.farmingPeriod)
      : 0
  const farmingRewardFormatted = `${stripByAmount(farmingRewardPerDay)}`

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
            <Button
              $padding="lg"
              type="button"
              onClick={onClose}
              $variant="outline-white"
            >
              Cancel
            </Button>
            <Button disabled={!form.isValid} type="submit">
              {title}
            </Button>
          </Footer>
        </form>
      </FormikProvider>
      {farmingTransactionStatus && (
        <FarmingProcessingModal
          status={farmingTransactionStatus}
          onClose={() => {
            setFarmingTransactionStatus(null)
            onClose()
          }}
        />
      )}
    </>
  )
}

export const ExtendFarmingModal: React.FC<ExtendFarmingModalProps> = (
  props
) => {
  const [userTokens] = useUserTokenAccounts()
  const { title = 'Extend Farming', onClose, onExtend, pool } = props

  return (
    <Modal open onClose={onClose} title={title}>
      <Body>
        {!userTokens.length ? (
          <Loader />
        ) : (
          <FarmingModal
            userTokens={userTokens}
            onClose={onClose}
            pool={pool}
            title={title}
            onExtend={onExtend}
          />
        )}
      </Body>
    </Modal>
  )
}
